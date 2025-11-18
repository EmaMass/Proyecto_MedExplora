<template> 
  <div class="cms-panel-container">
    <div v-if="isLoading" class="d-flex flex-column align-center justify-center fill-height">
      <v-progress-circular indeterminate color="#00723F" size="40" />
      <div class="mt-3 text-caption text-grey">Recuperando datos...</div>
    </div>

    <div v-else-if="hasError" class="d-flex flex-column align-center justify-center fill-height text-center pa-4">
      <v-icon color="error" size="40" class="mb-2">mdi-database-off</v-icon>
      <div class="text-body-2 text-grey-darken-1">
        No hay información registrada para: <br>
        <strong>{{ title }}</strong>
      </div>
      <div class="text-caption text-grey mt-2">Clave: {{ sectionKey }}</div>
    </div>

    <template v-else>
      <div class="content-scroll-area">
        <div v-if="content.image" class="image-wrapper mb-4">
          <v-img 
            :src="content.image" 
            cover
            aspect-ratio="1.7"
            class="rounded-lg elevation-2"
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height bg-grey-lighten-3">
                <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
              </div>
            </template>
          </v-img>
        </div>

        <div class="text-content">
          <div v-html="content.text" class="formatted-text" />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContent } from '@/api/content'

const props = defineProps({
  sectionKey: { type: String, required: true },
  title: { type: String, required: true },
  chipColor: { type: String, default: 'primary' }
})

const isLoading = ref(true)
const hasError = ref(false)
const content = ref({ text: '', image: '' })

onMounted(async () => {
  isLoading.value = true
  try {
    // Llamada al Backend MongoDB
    const data = await getContent(props.sectionKey)
    
    if (data && (data.text || data.image)) {
      content.value = data
      hasError.value = false
    } else {
      // Si no hay datos en BD, mostramos error o data dummy para demo
      hasError.value = true
    }
  } catch (err) {
    console.error("Error fetching CMS data:", err)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.cms-panel-container {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.content-scroll-area {
  padding: 20px;
  overflow-y: auto;
  height: 100%;
}

.image-wrapper {
  width: 100%;
  border: 2px solid #DD9500; /* Borde dorado UABC */
  border-radius: 10px;
  padding: 2px;
}

.formatted-text {
  color: #333;
  line-height: 1.8;
  font-size: 0.95rem;
  text-align: justify;
}

/* Estilos para el HTML inyectado desde el CMS */
:deep(.formatted-text h3) {
  color: #00723F;
  margin-bottom: 8px;
  font-weight: 600;
}
:deep(.formatted-text p) {
  margin-bottom: 12px;
}
</style>