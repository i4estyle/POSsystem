<template>
  <section class="attendance-location-card">
    <div class="attendance-location-card__map">
      <span class="map-road road-one" />
      <span class="map-road road-two" />
      <span class="map-pin"><q-icon name="location_on" size="27px" /></span>
    </div>
    <div class="attendance-location-card__details">
      <q-icon name="my_location" size="20px" />
      <div>
        <span>{{ title }}</span>
        <strong>{{ address }}</strong>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string; address: string }>();
</script>
