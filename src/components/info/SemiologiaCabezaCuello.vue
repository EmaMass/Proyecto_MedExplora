<template>
  <v-card>
    <v-toolbar color="primary" dark>
      <v-toolbar-title>Semiología de Cabeza y Cuello</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-tabs v-model="tab" bg-color="white" color="primary">
      <v-tab value="cabeza">Cabeza</v-tab>
      <v-tab value="cara">Cara</v-tab>
      <v-tab value="ojos">Ojos</v-tab>
      <v-tab value="oidos">Oídos</v-tab>
      <v-tab value="nariz">Nariz</v-tab>
      <v-tab value="boca">Boca</v-tab>
      <v-tab value="cuello">Cuello</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="cabeza">
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="5">
              <v-img :src="imagenCabeza" eager />
            </v-col>
            <v-col cols="12" md="7">
              <h3>Inspección</h3>
              <ul>
                <li><b>Tamaño y forma:</b> Normocefalia, braquicefalia, dolicocefalia, micro/macrocefalia.</li>
                <li><b>Simetría:</b> Craneal y proporción facial.</li>
                <li><b>Piel:</b> Color, cicatrices, lesiones, descamación.</li>
                <li><b>Cabello:</b> Implantación, textura, color, alopecia.</li>
              </ul>
              <h3>Palpación</h3>
              <ul>
                <li><b>Cráneo:</b> Depresiones, prominencias, dolor.</li>
                <li><b>Cuero cabelludo:</b> Adherencias, movilidad, sensibilidad.</li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <v-window-item value="cara">
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="5">
              <v-img :src="imagenCara" eager />
            </v-col>
            <v-col cols="12" md="7">
              <h3>Inspección</h3>
              <ul>
                <li><b>Simetría:</b> Facial y expresión.</li>
                <li><b>Facies:</b> Hipocrática, cushingoide, parkinsoniana, mixedematosa.</li>
              </ul>
              <h3>Palpación y Percusión</h3>
              <ul>
                <li>Senos frontales y maxilares (dolor).</li>
                <li>Articulación temporomandibular (chasquidos).</li>
              </ul>
              <h3>Pares Craneales</h3>
              <ul>
                <li><b>V (Trigémino):</b> Sensibilidad facial, masticación.</li>
                <li><b>VII (Facial):</b> Movimientos faciales, sonrisa.</li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <v-window-item value="ojos">
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="5">
              <v-img :src="imagenOjo" eager />
            </v-col>
            <v-col cols="12" md="7">
              <h3>Inspección</h3>
              <ul>
                <li><b>Alineación:</b> Exoftalmos, estrabismo.</li>
                <li><b>Párpados:</b> Ptosis, edema, lesiones.</li>
                <li><b>Pupilas:</b> Tamaño, forma, simetría.</li>
              </ul>
              <h3>Maniobras</h3>
              <ul>
                <li>Reflejo fotomotor directo y consensual.</li>
                <li>Movimientos oculares extrínsecos (en H).</li>
              </ul>
              <h3>Pares Craneales</h3>
              <ul>
                <li><b>II (Óptico):</b> Agudeza visual, campo visual.</li>
                <li><b>III, IV, VI:</b> Movimientos oculares.</li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <v-window-item value="oidos">
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="5">
              <v-img :src="imagenOido" eager />
            </v-col>
            <v-col cols="12" md="7">
              <h3>Inspección (con Otoscopía)</h3>
              <ul>
                <li><b>Pabellón auricular:</b> Forma, implantación.</li>
                <li><b>Conducto auditivo:</b> Cerumen, secreción.</li>
                <li><b>Tímpano:</b> Color, integridad.</li>
              </ul>
              <h3>Palpación y Maniobras</h3>
              <ul>
                <li>Dolor en trago y mastoides.</li>
                <li>Tracción del pabellón (Otitis externa).</li>
                <li>Pruebas: Rinne y Weber.</li>
              </ul>
              <h3>Par Craneal</h3>
              <ul>
                <li><b>VIII (Vestibulococlear):</b> Audición y equilibrio.</li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <v-window-item value="nariz">
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="5">
              <v-img :src="imagenNariz" eager />
            </v-col>
            <v-col cols="12" md="7">
              <h3>Inspección</h3>
              <ul>
                <li>Forma externa, desviación del tabique.</li>
                <li><b>Mucosa nasal:</b> Color, secreciones, pólipos.</li>
              </ul>
              <h3>Palpación y Maniobras</h3>
              <ul>
                <li>Dolor en senos frontales y maxilares.</li>
                <li>Transiluminación de senos.</li>
              </ul>
              <h3>Par Craneal</h3>
              <ul>
                <li><b>I (Olfatorio):</b> Oler sustancias no irritantes.</li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

      <v-window-item value="boca">
        <v-container fluid>
          <h3>Inspección</h3>
          <ul>
            <li>Labios, mucosa oral, lengua, dientes, encías.</li>
            <li><b>Amígdalas:</b> Color, tamaño, exudado.</li>
            <li><b>Paladar y úvula:</b> Movilidad.</li>
          </ul>
          <h3>Palpación y Maniobras</h3>
          <ul>
            <li><b>Lengua:</b> Nódulos, induración.</li>
            <li>Reflejo nauseoso (Guttmann).</li>
          </ul>
          <h3>Pares Craneales</h3>
          <ul>
            <li><b>IX (Glosofaríngeo):</b> Reflejo nauseoso, gusto posterior.</li>
            <li><b>X (Vago):</b> Movilidad del paladar, voz.</li>
            <li><b>XII (Hipogloso):</b> Movimientos de la lengua.</li>
          </ul>
        </v-container>
      </v-window-item>

      <v-window-item value="cuello">
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="5">
              <v-img :src="imagenTiroides" eager />
            </v-col>
            <v-col cols="12" md="7">
              <h3>Inspección</h3>
              <ul>
                <li>Simetría, masas, deformidades.</li>
                <li>Piel: Cicatrices, pulsaciones anómalas.</li>
              </ul>
              <h3>Palpación</h3>
              <ul>
                <li><b>Ganglios linfáticos:</b> Tamaño, consistencia, dolor.</li>
                <li><b>Tiroides:</b> Tamaño, nódulos, movilidad con deglución.</li>
                <li><b>Tráquea:</b> Centración.</li>
              </ul>
              <h3>Auscultación</h3>
              <ul>
                <li><b>Arteras carótidas:</b> Soplos.</li>
              </ul>
              <h3>Par Craneal</h3>
              <ul>
                <li><b>XI (Accesorio):</b> Movimiento del trapecio.</li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </v-window-item>

    </v-window>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

// --- INICIO DE LO NUEVO ---
// Define el evento 'close' que el botón de la barra de título usará
const emit = defineEmits(['close'])
// --- FIN DE LO NUEVO ---

// Variable para controlar las pestañas
const tab = ref(null)

// Importaciones de imágenes
import imagenCabeza from '@/Imagenes/cabeza.png'
import imagenCara from '@/Imagenes/cara.png'
import imagenOjo from '@/Imagenes/ojo.png'
import imagenOido from '@/Imagenes/oido.png'
import imagenNariz from '@/Imagenes/nariz.png'
import imagenTiroides from '@/Imagenes/tiroidea.png'
</script>

<style scoped>
h3 {
  margin-top: 10px;
  margin-bottom: 5px;
  color: #1976D2; /* Color primario de Vuetify */
}
ul {
  padding-left: 20px;
}
</style>