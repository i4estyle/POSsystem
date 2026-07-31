<template>
  <li class="order-ticket-item">
    <section class="order-ticket-item__main">
      <figure class="order-ticket-item__thumb">
        <img v-if="imageUrl" :src="imageUrl" :alt="name" />
        <q-icon v-else name="fastfood" size="18px" color="grey" />
      </figure>
      <span>{{ quantity }}x {{ name }}</span>
    </section>
    <b>{{ formatCurrency(price) }}</b>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string | null | undefined;
  formatCurrency: (value: number) => string;
}>();
</script>
