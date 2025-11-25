<template>
  <div class="inspecciones-panel">
    <v-card class="inspecciones-card" elevation="0">
      <v-tabs v-model="tab" bg-color="uabc-green" color="uabc-yellow" show-arrows>
        <v-tab value="inspeccion">Inspección General</v-tab>
        <v-tab value="palpacion">Palpación</v-tab>
        <v-tab value="auscultacion">Auscultación</v-tab>
        <v-tab value="percusion">Percusión</v-tab>
      </v-tabs>

      <v-window v-model="tab" class="inspecciones-window">
        <!-- INSPECCIÓN GENERAL -->
        <v-window-item value="inspeccion">
          <div class="inspeccion-content">
            <div v-if="isLoading" class="loading-state">
              <v-progress-circular indeterminate color="uabc-green" />
              <p>Cargando contenido...</p>
            </div>

            <div v-else>
              <div class="video-container" v-if="content.inspeccion.video">
                <iframe
                  :src="getEmbedUrl(content.inspeccion.video)"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  class="inspection-video"
                ></iframe>
              </div>

              <div class="content-text-container">
                <h3 class="section-title">
                  <v-icon color="uabc-green" size="small">mdi-eye-outline</v-icon>
                  Inspección General
                </h3>
                
                <div class="info-card">
                  <h4>Objetivo</h4>
                  <p>Observación sistemática de la región para identificar características visibles y anormalidades.</p>
                </div>

                <div class="info-card">
                  <h4>Técnica</h4>
                  <ul class="technique-list">
                    <li>Paciente en posición cómoda con buena iluminación</li>
                    <li>Observación de simetría y proporciones</li>
                    <li>Evaluación del color y textura de la piel</li>
                    <li>Identificación de lesiones, masas o deformidades</li>
                  </ul>
                </div>

                <div class="info-card">
                  <h4>Aspectos a Evaluar</h4>
                  <ul class="technique-list">
                    <li><b>Forma y tamaño:</b> Proporciones normales vs anormales</li>
                    <li><b>Simetría:</b> Comparación bilateral</li>
                    <li><b>Piel:</b> Color, lesiones, cicatrices, edema</li>
                    <li><b>Movimientos:</b> Espontáneos y provocados</li>
                  </ul>
                </div>

                <div v-if="content.inspeccion.text" v-html="content.inspeccion.text" class="cms-content"></div>
              </div>
            </div>
          </div>
        </v-window-item>

        <!-- PALPACIÓN -->
        <v-window-item value="palpacion">
          <div class="inspeccion-content">
            <div class="video-container" v-if="content.palpacion.video">
              <iframe
                :src="getEmbedUrl(content.palpacion.video)"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="inspection-video"
              ></iframe>
            </div>

            <div class="content-text-container">
              <h3 class="section-title">
                <v-icon color="uabc-green" size="small">mdi-hand-back-right-outline</v-icon>
                Palpación
              </h3>
              
              <div class="info-card">
                <h4>Objetivo</h4>
                <p>Examinar mediante el tacto para identificar características de los tejidos, órganos y estructuras.</p>
              </div>

              <div class="info-card">
                <h4>Técnica</h4>
                <ul class="technique-list">
                  <li>Manos limpias y tibias</li>
                  <li>Iniciar con palpación superficial</li>
                  <li>Progresar a palpación profunda según necesidad</li>
                  <li>Observar expresión del paciente durante el examen</li>
                </ul>
              </div>

              <div class="info-card">
                <h4>Aspectos a Evaluar</h4>
                <ul class="technique-list">
                  <li><b>Temperatura:</b> Local y comparativa</li>
                  <li><b>Textura:</b> Superficie y consistencia</li>
                  <li><b>Sensibilidad:</b> Dolor, puntos dolorosos</li>
                  <li><b>Movilidad:</b> De estructuras palpables</li>
                  <li><b>Masas:</b> Tamaño, forma, consistencia, movilidad</li>
                </ul>
              </div>

              <div v-if="content.palpacion.text" v-html="content.palpacion.text" class="cms-content"></div>
            </div>
          </div>
        </v-window-item>

        <!-- AUSCULTACIÓN -->
        <v-window-item value="auscultacion">
          <div class="inspeccion-content">
            <div class="video-container" v-if="content.auscultacion.video">
              <iframe
                :src="getEmbedUrl(content.auscultacion.video)"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="inspection-video"
              ></iframe>
            </div>

            <div class="content-text-container">
              <h3 class="section-title">
                <v-icon color="uabc-green" size="small">mdi-stethoscope</v-icon>
                Auscultación
              </h3>
              
              <div class="info-card">
                <h4>Objetivo</h4>
                <p>Escuchar sonidos producidos por el cuerpo para evaluar el funcionamiento de órganos y detectar anormalidades.</p>
              </div>

              <div class="info-card">
                <h4>Técnica</h4>
                <ul class="technique-list">
                  <li>Ambiente silencioso</li>
                  <li>Estetoscopio adecuado (campana vs diafragma)</li>
                  <li>Colocación correcta sobre la piel</li>
                  <li>Exploración sistemática de puntos clave</li>
                </ul>
              </div>

              <div class="info-card">
                <h4>Aspectos a Evaluar</h4>
                <ul class="technique-list">
                  <li><b>Vasos sanguíneos:</b> Soplos, flujo</li>
                  <li><b>Articulaciones:</b> Crepitaciones, roces</li>
                  <li><b>Glándula tiroides:</b> Soplos vasculares</li>
                  <li><b>Frecuencia y calidad:</b> De los sonidos escuchados</li>
                </ul>
              </div>

              <div v-if="content.auscultacion.text" v-html="content.auscultacion.text" class="cms-content"></div>
            </div>
          </div>
        </v-window-item>

        <!-- PERCUSIÓN -->
        <v-window-item value="percusion">
          <div class="inspeccion-content">
            <div class="video-container" v-if="content.percusion.video">
              <iframe
                :src="getEmbedUrl(content.percusion.video)"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="inspection-video"
              ></iframe>
            </div>

            <div class="content-text-container">
              <h3 class="section-title">
                <v-icon color="uabc-green" size="small">mdi-hand-pointing-right</v-icon>
                Percusión
              </h3>
              
              <div class="info-card">
                <h4>Objetivo</h4>
                <p>Golpear la superficie corporal para producir sonidos que ayuden a determinar la densidad de estructuras subyacentes.</p>
              </div>

              <div class="info-card">
                <h4>Técnica</h4>
                <ul class="technique-list">
                  <li>Dedo plesímetro firmemente sobre la piel</li>
                  <li>Golpes cortos y secos con dedo percusor</li>
                  <li>Movimiento de muñeca, no de brazo</li>
                  <li>Comparación simétrica bilateral</li>
                </ul>
              </div>

              <div class="info-card">
                <h4>Tipos de Sonidos</h4>
                <ul class="technique-list">
                  <li><b>Resonante:</b> Normal sobre tejido pulmonar</li>
                  <li><b>Mate:</b> Sobre órganos sólidos o líquido</li>
                  <li><b>Timpánico:</b> Sobre estructuras con aire</li>
                  <li><b>Hiperresonante:</b> Sobre aire excesivo</li>
                </ul>
              </div>

              <div class="info-card">
                <h4>Aplicación en Cabeza y Cuello</h4>
                <ul class="technique-list">
                  <li>Senos paranasales (frontal, maxilar)</li>
                  <li>Identificación de dolor localizado</li>
                  <li>Evaluación de ocupación sinusal</li>
                </ul>
              </div>

              <div v-if="content.percusion.text" v-html="content.percusion.text" class="cms-content"></div>
            </div>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContent } from '@/api/content'

const props = defineProps({
  sectionKey: {
    type: String,
    required: true
  }
})

const tab = ref('inspeccion')
const isLoading = ref(true)
const content = ref({
  inspeccion: { text: '', video: '' },
  palpacion: { text: '', video: '' },
  auscultacion: { text: '', video: '' },
  percusion: { text: '', video: '' }
})

onMounted(async () => {
  await loadAllContent()
})

async function loadAllContent() {
  isLoading.value = true
  
  const sections = ['inspeccion', 'palpacion', 'auscultacion', 'percusion']
  
  for (const section of sections) {
    try {
      const key = `inspeccion_${props.sectionKey}_${section}`
      const data = await getContent(key)
      if (data) {
        content.value[section] = {
          text: data.text || '',
          video: data.image || '' // Reutilizamos el campo 'image' para la URL del video
        }
      }
    } catch (error) {
      console.error(`Error cargando ${section}:`, error)
    }
  }
  
  isLoading.value = false
}

function getEmbedUrl(url) {
  if (!url) return ''
  
  // Convertir URL de YouTube a formato embed
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be') 
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0]
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }
  
  // Si ya es una URL embed o de otro servicio, devolverla tal cual
  return url
}
</script>

<style scoped>
.inspecciones-panel {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.inspecciones-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--uabc-white);
}

.inspecciones-window {
  flex: 1;
  overflow-y: auto;
}

.inspeccion-content {
  padding: var(--space-lg);
  animation: fadeIn 0.3s ease-out;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-2xl);
  color: var(--uabc-gray-700);
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  margin-bottom: var(--space-xl);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  border: 3px solid var(--uabc-yellow-primary);
  background: var(--uabc-gray-900);
}

.inspection-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.content-text-container {
  color: var(--uabc-gray-900);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--uabc-green-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 var(--space-lg) 0;
  padding-bottom: var(--space-sm);
  border-bottom: 3px solid var(--uabc-yellow-primary);
}

.info-card {
  background: linear-gradient(135deg, 
    rgba(0, 114, 63, 0.03) 0%, 
    rgba(221, 149, 0, 0.03) 100%
  );
  border-left: 4px solid var(--uabc-green-primary);
  padding: var(--space-md) var(--space-lg);
  margin-bottom: var(--space-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.info-card h4 {
  color: var(--uabc-green-dark);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 var(--space-sm) 0;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.info-card h4::before {
  content: '●';
  color: var(--uabc-yellow-primary);
  font-size: 0.75rem;
}

.info-card p {
  margin: 0;
  line-height: 1.6;
  color: var(--uabc-gray-700);
  font-size: 0.9375rem;
}

.technique-list {
  list-style: none;
  padding: 0;
  margin: var(--space-sm) 0 0 0;
}

.technique-list li {
  padding: var(--space-xs) 0 var(--space-xs) var(--space-lg);
  position: relative;
  line-height: 1.7;
  font-size: 0.9375rem;
  color: var(--uabc-gray-700);
}

.technique-list li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--uabc-green-primary);
  font-weight: bold;
  font-size: 1rem;
}

.technique-list li b {
  color: var(--uabc-green-dark);
  font-weight: 600;
}

.cms-content {
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--uabc-gray-300);
}

:deep(.cms-content) {
  line-height: 1.7;
}

:deep(.cms-content h3) {
  color: var(--uabc-green-primary);
  font-size: 1rem;
  font-weight: 600;
  margin: var(--space-lg) 0 var(--space-sm) 0;
}

:deep(.cms-content p) {
  margin: var(--space-sm) 0;
  color: var(--uabc-gray-700);
}

:deep(.cms-content ul) {
  margin: var(--space-sm) 0;
  padding-left: var(--space-xl);
}

:deep(.cms-content iframe) {
  width: 100%;
  min-height: 315px;
  border-radius: var(--radius-md);
  margin: var(--space-md) 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .inspeccion-content {
    padding: var(--space-md);
  }

  .section-title {
    font-size: 1.125rem;
  }

  .info-card {
    padding: var(--space-sm) var(--space-md);
  }

  .technique-list li {
    font-size: 0.875rem;
  }
}
</style>