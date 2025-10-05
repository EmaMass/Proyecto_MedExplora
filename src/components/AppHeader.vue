<template>
  <header class="header">
    <img :src="logo" alt="Logo UABC" class="app-logo" />  
    <h1>
      MedXplora
    </h1>
    <div class="header-controls">
      <div class="control-btn"></div>
      <div class="control-btn"></div>
      <div class="control-btn"></div>
    </div>
  </header>
</template>

<script setup>
  import logo from '/src/assets/logoUABC.png'
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.app-logo {
  height: 80px;
  width: auto;
}

.app-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #004b23; 
}
</style>