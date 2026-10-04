import { Component, OnInit, computed, inject, signal, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AuthComponent } from '../../../features/auth/auth.component';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Category, CategoryService } from '../../../core/services/category.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';

interface CategoryGroup {
  letter: string;
  items: Category[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, DialogModule, ButtonModule, AuthComponent, UserDropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private readonly router = inject(Router);

  protected readonly categories = signal<Category[]>([]);
  protected readonly isProductsMenuOpen = signal(false);
  protected readonly isAdminRoute = signal(this.router.url.startsWith('/admin'));

  protected readonly adminNavigation = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Products', path: '/admin/products' },
    { label: 'Orders', path: '/admin/orders' },
    { label: 'Customers', path: '/admin/customers' },
    { label: 'Payments', path: '/admin/payments' }
  ];

  protected readonly categoryGroups = computed<CategoryGroup[]>(() => {
    const seenNames = new Set<string>();
    const sortedCategories = [...this.categories()].sort((a, b) =>
      a.categoryName.localeCompare(b.categoryName)
    );

    const groups = new Map<string, Category[]>();
    for (const category of sortedCategories) {
      if (seenNames.has(category.categoryName)) {
        continue;
      }
      seenNames.add(category.categoryName);

      const letter = category.categoryName.charAt(0).toUpperCase();
      if (!groups.has(letter)) {
        groups.set(letter, []);
      }
      groups.get(letter)!.push(category);
    }

    return Array.from(groups.entries())
      .sort(([letterA], [letterB]) => letterA.localeCompare(letterB))
      .map(([letter, items]) => ({ letter, items }));
  });

  @Output() cartToggle = new EventEmitter<void>();

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private categoryService: CategoryService,
    protected authService: AuthService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (err) => console.error('Error fetching categories:', err)
    });

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.isAdminRoute.set(event.urlAfterRedirects.startsWith('/admin')));
  }

  openProductsMenu(): void {
    this.isProductsMenuOpen.set(true);
  }

  closeProductsMenu(): void {
    this.isProductsMenuOpen.set(false);
  }

  get cartCount() {
    return this.cartService.itemCount;
  }

  get wishlistCount() {
    return this.wishlistService.entries().length;
  }
  
  onAvatarClick() {
    if (this.authService.isLoggedIn()) {
      this.authService.closeUserDropdown();
      this.router.navigate(['/profile']);
      return;
    }

    this.authService.openLoginDialog();
  }

  onAvatarMouseEnter() {
    if (this.authService.isLoggedIn()) {
      this.authService.openUserDropdown();
    }
  }

  onAvatarMouseLeave() {
    this.authService.closeUserDropdown();
  }

  closeLogin() {
    this.authService.closeLoginDialog();
  }

  onLoginSuccess(success: boolean): void {
    if (success) {
      this.closeLogin();
    }
  }

  onCartClick() {
    this.cartToggle.emit();
  }
}
