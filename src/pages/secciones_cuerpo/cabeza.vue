<template>
  <BodySectionLayout
    title="Cabeza"
    subtitle="Región Superior del Cuerpo"
    icon="mdi-arm-flex"
    :header-color="'linear-gradient(135deg, #00796B 0%, #004d47 100%)'"
    section-key="cabeza"
    chip-color="teal"
    :is-loading="isLoadingModel"
    :error="errorMessage"
    @reset-camera="resetCamera"
    @go-back="goBack"
    @retry="retryLoad"
  >
    <template #canvas>
      <div ref="canvasContainer" class="canvas-3d"></div>
    </template>
  </BodySectionLayout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import BodySectionLayout from '@/components/BodySectionLayout.vue'
import modeloCabeaPath from '@/assets/head.glb?url'

const router = useRouter()
const canvasContainer = ref(null)
const isLoadingModel = ref(true)
const errorMessage = ref('')

let scene, camera, renderer, controls, model
let animationId = null

onMounted(() => {
  initThree()
  loadModel()
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
  try {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x1a1d23)

    const container = canvasContainer.value
    if (!container) throw new Error('Container no encontrado')

    const width = container.clientWidth
    const height = container.clientHeight

    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(0, 0, 3.5)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 2
    controls.maxDistance = 8
    controls.maxPolarAngle = Math.PI * 0.9
    controls.target.set(0, 0, 0)

    // Iluminación mejorada
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
    mainLight.position.set(5, 10, 7.5)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
    fillLight.position.set(-5, 5, -5)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0x00796B, 0.8)
    rimLight.position.set(0, 5, -10)
    scene.add(rimLight)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4)
    scene.add(hemiLight)
  } catch (error) {
    console.error('Error inicializando Three.js:', error)
    errorMessage.value = 'Error al inicializar el visor 3D'
  }
}

const loadModel = () => {
  const loader = new GLTFLoader()
  
  loader.load(
    modeloCabeaPath,
    (gltf) => {
      model = gltf.scene

      // Centrar y escalar
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      
      model.position.sub(center)
      
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 1.5 / maxDim
      model.scale.setScalar(scale)

      // Aplicar materiales mejorados
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          
          // Material PBR mejorado
          const material = new THREE.MeshStandardMaterial({
            color: 0x00796B,
            emissive: 0x004d47,
            emissiveIntensity: 0.2,
            metalness: 0.3,
            roughness: 0.7,
            side: THREE.FrontSide
          })
          
          child.material = material
        }
      })

      scene.add(model)
      isLoadingModel.value = false
      console.log('✓ Modelo de cabeza cargado')
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100
      console.log(`Cargando: ${percent.toFixed(0)}%`)
    },
    (error) => {
      console.error('Error cargando modelo:', error)
      errorMessage.value = 'No se pudo cargar el modelo 3D. Verifica que cabeza.glb existe en /src/assets/'
      isLoadingModel.value = false
    }
  )
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  if (controls) controls.update()
  if (model) model.rotation.y += 0.003
  
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

const resetCamera = () => {
  if (controls) controls.reset()
  camera.position.set(0, 0, 3.5)
  if (controls) controls.target.set(0, 0, 0)
  if (model) model.rotation.set(0, 0, 0)
}

const onWindowResize = () => {
  const container = canvasContainer.value
  if (!container || !camera || !renderer) return

  const width = container.clientWidth
  const height = container.clientHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

const goBack = () => router.push('/')

const retryLoad = () => {
  errorMessage.value = ''
  isLoadingModel.value = true
  loadModel()
}
</script>

<style scoped>
.canvas-3d {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>