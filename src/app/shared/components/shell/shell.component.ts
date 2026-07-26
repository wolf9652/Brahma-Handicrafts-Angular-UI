import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SideCartComponent } from '../side-cart/side-cart.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, SideCartComponent, SideMenuComponent, AuthModalComponent, UserDropdownComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  sideMenuVisible = false;
  sideCartVisible = false;

  toggleMenu() {
    this.sideMenuVisible = !this.sideMenuVisible;
  }

  toggleCart() {
    this.sideCartVisible = !this.sideCartVisible;
  }

  closeAll() {
    this.sideMenuVisible = false;
    this.sideCartVisible = false;
  }
}
