import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlConstants } from '../constants/apiUrl.constants';

export interface AdminProductImage {
  imageId: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface AdminProductItem {
  productId: string;
  productName: string;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  image: AdminProductImage;
  totalQuantity: number;
  designCount: number;
}

export interface AdminProductsResponse {
  items: AdminProductItem[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetAdminProductsOptions {
  includeInactive?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

export interface AdminDesignSize {
  sizeId: string;
  sizeName: string;
  length: number;
  breadth: number;
  height: number;
  weight: number;
  basePrice: number;
  mrp: number;
  inventoryStockId: string;
  quantity: number;
}

export interface AdminDesignDetail {
  designId: string;
  designName: string;
  designDescription: string;
  estimatedPrice: number;
  images: AdminProductImage[];
  sizes: AdminDesignSize[];
}

export interface AdminProductDetail {
  productId: string;
  productName: string;
  isActive: boolean;
  category: { categoryId: string; categoryName: string };
  designs: AdminDesignDetail[];
}

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private readonly http = inject(HttpClient);
  private readonly urlConstants = inject(ApiUrlConstants);

  getAdminProducts(options: GetAdminProductsOptions = {}): Observable<AdminProductsResponse> {
    const params = new HttpParams()
      .set('includeInactive', String(options.includeInactive ?? true))
      .set('pageNumber', String(options.pageNumber ?? 1))
      .set('pageSize', String(options.pageSize ?? 50));

    return this.http.get<AdminProductsResponse>(this.urlConstants.ADMIN_PRODUCTS, { params });
  }

  getAdminProductDetail(productId: string): Observable<AdminProductDetail> {
    return this.http.get<AdminProductDetail>(this.urlConstants.adminProductDetail(productId));
  }

  // Body must be multipart/form-data; built by buildCreateProductFormData.
  createAdminProduct(body: FormData): Observable<AdminProductDetail> {
    return this.http.post<AdminProductDetail>(this.urlConstants.ADMIN_PRODUCTS, body);
  }

  // Body must be multipart/form-data; built by buildProductUpdateFormData.
  updateAdminProduct(productId: string, body: FormData): Observable<AdminProductDetail> {
    return this.http.put<AdminProductDetail>(this.urlConstants.adminProductDetail(productId), body);
  }
}
