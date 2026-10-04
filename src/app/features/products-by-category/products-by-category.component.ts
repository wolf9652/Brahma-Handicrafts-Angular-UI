import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { CategoryProduct, Product, ProductDesign, ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { ApiUrlConstants } from '../../core/constants/apiUrl.constants';
import { buildAssetUrl } from '../../core/utils/image-url.util';

interface ProductCardItem {
  product: Product;
  queryParams: { designId: string; category: string };
}

@Component({
  selector: 'app-products-by-category',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products-by-category.component.html',
  styleUrl: './products-by-category.component.scss'
})
export class ProductsByCategoryComponent implements OnInit {
  protected readonly categoryName = signal<string>('');
  protected readonly cardItems = signal<ProductCardItem[]>([]);
  protected readonly loading = signal(true);

  private categoryId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly urlConstants: ApiUrlConstants
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => this.loadForCategory(params.get('categoryId')));
  }

  private loadForCategory(categoryId: string | null): void {
    this.categoryId = categoryId ?? '';
    this.categoryName.set('');
    this.cardItems.set([]);

    if (!this.categoryId) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);

    combineLatest([
      this.categoryService.getCategories(),
      this.productService.getProductsByCategory(this.categoryId)
    ]).subscribe({
      next: ([categories, products]) => {
        const match = categories.find((category) => category.categoryId === this.categoryId);
        const categoryName = match?.categoryName ?? '';
        this.categoryName.set(categoryName);
        this.cardItems.set(this.buildCardItems(products, categoryName));
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products for category:', err);
        this.loading.set(false);
      }
    });
  }

  private buildCardItems(products: CategoryProduct[], categoryName: string): ProductCardItem[] {
    const items: ProductCardItem[] = [];

    for (const product of products) {
      for (const design of product.designs ?? []) {
        items.push({
          product: this.mapToProduct(product, design, categoryName),
          queryParams: { designId: design.designId, category: categoryName }
        });
      }
    }

    return items;
  }

  private mapToProduct(product: CategoryProduct, design: ProductDesign, categoryName: string): Product {
    const imageUrl = buildAssetUrl(this.urlConstants.origin, design.image?.url);

    return {
      id: product.productId,
      name: `${product.name} ${design.designName}`,
      price: design.estimatedPrice,
      image: imageUrl,
      images: imageUrl ? [imageUrl] : [],
      category: categoryName,
      description: design.designDescription,
      features: [],
      inStock: design.totalQuantity > 0,
      rating: 0,
      reviews: 0,
      totalSizes: design.totalSizes
    };
  }
}
