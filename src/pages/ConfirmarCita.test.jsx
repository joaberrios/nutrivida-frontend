import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach
} from 'vitest'

import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup
} from '@testing-library/react'

import {
  MemoryRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'

import ConfirmarCita from './ConfirmarCita'
import { crearReserva } from '../services/reservasService'
import { useAutenticacion } from '../hooks/useAutenticacion'

vi.mock('../services/reservasService', () => ({
  crearReserva: vi.fn()
}))

vi.mock('../hooks/useAutenticacion', () => ({
  useAutenticacion: vi.fn()
}))

vi.mock('../components/templates/PlantillaPublica', () => ({
  default: ({ children }) => children
}))

const cerrarSesion = vi.fn()

const citaEjemplo = {
  servicio: 'Primera consulta nutricional',
  codigoServicio: 'CN001',
  nutricionista: 'Nutricionista 2',
  nutricionistaId: 2,
  fecha: '2026-11-24',
  hora: '11:00'
}

function ResultadoExitoso() {
  const ubicacion = useLocation()

  return (
    <p>Reserva registrada: {ubicacion.state?.cita?.id}</p>
  )
}

function ResultadoError() {
  const ubicacion = useLocation()

  return <p>{ubicacion.state?.mensaje}</p>
}

function renderizarPagina(datos = citaEjemplo) {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/confirmar-cita',
          state: datos
        }
      ]}
    >
      <Routes>
        <Route
          path="/confirmar-cita"
          element={<ConfirmarCita />}
        />

        <Route
          path="/cita-exitosa"
          element={<ResultadoExitoso />}
        />

        <Route
          path="/cita-error"
          element={<ResultadoError />}
        />

        <Route
          path="/login"
          element={<p>Iniciar sesión</p>}
        />

        <Route
          path="/nueva-cita"
          element={<p>Nueva cita</p>}
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('Confirmación de citas', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    useAutenticacion.mockReturnValue({
      token: 'token-de-prueba',
      cerrarSesion
    })
  })

  afterEach(() => {
    cleanup()
  })

  it('muestra el resumen de la cita', () => {
    renderizarPagina()

    expect(
      screen.getByText('Servicio: Primera consulta nutricional')
    ).toBeTruthy()

    expect(
      screen.getByText('Nutricionista: Nutricionista 2')
    ).toBeTruthy()
  })

  it('confirma la reserva mediante la API y JWT', async () => {
    crearReserva.mockResolvedValue({ id: 9 })

    renderizarPagina()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Confirmar cita'
      })
    )

    expect(
      await screen.findByText('Reserva registrada: 9')
    ).toBeTruthy()

    expect(crearReserva).toHaveBeenCalledWith(
      citaEjemplo,
      'token-de-prueba'
    )
  })

  it('muestra un error cuando el horario está ocupado', async () => {
    const error = new Error('Horario ocupado')
    error.estado = 409

    crearReserva.mockRejectedValue(error)

    renderizarPagina()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Confirmar cita'
      })
    )

    expect(
      await screen.findByText('Horario ocupado')
    ).toBeTruthy()
  })

  it('cierra la sesión cuando el JWT no es válido', async () => {
    const error = new Error('Sesion vencida')
    error.estado = 401

    crearReserva.mockRejectedValue(error)

    renderizarPagina()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Confirmar cita'
      })
    )

    expect(
      await screen.findByText('Iniciar sesión')
    ).toBeTruthy()

    expect(cerrarSesion).toHaveBeenCalled()
  })

  it('impide confirmar una reserva sin datos', () => {
    renderizarPagina(null)

    expect(
      screen.getByText('No hay datos de una cita')
    ).toBeTruthy()

    expect(crearReserva).not.toHaveBeenCalled()
  })

  it('deshabilita el botón mientras guarda la reserva', async () => {
    let resolverReserva

    crearReserva.mockImplementation(
      () => new Promise((resolver) => {
        resolverReserva = resolver
      })
    )

    renderizarPagina()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Confirmar cita'
      })
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: /Guardando reserva/
        }).disabled
      ).toBe(true)
    })

    resolverReserva({ id: 9 })

    expect(
      await screen.findByText('Reserva registrada: 9')
    ).toBeTruthy()
  })
})


