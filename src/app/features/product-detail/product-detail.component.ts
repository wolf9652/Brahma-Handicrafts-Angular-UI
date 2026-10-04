import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DesignDetail, DesignSize, Product, ProductVariant, ProductService } from '../../core/services/product.service';
import { ApiUrlConstants } from '../../core/constants/apiUrl.constants';
import { buildAssetUrl } from '../../core/utils/image-url.util';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AuthService } from '../../core/services/auth.service';
import { ImageGalleryComponent } from '../../shared/components/image-gallery/image-gallery.component';

type ViewMode = 'legacy' | 'api';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, ImageGalleryComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent {
  protected readonly mode = signal<ViewMode>('legacy');

  // Legacy (static demo data) state — unchanged behavior.
  protected readonly product = signal<Product | null>(null);
  protected readonly selectedVariant = signal<ProductVariant | null>(null);
  protected readonly selectedDesign = signal<string | null>(null);

  // Live-API-driven state.
  protected readonly design = signal<DesignDetail | null>(null);
  protected readonly designNotFound = signal(false);
  protected readonly categoryName = signal<string>('');
  protected readonly selectedSize = signal<DesignSize | null>(null);

  protected readonly selectedImage = signal(0);
  protected readonly quantity = signal(1);

  protected readonly sortedImageUrls = computed(() => {
    const currentDesign = this.design();
    if (!currentDesign) {
      return [];
    }

    return [...currentDesign.images]
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
      .map((image) => buildAssetUrl(this.urlConstants.origin, image.url));
  });

  protected readonly legacyImages = computed<string[]>(() => {
    const currentProduct = this.product();
    if (!currentProduct) {
      return [];
    }

    const variant = this.selectedVariant();
    if (variant?.images?.length) {
      return variant.images;
    }
    if (variant?.image) {
      return [variant.image];
    }

    return currentProduct.images?.length ? currentProduct.images : [currentProduct.image];
  });

  protected readonly activeDesignId = computed(() =>
    this.mode() === 'api' ? this.design()?.designId : undefined
  );

  protected readonly isInWishlist = computed(() => {
    const activeProduct = this.effectiveProduct();
    if (!activeProduct) {
      return false;
    }

    return this.wishlistService.isWishlisted(activeProduct.id, this.activeDesignId());
  });

  private readonly effectiveProduct = computed<Product | null>(() => {
    if (this.mode() === 'api') {
      const currentDesign = this.design();
      if (!currentDesign) {
        return null;
      }

      const size = this.selectedSize();
      const images = this.sortedImageUrls();

      return {
        id: currentDesign.productId,
        name: `${currentDesign.productName} ${currentDesign.designName}`,
        price: size?.basePrice ?? currentDesign.estimatedPrice,
        originalPrice: size?.mrp,
        image: images[0] ?? '',
        images,
        category: this.categoryName(),
        description: currentDesign.designDescription,
        features: [],
        inStock: size ? size.quantity > 0 : true,
        rating: 0,
        reviews: 0
      };
    }

    return this.product();
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService,
    private readonly authService: AuthService,
    private readonly urlConstants: ApiUrlConstants
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    const designId = this.route.snapshot.queryParamMap.get('designId');

    if (id && designId) {
      this.mode.set('api');
      this.categoryName.set(this.route.snapshot.queryParamMap.get('category') ?? '');
      this.loadDesign(id, designId);
      return;
    }

    this.mode.set('legacy');
    if (id) {
      const prod = this.productService.getProduct(id);
      if (prod) {
        this.product.set(prod);

        if (prod.variants?.length) {
          const defaultVariant = prod.variants[0];
          this.selectedVariant.set(defaultVariant);
          this.selectedDesign.set(defaultVariant.name);
        }
      }
    }
  }

  private loadDesign(productId: string, designId: string): void {
    this.productService.getDesignDetail(productId, designId).subscribe({
      next: (detail) => {
        this.design.set(detail);
        if (detail.sizes.length === 1) {
          this.selectedSize.set(detail.sizes[0]);
        }
      },
      error: (err) => {
        console.error('Error fetching design detail:', err);
        this.designNotFound.set(true);
      }
    });
  }

  protected selectSize(size: DesignSize): void {
    this.selectedSize.set(size);
  }

  protected increaseQuantity(): void {
    this.quantity.set(this.quantity() + 1);
  }

  protected decreaseQuantity(): void {
    this.quantity.set(Math.max(1, this.quantity() - 1));
  }

  protected selectDesign(design: string): void {
    const product = this.product();
    if (!product?.variants) return;

    const variant = product.variants.find(v => v.name === design) || null;
    this.selectedDesign.set(design);
    this.selectedVariant.set(variant);
    this.selectedImage.set(0); // reset gallery to first image
  }

  protected addToCart(): void {
    const activeProduct = this.mode() === 'api' ? this.effectiveProduct() : this.product();
    if (!activeProduct) {
      return;
    }

    const designId = this.activeDesignId();
    const sizeId = this.mode() === 'api' ? this.selectedSize()?.sizeId : undefined;
    const sizeName = this.mode() === 'api' ? this.selectedSize()?.sizeName : undefined;

    for (let index = 0; index < this.quantity(); index += 1) {
      this.cartService.addToCart(activeProduct, designId, sizeId, sizeName);
    }
  }

  protected toggleWishlist(): void {
    const activeProduct = this.mode() === 'api' ? this.effectiveProduct() : this.product();
    if (!activeProduct) {
      return;
    }

    const designId = this.activeDesignId();

    if (this.isInWishlist()) {
      const userId = this.authService.session()?.userId;
      const wishlistItemId = this.wishlistService.getWishlistItemId(activeProduct.id, designId);

      if (!userId || !wishlistItemId) {
        // No server-side row for this entry (e.g. a static demo product) — remove locally only.
        this.wishlistService.removeFromWishlist(activeProduct.id, designId);
        return;
      }

      this.wishlistService.deleteWishlistItem(wishlistItemId, userId).subscribe({
        next: () => this.wishlistService.loadWishlistForUser(userId),
        error: (err) => console.error('Error removing from wishlist:', err)
      });
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.authService.openLoginDialog();
      return;
    }

    const userId = this.authService.session()?.userId;

    if (!designId || !userId) {
      // No live-API design context (e.g. a static demo product) — fall back to local-only wishlist.
      this.wishlistService.addToWishlist(activeProduct);
      return;
    }

    this.wishlistService.addToWishlistApi({ userId, productId: activeProduct.id, designId }).subscribe({
      next: () => this.wishlistService.loadWishlistForUser(userId),
      error: (err) => console.error('Error adding to wishlist:', err)
    });
  }

  protected shareProduct(): void {
    const activeProduct = this.mode() === 'api' ? this.effectiveProduct() : this.product();
    if (!activeProduct) {
      return;
    }

    const url = `${window.location.origin}/product/${activeProduct.id}`;

    if (navigator.share) {
      navigator.share({
        title: activeProduct.name,
        text: activeProduct.description,
        url,
      });
      return;
    }

    navigator.clipboard.writeText(url);
    window.alert('Product link copied to clipboard!');
  }
}
