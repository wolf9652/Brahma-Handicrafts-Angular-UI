import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.component').then((m) => m.ProductsComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./features/product-detail/product-detail.component').then((m) => m.ProductDetailComponent)
  },
  {
    path: 'products-by-category/:categoryId',
    loadComponent: () => import('./features/products-by-category/products-by-category.component').then((m) => m.ProductsByCategoryComponent)
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./features/wishlist/wishlist.component').then((m) => m.WishlistComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/faq/faq.component').then((m) => m.FaqComponent)
  },
  {
    path: 'shipping',
    loadComponent: () => import('./features/shipping/shipping.component').then((m) => m.ShippingComponent)
  },
  {
    path: 'about-us',
    loadComponent: () => import('./features/about-us/about-us.component').then((m) => m.AboutUsComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/admin/products/products.component').then((m) => m.AdminProductsComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/orders/orders.component').then((m) => m.AdminOrdersComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/admin/customers/customers.component').then((m) => m.AdminCustomersComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/admin/payments/payments.component').then((m) => m.AdminPaymentsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
