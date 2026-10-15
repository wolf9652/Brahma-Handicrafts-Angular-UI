import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlConstants } from '../constants/apiUrl.constants';
import { Order, OrderStatusUpdate } from './order.service';

export interface AdminOrderListItem {
  userId: string;
  fullName: string;
  emailId: string;
  phoneNumber: string;
  order: Order;
}

export interface AdminOrdersPage {
  items: AdminOrderListItem[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetAdminOrdersOptions {
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminOrderService {
  private readonly http = inject(HttpClient);
  private readonly urlConstants = inject(ApiUrlConstants);

  // No pagination UI yet — one generous page, same pattern as admin products / the customer's My Orders.
  getAdminOrders(options: GetAdminOrdersOptions = {}): Observable<AdminOrdersPage> {
    const params = new HttpParams()
      .set('pageNumber', String(options.pageNumber ?? 1))
      .set('pageSize', String(options.pageSize ?? 50));

    return this.http.get<AdminOrdersPage>(this.urlConstants.ADMIN_ORDERS, { params });
  }

  // Authorization header is attached automatically by the interceptor (this URL isn't excluded),
  // which is what lets the backend check the caller's admin role.
  updateOrderStatus(orderId: string, status: string): Observable<OrderStatusUpdate> {
    return this.http.patch<OrderStatusUpdate>(this.urlConstants.adminOrderStatus(orderId), { status });
  }
}
