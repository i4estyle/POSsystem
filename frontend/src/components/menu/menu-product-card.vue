<template>
  <article class="menu-product-card">
    <div class="menu-product-image" :class="product.imageClass">
      <div class="product-actions">
        <button type="button" aria-label="Edit product"><q-icon name="edit" size="17px" /></button
        ><button type="button" aria-label="More product options">
          <q-icon name="more_horiz" size="18px" />
        </button>
      </div>
      <span class="product-category">{{ product.category }}</span>
    </div>
    <div class="menu-product-details">
      <div class="product-name-row">
        <h3>{{ product.name }}</h3>
        <strong>฿{{ product.price }}</strong>
      </div>
      <p>{{ product.description }}</p>
      <footer>
        <span><q-icon name="inventory_2" size="15px" /> {{ product.stock }} in stock</span
        ><span>{{ product.status }}</span>
      </footer>
    </div>
  </article>
</template>

<script setup lang="ts">
export interface MenuProduct {
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  status: string;
  imageClass: string;
}

defineProps<{ product: MenuProduct }>();
</script>
