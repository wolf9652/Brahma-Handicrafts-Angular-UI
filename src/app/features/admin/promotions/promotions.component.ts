import { Component, OnInit, inject, signal } from '@angular/core';
import { AdminPromotionListItem, AdminPromotionService } from '../../../core/services/admin-promotion.service';
import { PromotionFormComponent } from './promotion-form/promotion-form.component';
import { PromotionCardComponent } from './promotion-card/promotion-card.component';

@Component({
  selector: 'app-admin-promotions',
  standalone: true,
  imports: [PromotionFormComponent, PromotionCardComponent],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.scss'
})
export class AdminPromotionsComponent implements OnInit {
  private readonly adminPromotionService = inject(AdminPromotionService);

  protected readonly promotions = signal<AdminPromotionListItem[]>([]);
  protected readonly loading = signal(false);
  protected readonly addPromotionVisible = signal(false);

  ngOnInit(): void {
    this.loadPromotions();
  }

  protected loadPromotions(): void {
    this.loading.set(true);
    this.adminPromotionService.getAdminPromotions().subscribe({
      next: (page) => {
        this.promotions.set(page.items);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching promotions:', err);
        this.loading.set(false);
      }
    });
  }

  protected toggleAddPromotion(): void {
    this.addPromotionVisible.update((open) => !open);
  }

  // The create response doesn't carry status/productCount, so the list is reloaded from the
  // server afterward rather than appending the response directly.
  protected onPromotionSaved(): void {
    this.addPromotionVisible.set(false);
    this.loadPromotions();
  }
}
