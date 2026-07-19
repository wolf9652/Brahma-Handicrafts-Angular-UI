import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiService {
  readonly isCartOpen = signal(false);
  readonly isMenuOpen = signal(false);
  readonly isAuthOpen = signal(false);
  readonly isDropdownOpen = signal(false);

  toggleCart(): void {
    this.isCartOpen.set(!this.isCartOpen());
    if (this.isCartOpen()) {
      this.isMenuOpen.set(false);
    }
  }

  closeCart(): void {
    this.isCartOpen.set(false);
  }

  toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
    if (this.isMenuOpen()) {
      this.isCartOpen.set(false);
    }
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  toggleAuth(): void {
    this.isAuthOpen.set(!this.isAuthOpen());
  }

  closeAuth(): void {
    this.isAuthOpen.set(false);
  }

  toggleDropdown(): void {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }
}
