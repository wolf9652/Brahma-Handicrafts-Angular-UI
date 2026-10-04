import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DesignDraft, emptySize, getDesignErrors } from '../product-form.models';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';
import { SizeFormComponent } from '../size-form/size-form.component';

@Component({
  selector: 'app-design-form',
  standalone: true,
  imports: [FormsModule, ImageUploaderComponent, SizeFormComponent],
  templateUrl: './design-form.component.html'
})
export class DesignFormComponent {
  design = input.required<DesignDraft>();
  // Errors only show after the parent's first save attempt.
  submitted = input(false);

  protected get errors(): string[] {
    return this.submitted() ? getDesignErrors(this.design()) : [];
  }

  protected addSize(): void {
    const design = this.design();
    design.sizes = [...design.sizes, emptySize()];
  }

  protected removeSize(index: number): void {
    const design = this.design();
    design.sizes = design.sizes.filter((_, i) => i !== index);
  }
}
