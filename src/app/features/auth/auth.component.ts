import { Component, signal, computed } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [TooltipModule, ButtonModule, InputTextModule, PasswordModule, FormsModule, NgClass],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  isLoginMode = signal(true);

  // Login signals
  loginEmail = signal('');
  loginPassword = signal('');

  // Signup signals
  signupName = signal('');
  signupEmail = signal('');
  signupPassword = signal('');
  signupMobile = signal('');

  // Track if user attempted submit
  submitted = signal(false);

  // Validation rules
  loginValid = computed(() =>
    this.loginEmail().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
    this.loginPassword().length >= 6
  );

  signupValid = computed(() =>
    this.signupName().trim().length > 0 &&
    this.signupEmail().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
    this.signupPassword().length >= 6
  );

  switchMode() {
    this.isLoginMode.update(v => !v);
    this.submitted.set(false); // reset validation state when switching
  }

  onLogin() {
    this.submitted.set(true);
    if (this.loginValid()) {
      console.log('Login data:', {
        email: this.loginEmail(),
        password: this.loginPassword()
      });
    }
  }

  onSignup() {
    this.submitted.set(true);
    if (this.signupValid()) {
      console.log('Signup data:', {
        name: this.signupName(),
        email: this.signupEmail(),
        password: this.signupPassword(),
        mobile: this.signupMobile()
      });
    }
  }
}
