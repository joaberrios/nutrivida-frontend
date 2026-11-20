import { describe, expect, it } from 'vitest'
import { crearReservaDTO } from './reserva.dto'

describe('DTO de reservas', () => {
  it('convierte los datos del formulario al formato del backend', () => {
    const datos = {
      codigoServicio: 'CN001',
      nutricionistaId: '2',
      fecha: '2026-11-24',
      hora: '11:00'
    }

    expect(crearReservaDTO(datos)).toEqual({
      codigo_servicio: 'CN001',
      nutricionista_id: 2,
      fecha_reserva: '2026-11-24',
      hora_reserva: '11:00'
    })
  })

  it('no permite enviar datos adicionales del usuario o precio', () => {
    const datos = {
      codigoServicio: 'CN001',
      nutricionistaId: '2',
      fecha: '2026-11-24',
      hora: '11:00',
      precio: 1,
      usuario_id: 999
    }

    const resultado = crearReservaDTO(datos)

    expect(resultado).not.toHaveProperty('precio')
    expect(resultado).not.toHaveProperty('usuario_id')
  })
})
