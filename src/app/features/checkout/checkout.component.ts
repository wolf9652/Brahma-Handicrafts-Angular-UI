import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CartService } from '../../core/services/cart.service';
import { AddressService } from '../../core/services/address.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderCreateItem, OrderCreateRequest, OrderService } from '../../core/services/order.service';
import { AddressPickerComponent } from '../../shared/components/address-picker/address-picker.component';
import { calculateGst } from '../../core/utils/gst.util';
import { stateCodeByName } from '../../core/data/indian-states';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, FormsModule, AddressPickerComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  private readonly messageService = inject(MessageService);
  private readonly addressService = inject(AddressService);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  protected readonly billingOption = signal<'same' | 'different'>('same');
  protected readonly shippingAddressId = signal<string | null>(null);
  protected readonly billingAddressId = signal<string | null>(null);
  protected readonly placingOrder = signal(false);

  constructor(protected readonly cartService: CartService) {}

  protected get total(): number {
    return this.cartService.totalPrice;
  }

  // GST's place-of-supply for goods is the delivery address, so tax type (intra vs inter-state)
  // always follows the shipping address, even when billing uses a different one.
  private readonly deliveryStateCode = computed(() => {
    const addressId = this.shippingAddressId();
    if (!addressId) {
      return null;
    }

    const address = this.addressService.addresses().find((item) => item.id === addressId);
    return address ? stateCodeByName(address.state) : null;
  });

  protected readonly gst = computed(() => calculateGst(this.cartService.totalPrice, this.deliveryStateCode()));

  protected placeOrder(): void {
    if (this.placingOrder()) {
      return;
    }

    const userId = this.authService.session()?.userId;
    if (!userId) {
      return;
    }

    const shippingAddressId = this.shippingAddressId();
    if (!shippingAddressId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Shipping address required',
        detail: 'Please select or add a shipping address.'
      });
      return;
    }

    const billingAddressId = this.billingOption() === 'same' ? shippingAddressId : this.billingAddressId();
    if (!billingAddressId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Billing address required',
        detail: 'Please select or add a billing address.'
      });
      return;
    }

    // Every product/product-detail page is API-driven now, so a cart line should always carry real
    // backend ids — this catches the one case that shouldn't happen (e.g. a leftover legacy item)
    // instead of sending a request the backend can't use.
    const items: OrderCreateItem[] = [];
    for (const item of this.cartService.items()) {
      if (!item.product.id || !item.designId || !item.sizeId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Cannot place order',
          detail: 'Some items in your cart can\'t be ordered online yet. Please remove them from your cart and try again.'
        });
        return;
      }

      items.push({
        productId: item.product.id,
        designId: item.designId,
        sizeId: item.sizeId,
        basePrice: this.cartService.effectivePrice(item),
        quantity: item.quantity
      });
    }

    const gst = this.gst();
    const request: OrderCreateRequest = {
      userId,
      gstNumber: '',
      shippingAddressId,
      billingAddressId,
      itemsSubTotal: gst.taxableAmount,
      igst: gst.igstAmount,
      cgst: gst.cgstAmount,
      sgst: gst.sgstAmount,
      totalTaxCharges: gst.totalTax,
      grandTotal: gst.grandTotal,
      items
    };

    this.placingOrder.set(true);
    this.orderService.createOrder(request).subscribe({
      next: () => {
        this.placingOrder.set(false);
        this.router.navigate(['/order-confirmation']);

        // The order is already placed at this point — a failure here just means the server-side
        // cart wasn't cleared, so it's logged rather than shown to the user or allowed to block navigation.
        this.cartService.clearCartApi(userId).subscribe({
          next: () => this.cartService.clearCart(),
          error: (err) => {
            console.error('Error clearing cart after order placement:', err);
            this.cartService.clearCart();
          }
        });
      },
      error: (err) => {
        console.error('Error placing order:', err);
        this.placingOrder.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Order failed',
          detail: 'We could not place your order. Please try again.'
        });
      }
    });
  }
}
