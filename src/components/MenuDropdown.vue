<template>
  <div class="menu-dropdown">
<<<<<<< HEAD
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
=======
    <button
      class="dropdown-trigger"
      :class="{ active: isOpen }"
      @click="$emit('toggle')"
      :aria-expanded="isOpen"
      :aria-label="`Toggle ${title} menu`"
    >
      <span class="trigger-text">{{ title }}</span>
      <v-icon class="trigger-icon" :class="{ rotated: isOpen }">
        mdi-chevron-down
      </v-icon>
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown-content">
        <button
          v-for="(item, index) in items"
          :key="index"
          class="dropdown-item"
          @click="handleItemClick(item)"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <v-icon size="small" class="item-icon">mdi-circle-small</v-icon>
          <span class="item-text">{{ item }}</span>
          <v-icon size="small" class="item-arrow">mdi-chevron-right</v-icon>
        </button>
      </div>
>>>>>>> 9c91e0504505e7abe8cd42eddfe2a3a4f0c26d1a
    </transition>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle', 'item-click'])

function handleItemClick(item) {
  emit('item-click', item)
}
</script>

<style scoped>
.menu-dropdown {
<<<<<<< HEAD
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
=======
  position: relative;
  width: 100%;
}

/* TRIGGER BUTTON */
.dropdown-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  background: linear-gradient(135deg, var(--uabc-green-primary), var(--uabc-green-light));
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  color: var(--uabc-white);
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.dropdown-trigger::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1));
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.dropdown-trigger:hover::before {
  opacity: 1;
}

.dropdown-trigger:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--uabc-yellow-primary);
}

.dropdown-trigger.active {
  background: linear-gradient(135deg, var(--uabc-yellow-primary), var(--uabc-yellow-light));
  color: var(--uabc-green-dark);
  box-shadow: var(--shadow-md);
}

.dropdown-trigger:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.trigger-text {
  flex: 1;
  text-align: left;
  text-transform: uppercase;
}

.trigger-icon {
  transition: transform var(--transition-normal);
  font-size: 1.5rem;
}

.trigger-icon.rotated {
  transform: rotate(180deg);
}

/* DROPDOWN CONTENT */
.dropdown-content {
  margin-top: var(--space-sm);
  background: var(--uabc-white);
  border: 1px solid var(--uabc-gray-300);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  animation: slideDown 0.3s ease-out;
}

/* DROPDOWN ITEMS */
.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--uabc-gray-200);
  color: var(--uabc-gray-700);
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  animation: fadeInItem 0.3s ease-out backwards;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: var(--uabc-yellow-primary);
  transition: width var(--transition-fast);
}

.dropdown-item:hover {
  background: linear-gradient(90deg, 
    rgba(0, 114, 63, 0.05) 0%, 
    transparent 100%
  );
  color: var(--uabc-green-primary);
  padding-left: calc(var(--space-lg) + 4px);
}

.dropdown-item:hover::before {
  width: 4px;
}

.dropdown-item:active {
  background: linear-gradient(90deg, 
    rgba(0, 114, 63, 0.1) 0%, 
    transparent 100%
  );
}

.item-icon {
  color: var(--uabc-green-primary);
  opacity: 0.7;
  transition: all var(--transition-fast);
}

.dropdown-item:hover .item-icon {
  opacity: 1;
  transform: scale(1.2);
}

.item-text {
  flex: 1;
}

.item-arrow {
  opacity: 0;
  transform: translateX(-8px);
  transition: all var(--transition-fast);
  color: var(--uabc-yellow-primary);
}

.dropdown-item:hover .item-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* TRANSITIONS */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* ANIMATIONS */
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

@keyframes fadeInItem {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .dropdown-trigger {
    padding: var(--space-md) var(--space-lg);
    font-size: 0.875rem;
  }

  .dropdown-item {
    padding: var(--space-sm) var(--space-md);
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .dropdown-trigger {
    padding: var(--space-sm) var(--space-md);
  }

  .trigger-text {
    font-size: 0.8125rem;
  }
>>>>>>> 9c91e0504505e7abe8cd42eddfe2a3a4f0c26d1a
}
</style>