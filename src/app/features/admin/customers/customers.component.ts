import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminUserListItem, AdminUserService } from '../../../core/services/admin-user.service';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class AdminCustomersComponent implements OnInit {
  private readonly adminUserService = inject(AdminUserService);

  protected readonly customers = signal<AdminUserListItem[]>([]);
  protected readonly loading = signal(false);

  ngOnInit(): void {
    this.loadCustomers();
  }

  protected loadCustomers(): void {
    this.loading.set(true);
    this.adminUserService.getAdminUsers().subscribe({
      next: (page) => {
        this.customers.set(page.items);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        this.loading.set(false);
      }
    });
  }
}
