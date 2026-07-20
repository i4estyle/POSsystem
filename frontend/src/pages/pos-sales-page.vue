<template>
  <q-page>
    <section class="pos-sales-layout">
      <PosSidebarNav @new-order="onNewOrder" />

      <main class="pos-main-wrapper">
        <PosHeaderBar v-model:search-query="searchQuery" />

        <section class="pos-content-grid">
          <section class="products-section">
            <CategoryPillBar
              :categories="categories"
              :selected-id="selectedCategoryId"
              @select="selectCategory"
            />

            <ProductGrid :products="filteredProducts" @add-to-cart="addToCart" />
          </section>

          <section id="mobile-cart-target" class="cart-section-wrapper">
            <CartPanel
              :items="cartItems"
              :item-count="itemCount"
              :subtotal="subtotal"
              :tax="tax"
              :total="total"
              :order-type="orderType"
              :selected-table-id="selectedTableId"
              :tables="tables"
              :is-submitting="isSubmitting"
              @update:order-type="orderType = $event"
              @update:selected-table-id="selectedTableId = $event"
              @update-qty="updateQuantity"
              @confirm="handleConfirmOrder"
            />
          </section>
        </section>

        <aside v-if="itemCount > 0" class="mobile-cart-float-bar" @click="scrollToCart">
          <div class="cart-float-left">
            <span class="cart-badge">{{ itemCount }}</span>
            <span class="cart-label">{{ t('pos.orderList') }}</span>
          </div>
          <div class="cart-float-right">
            <span class="cart-total">฿{{ total.toLocaleString() }}</span>
            <q-icon name="arrow_forward" size="18px" />
          </div>
        </aside>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import CategoryPillBar from '@/components/pos/category-pill-bar.vue';
import ProductGrid from '@/components/pos/product-grid.vue';
import CartPanel from '@/components/pos/cart-panel.vue';
import { useProductList } from '@/composables/use-product-list';
import { useCart } from '@/composables/use-cart';
import { useDiningTables } from '@/composables/use-dining-tables';

const { t } = useI18n();
const authStore = useAuthStore();

const {
  categories,
  selectedCategoryId,
  searchQuery,
  filteredProducts,
  fetchProducts,
  fetchCategories,
  selectCategory,
} = useProductList();

const {
  cartItems,
  orderType,
  selectedTableId,
  isSubmitting,
  itemCount,
  subtotal,
  tax,
  total,
  addToCart,
  updateQuantity,
  submitOrder,
} = useCart();

const { tables, fetchTables } = useDiningTables();

onMounted(() => {
  void authStore.fetchProfile();
  void fetchProducts();
  void fetchCategories();
  void fetchTables();
});

const onNewOrder = (): void => {};

const handleConfirmOrder = (): void => {
  void submitOrder();
};

const scrollToCart = (): void => {
  const el = document.getElementById('mobile-cart-target');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>
