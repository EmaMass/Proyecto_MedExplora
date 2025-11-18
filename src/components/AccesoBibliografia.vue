<template>
  <div class="references-container">
    <!-- Header -->
    <div class="header">
      <h2 class="title">📚 Referencias Bibliográficas</h2>
      <p class="subtitle">Recursos académicos de medicina</p>
    </div>

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
</template>

<script setup>
import { ref, computed } from 'vue'

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
.references-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #00723F 0%, #50B848 100%);
  color: white;
  border-radius: 12px;
}

.title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #00723F;
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-select {
  flex: 1;
  min-width: 200px;
  padding: 10px 14px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  background-color: white;
  transition: border-color 0.3s;
}

.filter-select:focus {
  border-color: #00723F;
}

.library-link {
  display: flex;
  gap: 16px;
  padding: 20px;
  background-color: #FFF9E6;
  border-left: 4px solid #DD971A;
  border-radius: 8px;
  margin-bottom: 20px;
}

.library-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.library-content {
  flex: 1;
}

.library-content strong {
  display: block;
  color: #024731;
  margin-bottom: 4px;
}

.library-content p {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
}

.library-btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: #DD971A;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.library-btn:hover {
  background-color: #B08208;
}

.results-count {
  padding: 12px;
  background-color: #E8F4EC;
  color: #024731;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  margin-bottom: 20px;
}

.references-list {
  display: grid;
  gap: 20px;
}

.reference-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-left: 4px solid #00723F;
  border-radius: 10px;
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.reference-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
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
  padding: 4px 12px;
  background-color: #F5F5F5;
  color: #666;
  border-radius: 12px;
  font-size: 12px;
}

.reference-title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #024731;
}

.reference-authors {
  margin: 0 0 8px 0;
  color: #555;
  font-size: 14px;
}

.reference-info {
  margin: 0 0 12px 0;
  color: #777;
  font-size: 13px;
}

.reference-description {
  margin: 0 0 16px 0;
  color: #666;
  line-height: 1.5;
  font-size: 14px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.access-badge {
  padding: 6px 12px;
  background-color: #E3F2FD;
  color: #1976D2;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.access-btn {
  padding: 8px 20px;
  background-color: #00723F;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.access-btn:hover {
  background-color: #024731;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
  border: 2px dashed #ddd;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  color: #024731;
}

.empty-state p {
  margin: 0;
  color: #666;
}

@media (max-width: 768px) {
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
  }
}
</style>