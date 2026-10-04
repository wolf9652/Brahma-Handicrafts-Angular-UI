import { Injectable, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from './product.service';
import { ApiUrlConstants } from '../constants/apiUrl.constants';
import { buildAssetUrl } from '../utils/image-url.util';

export interface CartItem {
  /** Unique per line: productId (+ designId, + sizeId when known) — so different designs/sizes of the
   *  same product never collide into one line, matching what the server's per-user cart can contain. */
  key: string;
  cartItemId?: string;
  product: Product;
  designId?: string;
  sizeId?: string;
  sizeName?: string;
  quantity: number;
}

export interface CartAddRequest {
  userId: string;
  productId: string;
  designId: string;
  sizeId: string;
  quantity: number;
}

export interface CartAddResponse {
  cartItemId: string;
  userId: string;
  productId: string;
  designId: string;
  sizeId: string;
}

export interface CartUpdateRequest {
  userId: string;
  cartItemId: string;
  quantity: number;
}

export interface CartUpdateResponse {
  cartItemId: string;
  quantity: number;
}

export interface CartDesignImage {
  imageId: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface CartDesign {
  designId: string;
  designName: string;
  designDescription: string;
  estimatedPrice: number;
  totalQuantity: number;
  totalSizes: number;
  image: CartDesignImage;
}

export interface CartUserItem {
  cartItemId: string;
  productId: string;
  productName: string;
  designId: string;
  sizeId: string;
  sizeName: string;
  basePrice: number;
  quantity: number;
  design: CartDesign;
}

const CART_STORAGE_KEY = 'guest_cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly urlConstants = inject(ApiUrlConstants);

  readonly items = signal<CartItem[]>(this.readStoredItems());
  readonly isCartOpen = signal(false);

  constructor() {
    // Persists on every change so a guest's cart survives a page reload/return visit.
    effect(() => {
      const items = this.items();
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // Storage unavailable (e.g. private browsing) — cart just won't persist across reloads.
      }
    });
  }

  private readStoredItems(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private computeKey(productId: string, designId?: string, sizeId?: string): string {
    if (designId && sizeId) {
      return `${productId}:${designId}:${sizeId}`;
    }
    if (designId) {
      return `${productId}:${designId}`;
    }
    return productId;
  }

  addToCart(product: Product, designId?: string, sizeId?: string, sizeName?: string, cartItemId?: string) {
    const key = this.computeKey(product.id, designId, sizeId);
    const existing = this.items().find((item) => item.key === key);

    if (existing) {
      this.items.update((current) => current.map((item) =>
        item.key === key ? { ...item, quantity: item.quantity + 1, cartItemId: item.cartItemId ?? cartItemId } : item
      ));
      return;
    }

    this.items.update((current) => [...current, { key, product, designId, sizeId, sizeName, cartItemId, quantity: 1 }]);
  }

  removeFromCart(productId: string, designId?: string, sizeId?: string) {
    const key = this.computeKey(productId, designId, sizeId);
    this.items.update((current) => current.filter((item) => item.key !== key));
  }

  updateQuantity(productId: string, quantity: number, designId?: string, sizeId?: string) {
    if (quantity <= 0) {
      this.removeFromCart(productId, designId, sizeId);
      return;
    }

    const key = this.computeKey(productId, designId, sizeId);
    this.items.update((current) => current.map((item) =>
      item.key === key ? { ...item, quantity } : item
    ));
  }

  increaseQuantity(productId: string, designId?: string, sizeId?: string) {
    const key = this.computeKey(productId, designId, sizeId);
    this.items.update((current) => current.map((item) =>
      item.key === key ? { ...item, quantity: item.quantity + 1 } : item
    ));
  }

  decreaseQuantity(productId: string, designId?: string, sizeId?: string) {
    const key = this.computeKey(productId, designId, sizeId);
    const item = this.items().find((item) => item.key === key);
    if (!item) return;
    if (item.quantity <= 1) {
      this.removeFromCart(productId, designId, sizeId);
      return;
    }

    this.items.update((current) => current.map((item) =>
      item.key === key ? { ...item, quantity: item.quantity - 1 } : item
    ));
  }

  clearCart() {
    this.items.set([]);
  }

  toggleCart(): void {
    this.isCartOpen.set(!this.isCartOpen());
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }

  get itemCount() {
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    return this.items().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  getTotal(): number {
    return this.totalPrice;
  }

  addToCartApi(request: CartAddRequest): Observable<CartAddResponse> {
    return this.http.post<CartAddResponse>(this.urlConstants.CART_ADD, request);
  }

  updateQuantityApi(request: CartUpdateRequest): Observable<CartUpdateResponse> {
    return this.http.put<CartUpdateResponse>(this.urlConstants.CART_UPDATE, request);
  }

  /** DELETE /api/Cart/{cartItemId}?userId={userId} — resolves on 200, errors on 404. */
  deleteCartItemApi(cartItemId: string, userId: string): Observable<void> {
    return this.http.delete<void>(this.urlConstants.cartDelete(cartItemId, userId));
  }

  getCartByUser(userId: string): Observable<CartUserItem[]> {
    return this.http.get<CartUserItem[]>(this.urlConstants.cartByUser(userId));
  }

  /** Fetches the user's cart from the server and replaces local state with it. Logged-in users only. */
  loadCartForUser(userId: string): void {
    this.getCartByUser(userId).subscribe({
      next: (items) => this.items.set(items.map((item) => this.mapToCartItem(item))),
      error: (err) => console.error('Error fetching cart:', err)
    });
  }

  /**
   * Pushes a guest's locally-held cart items (added before login) to the server for this now-logged-in
   * user, then refreshes from the server so the final state reflects whatever the backend ends up with.
   * Items with no real designId/sizeId (e.g. static demo products) can't be sent and are dropped.
   */
  migrateGuestCartToUser(userId: string): void {
    const migratable = this.items().filter(
      (item): item is CartItem & { designId: string; sizeId: string } => !!item.designId && !!item.sizeId
    );

    if (migratable.length === 0) {
      this.loadCartForUser(userId);
      return;
    }

    const requests = migratable.map((item) =>
      this.addToCartApi({
        userId,
        productId: item.product.id,
        designId: item.designId,
        sizeId: item.sizeId,
        quantity: item.quantity
      }).pipe(
        catchError((err) => {
          console.error('Error migrating cart item to account:', err);
          return of(null);
        })
      )
    );

    forkJoin(requests).subscribe(() => this.loadCartForUser(userId));
  }

  private mapToCartItem(item: CartUserItem): CartItem {
    const imageUrl = buildAssetUrl(this.urlConstants.origin, item.design.image?.url);

    const product: Product = {
      id: item.productId,
      name: `${item.productName} ${item.design.designName}`,
      price: item.basePrice,
      image: imageUrl,
      images: imageUrl ? [imageUrl] : [],
      description: item.design.designDescription,
      features: [],
      inStock: item.design.totalQuantity > 0,
      rating: 0,
      reviews: 0,
      totalSizes: item.design.totalSizes
    };

    return {
      key: this.computeKey(item.productId, item.designId, item.sizeId),
      cartItemId: item.cartItemId,
      product,
      designId: item.designId,
      sizeId: item.sizeId,
      sizeName: item.sizeName,
      quantity: item.quantity
    };
  }
}
