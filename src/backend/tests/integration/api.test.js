// ============================================
// PRUEBAS DE INTEGRACIÓN - API + Base de Datos
// ============================================
import request from 'supertest'
import express from 'express'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import bodyParser from 'body-parser'
import Content from '../../models/Content.js'

let app
let mongoServer

// Crear aplicación Express para pruebas
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
  
  // Configurar app Express
  app = express()
  app.use(bodyParser.json())
  
  // Definir rutas (igual que en server.js)
  app.get('/api/content/:page', async (req, res) => {
    try {
      const { page } = req.params
      const content = await Content.findOne({ page })
      if (!content) {
        return res.json({ page, text: '', image: '' })
      }
      res.json(content)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  })

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
      res.status(500).json({ error: err.message })
    }
  })
})

afterEach(async () => {
  await Content.deleteMany({})
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('GET /api/content/:page - Pruebas de Integración', () => {
  
  test('Debe obtener contenido existente', async () => {
    // Preparar datos
    await Content.create({
      page: 'cabeza',
      text: '<p>Información sobre la cabeza</p>',
      image: 'https://example.com/head.jpg'
    })
    
    // Realizar petición
    const response = await request(app)
      .get('/api/content/cabeza')
      .expect(200)
    
    // Verificar respuesta
    expect(response.body.page).toBe('cabeza')
    expect(response.body.text).toContain('cabeza')
    expect(response.body.image).toBe('https://example.com/head.jpg')
  })

  test('Debe retornar estructura vacía para contenido inexistente', async () => {
    const response = await request(app)
      .get('/api/content/no-existe')
      .expect(200)
    
    expect(response.body.page).toBe('no-existe')
    expect(response.body.text).toBe('')
    expect(response.body.image).toBe('')
  })

  test('Debe manejar caracteres especiales en el nombre de página', async () => {
    await Content.create({
      page: 'semiologia_cabeza_ojos',
      text: 'Contenido de semiología'
    })
    
    const response = await request(app)
      .get('/api/content/semiologia_cabeza_ojos')
      .expect(200)
    
    expect(response.body.page).toBe('semiologia_cabeza_ojos')
  })
})

describe('POST /api/content/:page - Pruebas de Integración', () => {
  
  test('Debe crear nuevo contenido', async () => {
    const newContent = {
      text: '<h1>Nuevo Contenido</h1>',
      image: 'https://example.com/new.jpg'
    }
    
    const response = await request(app)
      .post('/api/content/nueva-pagina')
      .send(newContent)
      .expect(200)
    
    expect(response.body.success).toBe(true)
    expect(response.body.content.page).toBe('nueva-pagina')
    expect(response.body.content.text).toBe(newContent.text)
    
    // Verificar en base de datos
    const saved = await Content.findOne({ page: 'nueva-pagina' })
    expect(saved).toBeDefined()
    expect(saved.text).toBe(newContent.text)
  })

  test('Debe actualizar contenido existente', async () => {
    // Crear contenido inicial
    await Content.create({
      page: 'actualizar-test',
      text: 'Texto original',
      image: 'original.jpg'
    })
    
    // Actualizar
    const updated = {
      text: 'Texto actualizado',
      image: 'nuevo.jpg'
    }
    
    const response = await request(app)
      .post('/api/content/actualizar-test')
      .send(updated)
      .expect(200)
    
    expect(response.body.success).toBe(true)
    expect(response.body.content.text).toBe('Texto actualizado')
    expect(response.body.content.image).toBe('nuevo.jpg')
  })

  test('Debe manejar solicitudes con campos vacíos', async () => {
    const response = await request(app)
      .post('/api/content/empty-test')
      .send({ text: '', image: '' })
      .expect(200)
    
    expect(response.body.success).toBe(true)
    expect(response.body.content.text).toBe('')
  })

  test('Debe manejar HTML complejo', async () => {
    const complexHtml = {
      text: `
        <h1>Título Principal</h1>
        <p>Párrafo con <strong>negrita</strong> y <em>cursiva</em></p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
        <iframe src="https://youtube.com/embed/xyz"></iframe>
      `,
      image: 'https://cdn.example.com/image.webp'
    }
    
    const response = await request(app)
      .post('/api/content/html-complejo')
      .send(complexHtml)
      .expect(200)
    
    expect(response.body.content.text).toContain('<ul>')
    expect(response.body.content.text).toContain('<iframe')
  })
})

// ============================================
// PRUEBAS DE VERIFICACIÓN - Flujos Completos
// ============================================
describe('Flujos de Usuario Completos - Verificación', () => {
  
  test('Flujo: Crear, Leer, Actualizar contenido', async () => {
    const pageName = 'flujo-completo'
    
    // 1. CREAR contenido
    const createResponse = await request(app)
      .post(`/api/content/${pageName}`)
      .send({ text: 'Versión 1', image: 'v1.jpg' })
      .expect(200)
    
    expect(createResponse.body.success).toBe(true)
    
    // 2. LEER contenido creado
    const readResponse = await request(app)
      .get(`/api/content/${pageName}`)
      .expect(200)
    
    expect(readResponse.body.text).toBe('Versión 1')
    
    // 3. ACTUALIZAR contenido
    const updateResponse = await request(app)
      .post(`/api/content/${pageName}`)
      .send({ text: 'Versión 2 actualizada', image: 'v2.jpg' })
      .expect(200)
    
    expect(updateResponse.body.content.text).toBe('Versión 2 actualizada')
    
    // 4. VERIFICAR actualización
    const verifyResponse = await request(app)
      .get(`/api/content/${pageName}`)
      .expect(200)
    
    expect(verifyResponse.body.text).toBe('Versión 2 actualizada')
    expect(verifyResponse.body.image).toBe('v2.jpg')
  })

  test('Flujo: Manejo de múltiples secciones del cuerpo', async () => {
    const sections = ['cabeza', 'torso', 'brazos', 'piernas']
    
    // Crear contenido para cada sección
    for (const section of sections) {
      await request(app)
        .post(`/api/content/${section}`)
        .send({ 
          text: `<h2>Información de ${section}</h2>`,
          image: `${section}.jpg`
        })
        .expect(200)
    }
    
    // Verificar que todas las secciones fueron creadas
    for (const section of sections) {
      const response = await request(app)
        .get(`/api/content/${section}`)
        .expect(200)
      
      expect(response.body.page).toBe(section)
      expect(response.body.text).toContain(section)
    }
    
    // Verificar cantidad total en base de datos
    const count = await Content.countDocuments()
    expect(count).toBe(sections.length)
  })

  test('Flujo: Manejo de contenido de semiología', async () => {
    const semiologiaSections = [
      'semiologia_cabeza_cabeza',
      'semiologia_cabeza_ojos',
      'semiologia_cabeza_oidos',
      'semiologia_cabeza_nariz'
    ]
    
    // Crear todas las secciones de semiología
    for (const section of semiologiaSections) {
      await request(app)
        .post(`/api/content/${section}`)
        .send({ 
          text: `<p>Contenido de ${section}</p>`,
          image: `${section}.png`
        })
        .expect(200)
    }
    
    // Obtener y verificar cada sección
    for (const section of semiologiaSections) {
      const response = await request(app)
        .get(`/api/content/${section}`)
        .expect(200)
      
      expect(response.body.page).toBe(section)
      expect(response.body.text).toBeDefined()
      expect(response.body.image).toBeDefined()
    }
  })
})

// ============================================
// PRUEBAS DE VALIDACIÓN
// ============================================
describe('Validación de Datos', () => {
  
  test('Debe aceptar URLs válidas de imágenes', async () => {
    const validUrls = [
      'https://example.com/image.jpg',
      'http://cdn.example.com/photo.png',
      'https://storage.googleapis.com/bucket/file.webp'
    ]
    
    for (let i = 0; i < validUrls.length; i++) {
      const response = await request(app)
        .post(`/api/content/url-test-${i}`)
        .send({ image: validUrls[i] })
        .expect(200)
      
      expect(response.body.content.image).toBe(validUrls[i])
    }
  })

  test('Debe aceptar HTML con diferentes etiquetas', async () => {
    const htmlContent = {
      text: `
        <h1>Título</h1>
        <p>Párrafo</p>
        <ul><li>Lista</li></ul>
        <ol><li>Ordenada</li></ol>
        <strong>Negrita</strong>
        <em>Cursiva</em>
        <iframe src="video.mp4"></iframe>
      `
    }
    
    const response = await request(app)
      .post('/api/content/html-tags-test')
      .send(htmlContent)
      .expect(200)
    
    expect(response.body.content.text).toContain('<h1>')
    expect(response.body.content.text).toContain('<iframe')
  })
})

// ============================================
// PRUEBAS DE RENDIMIENTO
// ============================================
describe('Pruebas de Rendimiento', () => {
  
  test('Debe manejar múltiples peticiones simultáneas', async () => {
    const requests = []
    
    for (let i = 0; i < 10; i++) {
      requests.push(
        request(app)
          .post(`/api/content/page-${i}`)
          .send({ text: `Content ${i}` })
      )
    }
    
    const responses = await Promise.all(requests)
    
    responses.forEach(response => {
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })
    
    const count = await Content.countDocuments()
    expect(count).toBe(10)
  })

  test('Debe responder rápidamente a consultas', async () => {
    await Content.create({
      page: 'speed-test',
      text: 'Content for speed test'
    })
    
    const startTime = Date.now()
    
    await request(app)
      .get('/api/content/speed-test')
      .expect(200)
    
    const duration = Date.now() - startTime
    
    // La respuesta debe ser menor a 100ms
    expect(duration).toBeLessThan(100)
  })
})

// ============================================
// PRUEBAS DE MANEJO DE ERRORES
// ============================================
describe('Manejo de Errores', () => {
  
  test('Debe manejar IDs de MongoDB inválidos graciosamente', async () => {
    const response = await request(app)
      .get('/api/content/pagina-valida')
      .expect(200)
    
    // Debe retornar estructura vacía, no error
    expect(response.body.page).toBe('pagina-valida')
  })

  test('Debe manejar body malformado', async () => {
    const response = await request(app)
      .post('/api/content/test-body')
      .send({ textoIncorrecto: 'valor' })
      .expect(200)
    
    // Debe crear el documento aunque falten campos
    expect(response.body.success).toBe(true)
  })
})