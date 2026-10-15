import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlConstants } from '../constants/apiUrl.constants';

export interface AdminUserListItem {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  gender: string;
  ordersCount: number;
}

export interface AdminUsersPage {
  items: AdminUserListItem[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetAdminUsersOptions {
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly http = inject(HttpClient);
  private readonly urlConstants = inject(ApiUrlConstants);

  // No pagination UI yet — one generous page, same pattern as the other admin list endpoints.
  // Authorization header is attached automatically by the interceptor (this URL isn't excluded),
  // which is what lets the backend check the caller's admin role.
  getAdminUsers(options: GetAdminUsersOptions = {}): Observable<AdminUsersPage> {
    const params = new HttpParams()
      .set('pageNumber', String(options.pageNumber ?? 1))
      .set('pageSize', String(options.pageSize ?? 50));

    return this.http.get<AdminUsersPage>(this.urlConstants.ADMIN_USERS, { params });
  }
}
