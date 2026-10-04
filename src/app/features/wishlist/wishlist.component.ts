import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishlistEntry, WishlistService } from '../../core/services/wishlist.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  protected readonly wishlistEntries;

  constructor(
    private readonly wishlistService: WishlistService,
    private readonly cartService: CartService,
    private readonly authService: AuthService
  ) {
    this.wishlistEntries = this.wishlistService.entries;
  }

  protected removeFromWishlist(entry: WishlistEntry): void {
    this.deleteEntry(entry);
  }

  protected moveToCart(entry: WishlistEntry): void {
    this.cartService.addToCart(entry.product, entry.designId);
    this.deleteEntry(entry);
  }

  private deleteEntry(entry: WishlistEntry): void {
    const userId = this.authService.session()?.userId;

    if (!userId || !entry.wishlistItemId) {
      // No server-side row for this entry (e.g. a static demo product) — remove locally only.
      this.wishlistService.removeFromWishlist(entry.product.id, entry.designId);
      return;
    }

    this.wishlistService.deleteWishlistItem(entry.wishlistItemId, userId).subscribe({
      next: () => this.wishlistService.loadWishlistForUser(userId),
      error: (err) => console.error('Error removing from wishlist:', err)
    });
  }
}
