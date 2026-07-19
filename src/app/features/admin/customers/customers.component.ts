import { Component } from '@angular/core';
import { customers } from '../../../core/data/admin-data';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class AdminCustomersComponent {
  protected readonly customerList = customers;
}
