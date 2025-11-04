<template>
  <v-app-bar flat>
    <v-app-bar-title>
      <v-icon icon="mdi-circle-slice-6" />
      MedExplora
    </v-app-bar-title>

    <v-list-item to="/">Home</v-list-item>
    <v-list-item title="Información"></v-list-item>
    <v-list-item title="Sistemas"></v-list-item>
    <v-list-item title="Búsqueda"></v-list-item>
    
    <v-list-item title="Diagnósticos" to="/diagnostics"></v-list-item>

  </v-app-bar>
</template>

<script setup>
  
</script>