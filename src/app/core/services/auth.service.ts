import { Injectable, signal } from '@angular/core';

export interface AppUser {
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<AppUser | null>(null);
  readonly loading = signal(false);
  readonly isAuthModalOpen = signal(false);
  readonly isUserDropdownOpen = signal(false);

  async signIn(email: string,): Promise<void> {
    this.loading.set(true);
    await Promise.resolve();
    this.user.set({ name: 'Guest User', email });
    this.loading.set(false);
  }

  async signUp(email: string, name: string): Promise<void> {
    this.loading.set(true);
    await Promise.resolve();
    this.user.set({ name, email });
    this.loading.set(false);
  }

  async signOut(): Promise<void> {
    this.loading.set(true);
    await Promise.resolve();
    this.user.set(null);
    this.loading.set(false);
  }

  login(): void {
    this.user.set({ name: 'Admin User', email: 'admin@brahma.com', password: 'admin', phoneNumber: '884653649' });
    this.closeAuthModal();
    this.closeUserDropdown();
  }

  logout(): void {
    this.user.set(null);
    this.closeUserDropdown();
  }

  toggleAuthModal(): void {
    this.isAuthModalOpen.set(!this.isAuthModalOpen());
  }

  closeAuthModal(): void {
    this.isAuthModalOpen.set(false);
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen.set(!this.isUserDropdownOpen());
  }

  closeUserDropdown(): void {
    this.isUserDropdownOpen.set(false);
  }

  userName(): string {
    return this.user()?.name ?? 'Guest';
  }

  userEmail(): string {
    return this.user()?.email ?? 'No account';
  }
}
