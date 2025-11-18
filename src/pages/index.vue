<template>
  <div class="home-view">
    <div class="content-grid">
      <!-- Canvas 3D Section -->
      <section class="model-section">
        <CuerpoHumano 
          :highlighted="highlightedBodyParts"
          class="model-viewer"
        />
      </section>

      <!-- Controls Panel -->
      <aside class="controls-panel">
        <div class="panel-inner">
          <!-- Search Bar -->
          <div class="search-section fade-in">
            <BarraBusqueda v-model="searchTerm" />
          </div>

          <!-- Menu Sections -->
          <div class="menus-container">
            <MenuDropdown
              title="INFORMACIÓN"
              :items="menuData.informacion"
              :isOpen="dropdowns.informacion"
              @toggle="toggleDropdown('informacion')"
              @item-click="handleMenuClick"
              class="slide-in"
              style="animation-delay: 0.1s"
            />

            <MenuDropdown
              title="BÚSQUEDA"
              :items="menuData.busqueda"
              :isOpen="dropdowns.busqueda"
              @toggle="toggleDropdown('busqueda')"
              @item-click="handleMenuClick"
              class="slide-in"
              style="animation-delay: 0.2s"
            />

            <MenuDropdown
              title="SISTEMAS"
              :items="menuData.sistemas"
              :isOpen="dropdowns.sistemas"
              @toggle="toggleDropdown('sistemas')"
              @item-click="handleMenuClick"
              class="slide-in"
              style="animation-delay: 0.3s"
            />

            <MenuDropdown
              title="DIAGNÓSTICOS"
              :items="menuData.diagnosticos"
              :isOpen="dropdowns.diagnosticos"
              @toggle="toggleDropdown('diagnosticos')"
              @item-click="handleDiagnosticsClick"
              class="slide-in"
              style="animation-delay: 0.4s"
            />
          </div>

          <!-- Quick Stats -->
          <div class="stats-section slide-in" style="animation-delay: 0.5s">
            <div class="stat-card">
              <v-icon color="uabc-green">mdi-human-male</v-icon>
              <div class="stat-info">
                <span class="stat-value">4</span>
                <span class="stat-label">Secciones</span>
              </div>
            </div>
            <div class="stat-card">
              <v-icon color="uabc-yellow">mdi-heart-pulse</v-icon>
              <div class="stat-info">
                <span class="stat-value">10+</span>
                <span class="stat-label">Sistemas</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Floating Diagnostics -->
    <FloatingDiagnostics @symptoms-changed="handleSymptomsChanged" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import CuerpoHumano from '@/components/CuerpoHumano.vue'
import BarraBusqueda from '@/components/BarraBusqueda.vue'
import MenuDropdown from '@/components/MenuDropdown.vue'
import FloatingDiagnostics from '@/components/FloatingDiagnostics.vue'

const searchTerm = ref('')
const highlightedBodyParts = ref([])

const dropdowns = reactive({
  informacion: false,
  busqueda: false,
  sistemas: false,
  diagnosticos: false
})

const menuData = {
  informacion: [
    'Anatomía Básica',
    'Fisiología',
    'Patología',
    'Farmacología',
    'Medicina Interna'
  ],
  busqueda: [
    'Por Síntomas',
    'Por Órgano',
    'Por Sistema',
    'Por Enfermedad',
    'Por Medicamento'
  ],
  sistemas: [
    'Sistema Cardiovascular',
    'Sistema Respiratorio',
    'Sistema Digestivo',
    'Sistema Nervioso',
    'Sistema Endocrino',
    'Sistema Inmunológico'
  ],
  diagnosticos: [
    'Diagnóstico Diferencial',
    'Pruebas de Laboratorio',
    'Estudios de Imagen',
    'Examen Físico',
    'Historia Clínica'
  ]
}

function toggleDropdown(menu) {
  for (const key in dropdowns) {
    if (key !== menu) dropdowns[key] = false
  }
  dropdowns[menu] = !dropdowns[menu]
}

function handleMenuClick(item) {
  console.log('Menu item clicked:', item)
}

function handleDiagnosticsClick(item) {
  console.log('Diagnostics item clicked:', item)
}

function handleSymptomsChanged(bodyParts) {
  highlightedBodyParts.value = bodyParts
}
</script>

<style scoped>
.home-view {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: var(--uabc-gray-100);
}

.content-grid {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

/* MODEL SECTION */
.model-section {
  flex: 1;
  position: relative;
  background: linear-gradient(135deg, #1a1d23 0%, #2d3436 100%);
  overflow: hidden;
}

.model-viewer {
  width: 100%;
  height: 100%;
}

/* CONTROLS PANEL */
.controls-panel {
  width: clamp(320px, 25vw, 420px);
  height: 100%;
  background: var(--uabc-white);
  box-shadow: var(--shadow-xl);
  position: relative;
  z-index: 10;
  overflow: hidden;
}

.panel-inner {
  height: 100%;
  overflow-y: auto;
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* SEARCH SECTION */
.search-section {
  position: sticky;
  top: 0;
  background: var(--uabc-white);
  padding: var(--space-sm) 0;
  z-index: 10;
}

/* MENUS CONTAINER */
.menus-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* STATS SECTION */
.stats-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  margin-top: auto;
  padding-top: var(--space-lg);
}

.stat-card {
  background: linear-gradient(135deg, var(--uabc-green-primary) 0%, var(--uabc-green-light) 100%);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  color: var(--uabc-white);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-card .v-icon {
  font-size: 2rem;
  opacity: 0.9;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-top: var(--space-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* RESPONSIVE DESIGN */
@media (max-width: 1200px) {
  .controls-panel {
    width: 360px;
  }
}

@media (max-width: 1024px) {
  .content-grid {
    flex-direction: column;
  }

  .model-section {
    height: 60%;
  }

  .controls-panel {
    width: 100%;
    height: 40%;
  }

  .panel-inner {
    padding: var(--space-lg);
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .model-section {
    height: 50%;
  }

  .controls-panel {
    height: 50%;
  }

  .panel-inner {
    padding: var(--space-md);
    gap: var(--space-md);
  }

  .stat-card {
    padding: var(--space-md);
  }

  .stat-value {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .panel-inner {
    padding: var(--space-sm);
  }

  .stats-section {
    grid-template-columns: 1fr;
  }
}
</style>