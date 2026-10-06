import { describe, test, expect, beforeEach } from 'vitest'
import {
  listarServicios,
  crearServicio
} from './serviciosService'

describe('serviciosService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('crea un nuevo servicio', () => {
    const nuevoServicio = {
      codigo: 'TEST001',
      tipo: 'Consulta',
      nombre: 'Servicio de prueba',
      duracion: '30 min',
      modalidad: 'Presencial',
      profesional: 'Nutricionista',
      precio: 20000,
      descripcion: 'Servicio creado para la prueba'
    }

    crearServicio(nuevoServicio)

    const servicios = listarServicios()

    const encontrado = servicios.find(
      (servicio) => servicio.codigo === 'TEST001'
    )

    expect(encontrado).toBeDefined()
    expect(encontrado.nombre).toBe('Servicio de prueba')
  })
})