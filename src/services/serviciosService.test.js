
import { describe, test, expect, beforeEach } from 'vitest'

import {
  listarServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from './serviciosService'

describe('serviciosService', () => {

  beforeEach(() => {
    localStorage.clear()
  })

  // PRUEBA 1: Crear un servicio
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

  // PRUEBA 2: Listar servicios
  test('carga los servicios iniciales', () => {
    const servicios = listarServicios()

    expect(Array.isArray(servicios)).toBe(true)
    expect(servicios.length).toBeGreaterThan(0)
  })

  // PRUEBA 3: Guardar un servicio
  test('guarda un servicio en localStorage', () => {
    const nuevoServicio = {
      codigo: 'TEST002',
      nombre: 'Consulta nutricional',
      precio: 15000
    }

    crearServicio(nuevoServicio)

    const guardados = JSON.parse(
      localStorage.getItem('servicios')
    )

    expect(
      guardados.some(servicio => servicio.codigo === 'TEST002')
    ).toBe(true)
  })

  // PRUEBA 4: Actualizar un servicio
  test('actualiza un servicio existente', () => {
    crearServicio({
      codigo: 'TEST003',
      nombre: 'Servicio antiguo',
      precio: 10000
    })

    actualizarServicio('TEST003', {
      nombre: 'Servicio actualizado'
    })

    const servicios = listarServicios()

    const encontrado = servicios.find(
      servicio => servicio.codigo === 'TEST003'
    )

    expect(encontrado.nombre).toBe('Servicio actualizado')
    expect(encontrado.precio).toBe(10000)
  })

  // PRUEBA 5: Eliminar un servicio
  test('elimina un servicio existente', () => {
    crearServicio({
      codigo: 'TEST004',
      nombre: 'Servicio para eliminar',
      precio: 12000
    })

    eliminarServicio('TEST004')

    const servicios = listarServicios()

    const encontrado = servicios.find(
      servicio => servicio.codigo === 'TEST004'
    )

    expect(encontrado).toBeUndefined()
  })

  // PRUEBA 6: Mantener los demás servicios
  test('mantiene los otros servicios al eliminar uno', () => {
    crearServicio({
      codigo: 'TEST005',
      nombre: 'Servicio que permanece',
      precio: 20000
    })

    crearServicio({
      codigo: 'TEST006',
      nombre: 'Servicio que se elimina',
      precio: 18000
    })

    eliminarServicio('TEST006')

    const servicios = listarServicios()

    expect(
      servicios.some(servicio => servicio.codigo === 'TEST005')
    ).toBe(true)

    expect(
      servicios.some(servicio => servicio.codigo === 'TEST006')
    ).toBe(false)
  })

})
