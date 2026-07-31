import { Component, computed, signal } from '@angular/core';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product, ProductService } from '../../core/services/product.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, NgClass],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  allProducts = signal<Product[]>([]);
  protected readonly filter = signal('all');
  protected readonly sortBy = signal<'featured' | 'price-low' | 'price-high' | 'name' | 'rating'>('featured');
  protected readonly viewMode = signal<'grid' | 'list'>('grid');
  protected readonly visibleCount = signal(9);

  protected readonly categories = computed(() => [
    'all',
    ...Array.from(new Set(this.allProducts().map((product) => product.category))),
  ]);

  protected readonly filteredProducts = computed(() => {
    const currentFilter = this.filter();
    const products = this.allProducts();

    return currentFilter === 'all'
      ? products
      : products.filter((product) => product.category === currentFilter);
  });

  protected readonly sortedProducts = computed(() => {
    const products = [...this.filteredProducts()];

    switch (this.sortBy()) {
      case 'price-low':
        return products.sort((a, b) => a.price - b.price);
      case 'price-high':
        return products.sort((a, b) => b.price - a.price);
      case 'name':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'rating':
        return products.sort((a, b) => b.rating - a.rating);
      default:
        return products;
    }
  });

  protected readonly visibleProducts = computed(() => this.sortedProducts().slice(0, this.visibleCount()));

  protected readonly hasMoreProducts = computed(() => this.visibleCount() < this.sortedProducts().length);

  constructor(private readonly productService: ProductService) {
    this.allProducts.set(this.productService.getProducts());
  }

  protected setFilter(category: string): void {
    this.filter.set(category);
    this.visibleCount.set(9);
  }

  protected setSortBy(value: 'featured' | 'price-low' | 'price-high' | 'name' | 'rating'): void {
    this.sortBy.set(value);
    this.visibleCount.set(9);
  }

  protected setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  protected showMoreProducts(): void {
    this.visibleCount.set(Math.min(this.visibleCount() + 9, this.sortedProducts().length));
  }
}
