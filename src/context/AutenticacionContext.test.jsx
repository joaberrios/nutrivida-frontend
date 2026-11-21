import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { AutenticacionProvider } from './AutenticacionProvider'
import { useAutenticacion } from '../hooks/useAutenticacion'

import { iniciarSesion } from '../services/autenticacionService'
import RutaProtegida from '../components/templates/RutaProtegida'
import FormularioLogin from '../components/organisms/FormularioLogin'

// Simular la respuesta del backend sin usar credenciales reales.
vi.mock('../services/autenticacionService', () => ({
  iniciarSesion: vi.fn()
}))

const usuarioPrueba = {
  id: 1,
  nombre: 'Paciente de prueba',
  rol: 'paciente'
}

const tokenPrueba = 'token-ficticio-de-prueba'
const vigencia = 1800

// Comprobar el estado de la sesion desde el contexto real.
function EstadoSesion() {
  const { token, autenticado } = useAutenticacion()

  return (
    <div>
      <span data-testid="token">{token || 'Sin token'}</span>
      <span data-testid="sesion">
        {autenticado ? 'Activa' : 'Inactiva'}
      </span>
    </div>
  )
}

function MenuPrueba() {
  const { cerrarSesion } = useAutenticacion()

  return (
    <div>
      <h1>Menu protegido</h1>

      <button onClick={cerrarSesion}>
        Cerrar sesion
      </button>
    </div>
  )
}

// Integrar el formulario, contexto y ruta protegida reales.
function mostrarAplicacion() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AutenticacionProvider>
        <EstadoSesion />

        <Routes>
          <Route path="/login" element={<FormularioLogin />} />

          <Route element={<RutaProtegida />}>
            <Route path="/menu" element={<MenuPrueba />} />
          </Route>
        </Routes>
      </AutenticacionProvider>
    </MemoryRouter>
  )
}

async function acceder() {
  fireEvent.change(
    screen.getByPlaceholderText('Ingrese su correo'),
    { target: { value: 'paciente@gmail.com' } }
  )

  fireEvent.change(
    screen.getByPlaceholderText('Ingrese su contraseña'),
    { target: { value: 'ContrasenaFicticia123' } }
  )

  await act(async () => {
    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    )
  })
}

describe('Ciclo de sesion de NutriVida', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()

    iniciarSesion.mockResolvedValue({
      accessToken: tokenPrueba,
      tokenType: 'Bearer',
      expiresIn: vigencia,
      usuario: usuarioPrueba
    })
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('inicia la sesion y mantiene el token en el contexto', async () => {
    mostrarAplicacion()
    await acceder()

    expect(screen.getByTestId('token')).toHaveTextContent(tokenPrueba)
    expect(screen.getByTestId('sesion')).toHaveTextContent('Activa')
    expect(screen.getByText('Menu protegido')).toBeInTheDocument()
  })

  it('vence la sesion al completar los 30 minutos', async () => {
    mostrarAplicacion()
    await acceder()

    await act(async () => {
      vi.advanceTimersByTime(vigencia * 1000 - 1)
    })

    expect(screen.getByText('Menu protegido')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(1)
    })

    expect(screen.getByTestId('token')).toHaveTextContent('Sin token')
    expect(screen.getByTestId('sesion')).toHaveTextContent('Inactiva')
    expect(screen.queryByText('Menu protegido')).not.toBeInTheDocument()
    expect(screen.getByText(/Su sesión ha vencido/)).toBeInTheDocument()
  })

  it('elimina el token al cerrar la sesion', async () => {
    mostrarAplicacion()
    await acceder()

    fireEvent.click(
      screen.getByRole('button', { name: 'Cerrar sesion' })
    )

    expect(screen.getByTestId('token')).toHaveTextContent('Sin token')
    expect(screen.getByTestId('sesion')).toHaveTextContent('Inactiva')
    expect(screen.queryByText('Menu protegido')).not.toBeInTheDocument()
    expect(screen.queryByText(/Su sesión ha vencido/)).not.toBeInTheDocument()
  })

  it('permite iniciar una nueva sesion despues del vencimiento', async () => {
    mostrarAplicacion()
    await acceder()

    await act(async () => {
      vi.advanceTimersByTime(vigencia * 1000)
    })

    expect(screen.getByText(/Su sesión ha vencido/)).toBeInTheDocument()

    await acceder()

    expect(screen.getByTestId('sesion')).toHaveTextContent('Activa')
    expect(screen.getByText('Menu protegido')).toBeInTheDocument()
    expect(screen.queryByText(/Su sesión ha vencido/)).not.toBeInTheDocument()
  })
})


