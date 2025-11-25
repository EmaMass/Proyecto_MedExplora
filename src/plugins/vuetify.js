/**
 * plugins/vuetify.js - Configuración personalizada con colores UABC
 */

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'uabcTheme',
    themes: {
      uabcTheme: {
        dark: false,
        colors: {
          // Colores primarios UABC
          'uabc-green': '#00723F',
          'uabc-green-dark': '#004d2a',
          'uabc-green-light': '#009653',
          'uabc-yellow': '#DD9500',
          'uabc-yellow-light': '#FFB800',
          'uabc-yellow-dark': '#B87A00',
          
          // Colores base
          primary: '#00723F',
          secondary: '#DD9500',
          accent: '#FFB800',
          error: '#E53935',
          warning: '#FF6F00',
          info: '#0288D1',
          success: '#2E7D32',
          
          // Neutros
          background: '#F8F9FA',
          surface: '#FFFFFF',
          'on-surface': '#212529',
          'on-primary': '#FFFFFF',
          'on-secondary': '#212529',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: {
        textTransform: 'none',
        letterSpacing: '0.25px',
      },
    },
    VCard: {
      elevation: 2,
    },
    VChip: {
      elevation: 0,
    },
  },
})