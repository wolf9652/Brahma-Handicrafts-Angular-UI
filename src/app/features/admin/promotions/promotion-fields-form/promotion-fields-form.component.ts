import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminProductItem, AdminProductService } from '../../../../core/services/admin-product.service';
import { ApiUrlConstants } from '../../../../core/constants/apiUrl.constants';
import { buildAssetUrl } from '../../../../core/utils/image-url.util';
import { PromotionDraft, getPromotionErrors } from '../promotion-form.models';

// The Name/Type/Value/Dates/Banner/Products fields, shared between the create form and the
// promotion card's edit mode. Mutates `draft` directly — the parent owns that object.
@Component({
  selector: 'app-promotion-fields-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './promotion-fields-form.component.html'
})
export class PromotionFieldsFormComponent implements OnInit {
  private readonly adminProductService = inject(AdminProductService);
  private readonly urlConstants = inject(ApiUrlConstants);

  draft = input.required<PromotionDraft>();
  // Errors only show after the parent's first save attempt.
  submitted = input(false);

  // Reuses the real admin products list (already wired up) to power the search picker below.
  protected readonly allProducts = signal<AdminProductItem[]>([]);
  protected readonly productSearch = signal('');

  protected readonly productResults = computed(() => {
    const query = this.productSearch().trim().toLowerCase();
    const selectedIds = new Set(this.draft().products.map((product) => product.productId));
    const pool = this.allProducts().filter((product) => !selectedIds.has(product.productId));

    const matches = query ? pool.filter((product) => product.productName.toLowerCase().includes(query)) : pool;
    return matches.slice(0, 8);
  });

  private static readonly BANNER_ERROR = 'Banner image is required.';

  // Shown inline under the banner box instead of in the general list below.
  protected get bannerError(): string | null {
    return this.submitted() && !this.draft().bannerImage ? PromotionFieldsFormComponent.BANNER_ERROR : null;
  }

  protected get errors(): string[] {
    if (!this.submitted()) {
      return [];
    }
    return getPromotionErrors(this.draft()).filter((error) => error !== PromotionFieldsFormComponent.BANNER_ERROR);
  }

  ngOnInit(): void {
    this.adminProductService.getAdminProducts().subscribe({
      next: (page) => this.allProducts.set(page.items),
      error: (err) => console.error('Error fetching products for the promotion picker:', err)
    });
  }

  protected productImageUrl(product: AdminProductItem): string {
    return buildAssetUrl(this.urlConstants.origin, product.image?.url);
  }

  protected addProduct(product: AdminProductItem): void {
    const draft = this.draft();
    draft.products = [
      ...draft.products,
      { productId: product.productId, productName: product.productName, image: this.productImageUrl(product) }
    ];
    this.productSearch.set('');
  }

  protected removeProduct(productId: string): void {
    const draft = this.draft();
    draft.products = draft.products.filter((product) => product.productId !== productId);
  }

  protected onBannerSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file && file.type.startsWith('image/')) {
      this.draft().bannerImage = { src: URL.createObjectURL(file), file };
    }
    fileInput.value = '';
  }

  protected removeBanner(): void {
    this.draft().bannerImage = null;
  }
}
