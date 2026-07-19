import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiUrlConstants } from '../constants/apiUrl.constants';

export interface User {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private urlConstants = inject(ApiUrlConstants);

  // ✅ GET (returns Observable)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.urlConstants.USERS);
  }

  // ✅ POST (create new user)
  signUp(user: User): Observable<User> {
    return this.http.post<User>(this.urlConstants.USERS, user);
  }

  // ✅ PUT (update existing user)
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/users/${id}`, user);
  }

  // ✅ DELETE (remove user)
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${id}`);
  }
}
