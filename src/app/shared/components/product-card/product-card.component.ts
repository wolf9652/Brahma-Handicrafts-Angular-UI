import { Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { DesignDetail, DesignSize, Product, ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, DialogModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  product = input.required<Product>();
  viewMode = input<'grid' | 'list'>('grid');
  /** Extra query params to attach to the /product/:id routerLink, e.g. { designId }. */
  queryParams = input<Record<string, string> | undefined>(undefined);
  readonly add = output<Product>();

  protected readonly isWishlisted = computed(() =>
    this.wishlistService.isWishlisted(this.product().id, this.queryParams()?.['designId'])
  );

  // Size-selection dialog state — used when the design has more than one size to choose from.
  protected readonly showSizeDialog = signal(false);
  protected readonly sizeDialogLoading = signal(false);
  protected readonly sizeDialogDesign = signal<DesignDetail | null>(null);
  protected readonly selectedSize = signal<DesignSize | null>(null);

  constructor(
    private readonly cartService: CartService,
    private readonly wishlistService: WishlistService,
    private readonly productService: ProductService,
    private readonly authService: AuthService
  ) {}

  protected onCardOpen(): void {
    const designId = this.queryParams()?.['designId'];
    if (!designId) {
      return;
    }

    this.productService.getDesignDetail(this.product().id, designId).subscribe({
      next: (design) => console.log('Design detail:', design),
      error: (err) => console.error('Error fetching design detail:', err)
    });
  }

  protected onAddToCartClick(): void {
    const designId = this.queryParams()?.['designId'];
    const totalSizes = this.product().totalSizes;

    if (!designId || !totalSizes) {
      // No live-API design context (e.g. a static demo product) — fall back to the old local-only add.
      this.addLocallyOnly();
      return;
    }

    if (totalSizes === 1) {
      // Exactly one size — fetch it to get the sizeId and add directly, no dialog needed.
      this.sizeDialogLoading.set(true);
      this.productService.getDesignDetail(this.product().id, designId).subscribe({
        next: (design) => {
          this.sizeDialogLoading.set(false);
          const onlySize = design.sizes[0];
          if (!onlySize) {
            this.addLocallyOnly();
            return;
          }
          this.confirmAddToCart(design, onlySize);
        },
        error: (err) => {
          this.sizeDialogLoading.set(false);
          console.error('Error fetching design detail:', err);
        }
      });
      return;
    }

    // More than one size — open the dialog so the user can pick.
    this.sizeDialogLoading.set(true);
    this.selectedSize.set(null);
    this.productService.getDesignDetail(this.product().id, designId).subscribe({
      next: (design) => {
        this.sizeDialogDesign.set(design);
        this.sizeDialogLoading.set(false);
        this.showSizeDialog.set(true);
      },
      error: (err) => {
        this.sizeDialogLoading.set(false);
        console.error('Error fetching design detail:', err);
      }
    });
  }

  protected selectDialogSize(size: DesignSize): void {
    this.selectedSize.set(size);
  }

  protected closeSizeDialog(): void {
    this.showSizeDialog.set(false);
    this.sizeDialogDesign.set(null);
    this.selectedSize.set(null);
  }

  protected confirmDialogAddToCart(): void {
    const design = this.sizeDialogDesign();
    const size = this.selectedSize();
    if (!design || !size) {
      return;
    }

    this.confirmAddToCart(design, size);
    this.closeSizeDialog();
  }

  private confirmAddToCart(design: DesignDetail, size: DesignSize): void {
    // The card's product().price is the design's estimatedPrice — override it with the
    // selected size's actual basePrice for the cart line.
    const cartProduct: Product = { ...this.product(), price: size.basePrice };
    const userId = this.authService.session()?.userId;

    if (this.authService.isLoggedIn() && userId) {
      this.cartService.addToCartApi({
        userId,
        productId: design.productId,
        designId: design.designId,
        sizeId: size.sizeId,
        quantity: 1
      }).subscribe({
        next: (response) => {
          this.cartService.addToCart(cartProduct, design.designId, size.sizeId, size.sizeName, response.cartItemId);
          this.add.emit(cartProduct);
        },
        error: (err) => console.error('Error adding to cart:', err)
      });
      return;
    }

    // Guest — local only (CartService persists this to localStorage so it survives a return visit).
    this.cartService.addToCart(cartProduct, design.designId, size.sizeId, size.sizeName);
    this.add.emit(cartProduct);
  }

  private addLocallyOnly(): void {
    this.cartService.addToCart(this.product());
    this.add.emit(this.product());
  }

  protected toggleWishlist(): void {
    const designId = this.queryParams()?.['designId'];

    if (this.isWishlisted()) {
      const productId = this.product().id;
      const userId = this.authService.session()?.userId;
      const wishlistItemId = this.wishlistService.getWishlistItemId(productId, designId);

      if (!userId || !wishlistItemId) {
        // No server-side row for this entry (e.g. a static demo product) — remove locally only.
        this.wishlistService.removeFromWishlist(productId, designId);
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

    const product = this.product();
    const userId = this.authService.session()?.userId;

    if (!designId || !userId) {
      // No live-API design context (e.g. a static demo product) — fall back to local-only wishlist.
      this.wishlistService.addToWishlist(product);
      return;
    }

    this.wishlistService.addToWishlistApi({ userId, productId: product.id, designId }).subscribe({
      next: () => this.wishlistService.loadWishlistForUser(userId),
      error: (err) => console.error('Error adding to wishlist:', err)
    });
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
