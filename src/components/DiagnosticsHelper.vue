<template>
  <v-card flat>
    <v-card-title>Asistente de Diagnóstico</v-card-title>
    <v-card-subtitle>Selecciona tus síntomas para un posible diagnóstico</v-card-subtitle>

    <v-card-text>
      <v-text-field
        v-model="searchQuery"
        label="Buscar síntoma..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        class="mb-4"
      ></v-text-field>

      <v-list class="symptom-list">
        <v-list-item 
          v-for="symptom in filteredSymptoms" 
          :key="symptom.id"
        >
          <template v-slot:prepend>
            <v-checkbox-btn v-model="selectedSymptomIds" :value="symptom.id"></v-checkbox-btn>
          </template>
          <v-list-item-title>{{ symptom.name }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider class="my-4"></v-divider>

      <h3 class="mb-2">Posibles Diagnósticos</h3>

      <div v-if="possibleDiseases.length === 0 && selectedSymptomIds.length > 0">
        <p>No se encontraron diagnósticos claros. Intenta añadir más síntomas.</p>
      </div>
      <div v-else-if="possibleDiseases.length === 0">
         <p>Selecciona uno o más síntomas para comenzar.</p>
      </div>

      <v-list v-else lines="two">
        <v-list-item
          v-for="disease in possibleDiseases"
          :key="disease.id"
          @click="selectedDisease = disease"
        >
          <v-list-item-title>{{ disease.name }}</v-list-item-title>
          <v-list-item-subtitle>
            Coincidencia: {{ Math.round(disease.score * 100) }}%
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-dialog v-model="isDialogVisible" max-width="600">
        <v-card v-if="selectedDisease">

          <v-img
            :src="selectedDisease.image"
            height="250px"
            cover
          ></v-img>

          <v-card-title class="text-h5">{{ selectedDisease.name }}</v-card-title>
          <v-card-text>
            <p class="mb-4">{{ selectedDisease.description }}</p>

            <h4 class="mt-4">Síntomas Asociados:</h4>
            <ul>
              <li v-for="sId in selectedDisease.symptoms" :key="sId">
                {{ getSymptomNameById(sId) }}
              </li>
            </ul>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="isDialogVisible = false">
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
// Importamos nuestra "base de datos"
import { symptoms } from '@/data/symptoms.js'
import { diseases } from '@/data/diseases.js'

const emit = defineEmits(['symptoms-changed'])

// --- Estado de la Búsqueda ---
const searchQuery = ref('')
const selectedSymptomIds = ref([]) // Array de IDs, ej: ['s1', 's5']
const selectedDisease = ref(null)

// Esta variable será el v-model de nuestro diálogo
const isDialogVisible = computed({
  // GET: El diálogo se muestra si "selectedDisease" tiene algo
  get: () => !!selectedDisease.value,

  // SET: Si el diálogo se cierra (por cualquier motivo),
  // "selectedDisease" se limpia y vuelve a "null".
  set: (val) => {
    if (!val) {
      selectedDisease.value = null
    }
  }
})

// --- Lógica de Filtro y Búsqueda ---

// Filtra la lista de síntomas basada en la búsqueda
const filteredSymptoms = computed(() => {
  if (!searchQuery.value) {
    return symptoms
  }
  return symptoms.filter(s => 
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// El "motor" de diagnóstico. Calcula las coincidencias.
const possibleDiseases = computed(() => {
  if (selectedSymptomIds.value.length === 0) {
    return []
  }

  return diseases
    .map(disease => {
      const matchCount = disease.symptoms.filter(sId => 
        selectedSymptomIds.value.includes(sId)
      ).length

      const score = matchCount / selectedSymptomIds.value.length

      return { ...disease, score, matchCount }
    })
    .filter(disease => disease.matchCount > 0)
    .sort((a, b) => b.score - a.score)
})

// --- Comunicación con el Modelo 3D ---
watch(selectedSymptomIds, (newIds) => {
  const selected = newIds.map(id => symptoms.find(s => s.id === id))
  const bodyParts = [...new Set(selected.map(s => s.bodyPart))]
  emit('symptoms-changed', bodyParts)
}, { deep: true })


// --- Utilidad ---
function getSymptomNameById(id) {
  return symptoms.find(s => s.id === id)?.name || 'N/A'
}
</script>

<style scoped>
.symptom-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>