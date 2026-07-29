<template>
  <q-page class="menu-page">
    <section class="pos-sales-layout menu-layout">
      <PosSidebarNav @new-order="notifyNewOrder" />
      <main class="pos-main-wrapper menu-main">
        <PosHeaderBar />
        <section class="menu-content">
          <header class="menu-titlebar">
            <div>
              <h1>{{ t('menuPage.title') }}</h1>
              <small>{{ t('menuPage.subtitle') }}</small>
            </div>
            <button type="button" @click="notifyNewProduct">
              <span>{{ t('menuPage.addProduct') }}</span>
              <q-icon name="add" size="20px" />
            </button>
          </header>

          <section class="menu-categories">
            <div class="section-heading">
              <h2>{{ t('menuPage.categoriesTitle') }}</h2>
              <button type="button">
                <span>{{ t('menuPage.manageCategories') }}</span>
                <q-icon name="arrow_forward" size="17px" />
              </button>
            </div>
            <div class="category-pills">
              <button
                v-for="catKey in categoryKeys"
                :key="catKey.id"
                type="button"
                :class="{ active: selectedCategoryId === catKey.id }"
                @click="selectedCategoryId = catKey.id"
              >
                {{ t(catKey.i18nKey) }}
              </button>
              <button type="button" class="add-category" aria-label="Add category">
                <q-icon name="add" size="19px" />
              </button>
            </div>
          </section>

          <section class="menu-products">
            <button type="button" class="add-product-card" @click="notifyNewProduct">
              <span class="add-icon"><q-icon name="add" size="36px" /></span>
              <strong>{{ t('menuPage.addNewProduct') }}</strong>
              <small>{{ t('menuPage.uploadPhotoSub') }}</small>
            </button>
            <MenuProductCard
              v-for="product in filteredProducts"
              :key="product.name"
              :product="product"
            />
          </section>

          <section class="menu-stats">
            <div class="inventory-card">
              <div>
                <p>{{ t('menuPage.overviewTitle') }}</p>
                <h2>{{ t('menuPage.readyToSellCount', { count: 24 }) }}</h2>
                <small>{{ t('menuPage.overviewSub') }}</small>
              </div>
              <div class="stat-list">
                <span><b>24</b> {{ t('menuPage.productsCount', { count: '' }).trim() }}</span>
                <span><b>6</b> {{ t('menuPage.categoriesCount', { count: '' }).trim() }}</span>
                <span><b>18</b> {{ t('menuPage.availableCount', { count: '' }).trim() }}</span>
              </div>
            </div>
            <div class="featured-stat">
              <q-icon name="restaurant_menu" size="32px" />
              <p>{{ t('menuPage.mostOrdered') }}</p>
              <h2>Lavender Latte</h2>
              <small>{{ t('menuPage.weeklyOrdersCount', { count: 128 }) }}</small>
            </div>
          </section>
        </section>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useSearchState } from '@/composables/use-search-state';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import MenuProductCard, { type MenuProduct } from '@/components/menu/menu-product-card.vue';

const $q = useQuasar();
const { t } = useI18n();
const { searchQuery } = useSearchState();

const selectedCategoryId = ref('all');

const categoryKeys = [
  { id: 'all', i18nKey: 'menuPage.categories.all' },
  { id: 'coffee', i18nKey: 'menuPage.categories.coffee' },
  { id: 'bakery', i18nKey: 'menuPage.categories.bakery' },
  { id: 'breakfast', i18nKey: 'menuPage.categories.breakfast' },
  { id: 'tea', i18nKey: 'menuPage.categories.teaMatcha' },
  { id: 'seasonal', i18nKey: 'menuPage.categories.seasonal' },
];

const products: MenuProduct[] = [
  {
    name: 'Lavender Latte',
    price: 145,
    description: 'Signature espresso with organic lavender syrup and milk.',
    category: 'Coffee',
    categoryId: 'coffee',
    stock: 18,
    status: 'Available',
    imageClass: 'lavender-latte',
  },
  {
    name: 'Butter Croissant',
    price: 85,
    description: 'Hand-rolled daily with French AOP butter. 24-hour proof.',
    category: 'Bakery',
    categoryId: 'bakery',
    stock: 12,
    status: 'Available',
    imageClass: 'butter-croissant',
  },
  {
    name: 'Avocado Toast',
    price: 220,
    description: 'Mashed avocado, poached egg, and chili on sourdough.',
    category: 'Breakfast',
    categoryId: 'breakfast',
    stock: 8,
    status: 'Available',
    imageClass: 'avocado-toast',
  },
  {
    name: 'Kyoto Matcha Latte',
    price: 165,
    description: 'Stone-ground Kyoto matcha whisked with your choice of milk.',
    category: 'Tea & Matcha',
    categoryId: 'tea',
    stock: 16,
    status: 'Available',
    imageClass: 'matcha-latte',
  },
];

const filteredProducts = computed(() =>
  products.filter((product) => {
    const matchCat =
      selectedCategoryId.value === 'all' || product.categoryId === selectedCategoryId.value;
    const matchQuery =
      !searchQuery.value ||
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchCat && matchQuery;
  }),
);

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};

const notifyNewProduct = (): void => {
  $q.notify({
    message: t('menuPage.addNewProductPending'),
    color: 'primary',
    position: 'top',
  });
};
</script>
