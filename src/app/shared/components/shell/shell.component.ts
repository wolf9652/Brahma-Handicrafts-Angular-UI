import { Component } from '@angular/core';
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
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SideCartComponent, SideMenuComponent, AuthModalComponent, UserDropdownComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {}
