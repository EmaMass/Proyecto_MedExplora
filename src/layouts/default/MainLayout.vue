<template>
  <div class="main-layout">
    <!-- Header UABC -->
    <header class="main-header">
      <div class="header-content">
        <div class="logo-section">
          <img src="/src/assets/logoUABC.png" alt="UABC Logo" class="uabc-logo" />
          <div class="title-section">
            <h1 class="app-title">MedXplora</h1>
            <p class="app-subtitle">Explorador Anatómico Interactivo</p>
          </div>
        </div>
        
        <nav class="main-nav">
          <router-link to="/" class="nav-link" active-class="active">
            <v-icon>mdi-home</v-icon>
            <span>Inicio</span>
          </router-link>
          <router-link to="/admin" class="nav-link" active-class="active">
            <v-icon>mdi-cog</v-icon>
            <span>Admin</span>
          </router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Diagnostics Floating Button -->
    <FloatingDiagnostics v-if="showDiagnostics" @symptoms-changed="handleSymptomsChanged" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import FloatingDiagnostics from '@/components/FloatingDiagnostics.vue'

const route = useRoute()

const showDiagnostics = computed(() => {
  return route.path === '/' || route.path.startsWith('/secciones_cuerpo/')
})

const emit = defineEmits(['symptoms-changed'])

function handleSymptomsChanged(bodyParts) {
  emit('symptoms-changed', bodyParts)
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: var(--uabc-gray-100);
  overflow: hidden;
}

/* HEADER */
.main-header {
  background: linear-gradient(135deg, var(--uabc-green-primary) 0%, var(--uabc-green-dark) 100%);
  box-shadow: var(--shadow-md);
  position: relative;
  z-index: 100;
}

.main-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, 
    var(--uabc-yellow-primary) 0%, 
    var(--uabc-yellow-light) 50%, 
    var(--uabc-yellow-primary) 100%
  );
}

.header-content {
  max-width: 1800px;
  margin: 0 auto;
  padding: var(--space-lg) var(--space-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.uabc-logo {
  height: 64px;
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform var(--transition-normal);
}

.uabc-logo:hover {
  transform: scale(1.05);
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.app-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--uabc-white);
  letter-spacing: -0.5px;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.app-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;
  margin: 0;
  letter-spacing: 0.5px;
}

/* NAVIGATION */
.main-nav {
  display: flex;
  gap: var(--space-sm);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  color: var(--uabc-white);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
  backdrop-filter: blur(10px);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--uabc-yellow-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-link.active {
  background: var(--uabc-yellow-primary);
  border-color: var(--uabc-yellow-primary);
  color: var(--uabc-green-dark);
  font-weight: 600;
}

.nav-link .v-icon {
  font-size: 1.25rem;
}

/* MAIN CONTENT */
.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  background: var(--uabc-gray-100);
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .header-content {
    padding: var(--space-md) var(--space-lg);
  }
  
  .app-title {
    font-size: 1.5rem;
  }
  
  .app-subtitle {
    font-size: 0.75rem;
  }
  
  .uabc-logo {
    height: 48px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-md);
  }
  
  .logo-section {
    gap: var(--space-md);
  }
  
  .main-nav {
    width: 100%;
    justify-content: center;
  }
  
  .nav-link span {
    display: none;
  }
  
  .nav-link {
    flex: 1;
    justify-content: center;
    padding: var(--space-md);
  }
}

@media (max-width: 480px) {
  .app-subtitle {
    display: none;
  }
  
  .uabc-logo {
    height: 40px;
  }
  
  .app-title {
    font-size: 1.25rem;
  }
}
</style>