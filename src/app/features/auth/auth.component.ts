import { Component, signal, computed, inject, output, OutputEmitterRef } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { ApiUrlConstants } from '../../core/constants/apiUrl.constants';
import { AuthService } from '../../core/services/auth.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { AddressService } from '../../core/services/address.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [TooltipModule, ButtonModule, InputTextModule, PasswordModule, FormsModule, NgClass],
  providers: [UserService, ApiUrlConstants],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private addressService = inject(AddressService);
  isLoginMode = signal(true);

  // Login signals
  loginEmail = signal('');
  loginPassword = signal('');

  // Signup signals
  signupFirstName = signal('');
  signupLastName = signal('');
  signupEmail = signal('');
  signupPassword = signal('');
  signupRePassword = signal('');
  signupMobile = signal('');
  signUpEvent: OutputEmitterRef<boolean>= output<boolean>();
  loginEvent: OutputEmitterRef<boolean> = output<boolean>();

  // Track if user attempted submit
  submitted = signal(false);

  // Validation rules
  loginValid = computed(() =>
    this.loginEmail().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
    this.loginPassword().length >= 6
  );

  signupValid = computed(() =>
    this.signupFirstName().trim().length > 0 &&
    this.signupLastName().trim().length > 0 &&
    this.signupEmail().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
    this.signupPassword().length >= 6 &&
    this.signupPassword() === this.signupRePassword()
  );

  switchMode() {
    this.isLoginMode.update(v => !v);
    this.submitted.set(false); // reset validation state when switching
  }

  onLogin() {
    this.submitted.set(true);
    // if (this.loginValid()) {
      this.userService.login({ emailId: this.loginEmail(), password: this.loginPassword() }).subscribe({
        next: (response) => {
          this.authService.setSession(response);
          this.wishlistService.loadWishlistForUser(response.userId);
          this.cartService.migrateGuestCartToUser(response.userId);
          this.addressService.loadAddressesForUser(response.userId);
          this.messageService.add({
            severity: 'success',
            summary: 'Login successful',
            detail: `Welcome back, ${response.firstName}!`
          });
          this.loginEvent.emit(true);
        },
        error: (err) => {
          console.error('Error logging in user:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Login failed',
            detail: 'Your email or password is incorrect. Please try again.'
          });
          this.loginEvent.emit(false);
        }
      });
    // }
  }

  onSignup() {
    this.submitted.set(true);
    if (!this.signupValid()) {
      return;
    }

    // Copy of the password once we've confirmed it matches the re-typed one, for the auto-login below.
    const confirmedPassword = this.signupPassword();
    const email = this.signupEmail();

    this.userService.signUp({
      firstName: this.signupFirstName(),
      lastName: this.signupLastName(),
      emailId: email,
      phoneNumber: this.signupMobile(),
      role: true,
      password: confirmedPassword
    }).subscribe({
      next: (response) => {
        console.log('Signup response:', response);
        this.signUpEvent.emit(true);
        this.loginAfterSignup(email, confirmedPassword);
      },
      error: (err) => {
        console.error('Error signing up user:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Signup failed',
          detail: 'We could not create your account. Please check your details and try again.'
        });
        this.signUpEvent.emit(false);
      }
    });
  }

  private loginAfterSignup(emailId: string, password: string): void {
    this.userService.login({ emailId, password }).subscribe({
      next: (response) => {
        this.authService.setSession(response);
        this.wishlistService.loadWishlistForUser(response.userId);
        this.cartService.migrateGuestCartToUser(response.userId);
        this.addressService.loadAddressesForUser(response.userId);
        this.messageService.add({
          severity: 'success',
          summary: 'Signup successful',
          detail: `Welcome, ${response.firstName}!`
        });
        this.loginEvent.emit(true);
      },
      error: (err) => {
        console.error('Error logging in after signup:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Signup succeeded',
          detail: 'Your account was created, but automatic login failed. Please log in manually.'
        });
      }
    });
  }
}
