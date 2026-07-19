import { Component } from '@angular/core';
import { orders } from '../../../core/data/admin-data';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss'
})
export class AdminPaymentsComponent {
  protected readonly payments = orders.map((order) => ({
    id: order.paymentId,
    orderNumber: order.orderNumber,
    customerName: order.customerInfo.name,
    amount: order.total,
    status: order.paymentStatus
  }));
}
