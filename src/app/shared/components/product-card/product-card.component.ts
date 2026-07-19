import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Product } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  product = input.required<Product>();
  viewMode = input<'grid' | 'list'>('grid');
  readonly add = output<Product>();

  protected readonly isWishlisted = computed(() =>
    this.wishlistService.items().some((item) => item.id === this.product().id)
  );

  constructor(
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService
  ) {}

  protected addToCart(): void {
    this.cartService.addToCart(this.product());
    this.add.emit(this.product());
  }

  protected toggleWishlist(): void {
    if (this.isWishlisted()) {
      this.wishlistService.removeFromWishlist(this.product().id);
      return;
    }

    this.wishlistService.addToWishlist(this.product());
  }

  protected shareProduct(): void {
    const selectedProduct = this.product();
    const url = `${window.location.origin}/product/${selectedProduct.id}`;

    if (navigator.share) {
      navigator.share({
        title: selectedProduct.name,
        text: selectedProduct.description,
        url,
      });
      return;
    }

    navigator.clipboard.writeText(url);
    window.alert('Product link copied to clipboard!');
  }
}
