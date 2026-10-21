
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CitaError from './CitaError'

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

describe('Página de error de citas de NutriVida', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    estadoRuta = {
      mensaje: 'Este horario ya está ocupado.'
    }
  })

  afterEach(() => {
    cleanup()
  })

  function mostrarPagina() {
    render(
      <MemoryRouter>
        <CitaError />
      </MemoryRouter>
    )
  }

  it('muestra el mensaje de error recibido', () => {
    mostrarPagina()

    expect(
      screen.getByRole('heading', {
        name: 'No se pudo agendar la cita'
      })
    ).toBeInTheDocument()

    expect(
      screen.getByText('Este horario ya está ocupado.')
    ).toBeInTheDocument()
  })

  it('muestra un mensaje general cuando no se recibe un error', () => {
    estadoRuta = null

    mostrarPagina()

    expect(
      screen.getByText(/un problema al registrar la cita/i)
    ).toBeInTheDocument()
  })

  it('permite intentar agendar nuevamente', () => {
    mostrarPagina()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Intentar nuevamente'
      })
    )

    expect(navegar).toHaveBeenCalledWith('/nueva-cita')
  })
})
