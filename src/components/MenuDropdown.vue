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
        @click="handleItemClick(item)"
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

const emit = defineEmits(['toggle', 'item-click'])

function handleItemClick(item) {
  emit('item-click', item)
}
</script>

<style scoped>
.dropdown-container {
  margin-bottom: 1rem;
}

.dropdown-button {
  width: 100%;
  padding: 1rem;
  background: var(--bg-secondary, #f5f5f5);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-primary, #333);
  transition: all 0.3s ease;
}

.dropdown-button:hover {
  background: var(--bg-hover, #e8e8e8);
  transform: translateY(-2px);
}

.dropdown-button.active {
  background: var(--primary-color, #4a90e2);
  color: white;
}

.dropdown-arrow {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid currentColor;
  transition: transform 0.3s ease;
}

.dropdown-button.active .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-content {
  margin-top: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  color: var(--text-secondary, #666);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: var(--bg-hover, #f8f9fa);
  color: var(--primary-color, #4a90e2);
  padding-left: 1.25rem;
}

.dropdown-item:active {
  background: var(--bg-active, #e3f2fd);
}

/* Responsive */
@media (max-width: 768px) {
  .dropdown-button {
    padding: 0.875rem;
    font-size: 0.9rem;
  }

  .dropdown-item {
    padding: 0.75rem 1rem;
  }
}
</style>