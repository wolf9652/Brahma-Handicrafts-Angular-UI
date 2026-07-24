import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Product, ProductService } from '../../core/services/product.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { UserService } from '../../core/services/user.service';
import { ApiUrlConstants } from '../../core/constants/apiUrl.constants';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';

interface Review {
  id: string;
  name: string;
  title?: string;
  productName?: string;
  text: string;
  rating: number;
  alt: string;
  rotation: string;
  stars?: ('full' | 'half' | 'empty')[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RatingModule, FormsModule],
  providers: [UserService, ApiUrlConstants],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  protected readonly products = signal<Product[]>([]);
  protected readonly currentSlide = signal(0);
  protected readonly featuredCarouselIndex = signal(0);
  protected readonly viewMode = signal<'grid' | 'list'>('grid');
  protected readonly reviews = signal<Review[]>([]);

  protected readonly bannerProducts = computed(() => this.products().slice(0, 4));
  protected readonly featuredProducts = computed(() => this.products().slice(0, 5));
  protected readonly currentBannerProduct = computed(
    () => this.bannerProducts()[this.currentSlide()] ?? this.bannerProducts()[0]
  );
  protected readonly featuredVisibleProduct = computed(
    () => this.featuredProducts()[this.featuredCarouselIndex()] ?? this.featuredProducts()[0]
  );
  protected readonly isCurrentBannerWishlisted = computed(() => {
    const product = this.currentBannerProduct();
    return product ? this.wishlistService.items().some((item) => item.id === product.id) : false;
  });

  protected readonly isFeaturedWishlisted = (productId: string): boolean => {
    return this.wishlistService.items().some((item) => item.id === productId);
  };

  private featuredCarouselTimer?: number;

  constructor(
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService
  ) {
    this.products.set(this.productService.getProducts());

    const initialReviews: Review[] = [
      {
        id: 'r1',
        name: 'Amara Johnson',
        title: 'Interior Designer, NYC',
        productName: 'Linen Cloud Sofa',
        text: "Every piece I've ordered has been exactly as described — the quality exceptional. My living room finally feels like the sanctuary I always wanted.",
        alt: 'Amara Johnson, interior designer smiling in professional headshot',
        rotation: '-rotate-1',
        rating: 5,
      },
      {
        id: 'r2',
        name: 'Marcus Chen',
        title: 'Architect, San Francisco',
        productName: 'Travertine Side Table',
        text: 'I was skeptical about buying furniture online but this collection completely changed my mind. Packaging felt luxurious, and the table is stunning.',
        alt: 'Marcus Chen, architect in professional photo with friendly expression',
        rotation: 'rotate-1',
        rating: 4.5,
      },
      {
        id: 'r3',
        name: 'Sophia Reyes',
        title: 'Lifestyle Blogger, Austin',
        productName: 'Rattan Pendant Light',
        text: "The curation here unlike anything I've seen. Clearly have a strong design vision and quality product.",
        alt: 'Sophia Reyes, lifestyle blogger with warm smile in casual portrait',
        rotation: '-rotate-2',
        rating: 4,
      },
      {
        id: 'r4',
        text: "Fast shipping, beautiful products, and their customer service team is genuinely helpful. I've become a repeat customer for all my home updates.",
        name: 'Daniel Park',
        title: 'Homeowner, Chicago',
        alt: 'Daniel Park, homeowner smiling in casual portrait photograph',
        rating: 3,
        productName: 'Ceramic Vase Set',
        rotation: 'rotate-2'
      }
    ];

    this.reviews.set(initialReviews.map((r) => ({ ...r, stars: this.createStars(r.rating) })));
  }

  protected createStars(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    for (let i = 0; i < full; i += 1) stars.push('full');
    if (half) stars.push('half');
    while (stars.length < 5) stars.push('empty');
    return stars;
  }

  ngOnInit(): void {
    this.featuredCarouselTimer = window.setInterval(() => this.nextFeatured(), 6000);
  }

  ngOnDestroy(): void {
    if (this.featuredCarouselTimer) {
      window.clearInterval(this.featuredCarouselTimer);
    }
  }

  protected nextSlide(): void {
    const count = this.bannerProducts().length;
    this.currentSlide.set((this.currentSlide() + 1) % count);
  }

  protected previousSlide(): void {
    const count = this.bannerProducts().length;
    this.currentSlide.set((this.currentSlide() - 1 + count) % count);
  }

  protected nextFeatured(): void {
    const count = this.featuredProducts().length;
    this.featuredCarouselIndex.set((this.featuredCarouselIndex() + 1) % count);
  }

  protected previousFeatured(): void {
    const count = this.featuredProducts().length;
    this.featuredCarouselIndex.set((this.featuredCarouselIndex() - 1 + count) % count);
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
