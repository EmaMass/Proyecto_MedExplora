<template>
  <div class="app-container">
    <AppHeader />

    <main class="main-content">
      <!-- Modelo 3D del Cuerpo (oculto cuando se muestran referencias) -->
      <CuerpoHumano 
        v-if="!showReferences" 
        :highlightedParts="highlightedBodyParts" 
      />

      <!-- Panel de Referencias Bibliográficas (exclusivo) -->
      <ReferencesBibliograficas 
        v-if="showReferences"
        @close="closeReferences"
      />

      <aside class="controls-section">
        <BarraBusqueda v-model="searchTerm" />

        <MenuDropdown
          title="INFORMACIÓN"
          :items="menuData.informacion"
          :isOpen="dropdowns.informacion"
          @toggle="toggleDropdown('informacion')"
          @item-click="handleInformacionClick"
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
          title="REFERENCIAS" 
          :items="menuData.referencias"
          :isOpen="dropdowns.referencias"
          @toggle="toggleDropdown('referencias')"
          @item-click="handleReferenciasClick"
        />
      </aside>
    </main>

    <!-- Botón flotante de diagnósticos (oculto cuando se muestran referencias) -->
    <FloatingDiagnostics 
      v-if="!showReferences" 
      @symptoms-changed="handleSymptomsChanged" 
    />

    <!-- Diálogo de Semiología -->
    <v-dialog v-model="showSemiologiaDialog" max-width="1000px">
      <SemiologiaCabezaCuello @close="showSemiologiaDialog = false" />
    </v-dialog>
  </div>
</template>

<script setup>
import AppHeader from '/src/components/AppHeader.vue'
import CuerpoHumano from '/src/components/CuerpoHumano.vue'
import BarraBusqueda from '/src/components/BarraBusqueda.vue'
import MenuDropdown from '/src/components/MenuDropdown.vue'
import FloatingDiagnostics from '@/components/FloatingDiagnostics.vue'
import SemiologiaCabezaCuello from '@/components/info/SemiologiaCabezaCuello.vue'
import ReferencesBibliograficas from '@/components/AccesoBibliografia.vue'

import '/src/styles/medxplora.css'

import { reactive, ref } from 'vue'

const searchTerm = ref('')
const highlightedBodyParts = ref([])
const showSemiologiaDialog = ref(false)
const showReferences = ref(false)

const dropdowns = reactive({
  informacion: false,
  busqueda: false,
  sistemas: false,
  diagnosticos: false,
  referencias: false
})

const menuData = {
  informacion: [
    'Semiología Cabeza',
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
  referencias: [
    'Artículos Médicos',
    'Biblioteca UABC'
  ]
}

function toggleDropdown(menu) {
  for (const key in dropdowns) {
    if (key !== menu) dropdowns[key] = false
  }
  dropdowns[menu] = !dropdowns[menu]
}

function handleMenuItemClick(section, item) {
  if (section === 'informacion' && item === 'Semiología Cabeza') {
    showSemiologiaDialog.value = true
    dropdowns.informacion = false
  } else if (section === 'diagnosticos') {
    console.log('Diagnóstico seleccionado:', item)
  }
}

function handleSymptomsChanged(bodyParts) {
  highlightedBodyParts.value = bodyParts
}

function handleInformacionClick(item) {
  if (item === 'Semiología Cabeza') {
    showSemiologiaDialog.value = true
    dropdowns.informacion = false
  }
}

function handleReferenciasClick(item) {
  console.log('Referencia seleccionada:', item)
  if (item === 'Artículos Médicos' || item === 'Biblioteca UABC') {
    showReferences.value = true
    dropdowns.referencias = false
  }
}

function closeReferences() {
  showReferences.value = false
}
</script>

<style scoped>
/* Asegurar que las transiciones sean suaves */
.main-content {
  position: relative;
}
</style>