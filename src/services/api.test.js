import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'

describe('Cliente HTTP de NutriVida', () => {
  let solicitarApi
  let peticion

  beforeEach(async () => {
    vi.resetModules()

    vi.stubEnv(
      'VITE_API_URL',
      'http://localhost:3001/api'
    )

    peticion = vi.fn()
    vi.stubGlobal('fetch', peticion)

    const modulo = await import('./api')
    solicitarApi = modulo.solicitarApi
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  function simularRespuesta(estado, datos) {
    peticion.mockResolvedValue({
      ok: estado >= 200 && estado < 300,
      status: estado,
      json: async () => datos
    })
  }

  it('realiza una consulta GET correctamente', async () => {
    simularRespuesta(200, [])

    expect(
      await solicitarApi('/servicios')
    ).toEqual([])

    expect(peticion).toHaveBeenCalledWith(
      'http://localhost:3001/api/servicios',
      expect.objectContaining({
        method: 'GET'
      })
    )
  })

  it('envia los datos en formato JSON', async () => {
    const datos = { codigo_servicio: 'CN001' }

    simularRespuesta(201, { mensaje: 'Reserva creada' })

    await solicitarApi('/reservas', {
      metodo: 'POST',
      datos
    })

    expect(peticion).toHaveBeenCalledWith(
      'http://localhost:3001/api/reservas',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(datos),
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

    expect(peticion).toHaveBeenCalledWith(
      'http://localhost:3001/api/reservas',
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
  ])('maneja correctamente el error HTTP %s', async (estado, mensaje) => {
    simularRespuesta(estado, { mensaje })

    await expect(
      solicitarApi('/reservas')
    ).rejects.toMatchObject({
      estado,
      message: mensaje
    })
  })

  it('maneja una respuesta sin contenido', async () => {
    simularRespuesta(204, null)

    expect(
      await solicitarApi('/servicios/CN001', {
        metodo: 'DELETE'
      })
    ).toBeNull()
  })

  it('informa cuando no hay conexion con el servidor', async () => {
    peticion.mockRejectedValue(
      new TypeError('Failed to fetch')
    )

    await expect(
      solicitarApi('/servicios')
    ).rejects.toThrow(
      'No se pudo conectar con el servidor.'
    )
  })

  it('rechaza respuestas con JSON invalido', async () => {
    peticion.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError('JSON invalido')
      }
    })

    await expect(
      solicitarApi('/servicios')
    ).rejects.toThrow(
      'El servidor devolvio una respuesta no valida.'
    )
  })

  it('permite cancelar una solicitud', async () => {
    const controlador = new AbortController()
    const error = new DOMException(
      'Solicitud cancelada',
      'AbortError'
    )

    controlador.abort()
    peticion.mockRejectedValue(error)

    await expect(
      solicitarApi('/servicios', {
        senal: controlador.signal
      })
    ).rejects.toMatchObject({
      name: 'AbortError'
    })

    expect(peticion).toHaveBeenCalledWith(
      'http://localhost:3001/api/servicios',
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

    expect(peticion).not.toHaveBeenCalled()
  })
})
