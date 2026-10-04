import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlConstants } from '../constants/apiUrl.constants';

export interface Category {
  categoryId: string;
  categoryName: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private urlConstants = inject(ApiUrlConstants);

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.urlConstants.CATEGORIES);
  }
}
