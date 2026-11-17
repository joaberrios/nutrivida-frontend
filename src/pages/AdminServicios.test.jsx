import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { CatalogoContext } from '../context/CatalogoContext'
import { AutenticacionContext } from '../context/AutenticacionContext'

import {
  crearServicioApi,
  actualizarServicioApi,
  eliminarServicioApi
} from '../services/serviciosService'

import AdminServicios from './AdminServicios'

// Simular las operaciones de la API REST
vi.mock('../services/serviciosService', () => ({
  listarServiciosApi: vi.fn(),
  crearServicioApi: vi.fn(),
  actualizarServicioApi: vi.fn(),
  eliminarServicioApi: vi.fn()
}))

const recargarCatalogo = vi.fn()
const cerrarSesion = vi.fn()
const tokenPrueba = 'token-ficticio-administrador'

const servicioExistente = {
  codigo: 'NUT001',
  tipo: 'Consulta',
  nombre: 'Consulta nutricional',
  duracion: '60 minutos',
  modalidad: 'Presencial',
  profesional: 'Nutricionista 1',
  precio: 25000,
  descripcion: 'Evaluacion nutricional'
}

// Preparar los contextos utilizados por la pagina
function mostrarAdministrador(servicios = [servicioExistente]) {
  const resultado = render(
    <MemoryRouter>
      <AutenticacionContext.Provider
        value={{
          token: tokenPrueba,
          usuario: {
            id: 1,
            nombre: 'Administrador',
            rol: 'administrador'
          },
          autenticado: true,
          cerrarSesion
        }}
      >
        <CatalogoContext.Provider
          value={{
            servicios,
            cargando: false,
            error: '',
            recargarCatalogo
          }}
        >
          <AdminServicios />
        </CatalogoContext.Provider>
      </AutenticacionContext.Provider>
    </MemoryRouter>
  )

  return resultado.container
}

// Completar el formulario con datos ficticios
function completarFormulario(contenedor, datos = {}) {
  const valores = {
    codigo: 'NUT002',
    tipo: 'Consulta',
    nombre: 'Control nutricional',
    duracion: '30 minutos',
    modalidad: 'Presencial',
    profesional: 'Nutricionista 2',
    precio: '18000',
    descripcion: 'Control de alimentacion',
    ...datos
  }

  Object.entries(valores).forEach(([campo, valor]) => {
    const control = contenedor.querySelector(`[name="${campo}"]`)

    fireEvent.change(control, {
      target: { value: valor }
    })
  })
}

describe('Administracion de servicios de NutriVida', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.stubGlobal('scrollTo', vi.fn())
    vi.stubGlobal('confirm', vi.fn(() => true))

    crearServicioApi.mockResolvedValue({
      mensaje: 'Servicio creado'
    })

    actualizarServicioApi.mockResolvedValue({
      mensaje: 'Servicio actualizado'
    })

    eliminarServicioApi.mockResolvedValue(null)
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('muestra los servicios registrados', () => {
    mostrarAdministrador()

    expect(
      screen.getByText('Consulta nutricional')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        name: 'Servicios registrados'
      })
    ).toBeInTheDocument()
  })

  it('rechaza un formulario con campos vacios', () => {
    mostrarAdministrador()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Agregar servicio'
      })
    )

    expect(
      screen.getByText('Debes completar todos los campos.')
    ).toBeInTheDocument()

    expect(crearServicioApi).not.toHaveBeenCalled()
  })

  it('rechaza un precio igual a cero', () => {
    const contenedor = mostrarAdministrador()

    completarFormulario(contenedor, { precio: '0' })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Agregar servicio'
      })
    )

    expect(
      screen.getByText(/entero mayor que cero/)
    ).toBeInTheDocument()

    expect(crearServicioApi).not.toHaveBeenCalled()
  })

  it('muestra el rechazo de un codigo duplicado desde la API', async () => {
    const error = Object.assign(
      new Error('Ya existe un servicio con ese codigo.'),
      { estado: 409 }
    )

    crearServicioApi.mockRejectedValueOnce(error)

    const contenedor = mostrarAdministrador()

    completarFormulario(contenedor, {
      codigo: 'NUT001'
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Agregar servicio'
      })
    )

    expect(
      await screen.findByText(/Ya existe un servicio con ese/)
    ).toBeInTheDocument()

    expect(crearServicioApi).toHaveBeenCalledWith(
      expect.objectContaining({
        codigo: 'NUT001'
      }),
      tokenPrueba
    )

    expect(recargarCatalogo).not.toHaveBeenCalled()
  })

  it('agrega correctamente un servicio nuevo', async () => {
    const contenedor = mostrarAdministrador()

    completarFormulario(contenedor)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Agregar servicio'
      })
    )

    expect(
      await screen.findByText('Servicio agregado correctamente.')
    ).toBeInTheDocument()

    expect(crearServicioApi).toHaveBeenCalledWith(
      {
        codigo: 'NUT002',
        tipo: 'Consulta',
        nombre: 'Control nutricional',
        duracion: '30 minutos',
        modalidad: 'Presencial',
        profesional: 'Nutricionista 2',
        precio: 18000,
        descripcion: 'Control de alimentacion'
      },
      tokenPrueba
    )

    expect(recargarCatalogo).toHaveBeenCalledTimes(1)
  })

  it('permite editar un servicio existente', async () => {
    const contenedor = mostrarAdministrador()

    const fila = screen
      .getByText('Consulta nutricional')
      .closest('tr')

    fireEvent.click(
      within(fila).getByRole('button', {
        name: 'Editar'
      })
    )

    expect(
      screen.getByRole('heading', {
        name: 'Editar servicio'
      })
    ).toBeInTheDocument()

    expect(
      contenedor.querySelector('[name="codigo"]')
    ).toBeDisabled()

    fireEvent.change(
      contenedor.querySelector('[name="nombre"]'),
      {
        target: {
          value: 'Consulta nutricional actualizada'
        }
      }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Guardar cambios'
      })
    )

    expect(
      await screen.findByText('Servicio actualizado correctamente.')
    ).toBeInTheDocument()

    expect(actualizarServicioApi).toHaveBeenCalledWith(
      'NUT001',
      {
        ...servicioExistente,
        nombre: 'Consulta nutricional actualizada'
      },
      tokenPrueba
    )

    expect(recargarCatalogo).toHaveBeenCalledTimes(1)
  })

  it('permite cancelar la edicion', () => {
    const contenedor = mostrarAdministrador()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Editar'
      })
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Cancelar'
      })
    )

    expect(
      screen.getByRole('heading', {
        name: 'Agregar servicio'
      })
    ).toBeInTheDocument()

    expect(
      contenedor.querySelector('[name="codigo"]')
    ).not.toBeDisabled()

    expect(actualizarServicioApi).not.toHaveBeenCalled()
  })

  it('elimina un servicio cuando se confirma', async () => {
    mostrarAdministrador()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Eliminar'
      })
    )

    expect(
      await screen.findByText('Servicio eliminado correctamente.')
    ).toBeInTheDocument()

    expect(window.confirm).toHaveBeenCalledTimes(1)

    expect(eliminarServicioApi).toHaveBeenCalledWith(
      'NUT001',
      tokenPrueba
    )

    expect(recargarCatalogo).toHaveBeenCalledTimes(1)
  })

  it('no elimina un servicio cuando se cancela la confirmacion', () => {
    window.confirm.mockReturnValue(false)

    mostrarAdministrador()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Eliminar'
      })
    )

    expect(window.confirm).toHaveBeenCalledTimes(1)
    expect(eliminarServicioApi).not.toHaveBeenCalled()
    expect(recargarCatalogo).not.toHaveBeenCalled()
  })
})
