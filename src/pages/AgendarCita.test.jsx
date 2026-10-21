
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ServiciosContext } from '../context/ServiciosContext'
import AgendarCita from './AgendarCita'

const navegar = vi.fn()

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom')

  return {
    ...original,
    useNavigate: () => navegar
  }
})

vi.mock('../components/templates/PlantillaPublica', () => ({
  default: ({ children }) => <div>{children}</div>
}))

const serviciosPrueba = [
  {
    codigo: 'NUT001',
    nombre: 'Consulta nutricional',
    precio: 25000
  }
]

describe('Agendamiento de citas de NutriVida', () => {
  beforeEach(() => {
    navegar.mockClear()
    vi.useFakeTimers({
      toFake: ['Date']
    })
    vi.setSystemTime(new Date(2026, 9, 20, 10, 0, 0))
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  function mostrarFormulario() {
    const resultado = render(
      <MemoryRouter>
        <ServiciosContext.Provider value={{ servicios: serviciosPrueba }}>
          <AgendarCita />
        </ServiciosContext.Provider>
      </MemoryRouter>
    )

    const controles = resultado.container.querySelectorAll('select')
    const fecha = resultado.container.querySelector('input[type="date"]')

    return {
      servicio: controles[0],
      nutricionista: controles[1],
      fecha,
      hora: controles[2]
    }
  }

  function completarDatos(campos, fecha = '2026-10-21', hora = '10:00') {
    fireEvent.change(campos.servicio, {
      target: { value: 'NUT001' }
    })

    fireEvent.change(campos.nutricionista, {
      target: { value: 'Nutricionista 1' }
    })

    fireEvent.change(campos.fecha, {
      target: { value: fecha }
    })

    if (hora) {
      fireEvent.change(campos.hora, {
        target: { value: hora }
      })
    }
  }

  it('muestra el formulario para agendar citas', () => {
    const campos = mostrarFormulario()

    expect(
      screen.getByRole('heading', { name: 'Agendar cita nutricional' })
    ).toBeInTheDocument()

    expect(campos.servicio).toBeInTheDocument()
    expect(campos.nutricionista).toBeInTheDocument()
    expect(campos.fecha).toBeInTheDocument()
    expect(campos.hora).toBeDisabled()
  })

  it('muestra los horarios de lunes a jueves', () => {
    const campos = mostrarFormulario()

    fireEvent.change(campos.fecha, {
      target: { value: '2026-10-21' }
    })

    const opciones = within(campos.hora).getAllByRole('option')

    expect(opciones).toHaveLength(17)
    expect(within(campos.hora).getByRole('option', {
      name: '09:00'
    })).toBeInTheDocument()

    expect(within(campos.hora).getByRole('option', {
      name: '16:30'
    })).toBeInTheDocument()
  })

  it('limita los horarios de los viernes hasta las 12:30', () => {
    const campos = mostrarFormulario()

    fireEvent.change(campos.fecha, {
      target: { value: '2026-10-23' }
    })

    expect(within(campos.hora).getAllByRole('option')).toHaveLength(9)

    expect(within(campos.hora).getByRole('option', {
      name: '12:30'
    })).toBeInTheDocument()

    expect(within(campos.hora).queryByRole('option', {
      name: '13:00'
    })).not.toBeInTheDocument()
  })

  it('rechaza fechas anteriores al día actual', () => {
    const campos = mostrarFormulario()

    fireEvent.change(campos.fecha, {
      target: { value: '2026-10-19' }
    })

    expect(
      screen.getByText('No puedes reservar en fechas pasadas.')
    ).toBeInTheDocument()

    expect(campos.hora).toBeDisabled()
  })

  it('impide agendar citas los fines de semana', () => {
    const campos = mostrarFormulario()

    fireEvent.change(campos.fecha, {
      target: { value: '2026-10-24' }
    })

    expect(campos.hora).toBeDisabled()

    expect(
      screen.getByText(/Elige una fecha de lunes a viernes/i)
    ).toBeInTheDocument()
  })

  it('permite continuar con una cita válida', () => {
    const campos = mostrarFormulario()

    completarDatos(campos)

    fireEvent.click(
      screen.getByRole('button', {
        name: /Continuar a confirmaci/i
      })
    )

    expect(navegar).toHaveBeenCalledWith('/confirmar-cita', {
      state: {
        servicio: 'Consulta nutricional',
        codigoServicio: 'NUT001',
        nutricionista: 'Nutricionista 1',
        fecha: '2026-10-21',
        hora: '10:00'
      }
    })
  })
})
