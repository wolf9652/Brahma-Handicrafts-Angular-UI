import { DesignDraft, ImageDraft, ProductDraft, SizeDraft } from './product-form.models';

// Builds the multipart/form-data body for PUT /api/admin/products/{productId}.
// Only what changed against the saved product is sent; removed design/size/image ids go in the Remove* lists.
// Keys use ASP.NET model-binding names (PascalCase, indexed arrays), matching the Swagger field names.
export function buildProductUpdateFormData(original: ProductDraft, draft: ProductDraft, isActive: boolean): FormData {
  const form = new FormData();
  form.append('ProductName', draft.productName.trim());
  form.append('CategoryName', draft.categoryName.trim());
  form.append('IsActive', String(isActive));

  const originalDesigns = new Map(original.designs.map((design) => [design.designId, design]));
  const draftDesignIds = new Set(draft.designs.map((design) => design.designId));

  const removedDesignIds = original.designs
    .map((design) => design.designId)
    .filter((designId) => !draftDesignIds.has(designId));

  const newDesigns: DesignDraft[] = [];
  const updatedDesigns: DesignDraft[] = [];
  const newImages: { designId: string; image: ImageDraft }[] = [];
  const updatedImages: ImageDraft[] = [];
  const removedImageIds: string[] = [];
  const newSizes: { designId: string; size: SizeDraft }[] = [];
  const updatedSizes: SizeDraft[] = [];
  const removedSizeIds: string[] = [];

  for (const design of draft.designs) {
    // Sizes from the add-size forms count as sizes of their design once saved.
    const sizes = [...design.sizes, ...design.newSizes];
    const originalDesign = originalDesigns.get(design.designId);

    // A design that was not in the saved product goes in as a whole, with its own images and sizes nested.
    if (!originalDesign) {
      newDesigns.push({ ...design, sizes });
      continue;
    }

    if (isDesignChanged(originalDesign, design)) {
      updatedDesigns.push(design);
    }

    // Images: existing ones have no file; a file means the image is new.
    const keptImageIds = new Set(design.images.filter((image) => image.file === null).map((image) => image.key));
    for (const image of originalDesign.images) {
      if (!keptImageIds.has(image.key)) {
        removedImageIds.push(image.key);
      }
    }

    const originalImages = new Map(originalDesign.images.map((image) => [image.key, image]));
    for (const image of design.images) {
      if (image.file) {
        newImages.push({ designId: design.designId, image });
        continue;
      }

      const originalImage = originalImages.get(image.key);
      if (originalImage && originalImage.isPrimary !== image.isPrimary) {
        updatedImages.push(image);
      }
    }

    // Sizes: a size without a sizeId is new; existing ones are sent only when a value changed.
    const keptSizeIds = new Set(sizes.map((size) => size.sizeId));
    for (const size of originalDesign.sizes) {
      if (size.sizeId && !keptSizeIds.has(size.sizeId)) {
        removedSizeIds.push(size.sizeId);
      }
    }

    const originalSizes = new Map(originalDesign.sizes.map((size) => [size.sizeId, size]));
    for (const size of sizes) {
      if (!size.sizeId) {
        newSizes.push({ designId: design.designId, size });
        continue;
      }

      const originalSize = originalSizes.get(size.sizeId);
      if (originalSize && isSizeChanged(originalSize, size)) {
        updatedSizes.push(size);
      }
    }
  }

  appendItems('NewDesigns', newDesigns, (prefix, design) => {
    form.append(`${prefix}.DesignName`, design.designName.trim());
    form.append(`${prefix}.DesignDescription`, design.designDescription.trim());
    appendNumber(form, `${prefix}.EstimatedPrice`, design.estimatedPrice);
    appendItems(`${prefix}.Images`, design.images, (imagePrefix, image) => appendImage(form, imagePrefix, image));
    appendItems(`${prefix}.Sizes`, design.sizes, (sizePrefix, size) => appendSize(form, sizePrefix, size));
  });

  appendItems('UpdateDesigns', updatedDesigns, (prefix, design) => {
    form.append(`${prefix}.DesignId`, design.designId);
    form.append(`${prefix}.DesignName`, design.designName.trim());
    form.append(`${prefix}.DesignDescription`, design.designDescription.trim());
    appendNumber(form, `${prefix}.EstimatedPrice`, design.estimatedPrice);
  });

  appendValues(form, 'RemoveDesignIds', removedDesignIds);

  appendItems('NewImages', newImages, (prefix, { designId, image }) => {
    form.append(`${prefix}.DesignId`, designId);
    appendImage(form, prefix, image);
  });

  appendItems('UpdateImages', updatedImages, (prefix, image) => {
    form.append(`${prefix}.ImageId`, image.key);
    form.append(`${prefix}.AltText`, image.altText);
    form.append(`${prefix}.IsPrimary`, String(image.isPrimary));
  });

  appendValues(form, 'RemoveImageIds', removedImageIds);

  appendItems('NewSizes', newSizes, (prefix, { designId, size }) => {
    form.append(`${prefix}.DesignId`, designId);
    appendSize(form, prefix, size);
  });

  appendItems('UpdateSizes', updatedSizes, (prefix, size) => {
    form.append(`${prefix}.SizeId`, size.sizeId ?? '');
    appendSize(form, prefix, size);
  });

  appendValues(form, 'RemoveSizeIds', removedSizeIds);

  return form;
}

// Builds the multipart/form-data body for POST /api/admin/products.
// Same indexed-key layout as the PUT, with every design sent in full under Designs[i].
export function buildCreateProductFormData(product: ProductDraft): FormData {
  const form = new FormData();
  form.append('ProductName', product.productName.trim());
  form.append('CategoryName', product.categoryName.trim());

  appendItems('Designs', product.designs, (prefix, design) => {
    form.append(`${prefix}.DesignName`, design.designName.trim());
    form.append(`${prefix}.DesignDescription`, design.designDescription.trim());
    appendNumber(form, `${prefix}.EstimatedPrice`, design.estimatedPrice);
    appendItems(`${prefix}.Images`, design.images, (imagePrefix, image) => appendImage(form, imagePrefix, image));
    appendItems(`${prefix}.Sizes`, design.sizes, (sizePrefix, size) => appendSize(form, sizePrefix, size));
  });

  return form;
}

function isDesignChanged(original: DesignDraft, design: DesignDraft): boolean {
  return (
    original.designName !== design.designName ||
    original.designDescription !== design.designDescription ||
    original.estimatedPrice !== design.estimatedPrice
  );
}

function isSizeChanged(original: SizeDraft, size: SizeDraft): boolean {
  return (
    original.sizeName !== size.sizeName ||
    original.length !== size.length ||
    original.breadth !== size.breadth ||
    original.height !== size.height ||
    original.weight !== size.weight ||
    original.basePrice !== size.basePrice ||
    original.mrp !== size.mrp ||
    original.quantity !== size.quantity
  );
}

function appendImage(form: FormData, prefix: string, image: ImageDraft): void {
  if (image.file) {
    form.append(`${prefix}.File`, image.file, image.file.name);
  }
  form.append(`${prefix}.AltText`, image.altText);
  form.append(`${prefix}.IsPrimary`, String(image.isPrimary));
}

function appendSize(form: FormData, prefix: string, size: SizeDraft): void {
  form.append(`${prefix}.SizeName`, size.sizeName.trim());
  appendNumber(form, `${prefix}.Length`, size.length);
  appendNumber(form, `${prefix}.Breadth`, size.breadth);
  appendNumber(form, `${prefix}.Height`, size.height);
  appendNumber(form, `${prefix}.Weight`, size.weight);
  appendNumber(form, `${prefix}.BasePrice`, size.basePrice);
  appendNumber(form, `${prefix}.Mrp`, size.mrp);
  appendNumber(form, `${prefix}.Quantity`, size.quantity);
}

function appendNumber(form: FormData, key: string, value: number | null): void {
  // Validation runs before the request is built, so a null here should not happen.
  form.append(key, String(value ?? ''));
}

function appendItems<T>(name: string, items: T[], appendItem: (prefix: string, item: T) => void): void {
  items.forEach((item, index) => appendItem(`${name}[${index}]`, item));
}

function appendValues(form: FormData, name: string, values: string[]): void {
  values.forEach((value, index) => form.append(`${name}[${index}]`, value));
}
