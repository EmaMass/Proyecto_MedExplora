<template>
  <div class="app-container">
    <AppHeader />

    <main class="main-content">
      <CuerpoHumano />

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
        />
      </aside>
    </main>
  </div>
</template>

<script setup>
import AppHeader from '/src/components/AppHeader.vue'
import CuerpoHumano from '/src/components/CuerpoHumano.vue'
import BarraBusqueda from '/src/components/BarraBusqueda.vue'
import MenuDropdown from '/src/components/MenuDropdown.vue'

import '/src/styles/medxplora.css'

import { reactive, ref } from 'vue'

const searchTerm = ref('')

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
</script>
