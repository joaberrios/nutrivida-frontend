
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ConfirmarCita from './ConfirmarCita'
import { guardarCita } from '../services/citasService'

const navegar = vi.fn()

let datosReserva = null

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom')

  return {
    ...original,
    useNavigate: () => navegar,
    useLocation: () => ({ state: datosReserva })
  }
})

vi.mock('../components/templates/PlantillaPublica', () => ({
  default: ({ children }) => <div>{children}</div>
}))

vi.mock('../services/citasService', () => ({
  guardarCita: vi.fn()
}))

const citaEjemplo = {
  servicio: 'Consulta nutricional',
  codigoServicio: 'NUT001',
  nutricionista: 'Nutricionista 1',
  fecha: '2026-11-10',
  hora: '10:00'
}

describe('Confirmación de citas de NutriVida', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    datosReserva = { ...citaEjemplo }
  })

  afterEach(() => {
    cleanup()
  })

  function mostrarConfirmacion() {
    render(
      <MemoryRouter>
        <ConfirmarCita />
      </MemoryRouter>
    )
  }

  it('muestra los datos de la reserva', () => {
    mostrarConfirmacion()

    expect(
      screen.getByRole('heading', { name: 'Confirmar cita' })
    ).toBeInTheDocument()

    expect(
      screen.getByText('Consulta nutricional')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Nutricionista 1')
    ).toBeInTheDocument()

    expect(
      screen.getByText('2026-11-10')
    ).toBeInTheDocument()

    expect(
      screen.getByText('10:00')
    ).toBeInTheDocument()
  })

  it('confirma correctamente una cita válida', () => {
    const citaGuardada = {
      ...citaEjemplo,
      id: 'cita-123',
      estado: 'Confirmada'
    }

    guardarCita.mockReturnValue(citaGuardada)

    mostrarConfirmacion()

    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar cita' })
    )

    expect(guardarCita).toHaveBeenCalledWith(citaEjemplo)

    expect(navegar).toHaveBeenCalledWith('/cita-exitosa', {
      replace: true,
      state: { cita: citaGuardada }
    })
  })

  it('muestra el error cuando la cita ya está ocupada', () => {
    guardarCita.mockImplementation(() => {
      throw new Error('Este nutricionista ya tiene una cita en la fecha y hora seleccionadas.')
    })

    mostrarConfirmacion()

    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar cita' })
    )

    expect(navegar).toHaveBeenCalledWith('/cita-error', {
      replace: true,
      state: {
        mensaje: 'Este nutricionista ya tiene una cita en la fecha y hora seleccionadas.'
      }
    })
  })

  it('permite volver a agendar una cita', () => {
    mostrarConfirmacion()

    fireEvent.click(
      screen.getByRole('button', { name: 'Volver' })
    )

    expect(navegar).toHaveBeenCalledWith('/nueva-cita')
  })

  it('muestra un aviso cuando no existen datos de reserva', () => {
    datosReserva = null

    mostrarConfirmacion()

    expect(
      screen.getByText('No hay datos de una cita')
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Volver a agendar' })
    )

    expect(navegar).toHaveBeenCalledWith('/nueva-cita')

    expect(guardarCita).not.toHaveBeenCalled()
  })
})
