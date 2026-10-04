import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dropdown.component.html',
  styleUrl: './user-dropdown.component.scss'
})
export class UserDropdownComponent {
  private readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);

  constructor(public authService: AuthService) {}

  protected signOut(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.authService.isUserDropdownOpen()) {
      return;
    }

    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.authService.closeUserDropdown();
    }
  }
}
