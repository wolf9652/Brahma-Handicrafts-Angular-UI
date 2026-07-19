import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-side-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './side-cart.component.html',
  styleUrl: './side-cart.component.scss'
})
export class SideCartComponent {
  constructor(public cartService: CartService) {}
}
