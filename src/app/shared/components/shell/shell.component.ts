import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SideCartComponent } from '../side-cart/side-cart.component';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule, HeaderComponent, FooterComponent, SideCartComponent, AuthModalComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  sideCartVisible = false;

  toggleCart() {
    this.sideCartVisible = !this.sideCartVisible;
  }

  closeAll() {
    this.sideCartVisible = false;
  }
}
