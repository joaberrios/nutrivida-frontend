import { solicitarApi } from './api'
import { crearReservaDTO } from '../dto/reserva.dto'

// Obtener las reservas del usuario autenticado.
export function listarReservas(token, senal) {
  return solicitarApi('/reservas', {
    token,
    senal
  })
}

// Registrar una nueva reserva en PostgreSQL.
export async function crearReserva(datos, token) {
  const respuesta = await solicitarApi('/reservas', {
    metodo: 'POST',
    token,
    datos: crearReservaDTO(datos)
  })

  return respuesta.reserva
}
