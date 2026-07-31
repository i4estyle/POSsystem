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
            <button type="button" @click="openAddDialog">
              <span>{{ t('menuPage.addProduct') }}</span>
              <q-icon name="add" size="20px" />
            </button>
          </header>

          <section class="menu-categories">
            <div class="section-heading">
              <h2>{{ t('menuPage.categoriesTitle') }}</h2>
            </div>
            <div class="category-pills">
              <button
                type="button"
                :class="{ active: productStore.selectedCategoryId === null }"
                @click="productStore.selectCategory(null)"
              >
                {{ t('menuPage.categories.all') }}
              </button>
              <button
                v-for="cat in productStore.categories"
                :key="cat.categoryId"
                type="button"
                :class="{ active: productStore.selectedCategoryId === cat.categoryId }"
                @click="productStore.selectCategory(cat.categoryId)"
              >
                {{ cat.categoryName }}
              </button>
            </div>
          </section>

          <section class="menu-products">
            <button type="button" class="add-product-card" @click="openAddDialog">
              <span class="add-icon"><q-icon name="add" size="36px" /></span>
              <strong>{{ t('menuPage.addNewProduct') }}</strong>
              <small>{{ t('menuPage.uploadPhotoSub') }}</small>
            </button>

            <MenuProductCard
              v-for="product in productStore.filteredProducts"
              :key="product.productId"
              :product="product"
              :categories="productStore.categories"
              @edit="openEditDialog"
              @delete="onDeleteProduct"
              @toggle-status="productStore.toggleStatus"
            />
          </section>
        </section>
      </main>
    </section>

    <!-- Menu Form Dialog -->
    <MenuFormDialog
      v-model="showFormModal"
      :product="editingProduct"
      :categories="productStore.categories"
      @save="onSaveProduct"
    />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import type { ProductInterface } from '@/types/product';
import { useProductStore } from '@/stores/product-store';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import MenuProductCard from '@/components/menu/menu-product-card.vue';
import MenuFormDialog from '@/components/menu/menu-form-dialog.vue';

const $q = useQuasar();
const { t } = useI18n();
const productStore = useProductStore();

const showFormModal = ref(false);
const editingProduct = ref<ProductInterface | null>(null);

const openAddDialog = (): void => {
  editingProduct.value = null;
  showFormModal.value = true;
};

const openEditDialog = (prod: ProductInterface): void => {
  editingProduct.value = prod;
  showFormModal.value = true;
};

const onSaveProduct = (
  payload: Omit<ProductInterface, 'productId'> | Partial<ProductInterface>,
): void => {
  if (editingProduct.value) {
    productStore.updateProduct(editingProduct.value.productId, payload);
    $q.notify({
      type: 'positive',
      message: t('settings.saveSuccess'),
      position: 'top',
    });
  } else {
    productStore.addProduct(payload as Omit<ProductInterface, 'productId'>);
    $q.notify({
      type: 'positive',
      message: 'เพิ่มเมนูสินค้าสำเร็จ',
      position: 'top',
    });
  }
};

const onDeleteProduct = (id: number): void => {
  $q.dialog({
    title: t('common.confirm'),
    message: 'ต้องการลบเมนูสินค้านี้ใช่หรือไม่?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    productStore.deleteProduct(id);
    $q.notify({
      type: 'info',
      message: 'ลบเมนูสินค้าเรียบร้อย',
      position: 'top',
    });
  });
};

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};
</script>
