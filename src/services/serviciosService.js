
import serviciosIniciales from '../data/servicios'
import { solicitarApi } from './api'

const CLAVE = 'servicios'

// Cargar los datos iniciales
function iniciarDatos() {
  const datos = localStorage.getItem(CLAVE)

  if (!datos) {
    localStorage.setItem(CLAVE, JSON.stringify(serviciosIniciales))
  }
}

// Listar servicios desde el almacenamiento local
export function listarServicios() {
  iniciarDatos()

  const datos = localStorage.getItem(CLAVE)
  return JSON.parse(datos)
}

// Crear servicio
export function crearServicio(nuevoServicio) {
  const servicios = listarServicios()

  servicios.push(nuevoServicio)

  localStorage.setItem(CLAVE, JSON.stringify(servicios))

  return nuevoServicio
}

// Actualizar servicio
export function actualizarServicio(codigo, servicioActualizado) {
  const servicios = listarServicios()

  const nuevosServicios = servicios.map((servicio) =>
    servicio.codigo === codigo
      ? { ...servicio, ...servicioActualizado }
      : servicio
  )

  localStorage.setItem(CLAVE, JSON.stringify(nuevosServicios))

  return nuevosServicios
}

// Eliminar servicio
export function eliminarServicio(codigo) {
  const servicios = listarServicios()

  const nuevosServicios = servicios.filter(
    (servicio) => servicio.codigo !== codigo
  )

  localStorage.setItem(CLAVE, JSON.stringify(nuevosServicios))

  return nuevosServicios
}

// Listar servicios desde la API REST
export async function listarServiciosApi(senal) {
  return solicitarApi('/servicios', {
    metodo: 'GET',
    senal
  })
}

export async function crearServicioApi(datos, token) {
  return solicitarApi('/servicios', {
    metodo: 'POST',
    datos,
    token
  })
}

export async function actualizarServicioApi(codigo, datos, token) {
  return solicitarApi(
    `/servicios/${encodeURIComponent(codigo)}`,
    {
      metodo: 'PUT',
      datos,
      token
    }
  )
}

export async function eliminarServicioApi(codigo, token) {
  return solicitarApi(
    `/servicios/${encodeURIComponent(codigo)}`,
    {
      metodo: 'DELETE',
      token
    }
  )
}
