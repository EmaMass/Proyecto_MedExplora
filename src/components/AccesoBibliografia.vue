<template>
  <div class="references-wrapper">
    <div class="references-container">
      <!-- Header con botón de cerrar -->
      <div class="header">
        <div class="header-content">
          <h2 class="title">📚 Referencias Bibliográficas</h2>
          <p class="subtitle">Recursos académicos de medicina</p>
        </div>
        <button class="close-btn" @click="$emit('close')" aria-label="Cerrar referencias">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="content-scroll">
        <!-- Búsqueda -->
        <div class="search-box">
          <input
            v-model="searchTerm"
            class="search-input"
            placeholder="Buscar por título, autor o especialidad..."
            type="text"
          />
          <div class="search-icon">🔍</div>
        </div>

        <!-- Filtros -->
        <div class="filters">
          <select v-model="selectedType" class="filter-select">
            <option value="Todos">Todos los tipos</option>
            <option value="Libro">Libros</option>
            <option value="Artículo">Artículos</option>
            <option value="Guía">Guías Clínicas</option>
            <option value="Revista">Revistas</option>
          </select>

          <select v-model="selectedSpecialty" class="filter-select">
            <option value="Todas">Todas las especialidades</option>
            <option value="Medicina Interna">Medicina Interna</option>
            <option value="Cirugía">Cirugía</option>
            <option value="Pediatría">Pediatría</option>
            <option value="Ginecología">Ginecología</option>
            <option value="Neurología">Neurología</option>
            <option value="Cardiología">Cardiología</option>
          </select>
        </div>

        <!-- Enlace a Biblioteca UABC -->
        <div class="library-link">
          <div class="library-icon">🏛️</div>
          <div class="library-content">
            <strong>Biblioteca UABC - Ciencias de la Salud</strong>
            <p>Accede a más recursos en la colección digital</p>
            <a href="https://bibliotecas.uabc.mx/ciencias-de-la-salud-c" target="_blank" class="library-btn">
              Visitar Biblioteca Digital →
            </a>
          </div>
        </div>

        <!-- Contador de resultados -->
        <div class="results-count">
          {{ filteredReferences.length }} resultado{{ filteredReferences.length !== 1 ? 's' : '' }} encontrado{{ filteredReferences.length !== 1 ? 's' : '' }}
        </div>

        <!-- Lista de Referencias -->
        <div class="references-list">
          <div v-for="ref in filteredReferences" :key="ref.id" class="reference-card">
            <div class="card-header">
              <span class="type-badge" :class="getTypeBadgeClass(ref.type)">
                {{ ref.type }}
              </span>
              <span class="specialty-tag">{{ ref.specialty }}</span>
            </div>

            <h3 class="reference-title">{{ ref.title }}</h3>

            <p class="reference-authors">
              <strong>Autores:</strong> {{ ref.authors }}
            </p>

            <p class="reference-info">
              {{ ref.year }}
              <span v-if="ref.edition"> • {{ ref.edition }}</span>
              <span v-if="ref.isbn"> • ISBN: {{ ref.isbn }}</span>
            </p>

            <p class="reference-description">{{ ref.description }}</p>

            <div class="card-footer">
              <span class="access-badge">📍 {{ ref.access }}</span>
              <a v-if="ref.link" :href="ref.link" target="_blank" class="access-btn">
                Acceder →
              </a>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="filteredReferences.length === 0" class="empty-state">
          <div class="empty-icon">📖</div>
          <h3>No se encontraron referencias</h3>
          <p>Intenta ajustar los filtros o términos de búsqueda</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineEmits(['close'])

const searchTerm = ref('')
const selectedType = ref('Todos')
const selectedSpecialty = ref('Todas')

const references = [
  {
    id: 1,
    title: "Harrison's Principles of Internal Medicine",
    authors: "Jameson, Fauci, Kasper, Hauser, Longo, Loscalzo",
    year: 2022,
    edition: "21ª Edición",
    type: "Libro",
    specialty: "Medicina Interna",
    description: "Texto fundamental de medicina interna con enfoque clínico y científico actualizado.",
    access: "Biblioteca UABC",
    isbn: "978-1264268504"
  },
  {
    id: 2,
    title: "Guyton and Hall Textbook of Medical Physiology",
    authors: "John E. Hall",
    year: 2021,
    edition: "14ª Edición",
    type: "Libro",
    specialty: "Medicina Interna",
    description: "Referencia esencial en fisiología médica con explicaciones detalladas.",
    access: "Biblioteca UABC",
    isbn: "978-0323597128"
  },
  {
    id: 3,
    title: "Sabiston Textbook of Surgery",
    authors: "Courtney M. Townsend Jr.",
    year: 2022,
    edition: "21ª Edición",
    type: "Libro",
    specialty: "Cirugía",
    description: "Texto definitivo de cirugía general y especializada con base científica sólida.",
    access: "Biblioteca UABC",
    isbn: "978-0323640626"
  },
  {
    id: 4,
    title: "Nelson Textbook of Pediatrics",
    authors: "Robert M. Kliegman, Joseph St. Geme",
    year: 2023,
    edition: "21ª Edición",
    type: "Libro",
    specialty: "Pediatría",
    description: "Referencia completa en pediatría con cobertura integral de salud infantil.",
    access: "Biblioteca UABC",
    isbn: "978-0323568883"
  },
  {
    id: 5,
    title: "Williams Obstetrics",
    authors: "F. Gary Cunningham, et al.",
    year: 2022,
    edition: "26ª Edición",
    type: "Libro",
    specialty: "Ginecología",
    description: "Texto clásico de obstetricia con enfoque práctico y basado en evidencia.",
    access: "Biblioteca UABC",
    isbn: "978-1260456868"
  },
  {
    id: 6,
    title: "The New England Journal of Medicine",
    authors: "NEJM Editorial Board",
    year: 2024,
    type: "Revista",
    specialty: "Medicina Interna",
    description: "Revista médica líder mundial con artículos de investigación de alto impacto.",
    access: "Acceso Digital",
    link: "https://www.nejm.org/"
  },
  {
    id: 7,
    title: "The Lancet",
    authors: "The Lancet Editorial Team",
    year: 2024,
    type: "Revista",
    specialty: "Medicina Interna",
    description: "Revista médica internacional con investigación clínica y de salud pública.",
    access: "Acceso Digital",
    link: "https://www.thelancet.com/"
  },
  {
    id: 8,
    title: "Guías de Práctica Clínica - Sector Salud México",
    authors: "Secretaría de Salud",
    year: 2024,
    type: "Guía",
    specialty: "Todas",
    description: "Guías clínicas oficiales basadas en evidencia para el sistema de salud mexicano.",
    access: "Acceso Libre",
    link: "http://www.cenetec-difusion.com/CMGPC/"
  },
  {
    id: 9,
    title: "Adams and Victor's Principles of Neurology",
    authors: "Ropper, Samuels, Klein, Prasad",
    year: 2023,
    edition: "12ª Edición",
    type: "Libro",
    specialty: "Neurología",
    description: "Texto autorizado en neurología clínica con enfoque diagnóstico y terapéutico.",
    access: "Biblioteca UABC",
    isbn: "978-1264269297"
  },
  {
    id: 10,
    title: "Braunwald's Heart Disease",
    authors: "Douglas L. Mann, et al.",
    year: 2022,
    edition: "12ª Edición",
    type: "Libro",
    specialty: "Cardiología",
    description: "Referencia definitiva en cardiología con cobertura completa de enfermedades cardiovasculares.",
    access: "Biblioteca UABC",
    isbn: "978-0323722797"
  },
  {
    id: 11,
    title: "UpToDate",
    authors: "Wolters Kluwer",
    year: 2024,
    type: "Artículo",
    specialty: "Todas",
    description: "Base de datos clínica actualizada continuamente con recomendaciones basadas en evidencia.",
    access: "Suscripción UABC",
    link: "https://www.uptodate.com/"
  },
  {
    id: 12,
    title: "Cochrane Library",
    authors: "Cochrane Collaboration",
    year: 2024,
    type: "Artículo",
    specialty: "Todas",
    description: "Colección de revisiones sistemáticas y metaanálisis de alta calidad.",
    access: "Acceso Libre",
    link: "https://www.cochranelibrary.com/"
  }
]

const filteredReferences = computed(() => {
  return references.filter(ref => {
    const matchesSearch = 
      ref.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      ref.authors.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      ref.specialty.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      ref.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesType = selectedType.value === 'Todos' || ref.type === selectedType.value
    const matchesSpecialty = selectedSpecialty.value === 'Todas' || ref.specialty === selectedSpecialty.value
    
    return matchesSearch && matchesType && matchesSpecialty
  })
})

function getTypeBadgeClass(type) {
  const classes = {
    'Libro': 'badge-libro',
    'Artículo': 'badge-articulo',
    'Guía': 'badge-guia',
    'Revista': 'badge-revista'
  }
  return classes[type] || 'badge-default'
}
</script>

<style scoped>
/* WRAPPER - Ocupa todo el espacio del modelo 3D */
.references-wrapper {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1d23 0%, #2d3436 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.4s ease-out;
}

.references-container {
  width: 100%;
  max-width: 1400px;
  height: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: linear-gradient(135deg, #00723F 0%, #50B848 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  flex-shrink: 0;
}

.header-content {
  flex: 1;
}

.title {
  margin: 0 0 6px 0;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.subtitle {
  margin: 0;
  opacity: 0.95;
  font-size: 14px;
  font-weight: 400;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  flex-shrink: 0;
  margin-left: 20px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* CONTENT SCROLL - CON SCROLLBAR MEJORADA */
.content-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 32px;
  scrollbar-width: thin;
  scrollbar-color: #00723F #f1f1f1;
}

/* SEARCH */
.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 14px 50px 14px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.search-input:focus {
  border-color: #00723F;
  box-shadow: 0 0 0 3px rgba(0, 114, 63, 0.1);
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  pointer-events: none;
}

/* FILTERS */
.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-select {
  flex: 1;
  min-width: 220px;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  background-color: white;
  transition: all 0.3s ease;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.filter-select:focus {
  border-color: #00723F;
  box-shadow: 0 0 0 3px rgba(0, 114, 63, 0.1);
}

/* LIBRARY LINK */
.library-link {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #FFF9E6 0%, #FFF5D6 100%);
  border-left: 4px solid #DD971A;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(221, 151, 26, 0.1);
}

.library-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.library-content {
  flex: 1;
}

.library-content strong {
  display: block;
  color: #024731;
  margin-bottom: 6px;
  font-size: 16px;
}

.library-content p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.library-btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #DD971A;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(221, 151, 26, 0.3);
}

.library-btn:hover {
  background-color: #B08208;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(221, 151, 26, 0.4);
}

/* RESULTS COUNT */
.results-count {
  padding: 14px 20px;
  background: linear-gradient(135deg, #E8F4EC 0%, #D4EFE0 100%);
  color: #024731;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  margin-bottom: 24px;
  font-size: 15px;
}

/* REFERENCES LIST */
.references-list {
  display: grid;
  gap: 20px;
  animation: slideUp 0.5s ease-out;
}

.reference-card {
  background: white;
  border: 1px solid #e8e8e8;
  border-left: 4px solid #00723F;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}

.reference-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-left-width: 6px;
}

.card-header {
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.type-badge {
  padding: 6px 14px;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.badge-libro {
  background-color: #E8F4EC;
  color: #00723F;
}

.badge-articulo {
  background-color: #E3F2FD;
  color: #1976D2;
}

.badge-guia {
  background-color: #FFF9E6;
  color: #DD971A;
}

.badge-revista {
  background-color: #F3E5F5;
  color: #7B1FA2;
}

.specialty-tag {
  padding: 6px 14px;
  background-color: #F5F5F5;
  color: #666;
  border-radius: 14px;
  font-size: 12px;
  font-weight: 500;
}

.reference-title {
  margin: 0 0 14px 0;
  font-size: 20px;
  font-weight: 700;
  color: #024731;
  line-height: 1.4;
}

.reference-authors {
  margin: 0 0 10px 0;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
}

.reference-authors strong {
  font-weight: 600;
}

.reference-info {
  margin: 0 0 14px 0;
  color: #777;
  font-size: 13px;
}

.reference-description {
  margin: 0 0 18px 0;
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.access-badge {
  padding: 8px 14px;
  background-color: #E3F2FD;
  color: #1976D2;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.access-btn {
  padding: 10px 24px;
  background-color: #00723F;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 114, 63, 0.3);
}

.access-btn:hover {
  background-color: #024731;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 114, 63, 0.4);
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #ddd;
  margin-top: 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #024731;
  font-size: 20px;
}

.empty-state p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* SCROLLBAR PERSONALIZADA - WEBKIT (Chrome, Safari, Edge) */
.content-scroll::-webkit-scrollbar {
  width: 12px;
}

.content-scroll::-webkit-scrollbar-track {
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
  margin: 8px 0;
}

.content-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #00723F 0%, #024731 100%);
  border-radius: 10px;
  border: 2px solid #f8f9fa;
  transition: background 0.3s ease;
}

.content-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #024731 0%, #00723F 100%);
  border-color: #e9ecef;
}

.content-scroll::-webkit-scrollbar-thumb:active {
  background: #024731;
}

/* ANIMATIONS */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .references-wrapper {
    padding: 12px;
  }

  .header {
    padding: 20px 24px;
  }

  .content-scroll {
    padding: 20px 24px;
  }

  .content-scroll::-webkit-scrollbar {
    width: 10px;
  }
}

@media (max-width: 768px) {
  .references-wrapper {
    padding: 8px;
  }

  .header {
    padding: 16px 20px;
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .close-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    margin: 0;
  }

  .title {
    font-size: 22px;
  }

  .subtitle {
    font-size: 13px;
  }

  .content-scroll {
    padding: 16px 20px;
  }

  .content-scroll::-webkit-scrollbar {
    width: 8px;
  }

  .filters {
    flex-direction: column;
  }

  .filter-select {
    min-width: 100%;
  }

  .library-link {
    flex-direction: column;
    text-align: center;
  }

  .card-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .access-btn {
    text-align: center;
    width: 100%;
  }

  .reference-title {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .references-wrapper {
    padding: 4px;
  }

  .header {
    padding: 12px 16px;
  }

  .title {
    font-size: 20px;
    margin-bottom: 4px;
  }

  .content-scroll {
    padding: 12px 16px;
  }

  .content-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .reference-card {
    padding: 16px;
  }
}
</style>