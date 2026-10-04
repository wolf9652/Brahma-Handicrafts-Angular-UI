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

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  role: boolean;
  password: string;
}

export interface SignUpResponse {
  userId: string;
  emailId: string;
  role: boolean;
}

export interface LoginRequest {
  emailId: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  role: string;
}

export interface UpdateUserRequest {
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  emailId: string | null;
  gender: string | null;
}

export interface UpdateUserResponse {
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  role: string;
  gender: string;
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
  signUp(user: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(this.urlConstants.USERS, user);
  }

  // ✅ POST (login existing user)
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.urlConstants.LOGIN, credentials);
  }

  // ✅ PUT (update existing user)
  updateUser(userId: string, user: UpdateUserRequest): Observable<UpdateUserResponse> {
    return this.http.put<UpdateUserResponse>(this.urlConstants.updateUser(userId), user);
  }

  // ✅ DELETE (remove user)
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/users/${id}`);
  }
}
