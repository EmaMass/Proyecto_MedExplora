<template>
  <div class="cms-panel">
    <!-- Loading State -->
    <div v-if="isLoading" class="panel-state loading-state">
      <div class="state-content">
        <v-progress-circular
          indeterminate
          color="uabc-green"
          size="48"
          width="4"
        />
        <p class="state-text">Cargando contenido...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="panel-state error-state">
      <div class="state-content">
        <v-icon size="64" color="warning">mdi-information-outline</v-icon>
        <p class="state-title">Contenido no disponible</p>
        <p class="state-description">
          No hay información registrada para <strong>{{ title }}</strong>
        </p>
        <v-chip size="small" color="uabc-gray" variant="outlined" class="mt-2">
          {{ sectionKey }}
        </v-chip>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="panel-content">
      <!-- Image Section -->
      <div v-if="content.image" class="content-image">
        <div class="image-wrapper">
          <img 
            :src="content.image" 
            :alt="`Imagen de ${title}`"
            loading="lazy"
            @error="handleImageError"
          />
          <div class="image-overlay">
            <v-chip color="uabc-green" size="small" class="image-tag">
              <v-icon start size="small">mdi-image</v-icon>
              {{ title }}
            </v-chip>
          </div>
        </div>
      </div>

      <!-- Text Content -->
      <div class="content-text">
        <div v-html="content.text" class="formatted-content"></div>
      </div>

      <!-- Empty Content Message -->
      <div v-if="!content.text && !content.image" class="empty-content">
        <v-icon size="48" color="grey-lighten-1">mdi-file-document-outline</v-icon>
        <p>No hay contenido disponible</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContent } from '@/api/content'

const props = defineProps({
  sectionKey: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  chipColor: {
    type: String,
    default: 'primary'
  }
})

const isLoading = ref(true)
const hasError = ref(false)
const content = ref({ text: '', image: '' })
const imageError = ref(false)

onMounted(async () => {
  await fetchContent()
})

async function fetchContent() {
  isLoading.value = true
  hasError.value = false

  try {
    const data = await getContent(props.sectionKey)
    
    if (data && (data.text || data.image)) {
      content.value = data
      hasError.value = false
    } else {
      hasError.value = true
    }
  } catch (error) {
    console.error('Error fetching CMS content:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

function handleImageError() {
  imageError.value = true
}
</script>

<style scoped>
.cms-panel {
  width: 100%;
  height: 100%;
  background: var(--uabc-white);
  overflow-y: auto;
  overflow-x: hidden;
}

/* STATES */
.panel-state {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
}

.state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  text-align: center;
  max-width: 400px;
  animation: fadeIn 0.4s ease-out;
}

.loading-state .state-text {
  color: var(--uabc-gray-700);
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

.error-state .state-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--uabc-gray-900);
  margin: 0;
}

.error-state .state-description {
  font-size: 0.9375rem;
  color: var(--uabc-gray-700);
  line-height: 1.6;
  margin: var(--space-sm) 0 0 0;
}

/* CONTENT */
.panel-content {
  width: 100%;
  min-height: 100%;
  animation: fadeIn 0.4s ease-out;
}

/* IMAGE SECTION */
.content-image {
  width: 100%;
  padding: var(--space-xl);
  background: linear-gradient(180deg, var(--uabc-gray-100) 0%, var(--uabc-white) 100%);
}

.image-wrapper {
  position: relative;
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 3px solid var(--uabc-yellow-primary);
  background: var(--uabc-gray-200);
  aspect-ratio: 16 / 9;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--transition-slow);
}

.image-wrapper:hover img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  z-index: 2;
}

.image-tag {
  backdrop-filter: blur(10px);
  background: rgba(0, 114, 63, 0.95) !important;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* TEXT CONTENT */
.content-text {
  padding: var(--space-xl) var(--space-2xl);
}

.formatted-content {
  color: var(--uabc-gray-900);
  font-size: 1rem;
  line-height: 1.8;
  font-weight: 400;
}

/* Formatted content styles */
:deep(.formatted-content) {
  h1, h2, h3, h4, h5, h6 {
    color: var(--uabc-green-primary);
    font-weight: 600;
    margin: var(--space-xl) 0 var(--space-md) 0;
    line-height: 1.3;
  }

  h1 { font-size: 2rem; }
  h2 { font-size: 1.75rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }
  h5 { font-size: 1.125rem; }
  h6 { font-size: 1rem; }

  p {
    margin: var(--space-md) 0;
    text-align: justify;
  }

  strong, b {
    color: var(--uabc-green-dark);
    font-weight: 600;
  }

  em, i {
    font-style: italic;
    color: var(--uabc-gray-700);
  }

  a {
    color: var(--uabc-green-primary);
    text-decoration: none;
    border-bottom: 1px solid var(--uabc-yellow-primary);
    transition: all var(--transition-fast);
  }

  a:hover {
    color: var(--uabc-yellow-dark);
    border-bottom-color: var(--uabc-green-primary);
  }

  ul, ol {
    margin: var(--space-lg) 0;
    padding-left: var(--space-2xl);
  }

  li {
    margin: var(--space-sm) 0;
    line-height: 1.6;
  }

  ul li::marker {
    color: var(--uabc-green-primary);
  }

  ol li::marker {
    color: var(--uabc-yellow-primary);
    font-weight: 600;
  }

  blockquote {
    margin: var(--space-lg) 0;
    padding: var(--space-md) var(--space-xl);
    border-left: 4px solid var(--uabc-yellow-primary);
    background: linear-gradient(90deg, var(--uabc-gray-100), transparent);
    font-style: italic;
    color: var(--uabc-gray-700);
  }

  code {
    background: var(--uabc-gray-200);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-family: 'Courier New', monospace;
    font-size: 0.875rem;
    color: var(--uabc-green-dark);
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    margin: var(--space-lg) 0;
    box-shadow: var(--shadow-md);
  }

  iframe {
    width: 100%;
    min-height: 400px;
    border-radius: var(--radius-md);
    margin: var(--space-lg) 0;
    border: none;
    box-shadow: var(--shadow-md);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--space-lg) 0;
    box-shadow: var(--shadow-sm);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  th, td {
    padding: var(--space-md);
    text-align: left;
    border-bottom: 1px solid var(--uabc-gray-300);
  }

  th {
    background: var(--uabc-green-primary);
    color: var(--uabc-white);
    font-weight: 600;
  }

  tr:hover {
    background: var(--uabc-gray-100);
  }
}

/* EMPTY CONTENT */
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-2xl);
  color: var(--uabc-gray-700);
  text-align: center;
  min-height: 300px;
}

.empty-content p {
  font-size: 1rem;
  margin: 0;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .content-image {
    padding: var(--space-lg);
  }

  .content-text {
    padding: var(--space-lg) var(--space-xl);
  }
}

@media (max-width: 768px) {
  .content-image {
    padding: var(--space-md);
  }

  .content-text {
    padding: var(--space-md) var(--space-lg);
  }

  .formatted-content {
    font-size: 0.9375rem;
  }

  :deep(.formatted-content) {
    h1 { font-size: 1.75rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
    h4 { font-size: 1.125rem; }
  }
}

@media (max-width: 480px) {
  .content-text {
    padding: var(--space-sm) var(--space-md);
  }

  .formatted-content {
    font-size: 0.875rem;
  }
}
</style>