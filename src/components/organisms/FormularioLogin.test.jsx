
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'

import { MemoryRouter } from 'react-router-dom'
import { AutenticacionProvider } from '../../context/AutenticacionProvider'
import { iniciarSesion } from '../../services/autenticacionService'
import FormularioLogin from './FormularioLogin'

const navegar = vi.fn()

vi.mock('../../services/autenticacionService', () => ({
  iniciarSesion: vi.fn()
}))

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom')

  return {
    ...original,
    useNavigate: () => navegar
  }
})

describe('Formulario de login de NutriVida', () => {

  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.resetAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  function mostrarLogin() {
    render(
      <MemoryRouter>
        <AutenticacionProvider>
          <FormularioLogin />
        </AutenticacionProvider>
      </MemoryRouter>
    )
  }

  function ingresarDatos(correo, contrasena) {
    fireEvent.change(
      screen.getByPlaceholderText('Ingrese su correo'),
      { target: { value: correo } }
    )

    fireEvent.change(
      screen.getByPlaceholderText('Ingrese su contraseña'),
      { target: { value: contrasena } }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Iniciar sesión'
      })
    )
  }

  it('muestra el formulario de inicio de sesión', () => {
    mostrarLogin()

    expect(
      screen.getByRole('heading', {
        name: 'Iniciar sesión'
      })
    ).toBeInTheDocument()
  })

  it('rechaza campos vacíos', () => {
    mostrarLogin()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Iniciar sesión'
      })
    )

    expect(
      screen.getByText('Debe completar todos los campos')
    ).toBeInTheDocument()

    expect(iniciarSesion).not.toHaveBeenCalled()
  })

  it('rechaza dominios no permitidos', () => {
    mostrarLogin()

    ingresarDatos(
      'usuario@empresa.cl',
      'NutrividaPrueba2026!'
    )

    expect(
      screen.getByText(/Correo no permitido/i)
    ).toBeInTheDocument()

    expect(iniciarSesion).not.toHaveBeenCalled()
  })

  it('rechaza credenciales incorrectas', async () => {
    iniciarSesion.mockRejectedValue(
      Object.assign(
        new Error('Credenciales incorrectas'),
        { estado: 401 }
      )
    )

    mostrarLogin()

    ingresarDatos('usuario@gmail.com', 'incorrecta')

    expect(
      await screen.findByText(
        'Correo o contraseña incorrectos'
      )
    ).toBeInTheDocument()

    expect(navegar).not.toHaveBeenCalled()
  })

  it('permite iniciar sesión mediante la API', async () => {
    iniciarSesion.mockResolvedValue({
      accessToken: 'token-ficticio-de-prueba',
      expiresIn: 1800,
      usuario: {
        id: 1,
        nombre: 'Paciente',
        correo: 'usuario@gmail.com',
        rol: 'paciente'
      }
    })

    mostrarLogin()

    ingresarDatos(
      'Usuario@gmail.com',
      'NutrividaPrueba2026!'
    )

    await waitFor(() => {
      expect(navegar).toHaveBeenCalledWith(
        '/menu',
        { replace: true }
      )
    })

    expect(iniciarSesion).toHaveBeenCalledWith({
      correo: 'usuario@gmail.com',
      contrasena: 'NutrividaPrueba2026!'
    })

    expect(localStorage.length).toBe(0)
    expect(sessionStorage.length).toBe(0)
  })

  it('muestra un error de conexión', async () => {
    iniciarSesion.mockRejectedValue(
      new Error('No se pudo conectar con el servidor.')
    )

    mostrarLogin()

    ingresarDatos(
      'usuario@gmail.com',
      'NutrividaPrueba2026!'
    )

    expect(
      await screen.findByText(
        'No se pudo conectar con el servidor.'
      )
    ).toBeInTheDocument()
  })

  it('bloquea el formulario durante la solicitud', () => {
    iniciarSesion.mockImplementation(
      () => new Promise(() => {})
    )

    mostrarLogin()

    ingresarDatos(
      'usuario@gmail.com',
      'NutrividaPrueba2026!'
    )

    expect(
      screen.getByRole('button', {
        name: 'Iniciando sesión...'
      })
    ).toBeDisabled()
  })

  it('controla el exceso de intentos', async () => {
    iniciarSesion.mockRejectedValue(
      Object.assign(
        new Error('Límite de intentos'),
        { estado: 429 }
      )
    )

    mostrarLogin()

    ingresarDatos(
      'usuario@gmail.com',
      'NutrividaPrueba2026!'
    )

    expect(
      await screen.findByText(
        'Demasiados intentos. Inténtelo más tarde.'
      )
    ).toBeInTheDocument()
  })
})

