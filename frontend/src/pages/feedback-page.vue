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

          <FeedbackReviewList :reviews="filteredReviews" @reply="onReplyReview" />
        </section>
      </main>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth-store';
import { useSearchState } from '@/composables/use-search-state';
import PosSidebarNav from '@/components/pos/pos-sidebar-nav.vue';
import PosHeaderBar from '@/components/pos/pos-header-bar.vue';
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
