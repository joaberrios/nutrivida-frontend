import { describe, it, expect, vi, beforeEach } from 'vitest'
import { solicitarApi } from './api'

import {
  crearReserva,
  listarReservas
} from './reservasService'

vi.mock('./api', () => ({
  solicitarApi: vi.fn()
}))

const token = 'token-de-prueba'

const datosCita = {
  codigoServicio: 'CN001',
  nutricionistaId: 2,
  fecha: '2026-11-24',
  hora: '11:00'
}

const reservaEjemplo = {
  id: 9,
  codigo_servicio: 'CN001',
  nutricionista: 'Nutricionista 2',
  fecha_reserva: '2026-11-24',
  hora_reserva: '11:00',
  duracion_minutos: 50,
  precio: 35000,
  estado: 'confirmada'
}

describe('Servicio de reservas', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('obtiene las reservas del paciente autenticado', async () => {
    solicitarApi.mockResolvedValue([reservaEjemplo])

    const resultado = await listarReservas(token)

    expect(resultado).toEqual([reservaEjemplo])

    expect(solicitarApi).toHaveBeenCalledWith(
      '/reservas',
      {
        token,
        senal: undefined
      }
    )
  })

  it('permite obtener un historial vacío', async () => {
    solicitarApi.mockResolvedValue([])

    expect(await listarReservas(token)).toEqual([])
  })

  it('crea una reserva utilizando JWT', async () => {
    solicitarApi.mockResolvedValue({
      reserva: reservaEjemplo
    })

    const resultado = await crearReserva(datosCita, token)

    expect(resultado).toEqual(reservaEjemplo)

    expect(solicitarApi).toHaveBeenCalledWith(
      '/reservas',
      {
        metodo: 'POST',
        token,
        datos: {
          codigo_servicio: 'CN001',
          nutricionista_id: 2,
          fecha_reserva: '2026-11-24',
          hora_reserva: '11:00'
        }
      }
    )
  })

  it('no permite enviar un precio manipulado', async () => {
    solicitarApi.mockResolvedValue({
      reserva: reservaEjemplo
    })

    await crearReserva({
      ...datosCita,
      precio: 1,
      usuario_id: 999
    }, token)

    const solicitud = solicitarApi.mock.calls[0][1]

    expect(solicitud.datos).not.toHaveProperty('precio')
    expect(solicitud.datos).not.toHaveProperty('usuario_id')
  })

  it('propaga el error de horario ocupado', async () => {
    const error = new Error('Horario ocupado')
    error.estado = 409

    solicitarApi.mockRejectedValue(error)

    await expect(
      crearReserva(datosCita, token)
    ).rejects.toMatchObject({
      estado: 409
    })
  })

  it('propaga el error de sesión vencida', async () => {
    const error = new Error('Sesion vencida')
    error.estado = 401

    solicitarApi.mockRejectedValue(error)

    await expect(
      listarReservas(token)
    ).rejects.toMatchObject({
      estado: 401
    })
  })
})
