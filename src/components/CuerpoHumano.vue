<template>
  <v-container fluid class="pa-0 fill-height">
    <v-card class="d-flex flex-column" style="width: 100%; height: 100%;">
      <v-card-title class="flex-grow-0 transition-colors" :style="headerStyle">
        <v-icon start>mdi-human-male</v-icon>
        Modelo 3D Interactivo
        <v-spacer></v-spacer>
        <v-chip v-if="selectedPart" color="success" size="small">
          {{ selectedPart }}
        </v-chip>
      </v-card-title>
      
      <v-card-text class="pa-0 flex-grow-1" style="min-height: 0;">
        <div ref="canvasContainer" style="width: 100%; height: 100%; position: relative; cursor: pointer;">
          <!-- Indicador de carga -->
          <div v-if="isLoading" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; z-index: 10;">
            <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            <div style="margin-top: 16px; color: white;">Cargando modelo...</div>
          </div>
          
          <!-- Mensaje de error -->
          <div v-if="errorMessage" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: #ff6b6b; background: rgba(0,0,0,0.8); padding: 20px; border-radius: 8px; z-index: 10;">
            <v-icon color="error" size="48">mdi-alert-circle</v-icon>
            <div style="margin-top: 8px;">{{ errorMessage }}</div>
          </div>
          
          <!-- Tooltip al hacer hover -->
          <div v-if="hoveredPart" 
               :style="{
                 position: 'absolute',
                 left: tooltipPosition.x + 'px',
                 top: tooltipPosition.y + 'px',
                 background: 'rgba(0,0,0,0.8)',
                 color: 'white',
                 padding: '8px 12px',
                 borderRadius: '4px',
                 pointerEvents: 'none',
                 zIndex: 100,
                 fontSize: '14px',
                 fontWeight: 'bold'
               }">
            {{ hoveredPart }} - Click para ver detalle
          </div>
          
          <div style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.6); color: white; padding: 8px; border-radius: 4px; font-size: 12px; pointer-events: none; z-index: 5;">
            <div><strong>Controles:</strong></div>
            <div>🖱️ Arrastrar: Rotar</div>
            <div>🖱️ Rueda: Zoom</div>
            <div>👆 Click: Seleccionar parte</div>
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
      </v-card-text>
      
      <v-card-actions class="flex-grow-0">
        <v-row dense>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedView"
              :items="views"
              item-title="text"
              item-value="value"
              label="Vista Predefinida"
              dense
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-checkbox
              v-model="autoRotate"
              label="Rotación Automática"
              dense
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="4">
            <v-checkbox
              v-model="highlightOnHover"
              label="Resaltar al pasar"
              dense
              hide-details
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import modeloCuerpoPath from '@/assets/body2.glb?url';

const props = defineProps({
  highlighted: {
    type: Array,
    default: () => []
  }
})

const router = useRouter();
const emit = defineEmits(['part-clicked'])

// Referencias a elementos del DOM
const canvasContainer = ref(null);

// Estado de carga
const isLoading = ref(true);
const errorMessage = ref('');

// Lógica de Three.js
let scene, camera, renderer, controls, humanModel;
let animationId = null;

// Raycaster para detectar clicks
let raycaster, mouse;
const clickableObjects = [];
const partMeshMap = new Map();

// Estado reactivo
const autoRotate = ref(false);
const highlightOnHover = ref(true);
const selectedView = ref('frontal');
const selectedPart = ref('');
const hoveredPart = ref('');
const tooltipPosition = ref({ x: 0, y: 0 });

// Color del header dinámico
const currentPartColor = ref('primary');
const headerStyle = computed(() => {
  const colors = {
    'primary': '#1976D2',
    'head': '#1B5E20',      // Verde oscuro
    'torso': '#F57C00',     // Naranja
    'arms': '#00796B',      // Teal
    'legs': '#283593'       // Azul oscuro
  };
  
  return {
    backgroundColor: colors[currentPartColor.value],
    transition: 'background-color 0.6s ease'
  };
});

const views = [
  { text: 'Vista Frontal', value: 'frontal' },
  { text: 'Vista Posterior', value: 'posterior' },
  { text: 'Vista Lateral Derecha', value: 'lateral-der' },
  { text: 'Vista Lateral Izquierda', value: 'lateral-izq' }
];

const bodyParts = {
  'head': { 
    name: 'Cabeza', 
    type: 'Región Cefálica', 
    description: 'Incluye cráneo, cara, ojos, oídos, nariz y boca. Contiene el cerebro y los principales órganos sensoriales.',
    icon: 'mdi-head',
    route: '/secciones_cuerpo/cabeza'
  },
  'torso': { 
    name: 'Torso', 
    type: 'Tronco', 
    description: 'Comprende tórax y abdomen. Contiene órganos vitales como corazón, pulmones, hígado, estómago e intestinos.',
    icon: 'mdi-human-male-board',
    route: '/secciones_cuerpo/torso'
  },
  'arms': { 
    name: 'Brazos', 
    type: 'Extremidades Superiores', 
    description: 'Incluye hombros, brazos, antebrazos, muñecas y manos. Permiten la manipulación de objetos y movimientos precisos.',
    icon: 'mdi-arm-flex',
    route: '/secciones_cuerpo/brazos'
  },
  'legs': { 
    name: 'Piernas', 
    type: 'Extremidades Inferiores', 
    description: 'Incluye caderas, muslos, rodillas, piernas, tobillos y pies. Proporcionan soporte y movilidad al cuerpo.',
    icon: 'mdi-human-male-height',
    route: '/secciones_cuerpo/piernas'
  },
  'default': { 
    name: 'Parte del cuerpo', 
    type: 'Sección', 
    description: 'Parte anatómica',
    icon: 'mdi-human'
  }
};

const originalMaterials = new Map();

onMounted(() => {
  initThree();
  loadModel();
  animate();
  window.addEventListener('resize', onWindowResize);
  
  if (canvasContainer.value) {
    canvasContainer.value.addEventListener('click', onCanvasClick);
    canvasContainer.value.addEventListener('mousemove', onCanvasMouseMove);
  }
});

watch(() => props.highlighted, (newHighlightedParts) => {
  updateHighlightsFromProps(newHighlightedParts);
});


function updateHighlightsFromProps(highlightedParts) {
  // Si la lista de props está vacía, reseteamos todo al estado original
  // Esto permite que el click/hover funcionen normalmente
  if (highlightedParts.length === 0) {
    clickableObjects.forEach(obj => {
      const originalMat = originalMaterials.get(obj);
      if (originalMat) {
        obj.material.emissive.setHex(originalMat.emissive.getHex());
      }
    });
    return;
  }

  // Si HAY partes para resaltar, ellas toman el control
  clickableObjects.forEach(obj => {
    const partName = partMeshMap.get(obj);
    const originalMat = originalMaterials.get(obj);
    if (!originalMat) return;

    if (highlightedParts.includes(partName)) {
      // Aplicar resaltado de síntoma (Rojo)
      obj.material.emissive.setHex(0xE53935);
    } else {
      // Restaurar a original (sin resaltado)
      obj.material.emissive.setHex(originalMat.emissive.getHex());
    }
  });
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
  if (canvasContainer.value) {
    canvasContainer.value.removeEventListener('click', onCanvasClick);
    canvasContainer.value.removeEventListener('mousemove', onCanvasMouseMove);
  }
  
  cancelAnimationFrame(animationId);
  
  if (renderer) {
    renderer.dispose();
  }
  if (controls) {
    controls.dispose();
  }
});

const initThree = () => {
  try {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2d3436);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const container = canvasContainer.value;
    if (!container) {
      throw new Error('Container no encontrado');
    }
    
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 1.6, 5);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 10, 7.5);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
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
    modeloCuerpoPath,
    (gltf) => {
      humanModel = gltf.scene;
      
      const box = new THREE.Box3().setFromObject(humanModel);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      humanModel.position.sub(center);
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3 / maxDim;
      humanModel.scale.setScalar(scale);
      
      humanModel.position.y = 0;
      
      processModelParts(humanModel);
      
      scene.add(humanModel);
      isLoading.value = false;
    },
    (progress) => {
      const percent = (progress.loaded / progress.total) * 100;
      console.log(`Cargando: ${percent.toFixed(2)}%`);
    },
    (error) => {
      console.error('Error al cargar el modelo .glb:', error);
      isLoading.value = false;
      errorMessage.value = 'No se pudo cargar el modelo 3D. Verifica que el archivo body2.glb existe en src/assets/';
    }
  );
};

const processModelParts = (model) => {
  const objectToGroup = {
    'Cube064': 'head',
    'Cube066': 'head',
    'Retopo_Cylinder005': 'head',
    'eye_high': 'head',
    'Retopo_Cube065': 'head',
    
    'Cube050': 'arms',
    'Cube051': 'arms',
    'Cube052': 'arms',
    'Cube053': 'arms',
    'Cube054': 'arms',
    'Cube055': 'arms',
    'Cube056': 'arms',
    'Cube057': 'arms',
    'Cube008': 'arms',
    'Cube009': 'arms',
    'body_high001': 'arms',
    
    'Cube019': 'legs',
    'Cube021': 'legs',
    'Cube038': 'legs',
    
    'Cube024': 'torso',
    'Cube028': 'torso',
    'Cube029': 'torso',
    'Cube031': 'torso',
    'Cube032': 'torso',
    'Cube034': 'torso',
    'Cube035': 'torso',
    'Cube037': 'torso',
    'Retopo_Cube001': 'torso',
    'Retopo_Cube002': 'torso',
    'Retopo_Cube003': 'torso',
    'Cube003': 'torso',
    'Cube036': 'torso',
    'Retopo_Cube004': 'torso',
    'Cube007': 'torso',
  };
  
  const parentGroups = new Map();
  
  model.traverse((child) => {
    const nameLower = child.name.toLowerCase();
    if (nameLower === 'head' || nameLower === 'torso' || 
        nameLower === 'arms' || nameLower === 'legs') {
      child.traverse((descendant) => {
        if (descendant.isMesh) {
          parentGroups.set(descendant, nameLower);
        }
      });
    }
  });
  
  model.traverse((child) => {
    if (child.isMesh) {
      originalMaterials.set(child, child.material.clone());
      clickableObjects.push(child);
      
      let partName = null;
      
      if (objectToGroup[child.name]) {
        partName = objectToGroup[child.name];
      }
      
      if (!partName) {
        partName = parentGroups.get(child);
      }
      
      if (!partName) {
        partName = detectPartName(child.name);
      }
      
      if (!partName && child.parent) {
        const parentNameLower = child.parent.name.toLowerCase();
        if (parentNameLower === 'head' || parentNameLower === 'torso' || 
            parentNameLower === 'arms' || parentNameLower === 'legs') {
          partName = parentNameLower;
        }
      }
      
      if (!partName) {
        partName = 'default';
      }
      
      partMeshMap.set(child, partName);
      child.material = child.material.clone();
    }
  });
};

const detectPartName = (meshName) => {
  const nameLower = meshName.toLowerCase().trim();
  
  const exactParts = ['head', 'torso', 'arms', 'legs'];
  for (const part of exactParts) {
    if (nameLower === part || nameLower.includes(part)) {
      return part;
    }
  }
  
  if (nameLower.includes('cabeza') || nameLower.includes('cráneo') || nameLower.includes('skull')) {
    return 'head';
  }
  if (nameLower.includes('tronco') || nameLower.includes('chest') || nameLower.includes('abdomen') || nameLower.includes('spine')) {
    return 'torso';
  }
  if (nameLower.includes('brazo') || nameLower.includes('arm') || nameLower.includes('hand') || nameLower.includes('mano')) {
    return 'arms';
  }
  if (nameLower.includes('pierna') || nameLower.includes('leg') || nameLower.includes('foot') || nameLower.includes('pie')) {
    return 'legs';
  }
  
  return nameLower || 'default';
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  
  if (controls) {
    controls.update();
  }

  if (autoRotate.value && humanModel) {
    humanModel.rotation.y += 0.005;
  }
  
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
};

const onCanvasMouseMove = (event) => {
//
  if (props.highlighted.length > 0) return;

  if (!highlightOnHover.value) return;
  
  const rect = canvasContainer.value.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, false);
  
  clickableObjects.forEach(obj => {
    const objPartName = partMeshMap.get(obj);
    const selectedPartKey = Object.keys(bodyParts).find(
      key => bodyParts[key].name === selectedPart.value
    );
    
    if (objPartName !== selectedPartKey) {
      const originalMat = originalMaterials.get(obj);
      if (originalMat) {
        obj.material.emissive.setHex(originalMat.emissive.getHex());
      }
    }
  });
  
  if (intersects.length > 0) {
    const hoveredObject = intersects[0].object;
    const partName = partMeshMap.get(hoveredObject);
    const partInfo = bodyParts[partName] || bodyParts['default'];
    
    hoveredPart.value = partInfo.name;
    tooltipPosition.value = { x: event.clientX - rect.left + 10, y: event.clientY - rect.top + 10 };
    
    clickableObjects.forEach(obj => {
      const objPartName = partMeshMap.get(obj);
      if (objPartName === partName) {
        obj.material.emissive.setHex(0x555555);
      }
    });
    
    canvasContainer.value.style.cursor = 'pointer';
  } else {
    hoveredPart.value = '';
    canvasContainer.value.style.cursor = 'grab';
  }
};

const onCanvasClick = (event) => {

  
  const rect = canvasContainer.value.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects, false);
  
  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;
const partName = partMeshMap.get(clickedObject); // Ej: 'head'
    
    // 2. (¡NUEVO!) Emitimos la parte clicada SIEMPRE
    if (partName) {
      emit('part-clicked', partName);
    }
    // 3. (MODIFICADO) Si estamos en modo diagnóstico,
    // ya emitimos el clic, así que no hacemos nada más.
    if (props.highlighted.length > 0) {
      return;
    }
    
    // 4. Si NO estamos en modo diagnóstico, continuamos
    // con tu lógica original (resaltar en verde, navegar, etc.)
    const partInfo = bodyParts[partName] || bodyParts['default'];
    
    selectedPart.value = partInfo.name;
    
    // Cambiar color del header
    currentPartColor.value = partName;
    
    // Resaltar TODOS los objetos de la sección
    clickableObjects.forEach(obj => {
      const originalMat = originalMaterials.get(obj);
      if (originalMat) {
        obj.material.emissive.setHex(originalMat.emissive.getHex());
      }
      
      const objPartName = partMeshMap.get(obj);
      if (objPartName === partName) {
        obj.material.emissive.setHex(0x00ff00);
      }
    });
    
    // Navegar a la vista de la sección
// CÁMBIALO POR ESTO:
if (partInfo.route) {
  setTimeout(() => {
    router.push(partInfo.route)
  }, 300)
}
  }
};

const resetCamera = () => {
  if (controls) {
    controls.reset();
  }
  camera.position.set(0, 1.6, 5);
  if (controls) {
    controls.target.set(0, 1, 0);
  }
  if (humanModel) {
    humanModel.rotation.set(0, 0, 0);
  }
  selectedView.value = 'frontal';
  selectedPart.value = '';
  currentPartColor.value = 'primary';
  
  clickableObjects.forEach(obj => {
    const originalMat = originalMaterials.get(obj);
    if (originalMat) {
      obj.material.emissive.setHex(originalMat.emissive.getHex());
    }
  });
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

watch(selectedView, (newView) => {
  if (humanModel) {
    humanModel.rotation.set(0, 0, 0);
  }
  if (controls) {
    controls.target.set(0, 1, 0);
  }
  
  switch (newView) {
    case 'frontal':
      camera.position.set(0, 1.6, 5);
      break;
    case 'posterior':
      camera.position.set(0, 1.6, -5);
      break;
    case 'lateral-der':
      camera.position.set(5, 1.6, 0);
      break;
    case 'lateral-izq':
      camera.position.set(-5, 1.6, 0);
      break;
  }
});
</script>

<style scoped>
.v-card-text {
  overflow: hidden;
}

.transition-colors {
  transition: background-color 0.6s ease;
}
</style>