
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { useContext } from 'react'
import { ServiciosContext, ServiciosProvider } from './ServiciosContext'
import {
  listarServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from '../services/serviciosService'

vi.mock('../services/serviciosService', () => ({
  listarServicios: vi.fn(),
  crearServicio: vi.fn(),
  actualizarServicio: vi.fn(),
  eliminarServicio: vi.fn()
}))

const servicioInicial = {
  codigo: 'NUT001',
  nombre: 'Consulta nutricional',
  precio: 25000
}

const servicioNuevo = {
  codigo: 'NUT002',
  nombre: 'Control nutricional',
  precio: 18000
}

function ComponentePrueba() {
  const {
    servicios,
    agregarServicio,
    editarServicio,
    borrarServicio
  } = useContext(ServiciosContext)

  return (
    <div>
      <p data-testid="cantidad-servicios">{servicios.length}</p>

      {servicios.map(servicio => (
        <p key={servicio.codigo}>{servicio.nombre}</p>
      ))}

      <button onClick={() => agregarServicio(servicioNuevo)}>
        Agregar
      </button>

      <button
        onClick={() =>
          editarServicio('NUT001', {
            ...servicioInicial,
            nombre: 'Consulta actualizada'
          })
        }
      >
        Editar
      </button>

      <button onClick={() => borrarServicio('NUT001')}>
        Eliminar
      </button>
    </div>
  )
}

describe('Contexto de servicios de NutriVida', () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
    listarServicios.mockReturnValue([servicioInicial])
  })

  function mostrarContexto() {
    render(
      <ServiciosProvider>
        <ComponentePrueba />
      </ServiciosProvider>
    )
  }

  it('carga los servicios al iniciar', () => {
    mostrarContexto()

    expect(listarServicios).toHaveBeenCalled()
    expect(screen.getByText('Consulta nutricional')).toBeInTheDocument()
    expect(screen.getByTestId('cantidad-servicios')).toHaveTextContent('1')
  })

  it('agrega un servicio y actualiza la lista', () => {
    listarServicios
      .mockReturnValueOnce([servicioInicial])
      .mockReturnValueOnce([servicioInicial, servicioNuevo])

    mostrarContexto()

    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(crearServicio).toHaveBeenCalledWith(servicioNuevo)
    expect(screen.getByText('Control nutricional')).toBeInTheDocument()
    expect(screen.getByTestId('cantidad-servicios')).toHaveTextContent('2')
  })

  it('edita un servicio y actualiza los datos', () => {
    const servicioActualizado = {
      ...servicioInicial,
      nombre: 'Consulta actualizada'
    }

    listarServicios
      .mockReturnValueOnce([servicioInicial])
      .mockReturnValueOnce([servicioActualizado])

    mostrarContexto()

    fireEvent.click(screen.getByRole('button', { name: 'Editar' }))

    expect(actualizarServicio).toHaveBeenCalledWith(
      'NUT001',
      servicioActualizado
    )

    expect(screen.getByText('Consulta actualizada')).toBeInTheDocument()
  })

  it('elimina un servicio y actualiza la lista', () => {
    listarServicios
      .mockReturnValueOnce([servicioInicial])
      .mockReturnValueOnce([])

    mostrarContexto()

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }))

    expect(eliminarServicio).toHaveBeenCalledWith('NUT001')
    expect(screen.getByTestId('cantidad-servicios')).toHaveTextContent('0')
  })
})
