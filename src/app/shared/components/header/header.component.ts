import { Component, signal, EventEmitter, Output } from '@angular/core';
import { RouterLink, } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AuthComponent } from '../../../features/auth/auth.component';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, DialogModule, ButtonModule, AuthComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showLoginDialog = signal(false);

  @Output() menuToggle = new EventEmitter<void>();
  @Output() cartToggle = new EventEmitter<void>();

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  get cartCount() {
    return this.cartService.itemCount;
  }

  get wishlistCount() {
    return this.wishlistService.items().length;
  }
  
  openLogin() {
    this.showLoginDialog.set(true);
  }

  closeLogin() {
    this.showLoginDialog.set(false);
  }

  onLogoClick() {
    this.menuToggle.emit();
  }

  onCartClick() {
    this.cartToggle.emit();
  }
}
