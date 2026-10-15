import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SideCartComponent } from '../side-cart/side-cart.component';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { PromotionPricingService } from '../../../core/services/promotion-pricing.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, HeaderComponent, FooterComponent, SideCartComponent, AuthModalComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  sideCartVisible = false;

  constructor() {
    // Shell wraps every route, so injecting here (rather than a specific page) starts the fetch
    // the moment the site is visited, regardless of which page is landed on first. The service
    // loads itself in its own constructor — nothing further is needed from this reference.
    inject(PromotionPricingService);
  }

  toggleCart() {
    this.sideCartVisible = !this.sideCartVisible;
  }

  closeAll() {
    this.sideCartVisible = false;
  }
}
