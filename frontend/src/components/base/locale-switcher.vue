<template>
  <nav class="locale-switcher" aria-label="Language selection">
    <button
      type="button"
      class="locale-btn"
      :class="{ active: currentLocale === 'th' }"
      @click="setLocale('th')"
    >
      TH
    </button>
    <button
      type="button"
      class="locale-btn"
      :class="{ active: currentLocale === 'en-US' }"
      @click="setLocale('en-US')"
    >
      ENG
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useLocaleSwitcher } from '@/composables/use-locale-switcher';

const { currentLocale, setLocale } = useLocaleSwitcher();
</script>
