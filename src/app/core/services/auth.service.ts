import { Injectable, inject, signal, computed } from '@angular/core';
import { WishlistService } from './wishlist.service';
import { CartService } from './cart.service';
import { AddressService } from './address.service';

export interface AppUser {
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
}

export interface AuthSession {
  token: string;
  userId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  role: string;
  gender?: string;
}

const TOKEN_STORAGE_KEY = 'auth_token';
const SESSION_STORAGE_KEY = 'auth_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);
  private readonly addressService = inject(AddressService);

  readonly user = signal<AppUser | null>(null);
  readonly loading = signal(false);
  readonly isAuthModalOpen = signal(false);
  readonly isUserDropdownOpen = signal(false);
  readonly isLoginDialogOpen = signal(false);

  readonly token = signal<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY));
  readonly session = signal<AuthSession | null>(this.readStoredSession());
  readonly isLoggedIn = computed(() => !!this.token());
  readonly isAdmin = computed(() => this.session()?.role === 'Admin');
  readonly initials = computed(() => {
    const session = this.session();
    if (!session) {
      return '';
    }

    return `${session.firstName?.[0] ?? ''}${session.lastName?.[0] ?? ''}`.toUpperCase();
  });

  constructor() {
    // A returning visit with a session already restored from localStorage (not a fresh login this
    // session) still needs the server-backed data loaded — otherwise wishlist/cart/addresses stay
    // empty until the next explicit login/signup.
    //
    // This is deferred with queueMicrotask rather than called directly: the wishlist/cart/address
    // services fire HttpClient calls, which run through authInterceptor, which injects AuthService
    // to read the token. Calling them synchronously here — while AuthService itself is still being
    // constructed — makes Angular's injector see that as AuthService depending on itself (NG0200:
    // circular dependency), even though there's no real cycle once construction has finished.
    const existingSession = this.session();
    if (existingSession) {
      queueMicrotask(() => {
        this.wishlistService.loadWishlistForUser(existingSession.userId);
        this.cartService.loadCartForUser(existingSession.userId);
        this.addressService.loadAddressesForUser(existingSession.userId);
      });
    }
  }

  /** Persists the API login response and marks the user as authenticated. */
  setSession(session: AuthSession): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, session.token);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    this.token.set(session.token);
    this.session.set(session);
    this.closeAuthModal();
  }

  /** Merges updated fields (e.g. from a profile update response) into the current session, keeping the token. */
  updateSession(patch: Partial<AuthSession>): void {
    const current = this.session();
    if (!current) {
      return;
    }

    const updated: AuthSession = { ...current, ...patch };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    this.session.set(updated);
  }

  /** Clears the persisted session, e.g. on logout or a 401 response. */
  clearSession(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.token.set(null);
    this.session.set(null);
  }

  private readStoredSession(): AuthSession | null {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  }

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
    this.clearSession();
    this.wishlistService.clearWishlist();
    this.cartService.clearCart();
    this.addressService.clearAddresses();
    this.closeUserDropdown();
  }

  openLoginDialog(): void {
    this.isLoginDialogOpen.set(true);
  }

  closeLoginDialog(): void {
    this.isLoginDialogOpen.set(false);
  }

  toggleAuthModal(): void {
    this.isAuthModalOpen.set(!this.isAuthModalOpen());
  }

  closeAuthModal(): void {
    this.isAuthModalOpen.set(false);
  }

  openUserDropdown(): void {
    this.isUserDropdownOpen.set(true);
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
