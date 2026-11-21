import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CitaExitosa from './CitaExitosa'

vi.mock('../components/templates/PlantillaPublica', () => ({
  default: ({ children }) => <div>{children}</div>
}))

// Datos ficticios con la estructura de la API REST
const citaEjemplo = {
  id: 15,
  codigo_servicio: 'CN001',
  servicio: 'Consulta nutricional',
  nutricionista: 'Nutricionista 1',
  fecha_reserva: '2026-11-19',
  hora_reserva: '10:00:00',
  duracion_minutos: 50,
  precio: 35000,
  estado: 'Confirmada'
}

function mostrarPagina(estadoRuta = { cita: citaEjemplo }) {
  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/cita-exitosa',
          state: estadoRuta
        }
      ]}
    >
      <Routes>
        <Route
          path="/cita-exitosa"
          element={<CitaExitosa />}
        />
        <Route
          path="/menu"
          element={<h1>Menu principal</h1>}
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('Pagina de cita exitosa de NutriVida', () => {
  afterEach(() => {
    cleanup()
  })

  it('muestra los datos de la cita confirmada', () => {
    mostrarPagina()

    expect(
      screen.getByRole('heading', {
        name: 'Cita agendada correctamente'
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Tu reserva fue registrada/)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/mero de reserva:/)
    ).toHaveTextContent('15')

    expect(
      screen.getByText(/^Servicio:/)
    ).toHaveTextContent('Consulta nutricional')

    expect(
      screen.getByText(/^Nutricionista:/)
    ).toHaveTextContent('Nutricionista 1')

    expect(
      screen.getByText(/^Fecha:/)
    ).toHaveTextContent('2026-11-19')

    expect(
      screen.getByText(/^Hora:/)
    ).toHaveTextContent('10:00')

    expect(
      screen.getByText(/Duraci/)
    ).toHaveTextContent('50 minutos')

    expect(
      screen.getByText(/^Precio:/)
    ).toHaveTextContent('$35.000')

    expect(
      screen.getByText(/^Estado:/)
    ).toHaveTextContent('Confirmada')
  })

  it('muestra un aviso cuando no existe una confirmacion', () => {
    mostrarPagina(null)

    expect(
      screen.getByText(/No hay una confirmaci/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Realiza una reserva/i)
    ).toBeInTheDocument()
  })

  it('permite volver al menu principal', async () => {
    mostrarPagina()

    fireEvent.click(
      screen.getByRole('button', {
        name: /Volver al men/i
      })
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Menu principal'
      })
    ).toBeInTheDocument()
  })
})
