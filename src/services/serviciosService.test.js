import { beforeEach, describe, expect, it, vi } from 'vitest'

import { solicitarApi } from './api'

import {
  listarServiciosApi,
  crearServicioApi,
  actualizarServicioApi,
  eliminarServicioApi
} from './serviciosService'

// Simular la comunicacion con el backend.
vi.mock('./api', () => ({
  solicitarApi: vi.fn()
}))

const tokenPrueba = 'token-ficticio-administrador'

const servicioPrueba = {
  codigo: 'CN001',
  tipo: 'Consulta',
  nombre: 'Consulta nutricional',
  duracion: '50 min',
  modalidad: 'Presencial',
  profesional: 'Nutricionista',
  precio: 35000,
  descripcion: 'Servicio de prueba'
}

describe('Servicios de NutriVida mediante API REST', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('consulta el catalogo mediante GET', async () => {
    const controlador = new AbortController()

    solicitarApi.mockResolvedValue([servicioPrueba])

    const resultado = await listarServiciosApi(
      controlador.signal
    )

    expect(resultado).toEqual([servicioPrueba])

    expect(solicitarApi).toHaveBeenCalledWith(
      '/servicios',
      {
        metodo: 'GET',
        senal: controlador.signal
      }
    )
  })

  it('crea un servicio mediante POST y JWT', async () => {
    solicitarApi.mockResolvedValue(servicioPrueba)

    const resultado = await crearServicioApi(
      servicioPrueba,
      tokenPrueba
    )

    expect(resultado).toEqual(servicioPrueba)

    expect(solicitarApi).toHaveBeenCalledWith(
      '/servicios',
      {
        metodo: 'POST',
        datos: servicioPrueba,
        token: tokenPrueba
      }
    )
  })

  it('actualiza un servicio mediante PUT', async () => {
    const servicioActualizado = {
      ...servicioPrueba,
      precio: 40000
    }

    solicitarApi.mockResolvedValue(servicioActualizado)

    const resultado = await actualizarServicioApi(
      'CN001',
      servicioActualizado,
      tokenPrueba
    )

    expect(resultado).toEqual(servicioActualizado)

    expect(solicitarApi).toHaveBeenCalledWith(
      '/servicios/CN001',
      {
        metodo: 'PUT',
        datos: servicioActualizado,
        token: tokenPrueba
      }
    )
  })

  it('elimina un servicio mediante DELETE', async () => {
    solicitarApi.mockResolvedValue(null)

    const resultado = await eliminarServicioApi(
      'CN001',
      tokenPrueba
    )

    expect(resultado).toBeNull()

    expect(solicitarApi).toHaveBeenCalledWith(
      '/servicios/CN001',
      {
        metodo: 'DELETE',
        token: tokenPrueba
      }
    )
  })

  it('conserva el error cuando existe un codigo duplicado', async () => {
    const error = new Error('Codigo duplicado')
    error.estado = 409

    solicitarApi.mockRejectedValue(error)

    await expect(
      crearServicioApi(servicioPrueba, tokenPrueba)
    ).rejects.toMatchObject({
      estado: 409
    })
  })

  it('conserva el rechazo cuando faltan permisos', async () => {
    const error = new Error('Acceso denegado')
    error.estado = 403

    solicitarApi.mockRejectedValue(error)

    await expect(
      eliminarServicioApi('CN001', tokenPrueba)
    ).rejects.toMatchObject({
      estado: 403
    })
  })
})
