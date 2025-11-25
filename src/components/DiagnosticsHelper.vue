<template>
  <div class="diagnostics-container">
    <!-- Header -->
    <div class="diagnostics-header">
      <div class="header-content">
        <div class="header-icon">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        <div>
          <h2 class="header-title">Asistente de Diagnóstico</h2>
          <p class="header-subtitle">Selecciona tus síntomas para un posible diagnóstico</p>
        </div>
      </div>
      <button class="close-btn" @click="$emit('close')" aria-label="Cerrar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <!-- Content -->
    <div class="diagnostics-content">
      <!-- Buscador -->
      <div class="search-box">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar síntoma..."
          class="search-input"
        />
      </div>

      <!-- Lista de síntomas -->
      <div class="symptoms-section">
        <h3 class="section-title">Síntomas disponibles</h3>
        <div class="symptom-list">
          <label 
            v-for="symptom in filteredSymptoms" 
            :key="symptom.id"
            class="symptom-item"
          >
            <input 
              type="checkbox" 
              :value="symptom.id" 
              v-model="selectedSymptomIds"
              class="symptom-checkbox"
            />
            <span class="symptom-name">{{ symptom.name }}</span>
            <span class="checkmark"></span>
          </label>
        </div>
      </div>

      <!-- Diagnósticos -->
      <div class="diagnoses-section">
        <h3 class="section-title">Posibles Diagnósticos</h3>

        <div v-if="possibleDiseases.length === 0 && selectedSymptomIds.length > 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>No se encontraron diagnósticos claros</p>
          <span>Intenta añadir más síntomas</span>
        </div>

        <div v-else-if="possibleDiseases.length === 0" class="empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
          <p>Selecciona uno o más síntomas para comenzar.</p>
        </div>

        <div v-else class="disease-list">
          <div
            v-for="disease in possibleDiseases"
            :key="disease.id"
            class="disease-card"
            @click="selectedDisease = disease"
          >
            <div class="disease-info">
              <h4 class="disease-name">{{ disease.name }}</h4>
              <div class="disease-match">
                <div class="match-bar">
                  <div class="match-fill" :style="{ width: (disease.score * 100) + '%' }"></div>
                </div>
                <span class="match-text">Coincidencia: {{ Math.round(disease.score * 100) }}%</span>
              </div>
            </div>
            <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalles -->
    <transition name="modal">
      <div v-if="selectedDisease" class="modal-overlay" @click="selectedDisease = null">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ selectedDisease.name }}</h3>
            <button class="modal-close" @click="selectedDisease = null">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div v-if="selectedDisease.image" class="modal-image">
            <img :src="selectedDisease.image" :alt="selectedDisease.name" />
          </div>

          <div class="modal-body">
            <p class="disease-description">{{ selectedDisease.description }}</p>

            <div class="symptoms-associated">
              <h4>Síntomas Asociados:</h4>
              <ul>
                <li v-for="sId in selectedDisease.symptoms" :key="sId">
                  {{ getSymptomNameById(sId) }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { symptoms } from '@/data/symptoms.js'
import { diseases } from '@/data/diseases.js'

const emit = defineEmits(['symptoms-changed', 'close'])

const searchQuery = ref('')
const selectedSymptomIds = ref([])
const selectedDisease = ref(null)

const filteredSymptoms = computed(() => {
  if (!searchQuery.value) {
    return symptoms
  }
  return symptoms.filter(s => 
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

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

watch(selectedSymptomIds, (newIds) => {
  const selected = newIds.map(id => symptoms.find(s => s.id === id))
  const bodyParts = [...new Set(selected.map(s => s.bodyPart))]
  emit('symptoms-changed', bodyParts)
}, { deep: true })

function getSymptomNameById(id) {
  return symptoms.find(s => s.id === id)?.name || 'N/A'
}
</script>

<style scoped>
.diagnostics-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #2b2d31;
}

/* Header */
.diagnostics-header {
  background: #1e1f22;
  color: white;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #3a3c40;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 36px;
  height: 36px;
  background: rgba(37, 99, 235, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon svg {
  width: 20px;
  height: 20px;
  color: #2563eb;
}

.header-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #f3f4f6;
}

.header-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.8125rem;
  color: #9ca3af;
}

.close-btn {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #9ca3af;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f3f4f6;
}

.close-btn svg {
  width: 18px;
  height: 18px;
}

/* Content */
.diagnostics-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Search */
.search-box {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #6b7280;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  background: #1e1f22;
  border: 1px solid #3a3c40;
  border-radius: 8px;
  font-size: 0.9375rem;
  color: #f3f4f6;
  transition: all 0.2s;
}

.search-input::placeholder {
  color: #6b7280;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
  background: #24252a;
}

/* Sections */
.section-title {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.symptoms-section {
  margin-bottom: 2rem;
}

.symptom-list {
  background: #1e1f22;
  border: 1px solid #3a3c40;
  border-radius: 8px;
  padding: 0.25rem;
  max-height: 300px;
  overflow-y: auto;
}

.symptom-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s;
  position: relative;
}

.symptom-item:hover {
  background: #2b2d31;
}

.symptom-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.symptom-name {
  flex: 1;
  margin-left: 2.25rem;
  color: #e5e7eb;
  font-size: 0.9375rem;
}

.checkmark {
  position: absolute;
  left: 1rem;
  height: 18px;
  width: 18px;
  border: 2px solid #4b5563;
  border-radius: 4px;
  transition: all 0.2s;
}

.symptom-checkbox:checked ~ .checkmark {
  background: #2563eb;
  border-color: #2563eb;
}

.symptom-checkbox:checked ~ .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 4px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Diagnoses */
.diagnoses-section {
  margin-bottom: 2rem;
}

.empty-state {
  text-align: center;
  padding: 2.5rem 1.5rem;
  color: #6b7280;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  opacity: 0.4;
}

.empty-state p {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #9ca3af;
}

.empty-state span {
  font-size: 0.875rem;
  color: #6b7280;
}

.disease-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.disease-card {
  background: #1e1f22;
  border: 1px solid #3a3c40;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;
}

.disease-card:hover {
  background: #24252a;
  border-color: #4b5563;
  transform: translateX(4px);
}

.disease-info {
  flex: 1;
}

.disease-name {
  margin: 0 0 0.625rem 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #f3f4f6;
}

.disease-match {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.match-bar {
  height: 5px;
  background: #3a3c40;
  border-radius: 3px;
  overflow: hidden;
  width: 200px;
}

.match-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.match-text {
  font-size: 0.8125rem;
  color: #10b981;
  font-weight: 500;
}

.arrow-icon {
  width: 18px;
  height: 18px;
  color: #6b7280;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.disease-card:hover .arrow-icon {
  transform: translateX(4px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10002;
  padding: 1rem;
}

.modal-content {
  background: #1e1f22;
  border: 1px solid #3a3c40;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #3a3c40;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #f3f4f6;
  font-weight: 600;
}

.modal-close {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #9ca3af;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f3f4f6;
}

.modal-close svg {
  width: 18px;
  height: 18px;
}

.modal-image {
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-body {
  padding: 1.5rem;
}

.disease-description {
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

.symptoms-associated h4 {
  font-size: 0.9375rem;
  color: #f3f4f6;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.symptoms-associated ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.symptoms-associated li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: #d1d5db;
  font-size: 0.9375rem;
}

.symptoms-associated li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #2563eb;
  font-weight: bold;
  font-size: 1.25rem;
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content {
  transform: scale(0.95);
}

.modal-leave-to .modal-content {
  transform: scale(0.95);
}

/* Scrollbar */
.symptom-list::-webkit-scrollbar,
.diagnostics-content::-webkit-scrollbar,
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.symptom-list::-webkit-scrollbar-track,
.diagnostics-content::-webkit-scrollbar-track,
.modal-content::-webkit-scrollbar-track {
  background: #2b2d31;
}

.symptom-list::-webkit-scrollbar-thumb,
.diagnostics-content::-webkit-scrollbar-thumb,
.modal-content::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

.symptom-list::-webkit-scrollbar-thumb:hover,
.diagnostics-content::-webkit-scrollbar-thumb:hover,
.modal-content::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .match-bar {
    width: 150px;
  }
}
</style>