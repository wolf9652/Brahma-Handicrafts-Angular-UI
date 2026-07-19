import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  protected readonly billingOption = signal<'same' | 'different'>('same');
  protected readonly formData = signal({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  constructor(protected readonly cartService: CartService) {}

  protected get total(): number {
    return this.cartService.totalPrice;
  }

  protected placeOrder(): void {
    window.alert('Order placed successfully! Thank you for your purchase.');
    this.cartService.clearCart();
  }
}
