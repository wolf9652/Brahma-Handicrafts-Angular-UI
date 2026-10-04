import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DesignDraft,
  ProductDraft,
  emptyDesign,
  getDesignErrors,
  getProductErrors
} from '../../shared/product-form.models';
import { DesignFormComponent } from '../../shared/design-form/design-form.component';

@Component({
  selector: 'app-add-product-form',
  standalone: true,
  imports: [FormsModule, DesignFormComponent],
  templateUrl: './add-product-form.component.html'
})
export class AddProductFormComponent {
  saved = output<ProductDraft>();
  cancelled = output<void>();
  saving = input(false);
  saveError = input<string | null>(null);

  protected readonly product = { productName: '', categoryName: '' };
  // At least one design is always present; extra designs can be added and removed.
  protected designs: DesignDraft[] = [emptyDesign()];
  protected readonly submitted = signal(false);

  // Errors only show after the first save attempt.
  protected get productErrors(): string[] {
    return this.submitted() ? getProductErrors(this.product) : [];
  }

  protected addDesign(): void {
    this.designs = [...this.designs, emptyDesign()];
  }

  protected removeDesign(index: number): void {
    this.designs = this.designs.filter((_, i) => i !== index);
  }

  protected save(): void {
    this.submitted.set(true);
    const hasDesignErrors = this.designs.some((design) => getDesignErrors(design).length > 0);
    if (getProductErrors(this.product).length > 0 || hasDesignErrors) {
      return;
    }

    this.saved.emit({
      productName: this.product.productName.trim(),
      categoryName: this.product.categoryName.trim(),
      designs: this.designs
    });
  }
}
