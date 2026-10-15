import { Component, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AdminProductService } from '../../../../core/services/admin-product.service';
import { AdminPromotionListItem, AdminPromotionService } from '../../../../core/services/admin-promotion.service';
import { ApiUrlConstants } from '../../../../core/constants/apiUrl.constants';
import { buildAssetUrl } from '../../../../core/utils/image-url.util';
import { PromotionDraft, emptyPromotion, getPromotionErrors } from '../promotion-form.models';
import { buildUpdatePromotionFormData } from '../promotion-create.mapper';
import { PromotionFieldsFormComponent } from '../promotion-fields-form/promotion-fields-form.component';

interface ResolvedProduct {
  productId: string;
  productName: string;
  image: string;
}

@Component({
  selector: 'app-promotion-card',
  standalone: true,
  imports: [DatePipe, PromotionFieldsFormComponent],
  templateUrl: './promotion-card.component.html'
})
export class PromotionCardComponent {
  private readonly adminProductService = inject(AdminProductService);
  private readonly adminPromotionService = inject(AdminPromotionService);
  private readonly messageService = inject(MessageService);
  private readonly urlConstants = inject(ApiUrlConstants);

  promotion = input.required<AdminPromotionListItem>();
  // Emitted after a successful delete, disable or save so the list can reload.
  deleted = output<void>();
  statusChanged = output<void>();
  saved = output<void>();

  protected readonly expanded = signal(false);
  protected readonly editing = signal(false);
  protected readonly submitted = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly deleting = signal(false);
  protected readonly disabling = signal(false);
  protected readonly saving = signal(false);
  protected draft: PromotionDraft = emptyPromotion();

  // productId -> name/image, resolved against the real admin products list (list GET only returns
  // productIds). A product outside that page's first 50 shows its id instead of a name.
  private readonly productLookup = signal<Map<string, { productName: string; image: string }>>(new Map());

  constructor() {
    this.adminProductService.getAdminProducts().subscribe({
      next: (page) => {
        const lookup = new Map<string, { productName: string; image: string }>();
        for (const product of page.items) {
          lookup.set(product.productId, {
            productName: product.productName,
            image: buildAssetUrl(this.urlConstants.origin, product.image?.url)
          });
        }
        this.productLookup.set(lookup);
      },
      error: (err) => console.error('Error fetching products for promotion display:', err)
    });
  }

  protected current(): AdminPromotionListItem {
    return this.promotion();
  }

  protected toggleExpand(): void {
    this.expanded.update((open) => !open);
    if (!this.expanded()) {
      this.editing.set(false);
    }
  }

  protected formatValue(): string {
    const item = this.current();
    return item.discountType === 'Percentage' ? `${item.discountValue}%` : `${item.discountValue}`;
  }

  protected resolvedProducts(): ResolvedProduct[] {
    const lookup = this.productLookup();
    return this.current().productIds.map((productId) => {
      const found = lookup.get(productId);
      return found ? { productId, ...found } : { productId, productName: productId, image: '' };
    });
  }

  protected displayBannerUrl(): string {
    const banner = this.current().banners[0];
    return banner ? buildAssetUrl(this.urlConstants.origin, banner.url) : '';
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected startEdit(): void {
    this.menuOpen.set(false);
    const item = this.current();
    const lookup = this.productLookup();

    this.draft = {
      id: item.promotionId,
      name: item.name,
      discountType: item.discountType,
      discountValue: item.discountValue,
      startDate: item.startDate.slice(0, 10),
      endDate: item.endDate.slice(0, 10),
      bannerImage: item.banners[0] ? { src: this.displayBannerUrl(), file: null } : null,
      products: item.productIds.map((productId) => {
        const found = lookup.get(productId);
        return found
          ? { productId, productName: found.productName, image: found.image }
          : { productId, productName: productId, image: '' };
      })
    };
    this.submitted.set(false);
    this.editing.set(true);
  }

  protected cancelEdit(): void {
    this.editing.set(false);
  }

  // Label reflects status, not isActive — matches what the user asked to compare against.
  protected toggleLabel(): string {
    return this.current().status.toLowerCase() === 'inactive' ? 'Enable' : 'Disable';
  }

  protected toggleBusyLabel(): string {
    return this.current().status.toLowerCase() === 'inactive' ? 'Enabling...' : 'Disabling...';
  }

  // Toggles isActive both ways. The response has no body, and `status` is backend-computed from
  // more than just isActive, so the list is reloaded rather than guessing the new display state locally.
  protected toggleStatus(): void {
    if (this.disabling()) {
      return;
    }

    const wasInactive = this.current().status.toLowerCase() === 'inactive';
    this.menuOpen.set(false);
    this.disabling.set(true);
    this.adminPromotionService.togglePromotionStatus(this.current().promotionId).subscribe({
      next: () => {
        this.disabling.set(false);
        this.statusChanged.emit();
      },
      error: (err) => {
        console.error('Error updating promotion status:', err);
        this.disabling.set(false);
        this.messageService.add({
          severity: 'error',
          summary: wasInactive ? 'Enable failed' : 'Disable failed',
          detail: `We could not ${wasInactive ? 'enable' : 'disable'} this promotion. Please try again.`
        });
      }
    });
  }

  protected deletePromotion(): void {
    if (this.deleting()) {
      return;
    }

    this.menuOpen.set(false);
    this.deleting.set(true);
    this.adminPromotionService.deletePromotion(this.current().promotionId).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deleted.emit();
      },
      error: (err) => {
        console.error('Error deleting promotion:', err);
        this.deleting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Delete failed',
          detail: 'We could not delete this promotion. Please try again.'
        });
      }
    });
  }

  protected saveEdit(): void {
    this.submitted.set(true);
    if (getPromotionErrors(this.draft).length > 0 || this.saving()) {
      return;
    }

    this.saving.set(true);
    // The edit form has no Active/Inactive control, so the promotion's current value is resent unchanged.
    const body = buildUpdatePromotionFormData(this.draft, this.current().isActive);
    this.adminPromotionService.updatePromotion(this.current().promotionId, body).subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.saved.emit();
      },
      error: (err) => {
        console.error('Error updating promotion:', err);
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Save failed',
          detail: 'We could not save your changes. Please try again.'
        });
      }
    });
  }
}
