import instanciaApi from './api'
import { crearServicioRequestDto } from '../dto/servicio.dto'

// Consultar todos los servicios de PostgreSQL
export async function listarServicios() {
  const respuesta = await instanciaApi.get('/api/servicios')
  return respuesta.data
}

// Crear un servicio
export async function crearServicio(datos) {
  const solicitud = crearServicioRequestDto(datos)

  const respuesta = await instanciaApi.post(
    '/api/servicios',
    solicitud
  )

  return respuesta.data.servicio
}

// Actualizar un servicio
export async function actualizarServicio(codigo, datos) {
  const solicitud = crearServicioRequestDto(datos)

  const respuesta = await instanciaApi.put(
    `/api/servicios/${encodeURIComponent(codigo)}`,
    solicitud
  )

  return respuesta.data.servicio
}

// Desactivar un servicio
export async function eliminarServicio(codigo) {
  await instanciaApi.delete(
    `/api/servicios/${encodeURIComponent(codigo)}`
  )
}
