import { Injectable, signal } from '@angular/core';
import { Product } from './product.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  readonly items = signal<Product[]>([]);

  addToWishlist(product: Product) {
    this.items.update((current) => (current.some((item) => item.id === product.id) ? current : [...current, product]));
  }

  removeFromWishlist(productId: string) {
    this.items.update((current) => current.filter((item) => item.id !== productId));
  }

  clearWishlist() {
    this.items.set([]);
  }
}
