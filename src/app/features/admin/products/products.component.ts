import { Component } from '@angular/core';
import { adminProducts } from '../../../core/data/admin-data';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class AdminProductsComponent {
  protected readonly products = adminProducts;
}
