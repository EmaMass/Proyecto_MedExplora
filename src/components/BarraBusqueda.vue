<template>
  <div class="search-container">
    <input
      class="search-input"
      placeholder="Buscar"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div class="search-icon"></div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.search-container {
  display: flex;
  align-items: center;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.search-input:focus {
  border-color: #1976d2;
}

.search-icon {
  position: absolute;
  right: 10px;
  width: 16px;
  height: 16px;
  background-color: #1976d2;
  mask: url('https://cdn-icons-png.flaticon.com/512/622/622669.png') no-repeat center;
  mask-size: contain;
}
</style>
