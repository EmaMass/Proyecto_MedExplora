<template>
  <v-container class="pa-4">
    <h1 class="text-h5 mb-4">Panel de Administración CMS</h1>

    <v-select
      v-model="selectedPage"
      :items="pages"
      label="Selecciona página a editar"
      class="mb-4"
    ></v-select>

    <v-card>
      <v-card-title>Editor de Contenido</v-card-title>
      <v-card-text>
        <QuillEditor
          v-model:content="editorContent"
          content-type="html"
          theme="snow"
          placeholder="Escribe el contenido aquí..."
          style="height: 250px;"
        />
        <v-text-field
          v-model="imageUrl"
          label="URL de imagen (opcional)"
          class="mt-4"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="saveContent">Guardar</v-btn>
        <v-btn color="secondary" @click="loadContent">Cargar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { getContent, updateContent } from '@/api/content'

const selectedPage = ref('brazos')
const pages = ['brazos', 'piernas', 'torso', 'cabeza']

const editorContent = ref('')
const imageUrl = ref('')

const loadContent = async () => {
  try {
    const data = await getContent(selectedPage.value)
    editorContent.value = data.text || ''
    imageUrl.value = data.image || ''
    console.log('Cargado:', data)
  } catch (err) {
    console.error('Error cargando contenido:', err)
    alert('Error cargando contenido')
  }
}

const saveContent = async () => {
  try {
    const payload = { text: editorContent.value, image: imageUrl.value }
    const res = await updateContent(selectedPage.value, payload)
    console.log('Guardado:', res)
    alert(`Contenido de "${selectedPage.value}" guardado correctamente`)
  } catch (err) {
    console.error('Error guardando contenido:', err)
    alert('Error al guardar contenido')
  }
}

// Recarga el contenido cada vez que se cambia la página del selector
watch(selectedPage, loadContent, { immediate: true })
</script>

<style>
.ql-container.ql-snow {
  background-color: white !important;
  border-radius: 8px;
  color: black !important;
}

.ql-editor {
  background-color: white !important;
  color: black !important;
  min-height: 250px;
  padding: 12px !important;
}

.ql-toolbar.ql-snow {
  background-color: #f5f5f5 !important;
  border: 1px solid #ddd !important;
  border-radius: 8px 8px 0 0 !important;
}

.ql-editor.ql-blank::before {
  color: #999 !important;
  opacity: 1 !important;
}

.v-card-text {
  background-color: #fafafa;
}
</style>

