import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.service';
import { ApiUrlConstants } from '../constants/apiUrl.constants';
import { buildAssetUrl } from '../utils/image-url.util';

export interface WishlistAddRequest {
  userId: string;
  productId: string;
  designId: string;
}

export interface WishlistAddResponse {
  wishlistItemId: string;
  userId: string;
  productId: string;
  designId: string;
}

export interface WishlistDesignImage {
  imageId: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface WishlistDesign {
  designId: string;
  designName: string;
  designDescription: string;
  estimatedPrice: number;
  totalQuantity: number;
  image: WishlistDesignImage;
}

export interface WishlistUserItem {
  wishlistItemId: string;
  productId: string;
  productName: string;
  isActive: boolean;
  design: WishlistDesign;
}

export interface WishlistEntry {
  /** Unique per row: always productId (+ designId when known), never the bare server wishlistItemId — so
   *  entries fetched from the server and entries added locally via the same product/design resolve to the
   *  same identity for dedup/remove/isWishlisted checks. */
  key: string;
  wishlistItemId?: string;
  product: Product;
  designId?: string;
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly urlConstants = inject(ApiUrlConstants);

  readonly entries = signal<WishlistEntry[]>([]);

  private computeKey(productId: string, designId?: string): string {
    return designId ? `${productId}:${designId}` : productId;
  }

  isWishlisted(productId: string, designId?: string): boolean {
    const key = this.computeKey(productId, designId);
    return this.entries().some((entry) => entry.key === key);
  }

  /** The server-side wishlistItemId for a given product/design, if that entry came from the server. */
  getWishlistItemId(productId: string, designId?: string): string | undefined {
    const key = this.computeKey(productId, designId);
    return this.entries().find((entry) => entry.key === key)?.wishlistItemId;
  }

  /** Local-only add, for products with no live-API design context (no backend wishlist row exists for these). */
  addToWishlist(product: Product): void {
    const key = this.computeKey(product.id);
    this.entries.update((current) =>
      current.some((entry) => entry.key === key) ? current : [...current, { key, product }]
    );
  }

  /** Local-only remove. There's no delete API yet, so API-backed entries only disappear locally until the next server refresh. */
  removeFromWishlist(productId: string, designId?: string): void {
    const key = this.computeKey(productId, designId);
    this.entries.update((current) => current.filter((entry) => entry.key !== key));
  }

  clearWishlist(): void {
    this.entries.set([]);
  }

  addToWishlistApi(request: WishlistAddRequest): Observable<WishlistAddResponse> {
    return this.http.post<WishlistAddResponse>(this.urlConstants.WISHLIST_ADD, request);
  }

  getWishlistByUser(userId: string): Observable<WishlistUserItem[]> {
    return this.http.get<WishlistUserItem[]>(this.urlConstants.wishlistByUser(userId));
  }

  /** DELETE /api/Wishlist/{wishlistItemId}?userId={userId} — resolves on 204, errors on 404. */
  deleteWishlistItem(wishlistItemId: string, userId: string): Observable<void> {
    return this.http.delete<void>(this.urlConstants.wishlistDelete(wishlistItemId, userId));
  }

  /** Fetches the user's wishlist from the server and replaces local state with it. */
  loadWishlistForUser(userId: string): void {
    this.getWishlistByUser(userId).subscribe({
      next: (items) => this.entries.set(items.map((item) => this.mapToEntry(item))),
      error: (err) => console.error('Error fetching wishlist:', err)
    });
  }

  private mapToEntry(item: WishlistUserItem): WishlistEntry {
    const imageUrl = buildAssetUrl(this.urlConstants.origin, item.design.image?.url);

    const product: Product = {
      id: item.productId,
      name: `${item.productName} ${item.design.designName}`,
      price: item.design.estimatedPrice,
      originalPrice: item.design.estimatedPrice,
      image: imageUrl,
      images: imageUrl ? [imageUrl] : [],
      description: item.design.designDescription,
      features: [],
      inStock: item.design.totalQuantity > 0,
      rating: 0,
      reviews: 0
    };

    return {
      key: this.computeKey(item.productId, item.design.designId),
      wishlistItemId: item.wishlistItemId,
      product,
      designId: item.design.designId
    };
  }
}
