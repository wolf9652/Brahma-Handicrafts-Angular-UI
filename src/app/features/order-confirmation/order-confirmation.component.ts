import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent {
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  // Held in memory only (no "get order by id" endpoint yet) — reloading this page directly finds
  // nothing here and bounces home instead of showing a blank page.
  protected readonly order = this.orderService.lastOrder;

  constructor() {
    if (!this.order()) {
      this.router.navigate(['/']);
    }
  }
}
