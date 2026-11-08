<template>
  <q-dialog
    :model-value="modelValue"
    position="bottom"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="product" class="mobile-item-sheet">
      <div class="sheet-drag-handle"><span></span></div>

      <div class="sheet-hero">
        <img
          :src="
            product.imageUrl ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'
          "
          :alt="product.productName"
          class="sheet-hero-img"
        />
        <button type="button" class="sheet-close-btn" @click="emit('update:modelValue', false)">
          <q-icon name="close" size="20px" />
        </button>
        <span v-if="product.isPopular" class="sheet-popular-badge">
          <q-icon name="local_fire_department" size="14px" />
          {{ isEn ? 'Best Seller' : 'เมนูขายดี' }}
        </span>
      </div>

      <div class="sheet-scroll-body">
        <div class="sheet-title-row">
          <div>
            <h3 class="sheet-product-title">{{ product.productName }}</h3>
            <p class="sheet-product-sub">
              {{
                isDrink
                  ? isEn
                    ? 'Freshly prepared beverage • Customize sweetness & toppings'
                    : 'ชงสดแก้วต่อแก้ว • เลือกระดับความหวานและท็อปปิ้งได้ตามใจ'
                  : isEn
                    ? 'Prepared fresh to order • Customize spice & add-ons'
                    : 'ปรุงสดใหม่ทุกจาน • เลือกปรับรสชาติและท็อปปิ้งได้เองโดยไม่ต้องเรียกพนักงาน'
              }}
            </p>
          </div>
          <div class="sheet-base-price">฿{{ product.sellingPrice.toFixed(0) }}</div>
        </div>

        <!-- Drink Sweetness Level -->
        <section v-if="isDrink" class="sheet-option-group">
          <div class="group-header">
            <span class="group-title">
              <q-icon name="water_drop" size="16px" />
              {{ isEn ? 'Sweetness Level' : 'ระดับความหวาน' }}
            </span>
            <span class="group-badge required">{{ isEn ? 'Required 1' : 'เลือก 1 ข้อ' }}</span>
          </div>
          <div class="chip-choice-grid">
            <button
              v-for="lvl in SWEETNESS_OPTIONS"
              :key="lvl"
              type="button"
              class="choice-pill"
              :class="{ active: selectedSweetness === lvl }"
              @click="selectedSweetness = lvl"
            >
              {{ lvl }}
            </button>
          </div>
        </section>

        <!-- Food Spiciness / Flavor Level -->
        <section v-else class="sheet-option-group">
          <div class="group-header">
            <span class="group-title">
              <q-icon name="whatshot" size="16px" />
              {{ isEn ? 'Spice / Flavor Level' : 'ระดับความเผ็ด / รสชาติ' }}
            </span>
            <span class="group-badge required">{{ isEn ? 'Required 1' : 'เลือก 1 ข้อ' }}</span>
          </div>
          <div class="chip-choice-grid">
            <button
              v-for="sp in SPICINESS_OPTIONS"
              :key="sp"
              type="button"
              class="choice-pill"
              :class="{ active: selectedSpiciness === sp }"
              @click="selectedSpiciness = sp"
            >
              {{ sp }}
            </button>
          </div>
        </section>

        <!-- Add-ons / Toppings -->
        <section class="sheet-option-group">
          <div class="group-header">
            <span class="group-title">
              <q-icon name="add_circle_outline" size="16px" />
              {{ isEn ? 'Add-ons & Extras' : 'เพิ่มท็อปปิ้งพิเศษ' }}
            </span>
            <span class="group-badge optional">{{ isEn ? 'Optional' : 'เลือกได้หลายข้อ' }}</span>
          </div>
          <div class="addon-list">
            <button
              v-for="addon in availableAddons"
              :key="addon.id"
              type="button"
              class="addon-row"
              :class="{ selected: isAddonSelected(addon.id) }"
              @click="toggleAddon(addon)"
            >
              <div class="addon-left">
                <span class="addon-check">
                  <q-icon
                    :name="isAddonSelected(addon.id) ? 'check_box' : 'check_box_outline_blank'"
                    size="20px"
                  />
                </span>
                <span class="addon-label">{{ isEn ? addon.labelEn : addon.labelTh }}</span>
              </div>
              <span class="addon-price">+฿{{ addon.price }}</span>
            </button>
          </div>
        </section>

        <!-- Quick Exclusion Tags -->
        <section class="sheet-option-group">
          <div class="group-header">
            <span class="group-title">
              <q-icon name="tune" size="16px" />
              {{ isEn ? 'Preferences / Exclusions' : 'ตัวเลือกเพิ่มเติม (ไม่ใส่ / แยก)' }}
            </span>
            <span class="group-badge optional">{{ isEn ? 'Tap to select' : 'แตะเพื่อเลือก' }}</span>
          </div>
          <div class="chip-choice-grid">
            <button
              v-for="tag in availableExcludedTags"
              :key="tag"
              type="button"
              class="choice-pill outline"
              :class="{ active: selectedExcludedTags.includes(tag) }"
              @click="toggleExcludedTag(tag)"
            >
              <q-icon
                v-if="selectedExcludedTags.includes(tag)"
                name="check"
                size="14px"
                class="q-mr-xs"
              />
              {{ tag }}
            </button>
          </div>
        </section>

        <!-- Special Kitchen Note -->
        <section class="sheet-option-group">
          <div class="group-header">
            <span class="group-title">
              <q-icon name="edit_note" size="16px" />
              {{ isEn ? 'Note to Kitchen' : 'หมายเหตุถึงครัว (ถ้ามี)' }}
            </span>
          </div>
          <input
            v-model="customNote"
            type="text"
            class="sheet-note-input"
            :placeholder="
              isEn
                ? 'e.g., Allergy info, extra crispy, serve last...'
                : 'เช่น แพ้อาหาร, ขอซอสเพิ่ม, ทอดกรอบพิเศษ...'
            "
          />
        </section>
      </div>

      <!-- Sticky Bottom Action Bar -->
      <footer class="sheet-footer">
        <div class="qty-stepper">
          <button
            type="button"
            class="qty-btn"
            :disabled="quantity <= 1"
            @click="quantity = Math.max(1, quantity - 1)"
          >
            <q-icon name="remove" size="18px" />
          </button>
          <span class="qty-value">{{ quantity }}</span>
          <button type="button" class="qty-btn" @click="quantity += 1">
            <q-icon name="add" size="18px" />
          </button>
        </div>

        <button type="button" class="sheet-confirm-btn" @click="handleConfirm">
          <span>{{ isEn ? 'Add to Order' : 'ใส่ตะกร้าสั่งอาหาร' }}</span>
          <span class="confirm-price-pill">฿{{ lineTotalPrice.toFixed(0) }}</span>
        </button>
      </footer>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ProductInterface } from '@/types/product';
import type { MobileAddonOption, MobileCartCustomization } from '@/types/qr-order';
import {
  DRINK_ADDONS,
  DRINK_EXCLUDED_TAGS,
  FOOD_ADDONS,
  FOOD_EXCLUDED_TAGS,
  SPICINESS_OPTIONS,
  SWEETNESS_OPTIONS,
} from '@/stores/qr-order-store';

const props = defineProps<{
  modelValue: boolean;
  product: ProductInterface | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (
    e: 'confirm',
    payload: {
      product: ProductInterface;
      quantity: number;
      customization: MobileCartCustomization;
    },
  ): void;
}>();

const { locale } = useI18n();
const isEn = computed(() => locale.value.startsWith('en'));

const quantity = ref(1);
const selectedSweetness = ref('100% (ปกติ)');
const selectedSpiciness = ref('เผ็ดปกติ');
const selectedAddons = ref<MobileAddonOption[]>([]);
const selectedExcludedTags = ref<string[]>([]);
const customNote = ref('');

const isDrink = computed(() => {
  if (!props.product) return false;
  return props.product.categoryId === 2 || props.product.categoryId === 3;
});

const availableAddons = computed(() => (isDrink.value ? DRINK_ADDONS : FOOD_ADDONS));
const availableExcludedTags = computed(() =>
  isDrink.value ? DRINK_EXCLUDED_TAGS : FOOD_EXCLUDED_TAGS,
);

const addonsTotal = computed(() => selectedAddons.value.reduce((sum, item) => sum + item.price, 0));

const lineTotalPrice = computed(() => {
  if (!props.product) return 0;
  return (props.product.sellingPrice + addonsTotal.value) * quantity.value;
});

watch(
  () => [props.modelValue, props.product],
  ([isOpen]) => {
    if (isOpen) {
      quantity.value = 1;
      selectedSweetness.value = '100% (ปกติ)';
      selectedSpiciness.value = 'เผ็ดปกติ';
      selectedAddons.value = [];
      selectedExcludedTags.value = [];
      customNote.value = '';
    }
  },
);

const isAddonSelected = (id: string): boolean => selectedAddons.value.some((a) => a.id === id);

const toggleAddon = (addon: MobileAddonOption): void => {
  const exists = isAddonSelected(addon.id);
  if (exists) {
    selectedAddons.value = selectedAddons.value.filter((a) => a.id !== addon.id);
  } else {
    selectedAddons.value.push(addon);
  }
};

const toggleExcludedTag = (tag: string): void => {
  const idx = selectedExcludedTags.value.indexOf(tag);
  if (idx >= 0) {
    selectedExcludedTags.value.splice(idx, 1);
  } else {
    selectedExcludedTags.value.push(tag);
  }
};

const handleConfirm = (): void => {
  if (!props.product) return;
  const customization: MobileCartCustomization = {
    ...(isDrink.value
      ? { sweetness: selectedSweetness.value }
      : { spiciness: selectedSpiciness.value }),
    addons: [...selectedAddons.value],
    excludedTags: [...selectedExcludedTags.value],
    note: customNote.value.trim(),
  };

  emit('confirm', {
    product: props.product,
    quantity: quantity.value,
    customization,
  });
  emit('update:modelValue', false);
};
</script>
