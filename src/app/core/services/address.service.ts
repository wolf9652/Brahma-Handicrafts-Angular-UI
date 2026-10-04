import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlConstants } from '../constants/apiUrl.constants';

export interface AddressCreateRequest {
  userId: string;
  customerName: string;
  customerPhoneNumber: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface AddressCreateResponse {
  addressId: string;
  userId: string;
  customerName: string;
  customerPhoneNumber: string;
}

export interface AddressRemoveRequest {
  userId: string;
  addressId: string;
}

export interface AddressUpdateRequest {
  userId: string;
  addressId: string;
  customerName: string;
  customerPhoneNumber: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface AddressUpdateResponse {
  addressId: string;
  userId: string;
  customerName: string;
  customerPhoneNumber: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface AddressUserItem {
  addressId: string;
  userId: string;
  customerName: string;
  customerPhoneNumber: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface Address {
  id: string;
  customerName: string;
  customerPhoneNumber: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

@Injectable({ providedIn: 'root' })
export class AddressService {
  private readonly http = inject(HttpClient);
  private readonly urlConstants = inject(ApiUrlConstants);

  readonly addresses = signal<Address[]>([]);

  createAddress(request: AddressCreateRequest): Observable<AddressCreateResponse> {
    return this.http.post<AddressCreateResponse>(this.urlConstants.ADDRESS_ADD, request);
  }

  removeAddress(request: AddressRemoveRequest): Observable<void> {
    return this.http.post<void>(this.urlConstants.ADDRESS_REMOVE, request);
  }

  updateAddress(request: AddressUpdateRequest): Observable<AddressUpdateResponse> {
    return this.http.put<AddressUpdateResponse>(this.urlConstants.ADDRESS_UPDATE, request);
  }

  getAddressesByUser(userId: string): Observable<AddressUserItem[]> {
    return this.http.get<AddressUserItem[]>(this.urlConstants.addressesByUser(userId));
  }

  /** Fetches the user's saved addresses from the server and replaces local state with it. */
  loadAddressesForUser(userId: string): void {
    this.getAddressesByUser(userId).subscribe({
      next: (items) => this.addresses.set(items.map((item) => this.mapToAddress(item))),
      error: (err) => console.error('Error fetching addresses:', err)
    });
  }

  clearAddresses(): void {
    this.addresses.set([]);
  }

  private mapToAddress(item: AddressUserItem): Address {
    return {
      id: item.addressId,
      customerName: item.customerName,
      customerPhoneNumber: item.customerPhoneNumber,
      addressLine1: item.addressLine1,
      city: item.city,
      state: item.state,
      postalCode: item.postalCode,
      country: item.country,
      isDefault: item.isDefault
    };
  }
}
