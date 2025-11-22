// ============================================
// PRUEBAS UNITARIAS - Backend API
// ============================================
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Content from '../../models/Content.js'

let mongoServer

// Setup antes de todas las pruebas
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

// Limpiar después de cada prueba
afterEach(async () => {
  await Content.deleteMany({})
})

// Cerrar conexión después de todas las pruebas
afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Content Model - Pruebas Unitarias', () => {
  
  test('Debe crear un documento de contenido válido', async () => {
    const contentData = {
      page: 'test-page',
      text: '<p>Contenido de prueba</p>',
      image: 'https://example.com/image.jpg'
    }
    
    const content = new Content(contentData)
    const savedContent = await content.save()
    
    expect(savedContent._id).toBeDefined()
    expect(savedContent.page).toBe(contentData.page)
    expect(savedContent.text).toBe(contentData.text)
    expect(savedContent.image).toBe(contentData.image)
  })

  test('Debe requerir el campo "page"', async () => {
    const content = new Content({
      text: 'Texto sin página',
      image: 'https://example.com/image.jpg'
    })
    
    let error
    try {
      await content.save()
    } catch (err) {
      error = err
    }
    
    expect(error).toBeDefined()
    expect(error.errors.page).toBeDefined()
  })

  test('Debe permitir actualizar contenido existente', async () => {
    const original = await Content.create({
      page: 'update-test',
      text: 'Texto original',
      image: 'original.jpg'
    })
    
    const updated = await Content.findOneAndUpdate(
      { page: 'update-test' },
      { text: 'Texto actualizado' },
      { new: true }
    )
    
    expect(updated.text).toBe('Texto actualizado')
    expect(updated.image).toBe('original.jpg')
  })

  test('Debe retornar null si no encuentra el contenido', async () => {
    const content = await Content.findOne({ page: 'no-existe' })
    expect(content).toBeNull()
  })

  test('Debe manejar múltiples documentos correctamente', async () => {
    await Content.create({ page: 'page1', text: 'Content 1' })
    await Content.create({ page: 'page2', text: 'Content 2' })
    await Content.create({ page: 'page3', text: 'Content 3' })
    
    const count = await Content.countDocuments()
    expect(count).toBe(3)
  })
})

// ============================================
// PRUEBAS DE VALIDACIÓN DE DATOS
// ============================================
describe('Content Model - Validación de Datos', () => {
  
  test('Debe aceptar texto HTML válido', async () => {
    const htmlContent = {
      page: 'html-test',
      text: '<h1>Título</h1><p>Párrafo con <strong>negrita</strong></p>',
      image: ''
    }
    
    const content = await Content.create(htmlContent)
    expect(content.text).toContain('<h1>')
    expect(content.text).toContain('<strong>')
  })

  test('Debe aceptar URLs de imágenes válidas', async () => {
    const validUrls = [
      'https://example.com/image.jpg',
      'http://cdn.example.com/photo.png',
      'https://storage.googleapis.com/bucket/file.webp'
    ]
    
    for (const url of validUrls) {
      const content = await Content.create({
        page: `url-test-${url}`,
        image: url
      })
      expect(content.image).toBe(url)
    }
  })

  test('Debe permitir campos vacíos opcionales', async () => {
    const minimal = await Content.create({
      page: 'minimal-test'
    })
    
    expect(minimal.text).toBe('')
    expect(minimal.image).toBe('')
  })

  test('Debe rechazar páginas duplicadas', async () => {
    await Content.create({ page: 'duplicate-test', text: 'First' })
    
    let error
    try {
      await Content.create({ page: 'duplicate-test', text: 'Second' })
    } catch (err) {
      error = err
    }
    
    expect(error).toBeDefined()
    expect(error.code).toBe(11000) // Código de error de duplicado en MongoDB
  })
})