
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { ServiciosContext } from '../context/ServiciosContext'
import AdminServicios from './AdminServicios'

const agregarServicio = vi.fn()
const editarServicio = vi.fn()
const borrarServicio = vi.fn()

const servicioExistente = {
  codigo: 'NUT001',
  tipo: 'Consulta',
  nombre: 'Consulta nutricional',
  duracion: '60 minutos',
  modalidad: 'Presencial',
  profesional: 'Nutricionista 1',
  precio: 25000,
  descripcion: 'Evaluación nutricional'
}

describe('Administración de servicios de NutriVida', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.stubGlobal('scrollTo', vi.fn())
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  function mostrarAdministrador(servicios = [servicioExistente]) {
    const resultado = render(
      <ServiciosContext.Provider
        value={{
          servicios,
          agregarServicio,
          editarServicio,
          borrarServicio
        }}
      >
        <AdminServicios />
      </ServiciosContext.Provider>
    )

    return resultado.container
  }

  function completarFormulario(container, datos = {}) {
    const valores = {
      codigo: 'NUT002',
      tipo: 'Consulta',
      nombre: 'Control nutricional',
      duracion: '30 minutos',
      profesional: 'Nutricionista 2',
      precio: '18000',
      descripcion: 'Control de alimentación',
      ...datos
    }

    Object.entries(valores).forEach(([campo, valor]) => {
      const control = container.querySelector(`[name="${campo}"]`)

      fireEvent.change(control, {
        target: { value: valor }
      })
    })
  }

  it('muestra los servicios registrados', () => {
    mostrarAdministrador()

    expect(
      screen.getByText('Consulta nutricional')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'Servicios registrados' })
    ).toBeInTheDocument()
  })

  it('rechaza un formulario con campos vacíos', () => {
    mostrarAdministrador()

    fireEvent.click(
      screen.getByRole('button', { name: 'Agregar servicio' })
    )

    expect(
      screen.getByText('Debes completar todos los campos.')
    ).toBeInTheDocument()

    expect(agregarServicio).not.toHaveBeenCalled()
  })

  it('rechaza un precio igual a cero', () => {
    const container = mostrarAdministrador()

    completarFormulario(container, { precio: '0' })

    fireEvent.click(
      screen.getByRole('button', { name: 'Agregar servicio' })
    )

    expect(
      screen.getByText('El precio debe ser mayor que cero.')
    ).toBeInTheDocument()

    expect(agregarServicio).not.toHaveBeenCalled()
  })

  it('impide agregar un servicio con código duplicado', () => {
    const container = mostrarAdministrador()

    completarFormulario(container, { codigo: 'NUT001' })

    fireEvent.click(
      screen.getByRole('button', { name: 'Agregar servicio' })
    )

    expect(
      screen.getByText(/Ya existe un servicio con ese/i)
    ).toBeInTheDocument()

    expect(agregarServicio).not.toHaveBeenCalled()
  })

  it('agrega correctamente un servicio nuevo', () => {
    const container = mostrarAdministrador()

    completarFormulario(container)

    fireEvent.click(
      screen.getByRole('button', { name: 'Agregar servicio' })
    )

    expect(agregarServicio).toHaveBeenCalledWith(
      expect.objectContaining({
        codigo: 'NUT002',
        nombre: 'Control nutricional',
        precio: 18000,
        modalidad: 'Presencial'
      })
    )

    expect(
      screen.getByText('Servicio agregado correctamente.')
    ).toBeInTheDocument()
  })

  it('permite editar un servicio existente', () => {
    const container = mostrarAdministrador()

    const fila = screen.getByText('Consulta nutricional').closest('tr')

    fireEvent.click(
      within(fila).getByRole('button', { name: 'Editar' })
    )

    expect(
      screen.getByRole('heading', { name: 'Editar servicio' })
    ).toBeInTheDocument()

    expect(
      container.querySelector('[name="codigo"]')
    ).toBeDisabled()

    fireEvent.change(container.querySelector('[name="nombre"]'), {
      target: { value: 'Consulta nutricional actualizada' }
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Guardar cambios' })
    )

    expect(editarServicio).toHaveBeenCalledWith(
      'NUT001',
      expect.objectContaining({
        codigo: 'NUT001',
        nombre: 'Consulta nutricional actualizada',
        precio: 25000
      })
    )

    expect(
      screen.getByText('Servicio actualizado correctamente.')
    ).toBeInTheDocument()
  })

  it('permite cancelar la edición', () => {
    const container = mostrarAdministrador()

    fireEvent.click(
      screen.getByRole('button', { name: 'Editar' })
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Cancelar' })
    )

    expect(
      screen.getByRole('heading', { name: 'Agregar servicio' })
    ).toBeInTheDocument()

    expect(
      container.querySelector('[name="codigo"]')
    ).not.toBeDisabled()

    expect(editarServicio).not.toHaveBeenCalled()
  })

  it('elimina un servicio cuando se confirma', () => {
    mostrarAdministrador()

    fireEvent.click(
      screen.getByRole('button', { name: 'Eliminar' })
    )

    expect(window.confirm).toHaveBeenCalled()

    expect(borrarServicio).toHaveBeenCalledWith('NUT001')

    expect(
      screen.getByText('Servicio eliminado correctamente.')
    ).toBeInTheDocument()
  })

  it('no elimina un servicio cuando se cancela la confirmación', () => {
    vi.stubGlobal('confirm', vi.fn(() => false))

    mostrarAdministrador()

    fireEvent.click(
      screen.getByRole('button', { name: 'Eliminar' })
    )

    expect(borrarServicio).not.toHaveBeenCalled()
  })
})
