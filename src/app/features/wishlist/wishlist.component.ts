import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import type { Product } from '../../core/services/product.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  protected readonly wishlistItems;

  constructor(
    private readonly wishlistService: WishlistService,
    private readonly cartService: CartService
  ) {
    this.wishlistItems = this.wishlistService.items;
  }

  protected removeFromWishlist(productId: string): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  protected moveToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.wishlistService.removeFromWishlist(product.id);
  }
}
