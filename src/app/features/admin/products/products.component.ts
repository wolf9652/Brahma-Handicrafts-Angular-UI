import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AdminProductItem, AdminProductService } from '../../../core/services/admin-product.service';
import { AdminProductCardComponent } from '../product-card/admin-product-card.component';
import { AddProductFormComponent } from './add-product-form/add-product-form.component';
import { ProductDraft } from '../shared/product-form.models';
import { buildCreateProductFormData } from '../shared/product-update.mapper';

interface CategoryOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [AdminProductCardComponent, AddProductFormComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class AdminProductsComponent implements OnInit {
  private readonly adminProductService = inject(AdminProductService);

  protected readonly products = signal<AdminProductItem[]>([]);
  protected readonly filter = signal('all');
  protected readonly addProductVisible = signal(false);
  protected readonly addProductSaving = signal(false);
  protected readonly addProductError = signal<string | null>(null);

  protected readonly categories = computed<CategoryOption[]>(() => {
    const seen = new Map<string, string>();
    for (const product of this.products()) {
      if (!seen.has(product.categoryId)) {
        seen.set(product.categoryId, product.categoryName);
      }
    }

    return [
      { id: 'all', name: 'All Categories' },
      ...Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
    ];
  });

  protected readonly filteredProducts = computed(() => {
    const currentFilter = this.filter();
    const products = this.products();

    return currentFilter === 'all'
      ? products
      : products.filter((product) => product.categoryId === currentFilter);
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  protected loadProducts(): void {
    this.adminProductService.getAdminProducts().subscribe({
      next: (response) => this.products.set(response.items),
      error: (err) => console.error('Error fetching admin products:', err)
    });
  }

  protected setFilter(categoryId: string): void {
    this.filter.set(categoryId);
  }

  protected toggleAddProduct(): void {
    this.addProductVisible.update((open) => !open);
  }

  protected onProductSaved(product: ProductDraft): void {
    this.addProductSaving.set(true);
    this.addProductError.set(null);

    this.adminProductService.createAdminProduct(buildCreateProductFormData(product)).subscribe({
      next: () => {
        this.addProductSaving.set(false);
        this.addProductVisible.set(false);
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error creating admin product:', err);
        this.addProductSaving.set(false);
        this.addProductError.set('Could not save the product. Please try again.');
      }
    });
  }
}
