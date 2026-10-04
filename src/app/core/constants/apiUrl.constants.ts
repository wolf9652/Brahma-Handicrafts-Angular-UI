import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: 'root' })
export class ApiUrlConstants {
    baseUrl: string = environment.apiUrl;
    // The API host without the trailing /api segment, e.g. https://localhost:7119 — used to resolve
    // server-relative asset paths (like image urls) that the API returns without a scheme/host.
    public origin: string = this.baseUrl.replace(/\/api\/?$/, '');
    public USERS = `${this.baseUrl}/Users/signup`;
    public LOGIN = `${this.baseUrl}/Users/login`;
    public CATEGORIES = `${this.baseUrl}/Categories`;
    public ALL_PRODUCTS = `${this.baseUrl}/Products`;
    public NEWEST_PRODUCTS = `${this.baseUrl}/Products/newest`;
    public WISHLIST_ADD = `${this.baseUrl}/Wishlist/add`;
    public CART_ADD = `${this.baseUrl}/Cart/add`;
    public CART_UPDATE = `${this.baseUrl}/Cart/update`;

    public productsByCategory(categoryId: string): string {
        return `${this.baseUrl}/Products/category/${categoryId}`;
    }

    public designDetail(productId: string, designId: string): string {
        return `${this.baseUrl}/Designs/${productId}/${designId}`;
    }

    public wishlistByUser(userId: string): string {
        return `${this.baseUrl}/Wishlist/user/${userId}`;
    }

    public wishlistDelete(wishlistItemId: string, userId: string): string {
        return `${this.baseUrl}/Wishlist/${wishlistItemId}?userId=${userId}`;
    }

    public cartByUser(userId: string): string {
        return `${this.baseUrl}/Cart/user/${userId}`;
    }

    public cartDelete(cartItemId: string, userId: string): string {
        return `${this.baseUrl}/Cart/${cartItemId}?userId=${userId}`;
    }

    public updateUser(userId: string): string {
        return `${this.baseUrl}/Users/${userId}`;
    }

    public ADDRESS_ADD = `${this.baseUrl}/Addresses/add`;
    public ADDRESS_REMOVE = `${this.baseUrl}/Addresses/remove`;
    public ADDRESS_UPDATE = `${this.baseUrl}/Addresses/update`;

    public addressesByUser(userId: string): string {
        return `${this.baseUrl}/Addresses/user/${userId}`;
    }

    public ADMIN_PRODUCTS = `${this.baseUrl}/admin/products`;

    public adminProductDetail(productId: string): string {
        return `${this.baseUrl}/admin/products/${productId}`;
    }
}