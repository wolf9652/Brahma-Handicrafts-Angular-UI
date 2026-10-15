import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiUrlConstants } from '../constants/apiUrl.constants';

export interface ActivePromotionBanner {
  bannerId: string;
  url: string;
  altText: string;
}

export interface ActivePromotion {
  promotionId: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  productIds: string[];
  banners: ActivePromotionBanner[];
}

// Loads once, on app start (injected eagerly from ShellComponent, which wraps every route — this
// needs to be live before any page with prices renders, not just the home page). Every price
// display and price calculation across the site reads through applyDiscount() rather than a
// snapshot taken once, so a promotion starting/ending is reflected without a reload.
@Injectable({ providedIn: 'root' })
export class PromotionPricingService {
  private readonly http = inject(HttpClient);
  private readonly urlConstants = inject(ApiUrlConstants);

  // productId -> the one active promotion covering it. Per confirmed business rule, a product is
  // never covered by more than one active promotion at a time, so there's no overlap to resolve.
  private readonly promotionByProductId = signal<Map<string, ActivePromotion>>(new Map());

  constructor() {
    // Deferred, not called directly: this HTTP call runs through authInterceptor, which injects
    // AuthService — and AuthService injects CartService, which now injects this service. Calling
    // http.get() synchronously here would re-enter that chain while CartService is still being
    // constructed, which Angular's injector reports as NG0200 (circular dependency), even though
    // there's no real cycle once construction has finished. Same fix as AuthService's constructor.
    queueMicrotask(() => this.loadActivePromotions());
  }

  private loadActivePromotions(): void {
    this.http.get<ActivePromotion[]>(this.urlConstants.ACTIVE_PROMOTIONS).subscribe({
      next: (promotions) => {
        const map = new Map<string, ActivePromotion>();
        for (const promotion of promotions) {
          for (const productId of promotion.productIds) {
            map.set(productId, promotion);
          }
        }
        this.promotionByProductId.set(map);
      },
      error: (err) => console.error('Error fetching active promotions:', err)
    });
  }

  /**
   * Applies productId's active promotion (if any) to `price`: the discountValue is subtracted
   * directly for 'Fixed', or taken as a percentage off for 'Percentage'. Never goes below ₹0.
   * Returns `price` unchanged when productId has no active promotion.
   */
  applyDiscount(productId: string | undefined, price: number): number {
    const promotion = productId ? this.promotionByProductId().get(productId) : undefined;
    if (!promotion) {
      return price;
    }

    const discounted = promotion.discountType === 'Percentage'
      ? price * (1 - promotion.discountValue / 100)
      : price - promotion.discountValue;

    return Math.max(0, discounted);
  }

  hasDiscount(productId: string | undefined): boolean {
    return !!productId && this.promotionByProductId().has(productId);
  }
}
