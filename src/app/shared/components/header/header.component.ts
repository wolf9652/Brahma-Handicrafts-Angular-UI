import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AuthComponent } from '../../../features/auth/auth.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, DialogModule, ButtonModule, AuthComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  showLoginDialog = signal(false);
 openLogin() {
    this.showLoginDialog.set(true);
  }

  closeLogin() {
    this.showLoginDialog.set(false);
  }
}
