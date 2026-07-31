<template>
  <div class="pos-sales-layout">
    <!-- 1. Left Navigation Sidebar -->
    <PosSidebarNav />

    <!-- 2. Main Content Wrapper (Header + Catalog Grid + Cart Panel) -->
    <div class="pos-main-wrapper">
      <PosHeaderBar />

      <div class="pos-content-grid">
        <!-- Products Catalog Section -->
        <main class="products-section">
          <CategoryPillBar
            :categories="categories"
            :selected-id="selectedCategoryId"
            @select="selectCategory"
          />

          <ProductGrid
            :products="filteredProducts"
            :is-loading="isLoading"
            :search-query="searchQuery"
            @update:search-query="searchQuery = $event"
            @add-to-cart="addToCart"
          />
        </main>

        <!-- Right Cart Section -->
        <div id="mobile-cart-target" class="cart-section-wrapper">
          <CartPanel
            ref="cartPanelRef"
            :items="cartItems"
            :item-count="itemCount"
            :subtotal="subtotal"
            :discount-amount="discountAmount"
            :tax="tax"
            :total="total"
            :order-type="orderType"
            :selected-table-id="selectedTableId"
            :tables="tables"
            :selected-promotion="selectedPromotion"
            :selected-member="selectedMember"
            @update:order-type="orderType = $event"
            @update:selected-table-id="selectedTableId = $event"
            @update-qty="updateQuantity"
            @clear-cart="clearCart"
            @open-promotion-dialog="showPromotionDialog = true"
            @open-member-dialog="showMemberDialog = true"
            @remove-promotion="removePromotion"
            @remove-member="removeMember"
            @confirm="handleConfirmOrder"
          />
        </div>
      </div>
    </div>

    <!-- Promotion Dialog -->
    <PosPromotionDialog
      v-model="showPromotionDialog"
      :selected-promotion-id="selectedPromotion?.id"
      :current-subtotal="subtotal"
      @select-promotion="applyPromotion"
    />

    <!-- Member Dialog -->
    <PosMemberDialog
      v-model="showMemberDialog"
      :selected-member-id="selectedMember?.id"
      @select-member="selectMember"
    />

    <!-- Payment Checkout Dialog -->
    <PosPaymentDialog
      v-model="showPaymentDialog"
      :total-amount="total"
      :subtotal="subtotal"
      :discount-amount="discountAmount"
      :tax="tax"
      :cart-items="cartItems"
      :order-type="orderType"
      :selected-table-id="selectedTableId"
      :tables="tables"
      :selected-promotion="selectedPromotion"
      :selected-member="selectedMember"
      :branch-name="
        authStore.currentUser?.branchName ||
        authStore.currentUser?.branch?.branchName ||
        (authStore.currentUser?.branchId
          ? `สาขา #${authStore.currentUser.branchId}`
          : 'สาขาใหญ่ (Branch 001)')
      "
      :cashier-name="
        authStore.currentUser
          ? `${authStore.currentUser.firstName} ${authStore.currentUser.lastName}`
          : 'พนักงานประจำเครื่อง'
      "
      @success="onPaymentSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useAuthStore } from '@/stores/auth-store';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import CategoryPillBar from '@/components/pos/category-pill-bar.vue';
import ProductGrid from '@/components/pos/product-grid.vue';
import CartPanel from '@/components/pos/cart-panel.vue';
import PosPromotionDialog from '@/components/pos/pos-promotion-dialog.vue';
import PosMemberDialog from '@/components/pos/pos-member-dialog.vue';
import PosPaymentDialog from '@/components/pos/pos-payment-dialog.vue';
import { useProductList } from '@/composables/use-product-list';
import { useDiningTables } from '@/composables/use-dining-tables';
import { useCart } from '@/composables/use-cart';
import { OrderType } from '@/types/order';

const { t } = useI18n();
const $q = useQuasar();
const authStore = useAuthStore();

const showPromotionDialog = ref(false);
const showMemberDialog = ref(false);
const showPaymentDialog = ref(false);
const cartPanelRef = ref<InstanceType<typeof CartPanel> | null>(null);

const {
  categories,
  selectedCategoryId,
  searchQuery,
  filteredProducts,
  isLoading,
  fetchProducts,
  selectCategory,
} = useProductList();

const { tables, fetchTables } = useDiningTables();

const {
  cartItems,
  itemCount,
  subtotal,
  discountAmount,
  tax,
  total,
  orderType,
  selectedTableId,
  selectedPromotion,
  selectedMember,
  addToCart,
  updateQuantity,
  clearCart,
  applyPromotion,
  removePromotion,
  selectMember,
  removeMember,
  submitOrder,
} = useCart();

onMounted(() => {
  void fetchProducts();
  void fetchTables();
});

const handleConfirmOrder = (): void => {
  if (orderType.value === OrderType.DINE_IN && !selectedTableId.value) {
    $q.notify({
      type: 'warning',
      icon: 'table_restaurant',
      message: t('pos.selectTableRequired'),
      position: 'top',
    });
    cartPanelRef.value?.focusTableSelect();
    return;
  }
  showPaymentDialog.value = true;
};

const onPaymentSuccess = async (): Promise<void> => {
  await submitOrder();
  $q.notify({
    type: 'positive',
    icon: 'check_circle',
    message: t('pos.payment.successMessage'),
    position: 'top',
  });
};
</script>

<style scoped lang="scss">
@use '../css/pages/pos-sales.scss';
</style>
