<template>
  <v-container fluid class="fill-height">
    <v-row class="fill-height">
      <v-col cols="12" md="4" class="fill-height" style="overflow-y: auto;">
        <DiagnosticsHelper @symptoms-changed="updateHighlightedParts" />
      </v-col>

      <v-col cols="12" md="8" class="fill-height d-flex justify-center align-center">
        <CuerpoHumano :highlighted="highlightedParts" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import CuerpoHumano from '@/components/CuerpoHumano.vue'
import DiagnosticsHelper from '@/components/DiagnosticsHelper.vue' // Lo crearemos ahora

const highlightedParts = ref([]) // Ejemplo: ['head', 'torso']

function updateHighlightedParts(parts) {
  highlightedParts.value = parts
}
</script>