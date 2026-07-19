import { Component } from '@angular/core';
import { adminStats } from '../../../core/data/admin-data';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  protected readonly stats = [
    { title: 'Total Revenue', value: `₹${adminStats.totalRevenue.toFixed(2)}`, icon: '₹' },
    { title: 'Total Orders', value: adminStats.totalOrders.toString(), icon: '🛒' },
    { title: 'Total Customers', value: adminStats.totalCustomers.toString(), icon: '👤' },
    { title: 'Total Products', value: adminStats.totalProducts.toString(), icon: '📦' }
  ];
}
