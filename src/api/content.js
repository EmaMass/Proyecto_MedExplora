import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

export const getContent = async (page) => {
  const res = await api.get(`/content/${page}`)
  return res.data
}

export const updateContent = async (page, data) => {
  const res = await api.post(`/content/${page}`, data)
  return res.data
}