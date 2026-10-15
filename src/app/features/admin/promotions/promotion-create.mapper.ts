import { PromotionDraft } from './promotion-form.models';

// Builds the multipart/form-data body for POST /api/admin/promotions.
// Keys use ASP.NET model-binding names (PascalCase, indexed arrays), matching the Swagger field names.
export function buildCreatePromotionFormData(draft: PromotionDraft): FormData {
  const form = new FormData();
  form.append('Name', draft.name.trim());
  form.append('DiscountType', draft.discountType);
  form.append('DiscountValue', String(draft.discountValue ?? ''));
  form.append('StartDate', toIsoDateTime(draft.startDate));
  form.append('EndDate', toIsoDateTime(draft.endDate));
  // No Active/Inactive control in the form — every new promotion is created active.
  form.append('IsActive', 'true');

  draft.products.forEach((product, index) => {
    form.append(`ProductIds[${index}]`, product.productId);
  });

  if (draft.bannerImage?.file) {
    form.append('Banners[0].File', draft.bannerImage.file, draft.bannerImage.file.name);
    // No separate alt-text field in the form — the promotion name doubles as the banner's alt text.
    form.append('Banners[0].AltText', draft.name.trim());
  }

  return form;
}

// Builds the multipart/form-data body for PUT /api/admin/promotions/{promotionId}.
// isActive is passed in rather than read from the draft — the edit form has no Active/Inactive
// control (Disable is a separate action), so whatever the promotion's current value is gets resent unchanged.
export function buildUpdatePromotionFormData(draft: PromotionDraft, isActive: boolean): FormData {
  const form = new FormData();
  form.append('Name', draft.name.trim());
  form.append('DiscountType', draft.discountType);
  form.append('DiscountValue', String(draft.discountValue ?? ''));
  form.append('StartDate', toIsoDateTime(draft.startDate));
  form.append('EndDate', toIsoDateTime(draft.endDate));
  form.append('IsActive', String(isActive));

  draft.products.forEach((product, index) => {
    form.append(`ProductIds[${index}]`, product.productId);
  });

  // Only sent when a new file was picked — the existing banner is left untouched on the server
  // when the admin doesn't change it, since there's no way to "resend" it by reference.
  if (draft.bannerImage?.file) {
    form.append('Banners[0].File', draft.bannerImage.file, draft.bannerImage.file.name);
    form.append('Banners[0].AltText', draft.name.trim());
  }

  return form;
}

// The date input gives a plain yyyy-mm-dd string; the API wants a full ISO datetime.
function toIsoDateTime(dateOnly: string): string {
  return new Date(dateOnly).toISOString();
}
