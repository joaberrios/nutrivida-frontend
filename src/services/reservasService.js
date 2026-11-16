import { solicitarApi } from './api'

// Obtener las reservas del usuario autenticado
export function listarReservas(token, senal) {
  return solicitarApi('/reservas', {
    token,
    senal
  })
}

// Registrar una nueva reserva en PostgreSQL
export async function crearReserva(datos, token) {
  const respuesta = await solicitarApi('/reservas', {
    metodo: 'POST',
    token,
    datos: {
      codigo_servicio: datos.codigoServicio,
      nutricionista_id: Number(datos.nutricionistaId),
      fecha_reserva: datos.fecha,
      hora_reserva: datos.hora
    }
  })

  return respuesta.reserva
}
