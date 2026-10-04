import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SizeDraft } from '../product-form.models';

@Component({
  selector: 'app-size-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './size-form.component.html'
})
export class SizeFormComponent {
  size = input.required<SizeDraft>();
  removable = input(true);
  removed = output<void>();
}
