<template>
  <div class="reviews-list">
    <div v-for="review in reviews" :key="review.id" class="review-card">
      <div class="review-top">
        <div class="reviewer-info">
          <div class="avatar">{{ review.customerName.charAt(0) }}</div>
          <div>
            <strong>{{ review.customerName }}</strong>
            <div class="review-date">{{ review.date }}</div>
          </div>
        </div>
        <div class="star-rating">
          <q-icon
            v-for="n in 5"
            :key="n"
            :name="n <= review.rating ? 'star' : 'star_outline'"
            size="20px"
          />
        </div>
      </div>

      <div class="review-comment">
        {{ review.comment }}
      </div>

      <div class="review-footer">
        <span class="order-tag">Order #{{ review.orderNumber }} — {{ review.orderedItem }}</span>
        <button type="button" class="reply-btn" @click="$emit('reply', review)">
          <q-icon name="reply" size="16px" />
          <span>{{ review.isReplied ? t('feedback.viewReply') : t('feedback.reply') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  orderNumber: string;
  orderedItem: string;
  isReplied: boolean;
}

defineProps<{
  reviews: ReviewItem[];
}>();

defineEmits<{
  (e: 'reply', review: ReviewItem): void;
}>();
</script>
