<template>
  <q-page class="feedback-page">
    <section class="pos-sales-layout feedback-layout">
      <PosSidebarNav @new-order="notifyNewOrder" />
      <main class="pos-main-wrapper feedback-main">
        <PosHeaderBar />

        <section class="feedback-content">
          <header class="feedback-header">
            <div>
              <h1>{{ t('feedback.title') }}</h1>
              <small>{{ t('feedback.subtitle', { branch: currentBranchName }) }}</small>
            </div>
            <div class="header-stats">
              <div class="rating-overview">
                <span class="score">4.8</span>
                <div class="stars">
                  <q-icon v-for="n in 5" :key="n" name="star" size="22px" />
                </div>
              </div>
            </div>
          </header>

          <FeedbackSummaryCards />

          <FeedbackReviewList :reviews="paginatedReviews" @reply="onReplyReview" />

          <!-- Pagination Bar -->
          <div v-if="filteredReviews.length > 0" class="feedback-pagination-container">
            <AppPagination
              v-model:page="currentPage"
              v-model:rows-per-page="itemsPerPage"
              :max-pages="totalPages"
              :showing-from="showingFrom"
              :showing-to="showingTo"
              :total-rows="filteredReviews.length"
            />
          </div>
        </section>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { useSearchState } from '@/composables/use-search-state';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
import AppPagination from '@/components/base/app-pagination.vue';
import FeedbackSummaryCards from '@/components/feedback/feedback-summary-cards.vue';
import FeedbackReviewList, {
  type ReviewItem,
} from '@/components/feedback/feedback-review-list.vue';

const $q = useQuasar();
const { t } = useI18n();
const authStore = useAuthStore();
const { searchQuery } = useSearchState();

const currentBranchName = computed(
  () =>
    authStore.currentUser?.branchName ||
    authStore.currentUser?.branch?.branchName ||
    'Downtown Branch',
);

const itemsPerPage = ref(4);

const getInitialPage = (): number => {
  try {
    const saved = sessionStorage.getItem('pos_feedback_page');
    if (saved) {
      const p = parseInt(saved, 10);
      if (!isNaN(p) && p > 0) return p;
    }
  } catch {
    // Ignore storage parse error
  }
  return 1;
};

const currentPage = ref(getInitialPage());

const reviews: ReviewItem[] = [
  {
    id: 'FB-001',
    customerName: 'คุณกิตติศักดิ์ ม.',
    rating: 5,
    date: '10:15',
    comment:
      'Iced Lavender Latte หอมกลิ่นลาเวนเดอร์มาก หวานกำลังดี บรรยากาศร้านก็นั่งสบาย พนักงานบริการสุภาพรวดเร็วครับ!',
    orderNumber: 'POS-1042',
    orderedItem: 'Iced Lavender Latte',
    isReplied: true,
  },
  {
    id: 'FB-002',
    customerName: 'คุณชนิกานต์ ว.',
    rating: 5,
    date: '09:30',
    comment:
      'Butter Croissant อบใหม่ๆ กรอบนอกนุ่มใน หอมเนยฝรั่งเศสมาก ทานคู่กับ Kyoto Matcha Latte เข้ากันสุดๆ',
    orderNumber: 'POS-1038',
    orderedItem: 'Butter Croissant + Matcha Latte',
    isReplied: false,
  },
  {
    id: 'FB-003',
    customerName: 'คุณธนพล ส.',
    rating: 4,
    date: '15:20',
    comment: 'กาแฟรสชาติดีมากครับ แต่อยากให้เพิ่มโต๊ะนั่งอีกนิดช่วงช่วงบ่ายคนแน่นมาก',
    orderNumber: 'POS-1021',
    orderedItem: 'Americano (Hot)',
    isReplied: true,
  },
  {
    id: 'FB-004',
    customerName: 'คุณปรียาภรณ์ K.',
    rating: 5,
    date: '11:45',
    comment: 'สั่งผ่าน QR Code ที่โต๊ะสะดวกมาก ไม่ต้องยืนรอคิว อาหารและเครื่องดื่มมาไวมากค่ะ',
    orderNumber: 'QR-089',
    orderedItem: 'Avocado Toast + Flat White',
    isReplied: false,
  },
  {
    id: 'FB-005',
    customerName: 'คุณณัฐวุฒิ ช.',
    rating: 5,
    date: '14:10',
    comment: 'Dirty Coffee เข้มข้น นมเย็นเจี๊ยบ กลมกล่อมมากครับ มาซ้ำรอบที่ 3 แล้วในอาทิตย์นี้',
    orderNumber: 'POS-1015',
    orderedItem: 'Dirty Coffee Signature',
    isReplied: true,
  },
  {
    id: 'FB-006',
    customerName: 'คุณศศิธร พ.',
    rating: 4,
    date: '16:05',
    comment: 'เค้กชาไทยอร่อยมาก ไม่หวานเกินไป ชอบบรรยากาศการจัดร้านโทนอบอุ่น ถ่ายรูปสวยค่ะ',
    orderNumber: 'POS-1002',
    orderedItem: 'Thai Tea Layer Cake',
    isReplied: false,
  },
  {
    id: 'FB-007',
    customerName: 'คุณวิศรุต T.',
    rating: 5,
    date: '08:45',
    comment: 'พนักงานยิ้มแย้มต้อนรับดีมากครับ กาแฟดริปเมล็ดเอธิโอเปียหอมฟรุตตี้สดชื่น',
    orderNumber: 'POS-0995',
    orderedItem: 'Ethiopia Hand Drip',
    isReplied: true,
  },
  {
    id: 'FB-008',
    customerName: 'คุณลลิตา อ.',
    rating: 5,
    date: '13:25',
    comment: 'ชอบเมนูช็อกโกแลตเย็นเข้มข้นสะใจ มีปลั๊กและ Wi-Fi ฟรีสำหรับนั่งทำงาน สะดวกสุดๆ',
    orderNumber: 'POS-0988',
    orderedItem: 'Signature Dark Chocolate',
    isReplied: false,
  },
];

const filteredReviews = computed(() =>
  reviews.filter((review) => {
    if (!searchQuery.value) return true;
    const q = searchQuery.value.toLowerCase();
    return (
      review.customerName.toLowerCase().includes(q) ||
      review.comment.toLowerCase().includes(q) ||
      review.orderedItem.toLowerCase().includes(q) ||
      review.orderNumber.toLowerCase().includes(q)
    );
  }),
);

const totalPages = computed(
  () => Math.ceil(filteredReviews.value.length / itemsPerPage.value) || 1,
);

const showingFrom = computed(() => {
  if (filteredReviews.value.length === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage.value + 1;
});

const showingTo = computed(() => {
  if (filteredReviews.value.length === 0) return 0;
  return Math.min(currentPage.value * itemsPerPage.value, filteredReviews.value.length);
});

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredReviews.value.slice(start, start + itemsPerPage.value);
});

// Reset page to 1 when search query changes
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Persist page in sessionStorage
watch(currentPage, (val) => {
  try {
    sessionStorage.setItem('pos_feedback_page', String(val));
  } catch {
    // Ignore storage write error
  }
});

const notifyNewOrder = (): void => {
  $q.notify({ message: t('orders.newOrderPending'), color: 'primary', position: 'top' });
};

const onReplyReview = (review: ReviewItem): void => {
  $q.notify({
    message: t('feedback.replySuccess', { name: review.customerName }),
    color: 'primary',
    position: 'top',
  });
};
</script>
