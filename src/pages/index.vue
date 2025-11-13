<template>
  <div class="app-container">
    <AppHeader />

    <main class="main-content">
      <CuerpoHumano :highlightedParts="highlightedBodyParts" />

      <aside class="controls-section">
        <BarraBusqueda v-model="searchTerm" />

        <MenuDropdown
          title="INFORMACIÓN"
          :items="menuData.informacion"
          :isOpen="dropdowns.informacion"
          @toggle="toggleDropdown('informacion')"
        />

        <MenuDropdown
          title="BÚSQUEDA"
          :items="menuData.busqueda"
          :isOpen="dropdowns.busqueda"
          @toggle="toggleDropdown('busqueda')"
        />

        <MenuDropdown
          title="SISTEMAS"
          :items="menuData.sistemas"
          :isOpen="dropdowns.sistemas"
          @toggle="toggleDropdown('sistemas')"
        />

        <MenuDropdown
          title="DIAGNÓSTICOS"
          :items="menuData.diagnosticos"
          :isOpen="dropdowns.diagnosticos"
          @toggle="toggleDropdown('diagnosticos')"
          @item-click="handleDiagnosticsClick"
        />
      </aside>
    </main>

    <!-- Botón flotante de diagnósticos -->
    <FloatingDiagnostics @symptoms-changed="handleSymptomsChanged" />
  </div>
</template>

<script setup>
import AppHeader from '/src/components/AppHeader.vue'
import CuerpoHumano from '/src/components/CuerpoHumano.vue'
import BarraBusqueda from '/src/components/BarraBusqueda.vue'
import MenuDropdown from '/src/components/MenuDropdown.vue'
import FloatingDiagnostics from '@/components/FloatingDiagnostics.vue'

import '/src/styles/medxplora.css'

import { reactive, ref } from 'vue'

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

function handleDiagnosticsClick(item) {
  console.log('Diagnóstico seleccionado:', item)
  // Aquí puedes manejar otros items del menú de diagnósticos si lo necesitas
}

function handleSymptomsChanged(bodyParts) {
  highlightedBodyParts.value = bodyParts
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: var(--bg-primary, #f8f9fa);
}

.main-content {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.controls-section {
  flex: 0 0 320px;
  height: fit-content;
}

@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }

  .controls-section {
    flex: 1;
  }
}
</style>