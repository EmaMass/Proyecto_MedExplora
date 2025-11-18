<template>
  <div class="app-container">
    <AppHeader />

    <main class="main-content">
      <CuerpoHumano :highlightedParts="highlightedBodyParts" />

      <aside class="controls-section">
        <BarraBusqueda v-model="searchTerm" />

<<<<<<< HEAD
        <MenuDropdown title="INFORMACIÓN" :items="menuData.informacion" :isOpen="dropdowns.informacion"
          @toggle="toggleDropdown('informacion')" @item-click="handleMenuClick" />
=======
        <MenuDropdown
          title="INFORMACIÓN"
          :items="menuData.informacion"
          :isOpen="dropdowns.informacion"
          @toggle="toggleDropdown('informacion')"
          @item-click="handleInformacionClick"
        />
>>>>>>> 9c91e0504505e7abe8cd42eddfe2a3a4f0c26d1a

        <MenuDropdown title="BÚSQUEDA" :items="menuData.busqueda" :isOpen="dropdowns.busqueda"
          @toggle="toggleDropdown('busqueda')" />

        <MenuDropdown title="SISTEMAS" :items="menuData.sistemas" :isOpen="dropdowns.sistemas"
          @toggle="toggleDropdown('sistemas')" />

<<<<<<< HEAD
        <MenuDropdown title="DIAGNÓSTICOS" :items="menuData.diagnosticos" :isOpen="dropdowns.diagnosticos"
          @toggle="toggleDropdown('diagnosticos')" />
=======
        <MenuDropdown
          title="DIAGNÓSTICOS"
          :items="menuData.diagnosticos"
          :isOpen="dropdowns.diagnosticos"
          @toggle="toggleDropdown('diagnosticos')"
          @item-click="handleDiagnosticsClick"
        />
>>>>>>> 9c91e0504505e7abe8cd42eddfe2a3a4f0c26d1a
      </aside>
    </main>

    <!-- Botón flotante de diagnósticos -->
    <FloatingDiagnostics @symptoms-changed="handleSymptomsChanged" />

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
<<<<<<< HEAD
import ReferenciasBibliograficas from '/src/components/ReferenciasBibliograficas.vue'
=======
import FloatingDiagnostics from '@/components/FloatingDiagnostics.vue'
import SemiologiaCabezaCuello from '@/components/info/SemiologiaCabezaCuello.vue'
>>>>>>> 9c91e0504505e7abe8cd42eddfe2a3a4f0c26d1a

import '/src/styles/medxplora.css'

import { reactive, ref } from 'vue'

const searchTerm = ref('')
const highlightedBodyParts = ref([])
const showSemiologiaDialog = ref(false)

const dropdowns = reactive({
  informacion: false,
  busqueda: false,
  sistemas: false,
  diagnosticos: false
})

// En el data/ref
const showReferences = ref(false)

// En menuData
const menuData = {
  informacion: [
    'Semiología Cabeza',
    'Anatomía Básica',
    'Fisiología',
    'Patología',
    'Farmacología',
    'Medicina Interna',
    'Referencias Bibliográficas'
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

<<<<<<< HEAD
// La función handleMenuClick
function handleMenuClick(item) {
  if (item === 'Referencias Bibliográficas') {
    showReferences.value = true
  }
}
</script>
=======
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
  // Verificamos si el item clickeado es el correcto
  if (item === 'Semiología Cabeza') {
    showSemiologiaDialog.value = true // Abre el diálogo
    dropdowns.informacion = false     // Cierra el menú desplegable
  }
}
</script>
>>>>>>> 9c91e0504505e7abe8cd42eddfe2a3a4f0c26d1a
