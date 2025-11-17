<template> 
  <div
    style="width: 350px; background: #f5f5f5; overflow-y: auto; border-left: 1px solid #e0e0e0; padding: 24px;"
  >
    <div v-if="isLoading" style="text-align:center; padding-top:40px;">
      <v-progress-circular indeterminate color="primary" size="50" />
      <div class="mt-2" style="color:#666;">Cargando contenido...</div>
    </div>

    <div v-else-if="hasError" style="color: red; text-align: center;">
      Error al cargar contenido.
    </div>

    <template v-else>
      <v-chip :prepend-icon="icon" :color="chipColor" class="mb-3">
        {{ title }}
      </v-chip>

      <h2 class="titulo-panel">
        {{ title }}
      </h2>

      <div v-if="content.image" class="mb-4">
        <v-img :src="content.image" max-width="300" class="rounded-lg elevation-2" />
      </div>

      <div v-html="content.text" style="color: #444; line-height: 1.6; font-size: 14px;" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContent } from '@/api/content'

// props
const props = defineProps({
  sectionKey: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, default: 'mdi-information' },
  chipColor: { type: String, default: 'primary' }
})

// state
const isLoading = ref(true)
const hasError = ref(false)
const content = ref({ text: '', image: '' })

// load backend content
onMounted(async () => {
  try {
    const data = await getContent(props.sectionKey)

    console.log("CMS Response for:", props.sectionKey, data)

    if (data && (data.text || data.image)) {
      content.value = data
      hasError.value = false
    } else {
      hasError.value = true
    }
  } catch (err) {
    console.error(err)
    hasError.value = true
  }

  isLoading.value = false
})
</script>

<style scoped>

.titulo-panel {
  font-size: 24px;
  font-weight: 600;
  margin: 16px 0;
  color: #000 !important;
}

</style>