import { solicitarApi } from './api'

// Consultar el catalogo de servicios.
export async function listarServiciosApi(senal) {
  return solicitarApi('/servicios', {
    metodo: 'GET',
    senal
  })
}

// Crear un servicio como administrador.
export async function crearServicioApi(datos, token) {
  return solicitarApi('/servicios', {
    metodo: 'POST',
    datos,
    token
  })
}

// Actualizar un servicio existente.
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

// Eliminar un servicio del catalogo.
export async function eliminarServicioApi(codigo, token) {
  return solicitarApi(
    `/servicios/${encodeURIComponent(codigo)}`,
    {
      metodo: 'DELETE',
      token
    }
  )
}
