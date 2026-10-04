export interface SizeDraft {
  sizeId?: string;
  sizeName: string;
  length: number | null;
  breadth: number | null;
  height: number | null;
  weight: number | null;
  basePrice: number | null;
  mrp: number | null;
  quantity: number | null;
}

export interface ImageDraft {
  // imageId for saved images, a local key for new ones.
  key: string;
  src: string;
  altText: string;
  isPrimary: boolean;
  // Only set for images added in this session; saved images have no file.
  file: File | null;
}

export interface DesignDraft {
  designId: string;
  designName: string;
  designDescription: string;
  estimatedPrice: number | null;
  images: ImageDraft[];
  sizes: SizeDraft[];
  newSizes: SizeDraft[];
}

export interface ProductDraft {
  productName: string;
  categoryName: string;
  designs: DesignDraft[];
}

export function emptySize(): SizeDraft {
  return {
    sizeName: '',
    length: null,
    breadth: null,
    height: null,
    weight: null,
    basePrice: null,
    mrp: null,
    quantity: null
  };
}

export function emptyDesign(): DesignDraft {
  return {
    designId: `local-${Date.now()}`,
    designName: '',
    designDescription: '',
    estimatedPrice: null,
    images: [],
    sizes: [],
    newSizes: []
  };
}

export function isSizeComplete(size: SizeDraft): boolean {
  return (
    size.sizeName.trim() !== '' &&
    [size.length, size.breadth, size.height, size.weight, size.basePrice, size.mrp, size.quantity].every(
      (value) => value !== null
    )
  );
}

// Mandatory for a design: name, description, estimated price, at least one image, at least one complete size.
export function getDesignErrors(design: DesignDraft): string[] {
  const errors: string[] = [];

  if (design.designName.trim() === '') {
    errors.push('Design name is required.');
  }
  if (design.designDescription.trim() === '') {
    errors.push('Design description is required.');
  }
  if (design.estimatedPrice === null) {
    errors.push('Estimated price is required.');
  }
  if (design.images.length === 0) {
    errors.push('At least one image is required.');
  }
  if (design.sizes.length === 0) {
    errors.push('At least one size is required.');
  } else if (!design.sizes.every(isSizeComplete)) {
    errors.push('Every size must have a name and all its numeric fields filled.');
  }

  return errors;
}

export function getProductErrors(product: { productName: string; categoryName: string }): string[] {
  const errors: string[] = [];

  if (product.productName.trim() === '') {
    errors.push('Product name is required.');
  }
  if (product.categoryName.trim() === '') {
    errors.push('Category is required.');
  }

  return errors;
}
