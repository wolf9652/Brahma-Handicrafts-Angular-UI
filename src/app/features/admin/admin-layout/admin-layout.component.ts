import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  protected readonly sidebarOpen = signal(false);

  protected readonly navigation = [
    { label: 'Dashboard', path: '/admin', icon: '▣' },
    { label: 'Products', path: '/admin/products', icon: '📦' },
    { label: 'Orders', path: '/admin/orders', icon: '🛒' },
    { label: 'Customers', path: '/admin/customers', icon: '👤' },
    { label: 'Payments', path: '/admin/payments', icon: '💳' }
  ];

  constructor(private readonly authService: AuthService) {}

  protected toggleSidebar(): void {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  protected logout(): void {
    this.authService.signOut();
  }
}
