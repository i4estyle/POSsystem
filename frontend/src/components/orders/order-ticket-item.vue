<template>
  <li class="order-ticket-item">
    <section class="order-ticket-item__main">
      <figure class="order-ticket-item__thumb">
        <img v-if="imageUrl" :src="imageUrl" :alt="parsedItem.baseName" />
        <q-icon v-else name="restaurant" size="18px" />
      </figure>

      <div class="order-ticket-item__body">
        <div class="order-ticket-item__title-row">
          <span class="order-ticket-item__qty">{{ quantity }}x</span>
          <strong class="order-ticket-item__name">{{ parsedItem.baseName }}</strong>
        </div>

        <div v-if="parsedItem.tags.length > 0" class="order-ticket-item__mods">
          <span
            v-for="(tag, idx) in parsedItem.tags"
            :key="idx"
            class="order-mod-chip"
            :class="getTagType(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </section>

    <b class="order-ticket-item__price">{{ formatCurrency(price * quantity) }}</b>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string | null | undefined;
  formatCurrency: (value: number) => string;
}>();

const parsedItem = computed(() => {
  const raw = (props.name || '').trim();
  const firstParen = raw.indexOf('(');
  if (firstParen === -1) {
    return { baseName: raw, tags: [] as string[] };
  }

  const baseName = raw.slice(0, firstParen).trim();
  let modString = raw.slice(firstParen + 1).trim();
  if (modString.endsWith(')')) {
    modString = modString.slice(0, -1).trim();
  }

  const tags = modString
    .split(/[|,]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return { baseName, tags };
});

const getTagType = (tag: string): string => {
  if (tag.startsWith('+') || tag.includes('เพิ่ม')) return 'is-addon';
  if (tag.startsWith('ไม่') || tag.startsWith('แยก')) return 'is-exclude';
  return 'is-flavor';
};
</script>
