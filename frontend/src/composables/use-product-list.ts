import { ref, computed } from 'vue';
import { productService } from '@/services/product-service';
import { categoryService } from '@/services/category-service';
import type { ProductInterface, CategoryInterface } from '@/types/product';

const MOCK_PRODUCTS: ProductInterface[] = [
  {
    productId: 1,
    categoryId: 1,
    productName: 'Double Cheese Burger',
    sku: 'SKU-001',
    costPrice: 100,
    sellingPrice: 189.0,
    unit: 'ชิ้น',
    status: 'active',
  },
  {
    productId: 2,
    categoryId: 2,
    productName: 'Iced Matcha Latte',
    sku: 'SKU-002',
    costPrice: 40,
    sellingPrice: 85.0,
    unit: 'แก้ว',
    status: 'active',
  },
  {
    productId: 3,
    categoryId: 4,
    productName: 'Truffle Fries',
    sku: 'SKU-003',
    costPrice: 50,
    sellingPrice: 120.0,
    unit: 'จาน',
    status: 'active',
  },
  {
    productId: 4,
    categoryId: 3,
    productName: 'Strawberry Shortcake',
    sku: 'SKU-004',
    costPrice: 70,
    sellingPrice: 145.0,
    unit: 'ชิ้น',
    status: 'active',
  },
  {
    productId: 5,
    categoryId: 4,
    productName: 'Spicy Wings (6pcs)',
    sku: 'SKU-005',
    costPrice: 80,
    sellingPrice: 165.0,
    unit: 'ชุด',
    status: 'active',
  },
  {
    productId: 6,
    categoryId: 2,
    productName: 'Sparkling Lemonade',
    sku: 'SKU-006',
    costPrice: 20,
    sellingPrice: 60.0,
    unit: 'แก้ว',
    status: 'active',
  },
];

const MOCK_CATEGORIES: CategoryInterface[] = [
  { categoryId: 1, categoryName: 'เบอร์เกอร์' },
  { categoryId: 2, categoryName: 'เครื่องดื่ม' },
  { categoryId: 3, categoryName: 'ของหวาน' },
  { categoryId: 4, categoryName: 'ของว่าง' },
  { categoryId: 5, categoryName: 'เซตสุดคุ้ม' },
];

export function useProductList() {
  const products = ref<ProductInterface[]>([]);
  const categories = ref<CategoryInterface[]>([]);
  const selectedCategoryId = ref<number | null>(null);
  const searchQuery = ref<string>('');
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchCategories = async (): Promise<void> => {
    try {
      const res = await categoryService.getAll();
      const list = res && Array.isArray(res.data) ? res.data : [];
      if (list.length > 0) {
        categories.value = list;
      } else {
        categories.value = MOCK_CATEGORIES;
      }
    } catch {
      categories.value = MOCK_CATEGORIES;
    }
  };

  const fetchProducts = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await productService.getAll();
      const list = res && Array.isArray(res.data) ? res.data : [];
      if (list.length > 0) {
        products.value = list;
      } else {
        products.value = MOCK_PRODUCTS;
      }
    } catch {
      products.value = MOCK_PRODUCTS;
    } finally {
      isLoading.value = false;
    }
  };

  const filteredProducts = computed(() => {
    let result = products.value;

    if (selectedCategoryId.value !== null) {
      result = result.filter((p) => p.categoryId === selectedCategoryId.value);
    }

    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase().trim();
      result = result.filter(
        (p) => p.productName.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
      );
    }

    return result;
  });

  const selectCategory = (categoryId: number | null): void => {
    selectedCategoryId.value = categoryId;
  };

  return {
    products,
    categories,
    selectedCategoryId,
    searchQuery,
    isLoading,
    error,
    filteredProducts,
    fetchProducts,
    fetchCategories,
    selectCategory,
  };
}
