<template>
  <div class="editor-wrapper">

    <!-- TOOLBAR -->
    <div v-if="editor" class="toolbar">

      <v-btn
        class="toolbar-btn"
        :class="{ 'is-active': editor?.isActive('bold') }"
        size="small"
        @click="editor.chain().focus().toggleBold().run()"
        >
        B
        </v-btn>

      <v-btn
        class="toolbar-btn"
        :class="{ 'is-active': editor?.isActive('italic') }"
        size="small"
        @click="editor.chain().focus().toggleItalic().run()"
        >
        I
        </v-btn>

      <v-btn
        class="toolbar-btn"
        :class="{ 'is-active': editor?.isActive('underline') }"
        size="small"
        @click="editor.chain().focus().toggleUnderline().run()"
        >
        U
        </v-btn>



      <v-btn size="small" @click="editor.chain().focus().toggleBulletList().run()">• Lista</v-btn>

      <v-btn size="small" @click="editor.chain().focus().toggleOrderedList().run()">1. Lista</v-btn>

      <v-btn size="small" @click="addImage">Imagen</v-btn>

      <v-btn size="small" @click="insertVideo">Video</v-btn>
    </div>

    <!-- EDITOR -->
    <EditorContent :editor="editor" class="editor-area" />
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Iframe } from '@/extensions/Iframe.js'

const props = defineProps({
  modelValue: String,
  page: String,
})

const emit = defineEmits(["update:modelValue"])

const editor = ref(null)

onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue || "",
    extensions: [
      StarterKit.configure({
        bulletList: true,
        orderedList: true
      }),
      Underline,
      Link,
      Image,
      Iframe,
    ],

    onUpdate({ editor }) {
      emit("update:modelValue", editor.getHTML())
    }
  })
})

/// --- 🚨 PARTE CRUCIAL: ACTUALIZAR EL EDITOR SI CAMBIA modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && newValue !== editor.value.getHTML()) {
      editor.value.commands.setContent(newValue || "")
    }
  }
)

onBeforeUnmount(() => {
  if (editor.value) editor.value.destroy()
})


// --- IMAGEN
const addImage = () => {
  const url = prompt("URL de la imagen:")
  if (url) editor.value.chain().focus().setImage({ src: url }).run()
}

// --- VIDEO
const insertVideo = () => {
  const url = prompt("Pega el link de YouTube:")
  if (!url) return

  const embed = url.replace("watch?v=", "embed/")

  editor.value.commands.insertContent(`
    <iframe src="${embed}" width="560" height="315"></iframe>
  `)
}
</script>


<style>
/* --- WRAPPER --- */
.editor-wrapper {
  background: white;
  border-radius: 12px;
  padding: 18px;
  border: 1px solid #d0d0d0;
}

/* --- TOOLBAR --- */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

/* --- AREA QUE CONTIENE ProseMirror --- */
.editor-area {
  background: white;
  border: 1px solid #cccccc;
  border-radius: 8px;
  min-height: 280px;
  padding: 0 !important; /* Evita doble padding */
  overflow: hidden;
}

/* --- TEXTO INTERNO DE TIPTAP --- */
.ProseMirror {
  padding: 18px !important;   /* 👈 FIX REAL: AQUI SE ALINEA PERFECTO */
  margin: 0 !important;
  min-height: 250px;
  box-sizing: border-box;

  background: white !important;
  color: black !important;
  caret-color: black !important;

  line-height: 1.6;
  outline: none !important;
  border-radius: 8px;
}

/* Imagenes y videos */
.ProseMirror img {
  max-width: 100%;
  display: block;
  margin: 12px 0;
}

.ProseMirror iframe {
  width: 100%;
  min-height: 300px;
  margin: 12px 0;
  border-radius: 8px;
  border: none;
}

/* ================================
   ESTILOS DE BOTONES DE TOOLBAR
   ================================ */

.toolbar-btn {
  background: #f4f4f4 !important;
  border: 1px solid #d0d0d0 !important;
  color: black !important;
  min-width: 32px !important;
  height: 32px !important;
  font-weight: bold;
  text-transform: none !important;
}

/* Estado ACTIVO */
.toolbar-btn.is-active,
.toolbar-btn.is-active .v-btn__content {
  background: #000 !important;
  border-color: #000 !important;
  color: #fff !important;
}

/* ================================
   LISTAS — ESTILO PROFESIONAL
   ================================ */

/* Alineación general */
.ProseMirror ul,
.ProseMirror ol {
  margin: 0 0 0 1.2rem !important;   /* Alineadas sin salirse del borde */
  padding-left: 1.1rem !important;
}

/* Espaciado entre ítems */
.ProseMirror li {
  margin: 4px 0 !important;
  line-height: 1.55;
  padding-left: 4px; /* Hace que el texto no quede pegado al bullet */
}

/* Listas anidadas */
.ProseMirror li > ul,
.ProseMirror li > ol {
  margin-left: 1rem !important;
}

/* UL (•) estilo Notion */
.ProseMirror ul {
  list-style-type: disc !important;
}

.ProseMirror ul ul {
  list-style-type: circle !important;
}

.ProseMirror ul ul ul {
  list-style-type: square !important;
}

/* OL estilo moderno */
.ProseMirror ol {
  list-style-type: decimal !important;
}

.ProseMirror ol ol {
  list-style-type: lower-alpha !important;
}

.ProseMirror ol ol ol {
  list-style-type: lower-roman !important;
}

/* Evita que la primera línea tenga espacio arriba */
.ProseMirror > *:first-child {
  margin-top: 0 !important;
}

/* Espaciado elegante entre párrafos y listas */
.ProseMirror p + ul,
.ProseMirror p + ol,
.ProseMirror ul + p,
.ProseMirror ol + p {
  margin-top: 6px !important;
}

/* Cuando hay listas consecutivas */
.ProseMirror ul + ul,
.ProseMirror ol + ol {
  margin-top: 2px !important;
}

/* --- FORZAR TEXTO NEGRO SIN ROMPER EL ESTILO --- */
.ProseMirror,
.ProseMirror * {
  color: black !important;
  caret-color: black !important;
}

</style>

