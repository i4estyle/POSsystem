<template>
  <div class="app-logo" :class="{ 'no-title': !showTitle || !title }">
    <div
      v-if="showImage"
      class="logo-hero-card"
      :style="{
        width: typeof imageWidth === 'number' ? imageWidth + 'px' : imageWidth || imageSize + 'px',
        height: typeof imageHeight === 'number' ? imageHeight + 'px' : imageHeight || '150px',
      }"
    >
      <div class="image-stage">
        <img :src="iconSrc" class="logo-icon-img" alt="App Logo" />
      </div>
      <div v-if="subtitle" class="logo-card-subtitle">
        <q-icon name="storefront" size="13px" class="branch-icon" />
        <span class="branch-text">{{ subtitle }}</span>
      </div>
    </div>

    <div v-if="showTitle && title" class="logo-text-block">
      <div class="brand-title" :style="{ fontSize: size + 'px' }">
        {{ title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    size?: number;
    iconSrc?: string;
    showImage?: boolean;
    showTitle?: boolean;
    imageSize?: number;
    imageWidth?: number | string;
    imageHeight?: number | string;
  }>(),
  {
    title: 'i4estyle POS',
    subtitle: '',
    size: 18,
    iconSrc: '/favicon.ico',
    showImage: true,
    showTitle: true,
    imageSize: 100,
    imageWidth: '',
    imageHeight: '',
  },
);
</script>

<style scoped lang="scss">
.app-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;

  &.no-title {
    flex-direction: column;
    align-items: center;
    gap: 0;
  }

  .logo-hero-card {
    border-radius: 16px;
    background: linear-gradient(145deg, #ffffff 0%, #f9f9fb 100%);
    border: 1.5px solid #e4e4e7;
    box-shadow:
      0px 10px 25px -5px rgba(0, 0, 0, 0.06),
      0px 4px 10px -2px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    flex-shrink: 0;
    padding: 10px;
    box-sizing: border-box;
    transition:
      transform 0.25s cubic-bezier(0.34, 1.25, 0.64, 1),
      box-shadow 0.25s ease,
      border-color 0.25s ease;

    .image-stage {
      width: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      overflow: hidden;

      .logo-icon-img {
        width: 100%;
        height: 100%;
        max-height: 105px;
        object-fit: contain;
        image-rendering: -webkit-optimize-contrast;
        filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.08));
        transition: transform 0.25s ease;
      }
    }

    .logo-card-subtitle {
      font-family: 'Sarabun', sans-serif;
      font-size: 11.5px;
      font-weight: 700;
      color: #4a3e68;
      background: #f4f0ff;
      border: 1px solid #e8e0fe;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      width: 100%;
      padding: 4px 8px;
      box-sizing: border-box;
      margin-top: 6px;

      .branch-icon {
        color: #635880;
      }

      .branch-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  &:hover .logo-hero-card {
    transform: translateY(-2px) scale(1.02);
    border-color: #d4d4d8;
    box-shadow:
      0px 14px 30px -5px rgba(99, 88, 128, 0.12),
      0px 6px 14px -2px rgba(0, 0, 0, 0.06);

    .logo-icon-img {
      transform: scale(1.04);
    }
  }

  .logo-text-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;

    .brand-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-weight: 800;
      color: #18181b;
      line-height: 1.2;
      letter-spacing: -0.2px;
    }
  }
}
</style>
