import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'

const {
  solicitudAxios,
  crearCliente,
  esCancelacion
} = vi.hoisted(() => ({
  solicitudAxios: vi.fn(),
  crearCliente: vi.fn(),
  esCancelacion: vi.fn()
}))

vi.mock('axios', () => ({
  default: {
    create: crearCliente,
    isCancel: esCancelacion
  }
}))

describe('Cliente HTTP de NutriVida mediante Axios', () => {
  let solicitarApi

  beforeEach(async () => {
    vi.resetModules()

    vi.stubEnv(
      'VITE_API_URL',
      'http://localhost:3001/api'
    )

    solicitudAxios.mockReset()
    crearCliente.mockReset()
    esCancelacion.mockReset()

    crearCliente.mockReturnValue({
      request: solicitudAxios
    })

    esCancelacion.mockImplementation(
      error => error?.code === 'ERR_CANCELED'
    )

    const modulo = await import('./api')
    solicitarApi = modulo.solicitarApi
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  function simularRespuesta(estado, datos) {
    solicitudAxios.mockResolvedValue({
      status: estado,
      data: datos
    })
  }

  it('configura Axios con la direccion del backend', () => {
    expect(crearCliente).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3001/api',
      headers: {
        Accept: 'application/json'
      }
    })
  })

  it('realiza una consulta GET correctamente', async () => {
    simularRespuesta(200, [])

    expect(
      await solicitarApi('/servicios')
    ).toEqual([])

    expect(solicitudAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/servicios',
        method: 'GET'
      })
    )
  })

  it('envia los datos mediante POST', async () => {
    const datos = {
      codigo_servicio: 'CN001'
    }

    simularRespuesta(201, {
      mensaje: 'Reserva creada'
    })

    await solicitarApi('/reservas', {
      metodo: 'POST',
      datos
    })

    expect(solicitudAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/reservas',
        method: 'POST',
        data: datos,
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        })
      })
    )
  })

  it('envia el JWT mediante Authorization Bearer', async () => {
    simularRespuesta(200, [])

    await solicitarApi('/reservas', {
      token: 'token-ficticio'
    })

    expect(solicitudAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer token-ficticio'
        })
      })
    )
  })

  it.each([
    [400, 'Datos invalidos'],
    [401, 'Sesion no valida'],
    [403, 'Acceso denegado'],
    [409, 'Horario ocupado'],
    [429, 'Demasiados intentos'],
    [500, 'Error interno']
  ])(
    'maneja correctamente el error HTTP %s',
    async (estado, mensaje) => {
      solicitudAxios.mockRejectedValue({
        response: {
          status: estado,
          data: { mensaje }
        }
      })

      await expect(
        solicitarApi('/reservas')
      ).rejects.toMatchObject({
        estado,
        message: mensaje
      })
    }
  )

  it('maneja una respuesta sin contenido', async () => {
    simularRespuesta(204, null)

    expect(
      await solicitarApi('/servicios/CN001', {
        metodo: 'DELETE'
      })
    ).toBeNull()
  })

  it('informa cuando no hay conexion con el servidor', async () => {
    solicitudAxios.mockRejectedValue({
      request: {}
    })

    await expect(
      solicitarApi('/servicios')
    ).rejects.toThrow(
      'No se pudo conectar con el servidor.'
    )
  })

  it('rechaza respuestas sin datos validos', async () => {
    simularRespuesta(200, null)

    await expect(
      solicitarApi('/servicios')
    ).rejects.toThrow(
      'El servidor devolvio una respuesta no valida.'
    )
  })

  it('permite cancelar una solicitud', async () => {
    const error = new Error('Solicitud cancelada')
    error.name = 'CanceledError'
    error.code = 'ERR_CANCELED'

    const controlador = new AbortController()
    controlador.abort()

    solicitudAxios.mockRejectedValue(error)

    await expect(
      solicitarApi('/servicios', {
        senal: controlador.signal
      })
    ).rejects.toMatchObject({
      code: 'ERR_CANCELED'
    })

    expect(solicitudAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        signal: controlador.signal
      })
    )
  })

  it('rechaza solicitudes sin configurar la API', async () => {
    vi.stubEnv('VITE_API_URL', '')
    vi.resetModules()

    const modulo = await import('./api')

    await expect(
      modulo.solicitarApi('/servicios')
    ).rejects.toThrow(
      'La direccion de la API no esta configurada.'
    )

    expect(solicitudAxios).not.toHaveBeenCalled()
  })
})
