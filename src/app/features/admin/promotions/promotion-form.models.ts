// No promotions API exists yet — these are purely local, client-side types until one is wired up.

export interface PromotionProductRef {
  productId: string;
  productName: string;
  image: string;
}

export interface PromotionBannerImage {
  src: string;
  file: File | null;
}

export interface PromotionDraft {
  id: string;
  name: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number | null;
  startDate: string;
  endDate: string;
  bannerImage: PromotionBannerImage | null;
  products: PromotionProductRef[];
}

export function emptyPromotion(): PromotionDraft {
  return {
    id: `local-${Date.now()}`,
    name: '',
    discountType: 'Percentage',
    discountValue: null,
    startDate: '',
    endDate: '',
    bannerImage: null,
    products: []
  };
}

export function getPromotionErrors(draft: PromotionDraft): string[] {
  const errors: string[] = [];

  if (draft.name.trim() === '') {
    errors.push('Name is required.');
  }
  if (draft.discountValue === null || draft.discountValue <= 0) {
    errors.push('Discount value is required.');
  }
  if (!draft.startDate) {
    errors.push('Start date is required.');
  }
  if (!draft.endDate) {
    errors.push('End date is required.');
  }
  if (draft.startDate && draft.endDate && draft.endDate < draft.startDate) {
    errors.push('End date must be on or after the start date.');
  }
  if (!draft.bannerImage) {
    errors.push('Banner image is required.');
  }
  if (draft.products.length === 0) {
    errors.push('At least one product must be selected.');
  }

  return errors;
}
