<template>
  <div class="dropdown-container">
    <button
      class="dropdown-button"
      :class="{ active: isOpen }"
      @click="$emit('toggle')"
    >
      {{ title }}
      <div class="dropdown-arrow"></div>
    </button>

    <div class="dropdown-content" v-if="isOpen">
      <div
        class="dropdown-item"
        v-for="item in items"
        :key="item"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  items: Array,
  isOpen: Boolean
})

defineEmits(['toggle'])
</script>
