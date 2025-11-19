import mongoose from 'mongoose'

const ContentSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  text: { type: String, default: '' },
  image: { type: String, default: '' }, // También se usa para URLs de video
  video: { type: String, default: '' }, // Campo adicional para videos
  metadata: {
    lastUpdated: { type: Date, default: Date.now },
    section: { type: String, default: '' },
    category: { type: String, default: '' }
  }
})

// Índices para búsqueda rápida
ContentSchema.index({ page: 1 })
ContentSchema.index({ 'metadata.section': 1 })
ContentSchema.index({ 'metadata.category': 1 })

export default mongoose.model('Content', ContentSchema)