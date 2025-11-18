<template>
  <v-container fluid class="fill-height">
    <v-row class="fill-height">

      <v-col cols="12" md="8" class="fill-height d-flex justify-center align-center">
        <CuerpoHumano 
          :highlighted="highlightedParts"
          @part-clicked="onPartClicked" 
        />
      </v-col>

      <v-col cols="12" md="4" class="fill-height" style="overflow-y: auto;">
        
        <DiagnosticsHelper @symptoms-changed="updateHighlightedParts" />

        <v-btn
          v-if="showHeadButton"
          @click="showSemiologiaDialog = true"
          color="primary"
          class="mt-4"
          block
          prepend-icon="mdi-information-outline"
        >
          Ver Semiología de Cabeza
        </v-btn>
        </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="showSemiologiaDialog" max-width="1000px">
    <SemiologiaCabezaCuello @close="showSemiologiaDialog = false" />
  </v-dialog>
  </template>

<script setup>
import { ref } from 'vue' 

// Tus importaciones existentes
import CuerpoHumano from '@/components/CuerpoHumano.vue'
import DiagnosticsHelper from '@/components/DiagnosticsHelper.vue' 

// Importamos el componente de semiología
import SemiologiaCabezaCuello from '@/components/info/SemiologiaCabezaCuello.vue'

// --- Lógica existente ---
const highlightedParts = ref([])
function updateHighlightedParts(parts) {
  highlightedParts.value = parts
}

// --- Lógica NUEVA para el botón y la modal ---
const showHeadButton = ref(false)
const showSemiologiaDialog = ref(false)

// Esta función escucha los clics del modelo 3D
function onPartClicked(partName) {
  if (partName === 'head') {
    showHeadButton.value = true
  } else {
    // Opcional: Oculta el botón si hacen clic en otra parte
    showHeadButton.value = false 
  }
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>