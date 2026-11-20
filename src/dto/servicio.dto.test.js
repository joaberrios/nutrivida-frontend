import { describe, expect, it } from 'vitest'
import { crearServicioDTO } from './servicio.dto'

describe('DTO de servicios', () => {
  const datos = {
    codigo: ' cn001 ',
    tipo: ' Consulta ',
    nombre: ' Consulta nutricional ',
    duracion: ' 50 min ',
    modalidad: ' Presencial ',
    profesional: ' Nutricionista ',
    precio: '35000',
    descripcion: ' Servicio de prueba '
  }

  it('transforma los datos del formulario', () => {
    expect(crearServicioDTO(datos)).toEqual({
      codigo: 'CN001',
      tipo: 'Consulta',
      nombre: 'Consulta nutricional',
      duracion: '50 min',
      modalidad: 'Presencial',
      profesional: 'Nutricionista',
      precio: 35000,
      descripcion: 'Servicio de prueba'
    })
  })

  it('convierte el precio a numero', () => {
    expect(typeof crearServicioDTO(datos).precio).toBe('number')
  })

  it('no permite enviar datos adicionales', () => {
    const resultado = crearServicioDTO({
      ...datos,
      usuario_id: 999,
      rol: 'administrador',
      activo: false
    })

    expect(resultado).not.toHaveProperty('usuario_id')
    expect(resultado).not.toHaveProperty('rol')
    expect(resultado).not.toHaveProperty('activo')
    expect(Object.keys(resultado)).toHaveLength(8)
  })
})
