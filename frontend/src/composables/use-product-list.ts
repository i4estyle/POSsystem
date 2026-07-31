import { storeToRefs } from 'pinia';
import { useProductStore } from '@/stores/product-store';

export function useProductList() {
  const store = useProductStore();
  const { products, categories, selectedCategoryId, searchQuery, isLoading, filteredProducts } =
    storeToRefs(store);

  const fetchCategories = async (): Promise<void> => {};
  const fetchProducts = async (): Promise<void> => {};

  return {
    products,
    categories,
    selectedCategoryId,
    searchQuery,
    isLoading,
    error: null,
    filteredProducts,
    fetchProducts,
    fetchCategories,
    selectCategory: store.selectCategory,
  };
}
