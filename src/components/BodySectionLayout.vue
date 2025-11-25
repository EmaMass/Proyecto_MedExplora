<template>
  <div class="body-section-layout">
    <!-- Canvas 3D Container -->
    <div class="canvas-container">
      <slot name="canvas"></slot>
      
      <!-- Controls Overlay -->
      <div class="controls-info">
        <div class="controls-title">
          <v-icon size="small">mdi-information</v-icon>
          <span>Controles</span>
        </div>
        <div class="control-item">
          <v-icon size="small">mdi-cursor-move</v-icon>
          <span>Arrastrar para rotar</span>
        </div>
        <div class="control-item">
          <v-icon size="small">mdi-mouse</v-icon>
          <span>Rueda para zoom</span>
        </div>
        <div class="control-item">
          <v-icon size="small">mdi-cursor-default-click</v-icon>
          <span>Click para seleccionar</span>
        </div>
      </div>
      
      <!-- Reset Camera Button -->
      <v-btn
        icon
        size="small"
        class="reset-camera-btn"
        elevation="2"
        color="uabc-yellow"
        @click="$emit('reset-camera')"
      >
        <v-icon>mdi-camera-retake</v-icon>
      </v-btn>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-overlay">
        <v-progress-circular
          indeterminate
          size="64"
          width="4"
          color="uabc-green"
        />
        <p class="loading-text">Cargando modelo 3D...</p>
      </div>
      
      <!-- Error State -->
      <div v-if="error" class="error-overlay">
        <v-icon size="64" color="error">mdi-alert-circle-outline</v-icon>
        <p class="error-text">{{ error }}</p>
        <v-btn
          variant="outlined"
          color="error"
          @click="$emit('retry')"
        >
          Reintentar
        </v-btn>
      </div>
    </div>
    
    <!-- Information Panel -->
    <aside class="info-panel">
      <div class="panel-header" :style="{ background: headerColor }">
        <div class="header-content">
          <v-icon size="large" color="white">{{ icon }}</v-icon>
          <div class="header-text">
            <h2 class="section-title">{{ title }}</h2>
            <p class="section-subtitle">{{ subtitle }}</p>
          </div>
        </div>
        <v-btn
          icon
          size="small"
          variant="text"
          color="white"
          @click="$emit('go-back')"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </div>
      
      <div class="panel-content">
        <slot name="content">
          <PanelContenidoCuerpo
            :sectionKey="sectionKey"
            :title="title"
            :chipColor="chipColor"
          />
        </slot>
      </div>
    </aside>
  </div>
</template>

<script setup>
import PanelContenidoCuerpo from './PanelContenidoCuerpo.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  headerColor: {
    type: String,
    default: 'linear-gradient(135deg, var(--uabc-green-primary), var(--uabc-green-dark))'
  },
  sectionKey: {
    type: String,
    required: true
  },
  chipColor: {
    type: String,
    default: 'primary'
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['reset-camera', 'go-back', 'retry'])
</script>

<style scoped>
.body-section-layout {
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--uabc-gray-100);
  position: relative;
  overflow: hidden;
}

/* CANVAS CONTAINER */
.canvas-container {
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #1a1d23 0%, #2d3436 100%);
  overflow: hidden;
}

/* CONTROLS INFO OVERLAY */
.controls-info {
  position: absolute;
  top: var(--space-lg);
  left: var(--space-lg);
  background: rgba(0, 114, 63, 0.95);
  backdrop-filter: blur(10px);
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(221, 149, 0, 0.3);
  box-shadow: var(--shadow-lg);
  color: var(--uabc-white);
  z-index: 10;
  animation: fadeIn 0.4s ease-out;
}

.controls-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: var(--space-sm);
  color: var(--uabc-yellow-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.control-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.8125rem;
  margin: var(--space-xs) 0;
  padding: var(--space-xs) 0;
  opacity: 0.95;
}

.control-item .v-icon {
  opacity: 0.8;
}

/* RESET CAMERA BUTTON */
.reset-camera-btn {
  position: absolute;
  bottom: var(--space-lg);
  right: var(--space-lg);
  z-index: 10;
  background: var(--uabc-yellow-primary) !important;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
}

.reset-camera-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--shadow-xl);
}

/* LOADING OVERLAY */
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 50;
  animation: fadeIn 0.3s ease-out;
}

.loading-text {
  margin-top: var(--space-lg);
  color: var(--uabc-white);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* ERROR OVERLAY */
.error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  padding: var(--space-2xl);
  text-align: center;
  z-index: 50;
  animation: fadeIn 0.3s ease-out;
}

.error-text {
  color: var(--uabc-white);
  font-size: 1rem;
  max-width: 400px;
  line-height: 1.6;
}

/* INFO PANEL */
.info-panel {
  width: clamp(320px, 30vw, 480px);
  display: flex;
  flex-direction: column;
  background: var(--uabc-white);
  box-shadow: var(--shadow-xl);
  position: relative;
  z-index: 5;
  animation: slideInRight 0.4s ease-out;
}

.panel-header {
  padding: var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  box-shadow: var(--shadow-sm);
  position: relative;
}

.panel-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--uabc-yellow-primary);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex: 1;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--uabc-white);
  margin: 0;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--uabc-white);
}

/* RESPONSIVE DESIGN */
@media (max-width: 1200px) {
  .info-panel {
    width: 400px;
  }
}

@media (max-width: 1024px) {
  .body-section-layout {
    flex-direction: column;
  }
  
  .canvas-container {
    height: 60%;
  }
  
  .info-panel {
    width: 100%;
    height: 40%;
  }
  
  .controls-info {
    top: var(--space-md);
    left: var(--space-md);
    padding: var(--space-sm) var(--space-md);
  }
  
  .reset-camera-btn {
    bottom: var(--space-md);
    right: var(--space-md);
  }
}

@media (max-width: 768px) {
  .canvas-container {
    height: 50%;
  }
  
  .info-panel {
    height: 50%;
  }
  
  .controls-info {
    font-size: 0.75rem;
    padding: var(--space-sm);
  }
  
  .control-item {
    font-size: 0.75rem;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .section-subtitle {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .controls-info {
    top: var(--space-sm);
    left: var(--space-sm);
    right: auto;
  }
  
  .control-item span {
    display: none;
  }
  
  .panel-header {
    padding: var(--space-md);
  }
}
</style>