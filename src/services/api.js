import axios from 'axios'

// Direccion central del backend
const direccionApi =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:3001'

// Crear instancia de comunicacion con la API
const instanciaApi = axios.create({
  baseURL: direccionApi,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Incorporar automaticamente el token JWT
instanciaApi.interceptors.request.use((configuracion) => {

  const tokenAcceso = sessionStorage.getItem('nutrivida_token')

  if (tokenAcceso) {
    configuracion.headers.Authorization = `Bearer ${tokenAcceso}`
  }

  return configuracion
})

export default instanciaApi
