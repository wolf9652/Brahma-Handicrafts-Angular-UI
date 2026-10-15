import { Component, inject, output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AdminPromotionService, Promotion } from '../../../../core/services/admin-promotion.service';
import { PromotionDraft, emptyPromotion, getPromotionErrors } from '../promotion-form.models';
import { buildCreatePromotionFormData } from '../promotion-create.mapper';
import { PromotionFieldsFormComponent } from '../promotion-fields-form/promotion-fields-form.component';

@Component({
  selector: 'app-promotion-form',
  standalone: true,
  imports: [PromotionFieldsFormComponent],
  templateUrl: './promotion-form.component.html'
})
export class PromotionFormComponent {
  private readonly adminPromotionService = inject(AdminPromotionService);
  private readonly messageService = inject(MessageService);

  saved = output<Promotion>();
  cancelled = output<void>();

  protected readonly draft: PromotionDraft = emptyPromotion();
  protected readonly submitted = signal(false);
  protected readonly saving = signal(false);

  protected save(): void {
    this.submitted.set(true);
    if (getPromotionErrors(this.draft).length > 0 || this.saving()) {
      return;
    }

    this.saving.set(true);
    const body = buildCreatePromotionFormData(this.draft);
    this.adminPromotionService.createPromotion(body).subscribe({
      next: (promotion) => {
        this.saving.set(false);
        this.saved.emit(promotion);
      },
      error: (err) => {
        console.error('Error creating promotion:', err);
        this.saving.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Save failed',
          detail: 'We could not save this promotion. Please try again.'
        });
      }
    });
  }
}
