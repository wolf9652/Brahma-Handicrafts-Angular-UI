import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product, ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  protected readonly product = signal<Product | null>(null);
  protected readonly selectedImage = signal(0);
  protected readonly quantity = signal(1);
  protected readonly selectedColor = signal<string | null>(null);

  protected readonly isInWishlist = computed(() => {
    const product = this.product();
    if (!product) {
      return false;
    }

    return this.wishlistService.items().some((item) => item.id === product.id);
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.product.set(this.productService.getProduct(id) ?? null);
    }
  }

  protected increaseQuantity(): void {
    this.quantity.set(this.quantity() + 1);
  }

  protected decreaseQuantity(): void {
    this.quantity.set(Math.max(1, this.quantity() - 1));
  }

  protected selectImage(index: number): void {
    this.selectedImage.set(index);
  }

  protected selectColor(color: string): void {
    this.selectedColor.set(color);
  }

  protected addToCart(): void {
    const product = this.product();
    if (!product) {
      return;
    }

    for (let index = 0; index < this.quantity(); index += 1) {
      this.cartService.addToCart(product);
    }
  }

  protected toggleWishlist(): void {
    const product = this.product();
    if (!product) {
      return;
    }

    if (this.isInWishlist()) {
      this.wishlistService.removeFromWishlist(product.id);
      return;
    }

    this.wishlistService.addToWishlist(product);
  }

  protected shareProduct(): void {
    const product = this.product();
    if (!product) {
      return;
    }

    const url = `${window.location.origin}/product/${product.id}`;

    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url,
      });
      return;
    }

    navigator.clipboard.writeText(url);
    window.alert('Product link copied to clipboard!');
  }
}
