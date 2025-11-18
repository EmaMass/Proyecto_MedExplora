import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import Content from './models/Content.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

console.log('MONGODB_URI:', process.env.MONGODB_URI)

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => console.error('Error conectando MongoDB:', err))

// --- Rutas CMS ---
// Obtener contenido por página
app.get('/api/content/:page', async (req, res) => {
  try {
    const { page } = req.params
    const content = await Content.findOne({ page })
    if (!content) {
      return res.json({ page, text: '', image: '' })
    }
    res.json(content)
  } catch (err) {
    console.error('Error obteniendo contenido:', err)
    res.status(500).json({ error: err.message })
  }
})

// Guardar / Actualizar contenido
app.post('/api/content/:page', async (req, res) => {
  try {
    const { page } = req.params
    const { text, image } = req.body

    const updated = await Content.findOneAndUpdate(
      { page },
      { text, image },
      { new: true, upsert: true }
    )

    res.json({ success: true, content: updated })
  } catch (err) {
    console.error('Error guardando contenido:', err)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor CMS escuchando en http://localhost:${PORT}`)
})