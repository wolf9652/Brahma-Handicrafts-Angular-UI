import { Component } from '@angular/core';
import { orders } from '../../../core/data/admin-data';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class AdminOrdersComponent {
  protected readonly ordersList = orders;
}
