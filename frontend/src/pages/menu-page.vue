<template>
  <q-page class="menu-page">
    <section class="pos-sales-layout menu-layout">
      <PosSidebarNav @new-order="notifyNewOrder" />
      <main class="pos-main-wrapper menu-main">
        <PosHeaderBar v-model:search-query="searchQuery" />
        <section class="menu-content">
          <header class="menu-titlebar">
            <div>
              <p>MENU MANAGEMENT</p>
              <h1>Products &amp; Categories</h1>
              <small>Create, organize, and manage your menu.</small>
            </div>
            <button type="button" @click="notifyNewProduct">
              Add product <q-icon name="add" size="20px" />
            </button>
          </header>

          <section class="menu-categories">
            <div class="section-heading">
              <h2>Categories</h2>
              <button type="button">
                Manage categories <q-icon name="arrow_forward" size="17px" />
              </button>
            </div>
            <div class="category-pills">
              <button
                v-for="category in categories"
                :key="category"
                type="button"
                :class="{ active: selectedCategory === category }"
                @click="selectedCategory = category"
              >
                {{ category }}</button
              ><button type="button" class="add-category" aria-label="Add category">
                <q-icon name="add" size="19px" />
              </button>
            </div>
          </section>

          <section class="menu-products">
            <button type="button" class="add-product-card" @click="notifyNewProduct">
              <span class="add-icon"><q-icon name="add" size="36px" /></span
              ><strong>+ เพิ่มเมนูใหม่</strong><small>Upload photos and set<br />prices</small>
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
                <p>Menu overview</p>
                <h2>24 products ready to sell</h2>
                <small>Keep your menu current and your team in sync.</small>
              </div>
              <div class="stat-list">
                <span><b>24</b> Products</span><span><b>6</b> Categories</span
                ><span><b>18</b> Available</span>
              </div>
            </div>
            <div class="featured-stat">
              <q-icon name="restaurant_menu" size="32px" />
              <p>Most ordered</p>
              <h2>Lavender Latte</h2>
              <small>128 orders this week</small>
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
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import MenuProductCard, { type MenuProduct } from '@/components/menu/menu-product-card.vue';

const $q = useQuasar();
const searchQuery = ref('');
const selectedCategory = ref('All products');
const categories = ['All products', 'Coffee', 'Bakery', 'Breakfast', 'Tea & Matcha', 'Seasonal'];
const products: MenuProduct[] = [
  {
    name: 'Lavender Latte',
    price: 145,
    description: 'Signature espresso with organic lavender syrup and milk.',
    category: 'Coffee',
    stock: 18,
    status: 'Available',
    imageClass: 'lavender-latte',
  },
  {
    name: 'Butter Croissant',
    price: 85,
    description: 'Hand-rolled daily with French AOP butter. 24-hour proof.',
    category: 'Bakery',
    stock: 12,
    status: 'Available',
    imageClass: 'butter-croissant',
  },
  {
    name: 'Avocado Toast',
    price: 220,
    description: 'Mashed avocado, poached egg, and chili on sourdough.',
    category: 'Breakfast',
    stock: 8,
    status: 'Available',
    imageClass: 'avocado-toast',
  },
  {
    name: 'Kyoto Matcha Latte',
    price: 165,
    description: 'Stone-ground Kyoto matcha whisked with your choice of milk.',
    category: 'Tea & Matcha',
    stock: 16,
    status: 'Available',
    imageClass: 'matcha-latte',
  },
];
const filteredProducts = computed(() =>
  selectedCategory.value === 'All products'
    ? products
    : products.filter((product) => product.category === selectedCategory.value),
);
const notifyNewOrder = (): void => {
  $q.notify({ message: 'New order flow is coming next.', color: 'primary', position: 'top' });
};
const notifyNewProduct = (): void => {
  $q.notify({
    message: 'Product creation flow is coming next.',
    color: 'primary',
    position: 'top',
  });
};
</script>
