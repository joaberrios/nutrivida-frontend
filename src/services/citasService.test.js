import { beforeEach, describe, expect, it, vi } from 'vitest'
import { guardarCita, listarCitas } from './citasService'

describe('Servicio de citas de NutriVida', () => {
  const citaEjemplo = {
    servicio: 'Consulta nutricional',
    codigoServicio: 'NUT001',
    nutricionista: 'Nutricionista 1',
    fecha: '2026-11-10',
    hora: '10:00'
  }

  beforeEach(() => {
    localStorage.clear()

    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'cita-123')
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('devuelve una lista vacía cuando no existen citas', () => {
    expect(listarCitas()).toEqual([])
  })

  it('guarda una cita correctamente', () => {
    const resultado = guardarCita(citaEjemplo)

    expect(resultado).toEqual({
      ...citaEjemplo,
      id: 'cita-123',
      estado: 'Confirmada'
    })

    expect(listarCitas()).toHaveLength(1)
  })

  it('recupera las citas guardadas en localStorage', () => {
    localStorage.setItem(
      'nutrivida_citas',
      JSON.stringify([citaEjemplo])
    )

    expect(listarCitas()).toEqual([citaEjemplo])
  })

  it('impide reservar dos citas con el mismo nutricionista, fecha y hora', () => {
    guardarCita(citaEjemplo)

    expect(() => guardarCita(citaEjemplo)).toThrow(
      'Este nutricionista ya tiene una cita'
    )

    expect(listarCitas()).toHaveLength(1)
  })

  it('permite reservar otra hora con el mismo nutricionista', () => {
    guardarCita(citaEjemplo)

    guardarCita({
      ...citaEjemplo,
      hora: '11:00'
    })

    expect(listarCitas()).toHaveLength(2)
  })

  it('rechaza los datos almacenados cuando no son una lista', () => {
    localStorage.setItem(
      'nutrivida_citas',
      JSON.stringify({ error: 'datos inválidos' })
    )

    expect(() => listarCitas()).toThrow(
      'Los datos de las citas no son'
    )
  })
})