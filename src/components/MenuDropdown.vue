<template>
  <div class="menu-dropdown">
    <button class="menu-header" @click="$emit('toggle')" :class="{ active: isOpen }">
      <span>{{ title }}</span>
      <span class="arrow">{{ isOpen ? '▼' : '▶' }}</span>
    </button>

    <transition name="slide">
      <ul v-if="isOpen" class="menu-items">
        <li v-for="(item, index) in items" :key="index" @click="handleItemClick(item)" class="menu-item">
          {{ item }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  items: Array,
  isOpen: Boolean
})

const emit = defineEmits(['toggle', 'item-click'])

function handleItemClick(item) {
  emit('item-click', item)
}
</script>

<style scoped>
.menu-dropdown {
  margin-bottom: 10px;
}

.menu-header {
  width: 100%;
  padding: 12px 16px;
  background-color: #00723F;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  transition: background-color 0.3s;
}

.menu-header:hover {
  background-color: #024731;
}

.menu-header.active {
  border-radius: 6px 6px 0 0;
}

.arrow {
  font-size: 12px;
}

.menu-items {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
}

.menu-item {
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
  font-size: 14px;
  color: #333;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background-color: #E8F4EC;
  color: #00723F;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>