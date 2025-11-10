<template>
  <v-container fluid class="pa-0 fill-height">
    <v-card class="d-flex flex-column" style="width: 100%; height: 100%;">
      <v-card-title class="flex-grow-0" style="background-color: #00796B; color: white;">
        <v-icon start>mdi-arm-flex</v-icon>
        Brazos - Extremidades Superiores
        <v-spacer></v-spacer>
        <v-btn icon size="small" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="pa-0 flex-grow-1 d-flex" style="min-height: 0; overflow: hidden;">
        <!-- Canvas 3D izquierda -->
        <div style="flex: 1; position: relative;">
          <div ref="canvasContainer" style="width: 100%; height: 100%;"></div>

          <div v-if="isLoadingModel" class="absolute-center">
            <v-progress-circular indeterminate color="primary" size="64" />
            <div class="mt-2" style="color: white;">Cargando modelo...</div>
          </div>

          <div v-if="errorMessage" class="error-overlay">
            <v-icon color="error" size="48">mdi-alert-circle</v-icon>
            <div class="mt-2">{{ errorMessage }}</div>
          </div>

          <div class="controls-overlay">
            <div><strong>Controles:</strong></div>
            <div>🖱️ Arrastrar: Rotar</div>
            <div>🖱️ Rueda: Zoom</div>
          </div>

          <v-btn
            icon
            size="small"
            color="primary"
            class="reset-btn"
            @click="resetCamera"
          >
            <v-icon>mdi-camera-retake</v-icon>
          </v-btn>
        </div>

        <!-- Panel de información derecha -->
        <div style="width: 350px; background: #f5f5f5; overflow-y: auto; border-left: 1px solid #e0e0e0; padding: 24px;">
          <template v-if="!contentError">
            <v-chip prepend-icon="mdi-arm-flex" color="teal" class="mb-3">
              Extremidades Superiores
            </v-chip>
            <h2 style="font-size: 24px; font-weight: 600; margin: 16px 0; color: #00796B;">Brazos</h2>

            <div v-if="content.image" class="mb-4">
              <v-img :src="content.image" max-width="300" class="rounded-lg elevation-2"></v-img>
            </div>

            <div v-html="content.text" style="color: #444; line-height: 1.6; font-size: 14px;"></div>
          </template>

          <div v-else style="color: red; text-align: center;">
            Error al cargar contenido.
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getContent } from '@/api/content'
import modeloArmsPath from '@/assets/brazos.glb?url'

const router = useRouter()
const canvasContainer = ref(null)
const isLoadingModel = ref(true)
const errorMessage = ref('')
const content = ref({ text: '', image: '' })
const contentError = ref(false)

let scene, camera, renderer, controls, model
let animationId = null

onMounted(() => {
  initThree()
  loadModel()
  fetchCMSContent()
  animate()
  window.addEventListener('resize', onWindowResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  cancelAnimationFrame(animationId)
  if (renderer) renderer.dispose()
  if (controls) controls.dispose()
})

const initThree = () => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x2d3436)

  const container = canvasContainer.value
  const width = container.clientWidth
  const height = container.clientHeight

  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
  camera.position.set(0, 0, 3.5)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.minDistance = 2
  controls.maxDistance = 8

  const ambient = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(ambient)

  const dir1 = new THREE.DirectionalLight(0xffffff, 0.9)
  dir1.position.set(5, 10, 7.5)
  scene.add(dir1)

  const dir2 = new THREE.DirectionalLight(0xffffff, 0.5)
  dir2.position.set(-5, 5, -5)
  scene.add(dir2)
}

const loadModel = () => {
  const loader = new GLTFLoader()
  loader.load(
    modeloArmsPath,
    (gltf) => {
      model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      model.position.sub(center)
      model.scale.setScalar(1.5)

      // Restaurar color verde original
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone()
          child.material.color.setHex(0x00796B)
          child.material.emissive.setHex(0x004d47)
        }
      })

      scene.add(model)
      isLoadingModel.value = false
    },
    undefined,
    (error) => {
      console.error('Error cargando modelo:', error)
      errorMessage.value = 'No se pudo cargar el modelo.'
      isLoadingModel.value = false
    }
  )
}

const fetchCMSContent = async () => {
  try {
    const data = await getContent('brazos')
    if (data && (data.text || data.image)) {
      content.value = data
      contentError.value = false
    } else {
      contentError.value = true
    }
  } catch (err) {
    console.error('Error cargando contenido:', err)
    contentError.value = true
  }
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  controls.update()
  if (model) model.rotation.y += 0.003
  renderer.render(scene, camera)
}

const resetCamera = () => {
  controls.reset()
  camera.position.set(0, 0, 3.5)
}

const onWindowResize = () => {
  const container = canvasContainer.value
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.clientWidth, container.clientHeight)
}

const goBack = () => router.push('/')
</script>

<style scoped>
.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}

.error-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff6b6b;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 8px;
  z-index: 10;
}

.controls-overlay {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 5;
}

.reset-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 5;
}
</style>
