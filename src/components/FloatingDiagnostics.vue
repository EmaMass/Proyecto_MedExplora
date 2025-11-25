<template>
  <div class="floating-diagnostics">
    <!-- Botón flotante principal -->
    <button 
      class="diagnostics-fab"
      @click="togglePanel"
      :class="{ active: isPanelOpen }"
      aria-label="Asistente de Diagnóstico"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="icon"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    </button>

    <!-- Panel deslizable -->
    <transition name="slide-panel">
      <div v-if="isPanelOpen" class="diagnostics-panel">
        <DiagnosticsHelper 
          @symptoms-changed="handleSymptomsChanged"
          @close="closePanel"
        />
      </div>
    </transition>

    <!-- Overlay oscuro -->
    <transition name="fade">
      <div 
        v-if="isPanelOpen" 
        class="overlay"
        @click="closePanel"
      ></div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DiagnosticsHelper from './DiagnosticsHelper.vue'

const isPanelOpen = ref(false)

const emit = defineEmits(['symptoms-changed'])

function togglePanel() {
  isPanelOpen.value = !isPanelOpen.value
}

function closePanel() {
  isPanelOpen.value = false
}

function handleSymptomsChanged(bodyParts) {
  emit('symptoms-changed', bodyParts)
}
</script>

<style scoped>
.floating-diagnostics {
  position: fixed;
  z-index: 9999;
}

/* Botón flotante */
.diagnostics-fab {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10001;
}

.diagnostics-fab:hover {
  transform: scale(1.08) translateY(-2px);
  box-shadow: 0 10px 28px rgba(37, 99, 235, 0.5);
}

.diagnostics-fab:active {
  transform: scale(0.96);
}

.diagnostics-fab.active {
  background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
}

.diagnostics-fab .icon {
  width: 28px;
  height: 28px;
  color: white;
  transition: transform 0.3s ease;
}

.diagnostics-fab.active .icon {
  transform: rotate(180deg);
}

/* Panel lateral */
.diagnostics-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 450px;
  height: 100vh;
  background: #2b2d31;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  overflow: hidden;
}

/* Overlay oscuro */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  backdrop-filter: blur(2px);
}

/* Animaciones */
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-panel-enter-from {
  transform: translateX(100%);
}

.slide-panel-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .diagnostics-fab {
    width: 56px;
    height: 56px;
    bottom: 20px;
    right: 20px;
  }

  .diagnostics-fab .icon {
    width: 24px;
    height: 24px;
  }

  .diagnostics-panel {
    width: 100%;
  }
}

/* Accesibilidad - efecto de pulso */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  }
  50% {
    box-shadow: 0 6px 28px rgba(37, 99, 235, 0.6), 0 0 0 6px rgba(37, 99, 235, 0.1);
  }
}

.diagnostics-fab:focus-visible {
  animation: pulse 2s infinite;
  outline: none;
}
</style>