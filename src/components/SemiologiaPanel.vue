<template>
  <div class="semiologia-panel">
    <v-card class="semiologia-card" elevation="0">
      <v-tabs v-model="tab" bg-color="uabc-green" color="uabc-yellow" show-arrows>
        <v-tab value="cabeza">Cabeza</v-tab>
        <v-tab value="cara">Cara</v-tab>
        <v-tab value="ojos">Ojos</v-tab>
        <v-tab value="oidos">Oídos</v-tab>
        <v-tab value="nariz">Nariz</v-tab>
        <v-tab value="boca">Boca</v-tab>
        <v-tab value="cuello">Cuello</v-tab>
      </v-tabs>

      <v-window v-model="tab" class="semiologia-window">
        <!-- CABEZA -->
        <v-window-item value="cabeza">
          <div class="semiologia-content">
            <div v-if="isLoading" class="loading-state">
              <v-progress-circular indeterminate color="uabc-green" />
              <p>Cargando contenido...</p>
            </div>
            
            <div v-else-if="content.cabeza.image" class="content-image-container">
              <v-img 
                :src="content.cabeza.image" 
                cover 
                class="section-image"
                eager
              />
            </div>

            <div class="content-text-container">
              <h3 class="section-title">Inspección</h3>
              <ul class="info-list">
                <li><b>Tamaño y forma:</b> Normocefalia, braquicefalia, dolicocefalia, micro/macrocefalia.</li>
                <li><b>Simetría:</b> Craneal y proporción facial.</li>
                <li><b>Piel:</b> Color, cicatrices, lesiones, descamación.</li>
                <li><b>Cabello:</b> Implantación, textura, color, alopecia.</li>
              </ul>
              
              <h3 class="section-title">Palpación</h3>
              <ul class="info-list">
                <li><b>Cráneo:</b> Depresiones, prominencias, dolor.</li>
                <li><b>Cuero cabelludo:</b> Adherencias, movilidad, sensibilidad.</li>
              </ul>
              
              <div v-if="content.cabeza.text" v-html="content.cabeza.text" class="cms-content"></div>
            </div>
          </div>
        </v-window-item>

        <!-- CARA -->
        <v-window-item value="cara">
          <div class="semiologia-content">
            <div v-if="content.cara.image" class="content-image-container">
              <v-img :src="content.cara.image" cover class="section-image" eager />
            </div>

            <div class="content-text-container">
              <h3 class="section-title">Inspección</h3>
              <ul class="info-list">
                <li><b>Simetría:</b> Facial y expresión.</li>
                <li><b>Facies:</b> Hipocrática, cushingoide, parkinsoniana, mixedematosa.</li>
              </ul>
              
              <h3 class="section-title">Palpación y Percusión</h3>
              <ul class="info-list">
                <li>Senos frontales y maxilares (dolor).</li>
                <li>Articulación temporomandibular (chasquidos).</li>
              </ul>
              
              <h3 class="section-title">Pares Craneales</h3>
              <ul class="info-list">
                <li><b>V (Trigémino):</b> Sensibilidad facial, masticación.</li>
                <li><b>VII (Facial):</b> Movimientos faciales, sonrisa.</li>
              </ul>
              
              <div v-if="content.cara.text" v-html="content.cara.text" class="cms-content"></div>
            </div>
          </div>
        </v-window-item>

        <!-- OJOS -->
        <v-window-item value="ojos">
          <div class="semiologia-content">
            <div v-if="content.ojos.image" class="content-image-container">
              <v-img :src="content.ojos.image" cover class="section-image" eager />
            </div>

            <div class="content-text-container">
              <h3 class="section-title">Inspección</h3>
              <ul class="info-list">
                <li><b>Alineación:</b> Exoftalmos, estrabismo.</li>
                <li><b>Párpados:</b> Ptosis, edema, lesiones.</li>
                <li><b>Pupilas:</b> Tamaño, forma, simetría.</li>
              </ul>
              
              <h3 class="section-title">Maniobras</h3>
              <ul class="info-list">
                <li>Reflejo fotomotor directo y consensual.</li>
                <li>Movimientos oculares extrínsecos (en H).</li>
              </ul>
              
              <h3 class="section-title">Pares Craneales</h3>
              <ul class="info-list">
                <li><b>II (Óptico):</b> Agudeza visual, campo visual.</li>
                <li><b>III, IV, VI:</b> Movimientos oculares.</li>
              </ul>
              
              <div v-if="content.ojos.text" v-html="content.ojos.text" class="cms-content"></div>
            </div>
          </div>
        </v-window-item>

        <!-- OIDOS -->
        <v-window-item value="oidos">
          <div class="semiologia-content">
            <div v-if="content.oidos.image" class="content-image-container">
              <v-img :src="content.oidos.image" cover class="section-image" eager />
            </div>

            <div class="content-text-container">
              <h3 class="section-title">Inspección (con Otoscopía)</h3>
              <ul class="info-list">
                <li><b>Pabellón auricular:</b> Forma, implantación.</li>
                <li><b>Conducto auditivo:</b> Cerumen, secreción.</li>
                <li><b>Tímpano:</b> Color, integridad.</li>
              </ul>
              
              <h3 class="section-title">Palpación y Maniobras</h3>
              <ul class="info-list">
                <li>Dolor en trago y mastoides.</li>
                <li>Tracción del pabellón (Otitis externa).</li>
                <li>Pruebas: Rinne y Weber.</li>
              </ul>
              
              <h3 class="section-title">Par Craneal</h3>
              <ul class="info-list">
                <li><b>VIII (Vestibulococlear):</b> Audición y equilibrio.</li>
              </ul>
              
              <div v-if="content.oidos.text" v-html="content.oidos.text" class="cms-content"></div>
            </div>
          </div>
        </v-window-item>

        <!-- NARIZ -->
        <v-window-item value="nariz">
          <div class="semiologia-content">
            <div v-if="content.nariz.image" class="content-image-container">
              <v-img :src="content.nariz.image" cover class="section-image" eager />
            </div>

            <div class="content-text-container">
              <h3 class="section-title">Inspección</h3>
              <ul class="info-list">
                <li>Forma externa, desviación del tabique.</li>
                <li><b>Mucosa nasal:</b> Color, secreciones, pólipos.</li>
              </ul>
              
              <h3 class="section-title">Palpación y Maniobras</h3>
              <ul class="info-list">
                <li>Dolor en senos frontales y maxilares.</li>
                <li>Transiluminación de senos.</li>
              </ul>
              
              <h3 class="section-title">Par Craneal</h3>
              <ul class="info-list">
                <li><b>I (Olfatorio):</b> Oler sustancias no irritantes.</li>
              </ul>
              
              <div v-if="content.nariz.text" v-html="content.nariz.text" class="cms-content"></div>
            </div>
          </div>
        </v-window-item>

        <!-- BOCA -->
        <v-window-item value="boca">
          <div class="semiologia-content">
            <div class="content-text-container">
              <h3 class="section-title">Inspección</h3>
              <ul class="info-list">
                <li>Labios, mucosa oral, lengua, dientes, encías.</li>
                <li><b>Amígdalas:</b> Color, tamaño, exudado.</li>
                <li><b>Paladar y úvula:</b> Movilidad.</li>
              </ul>
              
              <h3 class="section-title">Palpación y Maniobras</h3>
              <ul class="info-list">
                <li><b>Lengua:</b> Nódulos, induración.</li>
                <li>Reflejo nauseoso (Guttmann).</li>
              </ul>
              
              <h3 class="section-title">Pares Craneales</h3>
              <ul class="info-list">
                <li><b>IX (Glosofaríngeo):</b> Reflejo nauseoso, gusto posterior.</li>
                <li><b>X (Vago):</b> Movilidad del paladar, voz.</li>
                <li><b>XII (Hipogloso):</b> Movimientos de la lengua.</li>
              </ul>
              
              <div v-if="content.boca.text" v-html="content.boca.text" class="cms-content"></div>
            </div>
          </div>
        </v-window-item>

        <!-- CUELLO -->
        <v-window-item value="cuello">
          <div class="semiologia-content">
            <div v-if="content.cuello.image" class="content-image-container">
              <v-img :src="content.cuello.image" cover class="section-image" eager />
            </div>

            <div class="content-text-container">
              <h3 class="section-title">Inspección</h3>
              <ul class="info-list">
                <li>Simetría, masas, deformidades.</li>
                <li>Piel: Cicatrices, pulsaciones anómalas.</li>
              </ul>
              
              <h3 class="section-title">Palpación</h3>
              <ul class="info-list">
                <li><b>Ganglios linfáticos:</b> Tamaño, consistencia, dolor.</li>
                <li><b>Tiroides:</b> Tamaño, nódulos, movilidad con deglución.</li>
                <li><b>Tráquea:</b> Centración.</li>
              </ul>
              
              <h3 class="section-title">Auscultación</h3>
              <ul class="info-list">
                <li><b>Arterias carótidas:</b> Soplos.</li>
              </ul>
              
              <h3 class="section-title">Par Craneal</h3>
              <ul class="info-list">
                <li><b>XI (Accesorio):</b> Movimiento del trapecio.</li>
              </ul>
              
              <div v-if="content.cuello.text" v-html="content.cuello.text" class="cms-content"></div>
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

const tab = ref('cabeza')
const isLoading = ref(true)
const content = ref({
  cabeza: { text: '', image: '' },
  cara: { text: '', image: '' },
  ojos: { text: '', image: '' },
  oidos: { text: '', image: '' },
  nariz: { text: '', image: '' },
  boca: { text: '', image: '' },
  cuello: { text: '', image: '' }
})

onMounted(async () => {
  await loadAllContent()
})

async function loadAllContent() {
  isLoading.value = true
  
  const sections = ['cabeza', 'cara', 'ojos', 'oidos', 'nariz', 'boca', 'cuello']
  
  for (const section of sections) {
    try {
      const key = `semiologia_${props.sectionKey}_${section}`
      const data = await getContent(key)
      if (data) {
        content.value[section] = data
      }
    } catch (error) {
      console.error(`Error cargando ${section}:`, error)
    }
  }
  
  isLoading.value = false
}
</script>

<style scoped>
.semiologia-panel {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.semiologia-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--uabc-white);
}

.semiologia-window {
  flex: 1;
  overflow-y: auto;
}

.semiologia-content {
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

.content-image-container {
  margin-bottom: var(--space-lg);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 2px solid var(--uabc-yellow-primary);
}

.section-image {
  width: 100%;
  max-height: 300px;
}

.content-text-container {
  color: var(--uabc-gray-900);
}

.section-title {
  color: var(--uabc-green-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin: var(--space-lg) 0 var(--space-md) 0;
  padding-bottom: var(--space-xs);
  border-bottom: 2px solid var(--uabc-yellow-primary);
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-md) 0;
}

.info-list li {
  padding: var(--space-sm) 0 var(--space-sm) var(--space-lg);
  position: relative;
  line-height: 1.6;
  font-size: 0.9375rem;
}

.info-list li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--uabc-green-primary);
  font-weight: bold;
}

.info-list li b {
  color: var(--uabc-green-dark);
  font-weight: 600;
}

.cms-content {
  margin-top: var(--space-lg);
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
  margin: var(--space-md) 0 var(--space-sm) 0;
}

:deep(.cms-content p) {
  margin: var(--space-sm) 0;
}

:deep(.cms-content ul) {
  margin: var(--space-sm) 0;
  padding-left: var(--space-xl);
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
  .semiologia-content {
    padding: var(--space-md);
  }

  .section-title {
    font-size: 1rem;
  }

  .info-list li {
    font-size: 0.875rem;
  }
}
</style>