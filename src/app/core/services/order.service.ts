import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ApiUrlConstants } from '../constants/apiUrl.constants';

export interface OrderCreateItem {
  productId: string;
  designId: string;
  sizeId: string;
  basePrice: number;
  quantity: number;
}

export interface OrderCreateRequest {
  userId: string;
  // No UI exists yet for a buyer to enter their business GSTIN, so this is always sent as ''.
  gstNumber: string;
  shippingAddressId: string;
  billingAddressId: string;
  itemsSubTotal: number;
  igst: number;
  cgst: number;
  sgst: number;
  totalTaxCharges: number;
  grandTotal: number;
  items: OrderCreateItem[];
}

export interface OrderAddress {
  customerName: string;
  customerPhoneNumber: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItemImage {
  imageId: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface OrderItem {
  orderItemId: string;
  productId: string;
  productName: string;
  designId: string;
  designName: string;
  sizeId: string;
  sizeName: string;
  basePrice: number;
  quantity: number;
  subTotal: number;
  image: OrderItemImage;
}

export interface Order {
  orderId: string;
  userId: string;
  gstNumber: string;
  orderDate: string;
  trackingNumber: string;
  orderStatus: string;
  itemsSubTotal: number;
  igst: number;
  cgst: number;
  sgst: number;
  totalTaxCharges: number;
  grandTotal: number;
  shippingAddressId: string;
  shippingAddress: OrderAddress;
  billingAddressId: string;
  billingAddress: OrderAddress;
  items: OrderItem[];
}

export interface OrdersPage {
  items: Order[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetOrdersOptions {
  pageNumber?: number;
  pageSize?: number;
}

export interface OrderStatusUpdate {
  orderId: string;
  orderStatus: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly urlConstants = inject(ApiUrlConstants);

  // The order just created, held in memory only (no "get order by id" endpoint exists yet). The
  // confirmation page reads this; reloading that page directly finds nothing and redirects away.
  readonly lastOrder = signal<Order | null>(null);

  createOrder(request: OrderCreateRequest): Observable<Order> {
    return this.http
      .post<Order>(this.urlConstants.ORDERS, request)
      .pipe(tap((order) => this.lastOrder.set(order)));
  }

  // No pagination UI yet — callers request one generous page, same pattern as admin products.
  getOrdersByUser(userId: string, options: GetOrdersOptions = {}): Observable<OrdersPage> {
    const params = new HttpParams()
      .set('pageNumber', String(options.pageNumber ?? 1))
      .set('pageSize', String(options.pageSize ?? 50));

    return this.http.get<OrdersPage>(this.urlConstants.ordersByUser(userId), { params });
  }

  updateOrderStatus(orderId: string, status: string): Observable<OrderStatusUpdate> {
    return this.http.patch<OrderStatusUpdate>(this.urlConstants.orderStatus(orderId), { status });
  }
}
