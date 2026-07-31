import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ProductInterface, CategoryInterface } from '@/types/product';

const INITIAL_CATEGORIES: CategoryInterface[] = [
  { categoryId: 1, categoryName: 'เบอร์เกอร์' },
  { categoryId: 2, categoryName: 'เครื่องดื่ม' },
  { categoryId: 3, categoryName: 'ของหวาน' },
  { categoryId: 4, categoryName: 'ของว่าง' },
  { categoryId: 5, categoryName: 'เซตสุดคุ้ม' },
];

const INITIAL_PRODUCTS: ProductInterface[] = [
  {
    productId: 1,
    categoryId: 1,
    productName: 'Double Cheese Burger',
    sku: 'BKG-001',
    costPrice: 100,
    sellingPrice: 189.0,
    unit: 'ชิ้น',
    stockQuantity: 24,
    status: 'active',
    isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  },
  {
    productId: 2,
    categoryId: 2,
    productName: 'Iced Matcha Latte',
    sku: 'DRK-001',
    costPrice: 40,
    sellingPrice: 85.0,
    unit: 'แก้ว',
    stockQuantity: 50,
    status: 'active',
    isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80',
  },
  {
    productId: 3,
    categoryId: 4,
    productName: 'Truffle Fries',
    sku: 'SNK-001',
    costPrice: 50,
    sellingPrice: 120.0,
    unit: 'จาน',
    stockQuantity: 8,
    status: 'active',
    isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
  },
  {
    productId: 4,
    categoryId: 3,
    productName: 'Strawberry Shortcake',
    sku: 'DST-001',
    costPrice: 70,
    sellingPrice: 145.0,
    unit: 'ชิ้น',
    stockQuantity: 15,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=80',
  },
  {
    productId: 5,
    categoryId: 4,
    productName: 'Spicy Wings (6pcs)',
    sku: 'SNK-002',
    costPrice: 80,
    sellingPrice: 165.0,
    unit: 'ชุด',
    stockQuantity: 3,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&q=80',
  },
  {
    productId: 6,
    categoryId: 2,
    productName: 'Sparkling Lemonade',
    sku: 'DRK-002',
    costPrice: 20,
    sellingPrice: 60.0,
    unit: 'แก้ว',
    stockQuantity: 40,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80',
  },
  {
    productId: 7,
    categoryId: 1,
    productName: 'Classic Bacon Cheeseburger',
    sku: 'BKG-002',
    costPrice: 110,
    sellingPrice: 199.0,
    unit: 'ชิ้น',
    stockQuantity: 18,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80',
  },
  {
    productId: 8,
    categoryId: 1,
    productName: 'Crispy Chicken Burger',
    sku: 'BKG-003',
    costPrice: 85,
    sellingPrice: 159.0,
    unit: 'ชิ้น',
    stockQuantity: 0,
    status: 'inactive',
    imageUrl: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=400&q=80',
  },
  {
    productId: 9,
    categoryId: 2,
    productName: 'Americano Cold Brew',
    sku: 'DRK-003',
    costPrice: 25,
    sellingPrice: 75.0,
    unit: 'แก้ว',
    stockQuantity: 35,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80',
  },
  {
    productId: 10,
    categoryId: 2,
    productName: 'Fresh Orange Juice',
    sku: 'DRK-004',
    costPrice: 30,
    sellingPrice: 70.0,
    unit: 'แก้ว',
    stockQuantity: 22,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80',
  },
  {
    productId: 11,
    categoryId: 3,
    productName: 'Chocolate Lava Cake',
    sku: 'DST-002',
    costPrice: 65,
    sellingPrice: 135.0,
    unit: 'จาน',
    stockQuantity: 12,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80',
  },
  {
    productId: 12,
    categoryId: 3,
    productName: 'Matcha Green Tea Parfait',
    sku: 'DST-003',
    costPrice: 75,
    sellingPrice: 150.0,
    unit: 'แก้ว',
    stockQuantity: 6,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=80',
  },
  {
    productId: 13,
    categoryId: 4,
    productName: 'Mozzarella Cheese Sticks',
    sku: 'SNK-003',
    costPrice: 60,
    sellingPrice: 129.0,
    unit: 'ชุด',
    stockQuantity: 30,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&q=80',
  },
  {
    productId: 14,
    categoryId: 5,
    productName: 'Cheeseburger Set',
    sku: 'SET-001',
    costPrice: 150,
    sellingPrice: 299.0,
    unit: 'เซต',
    stockQuantity: 10,
    status: 'active',
    isPopular: true,
    imageUrl: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=400&q=80',
  },
  {
    productId: 15,
    categoryId: 5,
    productName: 'Spicy Wings Set',
    sku: 'SET-002',
    costPrice: 160,
    sellingPrice: 319.0,
    unit: 'เซต',
    stockQuantity: 5,
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
  },
];

export const useProductStore = defineStore('product', () => {
  const products = ref<ProductInterface[]>(INITIAL_PRODUCTS);
  const categories = ref<CategoryInterface[]>(INITIAL_CATEGORIES);
  const selectedCategoryId = ref<number | null>(null);
  const searchQuery = ref<string>('');
  const isLoading = ref<boolean>(false);

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

    return [...result].sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
  });

  const selectCategory = (categoryId: number | null): void => {
    selectedCategoryId.value = categoryId;
  };

  const addProduct = (payload: Omit<ProductInterface, 'productId'>): void => {
    const newId = Math.max(0, ...products.value.map((p) => p.productId)) + 1;
    products.value.unshift({
      ...payload,
      productId: newId,
    });
  };

  const updateProduct = (id: number, payload: Partial<ProductInterface>): void => {
    const item = products.value.find((p) => p.productId === id);
    if (item) {
      Object.assign(item, payload);
    }
  };

  const deleteProduct = (id: number): void => {
    products.value = products.value.filter((p) => p.productId !== id);
  };

  const toggleStatus = (id: number): void => {
    const item = products.value.find((p) => p.productId === id);
    if (item) {
      item.status = item.status === 'active' ? 'inactive' : 'active';
    }
  };

  const deductStock = (productId: number, qty: number): void => {
    const item = products.value.find((p) => p.productId === productId);
    if (item && item.stockQuantity !== undefined && item.stockQuantity !== null) {
      item.stockQuantity = Math.max(0, item.stockQuantity - qty);
    }
  };

  return {
    products,
    categories,
    selectedCategoryId,
    searchQuery,
    isLoading,
    filteredProducts,
    selectCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStatus,
    deductStock,
  };
});
