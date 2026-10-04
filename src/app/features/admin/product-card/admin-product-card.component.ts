import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AdminProductDetail,
  AdminProductItem,
  AdminProductService
} from '../../../core/services/admin-product.service';
import { ApiUrlConstants } from '../../../core/constants/apiUrl.constants';
import { buildAssetUrl } from '../../../core/utils/image-url.util';
import {
  DesignDraft,
  ProductDraft,
  emptyDesign,
  emptySize,
  getDesignErrors,
  getProductErrors
} from '../shared/product-form.models';
import { buildProductUpdateFormData } from '../shared/product-update.mapper';
import { SizeFormComponent } from '../shared/size-form/size-form.component';
import { ImageUploaderComponent } from '../shared/image-uploader/image-uploader.component';
import { DesignFormComponent } from '../shared/design-form/design-form.component';

@Component({
  selector: 'app-admin-product-card',
  standalone: true,
  imports: [FormsModule, SizeFormComponent, ImageUploaderComponent, DesignFormComponent],
  templateUrl: './admin-product-card.component.html',
  styleUrl: './admin-product-card.component.scss'
})
export class AdminProductCardComponent {
  product = input.required<AdminProductItem>();
  // Emitted after a successful save so the list can reload.
  saved = output<void>();

  private readonly urlConstants = inject(ApiUrlConstants);
  private readonly adminProductService = inject(AdminProductService);

  protected readonly imageUrl = computed(() => buildAssetUrl(this.urlConstants.origin, this.product().image?.url));

  protected readonly expanded = signal(false);
  protected readonly detailLoading = signal(false);
  protected readonly editing = signal(false);

  // What the expanded card shows: built from the fetched detail, replaced on Save.
  protected readonly view = signal<ProductDraft | null>(null);
  // Mutable (not a signal) so ngModel can bind directly to nested fields while editing.
  protected draft: ProductDraft = { productName: '', categoryName: '', designs: [] };

  protected readonly addingDesign = signal(false);
  protected readonly newDesignSubmitted = signal(false);
  protected newDesign: DesignDraft = emptyDesign();

  protected readonly saving = signal(false);
  protected readonly saveErrors = signal<string[]>([]);

  // Edit mode works on the draft, view mode on the saved view; the template renders either.
  protected get designs(): DesignDraft[] {
    return this.editing() ? this.draft.designs : (this.view()?.designs ?? []);
  }

  protected toggleExpand(): void {
    if (this.expanded()) {
      this.expanded.set(false);
      this.cancelEdit();
      return;
    }

    this.expanded.set(true);

    // Already fetched this product's detail once — just re-expand without another round-trip.
    if (this.view()) {
      return;
    }

    this.detailLoading.set(true);
    this.adminProductService.getAdminProductDetail(this.product().productId).subscribe({
      next: (detail) => {
        this.view.set(this.toDraft(detail));
        this.detailLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching admin product detail:', err);
        this.detailLoading.set(false);
      }
    });
  }

  private toDraft(detail: AdminProductDetail): ProductDraft {
    return {
      productName: detail.productName,
      categoryName: detail.category.categoryName,
      designs: detail.designs.map((design) => ({
        designId: design.designId,
        designName: design.designName,
        designDescription: design.designDescription,
        estimatedPrice: design.estimatedPrice,
        images: [...design.images]
          .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
          .map((image) => ({
            key: image.imageId,
            src: buildAssetUrl(this.urlConstants.origin, image.url),
            altText: image.altText,
            isPrimary: image.isPrimary,
            file: null
          })),
        sizes: design.sizes.map((size) => ({
          sizeId: size.sizeId,
          sizeName: size.sizeName,
          length: size.length,
          breadth: size.breadth,
          height: size.height,
          weight: size.weight,
          basePrice: size.basePrice,
          mrp: size.mrp,
          quantity: size.quantity
        })),
        newSizes: []
      }))
    };
  }

  protected startEdit(): void {
    const current = this.view();
    if (!current || !this.product().isActive) {
      return;
    }

    this.draft = JSON.parse(JSON.stringify(current)) as ProductDraft;
    this.editing.set(true);
  }

  protected saveEdit(): void {
    const original = this.view();
    if (!original || this.saving()) {
      return;
    }

    // Sizes from the add-size forms count as sizes of their design once saved.
    const merged: ProductDraft = {
      ...this.draft,
      designs: this.draft.designs.map((design) => ({
        ...design,
        sizes: [...design.sizes, ...design.newSizes],
        newSizes: []
      }))
    };

    const errors = [
      ...getProductErrors(merged),
      ...merged.designs.flatMap((design) =>
        getDesignErrors(design).map((error) => `${design.designName.trim() || 'Design'}: ${error}`)
      )
    ];
    this.saveErrors.set(errors);
    if (errors.length > 0) {
      return;
    }

    this.saving.set(true);
    const body = buildProductUpdateFormData(original, merged, this.product().isActive);
    this.adminProductService.updateAdminProduct(this.product().productId, body).subscribe({
      next: (detail) => {
        this.view.set(this.toDraft(detail));
        this.saving.set(false);
        this.closeEditing();
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error updating admin product:', err);
        this.saving.set(false);
        this.saveErrors.set(['Save failed. Please try again.']);
      }
    });
  }

  protected cancelEdit(): void {
    this.closeEditing();
  }

  private closeEditing(): void {
    this.editing.set(false);
    this.addingDesign.set(false);
    this.newDesignSubmitted.set(false);
    this.saveErrors.set([]);
  }

  protected removeDesign(designIndex: number): void {
    this.draft.designs = this.draft.designs.filter((_, i) => i !== designIndex);
  }

  protected removeSize(designIndex: number, sizeIndex: number): void {
    const design = this.draft.designs[designIndex];
    design.sizes = design.sizes.filter((_, i) => i !== sizeIndex);
  }

  protected addNewSize(designIndex: number): void {
    const design = this.draft.designs[designIndex];
    design.newSizes = [...design.newSizes, emptySize()];
  }

  protected removeNewSize(designIndex: number, sizeIndex: number): void {
    const design = this.draft.designs[designIndex];
    design.newSizes = design.newSizes.filter((_, i) => i !== sizeIndex);
  }

  protected openAddDesign(): void {
    this.newDesign = emptyDesign();
    this.newDesignSubmitted.set(false);
    this.addingDesign.set(true);
  }

  protected cancelAddDesign(): void {
    this.addingDesign.set(false);
    this.newDesignSubmitted.set(false);
  }

  protected saveNewDesign(): void {
    this.newDesignSubmitted.set(true);
    if (getDesignErrors(this.newDesign).length > 0) {
      return;
    }

    this.draft.designs = [...this.draft.designs, this.newDesign];
    this.cancelAddDesign();
  }
}
