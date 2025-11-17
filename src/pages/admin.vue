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

        <EditorAdmin v-model="editorContent" :page="selectedPage" />

      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="saveContent">Guardar</v-btn>
        <v-btn color="secondary" @click="loadContent">Cargar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watch } from "vue";
import { getContent, updateContent } from "@/api/content";
import EditorAdmin from "@/components/EditorAdmin.vue";

const selectedPage = ref("brazos");
const pages = ["brazos", "piernas", "torso", "cabeza"];

const editorContent = ref("");
const imageUrl = ref("");

const loadContent = async () => {
  try {
    const data = await getContent(selectedPage.value);
    editorContent.value = data.text || "";
    imageUrl.value = data.image || "";
    console.log("Cargado:", data);
  } catch (err) {
    console.error("Error cargando contenido:", err);
    alert("Error cargando contenido");
  }
};

const saveContent = async () => {
  try {
    const payload = {
      text: editorContent.value,
      image: imageUrl.value,
    };
    const res = await updateContent(selectedPage.value, payload);
    console.log("Guardado:", res);
    alert(`Contenido de "${selectedPage.value}" guardado correctamente`);
  } catch (err) {
    console.error("Error guardando contenido:", err);
    alert("Error al guardar contenido");
  }
};

watch(selectedPage, loadContent, { immediate: true });
</script>

<style>
.ql-container.ql-snow {
  background-color: white !important;
  border-radius: 8px;
}
</style>
