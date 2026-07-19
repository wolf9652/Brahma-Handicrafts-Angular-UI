import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Product, ProductService } from '../../core/services/product.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { UserService } from '../../core/services/user.service';
import { ApiUrlConstants } from '../../core/constants/apiUrl.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  providers: [UserService, ApiUrlConstants],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private userService = inject(UserService);
  protected readonly products = signal<Product[]>([]);
  protected readonly currentSlide = signal(0);
  protected readonly viewMode = signal<'grid' | 'list'>('grid');

  protected readonly bannerProducts = computed(() => this.products().slice(0, 4));
  protected readonly featuredProducts = computed(() => this.products().slice(0, 5));
  protected readonly currentBannerProduct = computed(
    () => this.bannerProducts()[this.currentSlide()] ?? this.bannerProducts()[0]
  );
  protected readonly isCurrentBannerWishlisted = computed(() => {
    const product = this.currentBannerProduct();
    return product ? this.wishlistService.items().some((item) => item.id === product.id) : false;
  });

  protected readonly isFeaturedWishlisted = (productId: string): boolean => {
    return this.wishlistService.items().some((item) => item.id === productId);
  };

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService
  ) {
    this.products.set(this.productService.getProducts());
  }

  ngOnInit(): void {
    console.log('HomeComponent initialized');
    this.userService.signUp({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123', phoneNumber: '123-456-7890' }).subscribe({
      next: (user) => {
        console.log('User signed up successfully:', user);
      }, error: (err) => {
        console.error('Error signing up user:', err);
      }
    });
  }

  protected nextSlide(): void {
    const count = this.bannerProducts().length;
    this.currentSlide.set((this.currentSlide() + 1) % count);
  }

  protected previousSlide(): void {
    const count = this.bannerProducts().length;
    this.currentSlide.set((this.currentSlide() - 1 + count) % count);
  }

  protected toggleWishlist(): void {
    const product = this.currentBannerProduct();
    if (!product) {
      return;
    }

    if (this.isCurrentBannerWishlisted()) {
      this.wishlistService.removeFromWishlist(product.id);
      return;
    }

    this.wishlistService.addToWishlist(product);
  }

  protected toggleFeaturedWishlist(product: Product): void {
    if (this.isFeaturedWishlisted(product.id)) {
      this.wishlistService.removeFromWishlist(product.id);
      return;
    }

    this.wishlistService.addToWishlist(product);
  }

  protected addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  protected shareProduct(product?: Product): void {
    const selectedProduct = product ?? this.currentBannerProduct();
    if (!selectedProduct) {
      return;
    }

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
