export interface CategoryInterface {
  categoryId: number;
  categoryName: string;
  description?: string | null;
  parentCategoryId?: number | null;
}

export interface ProductInterface {
  productId: number;
  categoryId: number;
  productName: string;
  sku: string;
  barcode?: string | null;
  description?: string | null;
  costPrice: number;
  sellingPrice: number;
  unit: string;
  stockQuantity?: number | null;
  imageUrl?: string | null;
  status: 'active' | 'inactive';
  isPopular?: boolean;
  category?: CategoryInterface;
}
