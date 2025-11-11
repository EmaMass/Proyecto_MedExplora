<template>
  <v-container fluid class="pa-0 fill-height">
    <v-card class="d-flex flex-column" style="width: 100%; height: 100%;">
      <v-card-title class="flex-grow-0" style="background-color: #F57C00 !important; color: white; transition: background-color 0.6s ease;">
        <v-icon start>mdi-human-male-board</v-icon>
        Torso - Tronco
        <v-spacer></v-spacer>
        <v-btn icon size="small" @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-card-text class="pa-0 flex-grow-1 d-flex" style="min-height: 0; overflow: hidden;">
        <!-- Canvas 3D izquierda -->
        <div style="flex: 1; position: relative;">
          <div ref="canvasContainer" style="width: 100%; height: 100%;"></div>
          
          <div v-if="isLoadingModel" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; z-index: 10;">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <div style="margin-top: 16px; color: white;">Cargando modelo...</div>
          </div>
          
          <div v-if="errorMessage" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #ff6b6b; background: rgba(0,0,0,0.8); padding: 20px; border-radius: 8px; z-index: 10;">
            <v-icon color="error" size="48">mdi-alert-circle</v-icon>
            <div style="margin-top: 8px;">{{ errorMessage }}</div>
          </div>
          
          <div style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.6); color: white; padding: 8px; border-radius: 4px; font-size: 12px; pointer-events: none; z-index: 5;">
            <div><strong>Controles:</strong></div>
            <div>🖱️ Arrastrar: Rotar</div>
            <div>🖱️ Rueda: Zoom</div>
          </div>
          
          <v-btn
            icon
            size="small"
            color="primary"
            style="position: absolute; bottom: 10px; right: 10px; z-index: 5;"
            @click="resetCamera"
          >
            <v-icon>mdi-camera-retake</v-icon>
          </v-btn>
        </div>
        
        <!-- Panel de información derecha -->
        <div style="width: 350px; background: #f5f5f5; overflow-y: auto; border-left: 1px solid #e0e0e0; padding: 24px;">
          <div style="margin-bottom: 24px;">
            <v-chip prepend-icon="mdi-human-male-board" color="warning" class="mb-3">
              Tronco
            </v-chip>
            <h2 style="font-size: 24px; font-weight: 600; margin: 16px 0; color: #F57C00;">Torso</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 16px;">
              El torso es la sección central del cuerpo que comprende el tórax y el abdomen. Es el hogar de los órganos vitales más importantes para la supervivencia.
            </p>
          </div>
          
          <v-divider class="my-4"></v-divider>
          
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #333;">Órganos principales:</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="padding: 12px; background: white; border-left: 4px solid #F57C00; border-radius: 4px;">
                <div style="font-weight: 600; color: #F57C00;">Corazón</div>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">Bombea sangre por todo el cuerpo</div>
              </div>
              <div style="padding: 12px; background: white; border-left: 4px solid #F57C00; border-radius: 4px;">
                <div style="font-weight: 600; color: #F57C00;">Pulmones</div>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">Realizan el intercambio de gases</div>
              </div>
              <div style="padding: 12px; background: white; border-left: 4px solid #F57C00; border-radius: 4px;">
                <div style="font-weight: 600; color: #F57C00;">Hígado</div>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">Filtra y procesa nutrientes</div>
              </div>
              <div style="padding: 12px; background: white; border-left: 4px solid #F57C00; border-radius: 4px;">
                <div style="font-weight: 600; color: #F57C00;">Estómago</div>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">Digiere los alimentos</div>
              </div>
              <div style="padding: 12px; background: white; border-left: 4px solid #F57C00; border-radius: 4px;">
                <div style="font-weight: 600; color: #F57C00;">Intestinos</div>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">Absorben nutrientes</div>
              </div>
            </div>
          </div>
          
          <v-divider class="my-4"></v-divider>
          
          <div>
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px; color: #333;">Funciones principales:</h3>
            <ul style="padding-left: 20px; color: #666; line-height: 1.8; font-size: 14px;">
              <li>Circulación de la sangre</li>
              <li>Respiración y oxigenación</li>
              <li>Digestión de alimentos</li>
              <li>Metabolismo y producción de energía</li>
              <li>Protección de órganos vitales</li>
            </ul>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import modeloTorsoPath from '@/assets/torso.glb?url';

const router = useRouter();
const canvasContainer = ref(null);
const isLoadingModel = ref(true);
const errorMessage = ref('');

let scene, camera, renderer, controls, model;
let animationId = null;

onMounted(() => {
  initThree();
  loadModel();
  animate();
  window.addEventListener('resize', onWindowResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
  cancelAnimationFrame(animationId);
  if (renderer) renderer.dispose();
  if (controls) controls.dispose();
});

const initThree = () => {
  try {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2d3436);

    const container = canvasContainer.value;
    if (!container) {
      throw new Error('Container no encontrado');
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 6;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight1.position.set(5, 10, 7.5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    const fillLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
    scene.add(fillLight);
  } catch (error) {
    console.error('Error inicializando Three.js:', error);
    errorMessage.value = 'Error al inicializar el visor 3D';
  }
};

const loadModel = () => {
  const loader = new GLTFLoader();
  
  loader.load(
    modeloTorsoPath,
    (gltf) => {
      model = gltf.scene;

      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      model.position.sub(center);

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      model.scale.setScalar(scale);

      model.position.y = 0;

      scene.add(model);

      model.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          child.material.color.setHex(0xF57C00);
          child.material.emissive.setHex(0xb55a00);
        }
      });

      isLoadingModel.value = false;
      console.log('Modelo de torso cargado exitosamente');
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      console.log(`Cargando: ${percent.toFixed(2)}%`);
    },
    (error) => {
      console.error('Error al cargar el modelo de torso:', error);
      isLoadingModel.value = false;
      errorMessage.value = 'No se pudo cargar el modelo. Verifica que torso_model.glb existe en src/assets/';
    }
  );
};

const animate = () => {
  animationId = requestAnimationFrame(animate);

  if (controls) {
    controls.update();
  }

  if (model) {
    model.rotation.y += 0.003;
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
};

const resetCamera = () => {
  if (controls) {
    controls.reset();
  }
  camera.position.set(0, 0, 3);
  if (controls) {
    controls.target.set(0, 0, 0);
  }
  if (model) {
    model.rotation.set(0, 0, 0);
  }
};

const onWindowResize = () => {
  const container = canvasContainer.value;
  if (container && camera && renderer) {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
};

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
div {
  box-sizing: border-box;
}
</style>