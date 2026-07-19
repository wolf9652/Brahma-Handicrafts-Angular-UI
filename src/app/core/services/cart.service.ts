import { Injectable, signal } from '@angular/core';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>([]);
  readonly isCartOpen = signal(false);

  addToCart(product: Product) {
    const existing = this.items().find((item) => item.product.id === product.id);

    if (existing) {
      this.items.update((current) => current.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
      return;
    }

    this.items.update((current) => [...current, { product, quantity: 1 }]);
  }

  removeFromCart(productId: string) {
    this.items.update((current) => current.filter((item) => item.product.id !== productId));
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
}
