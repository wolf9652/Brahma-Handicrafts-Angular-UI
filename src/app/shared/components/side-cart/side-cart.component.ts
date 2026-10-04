import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem, CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-side-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './side-cart.component.html',
  styleUrl: './side-cart.component.scss'
})
export class SideCartComponent {
  constructor(
    public cartService: CartService,
    private readonly authService: AuthService
  ) {}

  @Output() cartToggle = new EventEmitter<void>();
  onCartClick() {
    this.cartToggle.emit();
  }

  protected trackByKey(_index: number, item: CartItem): string {
    return item.key;
  }

  protected increaseQuantity(item: CartItem): void {
    this.changeQuantity(item, item.quantity + 1);
  }

  protected decreaseQuantity(item: CartItem): void {
    if (item.quantity <= 1) {
      return;
    }
    this.changeQuantity(item, item.quantity - 1);
  }

  private changeQuantity(item: CartItem, newQuantity: number): void {
    const userId = this.authService.session()?.userId;

    if (userId && item.cartItemId) {
      this.cartService.updateQuantityApi({ userId, cartItemId: item.cartItemId, quantity: newQuantity }).subscribe({
        next: (response) => {
          this.cartService.updateQuantity(item.product.id, response.quantity, item.designId, item.sizeId);
        },
        error: (err) => console.error('Error updating cart quantity:', err)
      });
      return;
    }

    // Guest, or no server-side row for this line — local only.
    this.cartService.updateQuantity(item.product.id, newQuantity, item.designId, item.sizeId);
  }

  protected removeItem(item: CartItem): void {
    const userId = this.authService.session()?.userId;

    if (userId && item.cartItemId) {
      this.cartService.deleteCartItemApi(item.cartItemId, userId).subscribe({
        next: () => this.cartService.removeFromCart(item.product.id, item.designId, item.sizeId),
        error: (err) => console.error('Error removing cart item:', err)
      });
      return;
    }

    // Guest, or no server-side row for this line — local only.
    this.cartService.removeFromCart(item.product.id, item.designId, item.sizeId);
  }
}
