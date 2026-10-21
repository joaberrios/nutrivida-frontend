
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CitaExitosa from './CitaExitosa'

const navegar = vi.fn()
let estadoRuta = null

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom')

  return {
    ...original,
    useNavigate: () => navegar,
    useLocation: () => ({ state: estadoRuta })
  }
})

vi.mock('../components/templates/PlantillaPublica', () => ({
  default: ({ children }) => <div>{children}</div>
}))

const citaEjemplo = {
  servicio: 'Consulta nutricional',
  nutricionista: 'Nutricionista 1',
  fecha: '2026-11-10',
  hora: '10:00',
  estado: 'Confirmada'
}

describe('Página de cita exitosa de NutriVida', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    estadoRuta = { cita: { ...citaEjemplo } }
  })

  afterEach(() => {
    cleanup()
  })

  function mostrarPagina() {
    render(
      <MemoryRouter>
        <CitaExitosa />
      </MemoryRouter>
    )
  }

  it('muestra los datos de la cita confirmada', () => {
    mostrarPagina()

    expect(screen.getByText('Consulta nutricional')).toBeInTheDocument()
    expect(screen.getByText('Nutricionista 1')).toBeInTheDocument()
    expect(screen.getByText('2026-11-10')).toBeInTheDocument()
    expect(screen.getByText('10:00')).toBeInTheDocument()
    expect(screen.getByText('Confirmada')).toBeInTheDocument()

    expect(
      screen.getByText('Tu cita fue registrada correctamente.')
    ).toBeInTheDocument()
  })

  it('muestra un aviso cuando no existe una confirmación', () => {
    estadoRuta = null

    mostrarPagina()

    expect(
      screen.getByText(/No hay una confirmaci/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/Realiza una reserva/i)
    ).toBeInTheDocument()
  })

  it('permite volver al inicio', () => {
    mostrarPagina()

    fireEvent.click(
      screen.getByRole('button', { name: 'Volver al inicio' })
    )

    expect(navegar).toHaveBeenCalledWith('/inicio')
  })
})
