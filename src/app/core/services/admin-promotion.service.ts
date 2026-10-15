import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlConstants } from '../constants/apiUrl.constants';

export interface PromotionBanner {
  bannerId: string;
  url: string;
  altText: string;
}

export interface Promotion {
  promotionId: string;
  name: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  productIds: string[];
  banners: PromotionBanner[];
}

// What the list endpoint returns per promotion — same core fields as the create response, plus the
// backend-computed `status` and `productCount` that the create response doesn't include.
export interface AdminPromotionListItem {
  promotionId: string;
  name: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: string;
  productCount: number;
  productIds: string[];
  banners: PromotionBanner[];
}

export interface AdminPromotionsPage {
  items: AdminPromotionListItem[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetAdminPromotionsOptions {
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminPromotionService {
  private readonly http = inject(HttpClient);
  private readonly urlConstants = inject(ApiUrlConstants);

  // Body must be multipart/form-data; built by buildCreatePromotionFormData.
  // Authorization header is attached automatically by the interceptor (this URL isn't excluded),
  // which is what lets the backend check the caller's admin role.
  createPromotion(body: FormData): Observable<Promotion> {
    return this.http.post<Promotion>(this.urlConstants.ADMIN_PROMOTIONS, body);
  }

  // No pagination UI yet — one generous page, same pattern as the other admin list endpoints.
  getAdminPromotions(options: GetAdminPromotionsOptions = {}): Observable<AdminPromotionsPage> {
    const params = new HttpParams()
      .set('pageNumber', String(options.pageNumber ?? 1))
      .set('pageSize', String(options.pageSize ?? 50));

    return this.http.get<AdminPromotionsPage>(this.urlConstants.ADMIN_PROMOTIONS, { params });
  }

  // 200 on success, 404 if the promotion doesn't exist.
  deletePromotion(promotionId: string): Observable<void> {
    return this.http.delete<void>(this.urlConstants.adminPromotionDetail(promotionId));
  }

  // No request body — flips the promotion's isActive to whichever is opposite of its current value.
  togglePromotionStatus(promotionId: string): Observable<void> {
    return this.http.patch<void>(this.urlConstants.adminPromotionStatus(promotionId), null);
  }

  // Body must be multipart/form-data; built by buildUpdatePromotionFormData.
  updatePromotion(promotionId: string, body: FormData): Observable<Promotion> {
    return this.http.put<Promotion>(this.urlConstants.adminPromotionDetail(promotionId), body);
  }
}
