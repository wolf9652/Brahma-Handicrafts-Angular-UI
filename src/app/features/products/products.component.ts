import { Component, OnInit, computed, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { CatalogProduct, Product, ProductDesign, ProductService } from '../../core/services/product.service';
import { ApiUrlConstants } from '../../core/constants/apiUrl.constants';
import { buildAssetUrl } from '../../core/utils/image-url.util';

interface ProductCardItem {
  product: Product;
  queryParams: { designId: string; category: string };
  categoryId: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, NgClass],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  protected readonly cardItems = signal<ProductCardItem[]>([]);
  protected readonly loading = signal(true);
  protected readonly filter = signal('all');
  protected readonly sortBy = signal<'featured' | 'price-low' | 'price-high' | 'name' | 'rating'>('featured');
  protected readonly viewMode = signal<'grid' | 'list'>('grid');

  protected readonly categories = computed<CategoryOption[]>(() => {
    const seen = new Map<string, string>();
    for (const item of this.cardItems()) {
      if (!seen.has(item.categoryId)) {
        seen.set(item.categoryId, item.queryParams.category);
      }
    }

    return [
      { id: 'all', name: 'All Categories' },
      ...Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
    ];
  });

  protected readonly filteredItems = computed(() => {
    const currentFilter = this.filter();
    const items = this.cardItems();

    return currentFilter === 'all'
      ? items
      : items.filter((item) => item.categoryId === currentFilter);
  });

  protected readonly sortedItems = computed(() => {
    const items = [...this.filteredItems()];

    switch (this.sortBy()) {
      case 'price-low':
        return items.sort((a, b) => a.product.price - b.product.price);
      case 'price-high':
        return items.sort((a, b) => b.product.price - a.product.price);
      case 'name':
        return items.sort((a, b) => a.product.name.localeCompare(b.product.name));
      case 'rating':
        return items.sort((a, b) => b.product.rating - a.product.rating);
      default:
        return items;
    }
  });

  constructor(
    private readonly productService: ProductService,
    private readonly urlConstants: ApiUrlConstants
  ) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.cardItems.set(this.buildCardItems(response.items));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading.set(false);
      }
    });
  }

  private buildCardItems(products: CatalogProduct[]): ProductCardItem[] {
    const items: ProductCardItem[] = [];

    for (const product of products) {
      for (const design of product.designs ?? []) {
        items.push({
          product: this.mapToProduct(product, design),
          queryParams: { designId: design.designId, category: product.category.categoryName },
          categoryId: product.category.categoryId
        });
      }
    }

    return items;
  }

  private mapToProduct(product: CatalogProduct, design: ProductDesign): Product {
    const imageUrl = buildAssetUrl(this.urlConstants.origin, design.image?.url);

    return {
      id: product.productId,
      name: `${product.name} ${design.designName}`,
      price: design.estimatedPrice,
      image: imageUrl,
      images: imageUrl ? [imageUrl] : [],
      category: product.category.categoryName,
      description: design.designDescription,
      features: [],
      inStock: design.totalQuantity > 0,
      rating: 0,
      reviews: 0,
      totalSizes: design.totalSizes
    };
  }

  protected setFilter(categoryId: string): void {
    this.filter.set(categoryId);
  }

  protected setSortBy(value: 'featured' | 'price-low' | 'price-high' | 'name' | 'rating'): void {
    this.sortBy.set(value);
  }

  protected setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }
}
