import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AdminOrderListItem, AdminOrderService } from '../../../core/services/admin-order.service';
import { Order } from '../../../core/services/order.service';
import { ApiUrlConstants } from '../../../core/constants/apiUrl.constants';
import { buildAssetUrl } from '../../../core/utils/image-url.util';

// What the primary status button moves an order to next, keyed by its current status (lowercased).
// No entry (e.g. 'delivered', 'cancelled') means no button is shown.
const NEXT_STATUS: Record<string, string> = {
  pending: 'Confirmed',
  confirmed: 'Processing',
  processing: 'Shipped',
  shipped: 'Delivered'
};

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
  private readonly adminOrderService = inject(AdminOrderService);
  private readonly urlConstants = inject(ApiUrlConstants);
  private readonly messageService = inject(MessageService);

  protected readonly orders = signal<AdminOrderListItem[]>([]);
  protected readonly loading = signal(false);
  protected readonly expandedOrderId = signal<string | null>(null);
  protected readonly updatingOrderId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  protected loadOrders(): void {
    this.loading.set(true);
    this.adminOrderService.getAdminOrders().subscribe({
      next: (page) => {
        this.orders.set(page.items);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching admin orders:', err);
        this.loading.set(false);
      }
    });
  }

  protected toggleOrder(orderId: string): void {
    this.expandedOrderId.set(this.expandedOrderId() === orderId ? null : orderId);
  }

  protected isBillingSameAsShipping(order: Order): boolean {
    return order.billingAddressId === order.shippingAddressId;
  }

  protected orderItemImageUrl(item: Order['items'][number]): string {
    return buildAssetUrl(this.urlConstants.origin, item.image?.url);
  }

  protected nextStatus(order: Order): string | null {
    return NEXT_STATUS[order.orderStatus.toLowerCase()] ?? null;
  }

  protected canCancel(order: Order): boolean {
    return order.orderStatus.toLowerCase() === 'confirmed';
  }

  protected updateStatus(orderId: string, status: string): void {
    if (this.updatingOrderId()) {
      return;
    }

    this.updatingOrderId.set(orderId);
    this.adminOrderService.updateOrderStatus(orderId, status).subscribe({
      next: (response) => {
        this.orders.update((list) =>
          list.map((entry) =>
            entry.order.orderId === response.orderId
              ? { ...entry, order: { ...entry.order, orderStatus: response.orderStatus } }
              : entry
          )
        );
        this.updatingOrderId.set(null);
      },
      error: (err) => {
        console.error('Error updating order status:', err);
        this.updatingOrderId.set(null);
        this.messageService.add({
          severity: 'error',
          summary: 'Update failed',
          detail: 'We could not update this order\'s status. Please try again.'
        });
      }
    });
  }
}
