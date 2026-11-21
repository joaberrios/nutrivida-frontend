
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
import { registrarPaciente } from '../services/autenticacionService'
import Registro from './Registro'

const navegar = vi.fn()

vi.mock('../services/autenticacionService', () => ({
  registrarPaciente: vi.fn()
}))

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom')

  return {
    ...original,
    useNavigate: () => navegar
  }
})

describe('Registro de usuarios de NutriVida', () => {

  beforeEach(() => {
    localStorage.clear()
    vi.resetAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  function mostrarRegistro() {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    )
  }

  function completarFormulario({
    nombre = 'Usuario',
    apellido = 'Prueba',
    correo = 'usuario@gmail.com',
    contrasena = 'NutrividaPrueba2026!',
    confirmarContrasena = 'NutrividaPrueba2026!'
  } = {}) {

    fireEvent.change(
      screen.getByPlaceholderText('Ingresa tu nombre'),
      { target: { value: nombre } }
    )

    fireEvent.change(
      screen.getByPlaceholderText('Ingresa tu apellido'),
      { target: { value: apellido } }
    )

    fireEvent.change(
      screen.getByPlaceholderText('Ingresa tu correo'),
      { target: { value: correo } }
    )

    fireEvent.change(
      screen.getByPlaceholderText('Crea una contraseña'),
      { target: { value: contrasena } }
    )

    fireEvent.change(
      screen.getByPlaceholderText('Repite tu contraseña'),
      { target: { value: confirmarContrasena } }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Registrarse'
      })
    )
  }

  it('muestra el formulario de registro', () => {
    mostrarRegistro()

    expect(
      screen.getByRole('heading', {
        name: 'Crear cuenta'
      })
    ).toBeInTheDocument()
  })

  it('rechaza campos vacíos', () => {
    mostrarRegistro()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Registrarse'
      })
    )

    expect(
      screen.getByText('Debes completar todos los campos.')
    ).toBeInTheDocument()

    expect(registrarPaciente).not.toHaveBeenCalled()
  })

  it('rechaza dominios no permitidos', () => {
    mostrarRegistro()

    completarFormulario({
      correo: 'usuario@empresa.cl'
    })

    expect(
      screen.getByText(/Solo se permiten correos/i)
    ).toBeInTheDocument()

    expect(registrarPaciente).not.toHaveBeenCalled()
  })

  it('rechaza contraseñas demasiado cortas', () => {
    mostrarRegistro()

    completarFormulario({
      contrasena: '1234',
      confirmarContrasena: '1234'
    })

    expect(
      screen.getByText(
        'La contraseña debe tener entre 15 y 128 caracteres.'
      )
    ).toBeInTheDocument()

    expect(registrarPaciente).not.toHaveBeenCalled()
  })

  it('rechaza contraseñas diferentes', () => {
    mostrarRegistro()

    completarFormulario({
      confirmarContrasena: 'OtraContrasena2026!'
    })

    expect(
      screen.getByText('Las contraseñas no coinciden.')
    ).toBeInTheDocument()

    expect(registrarPaciente).not.toHaveBeenCalled()
  })

  it('muestra un error si la cuenta ya existe', async () => {
    registrarPaciente.mockRejectedValue(
      Object.assign(
        new Error('Correo registrado'),
        { estado: 409 }
      )
    )

    mostrarRegistro()
    completarFormulario()

    expect(
      await screen.findByText(
        'Ya existe una cuenta con ese correo electrónico.'
      )
    ).toBeInTheDocument()
  })

  it('registra una cuenta mediante la API', async () => {
    registrarPaciente.mockResolvedValue({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        id: 1,
        correo: 'usuario@gmail.com',
        rol: 'paciente'
      }
    })

    mostrarRegistro()
    completarFormulario()

    expect(
      await screen.findByText(
        'Cuenta creada correctamente. Ya puedes iniciar sesión.'
      )
    ).toBeInTheDocument()

    expect(registrarPaciente).toHaveBeenCalledWith({
      nombre: 'Usuario',
      apellido: 'Prueba',
      correo: 'usuario@gmail.com',
      contrasena: 'NutrividaPrueba2026!'
    })

    expect(
      localStorage.getItem('nutrivida_usuarios')
    ).toBeNull()

    await waitFor(() => {
      expect(navegar).toHaveBeenCalledWith('/login')
    }, { timeout: 3000 })
  })

  it('muestra un error cuando falla la conexión', async () => {
    registrarPaciente.mockRejectedValue(
      new Error('No se pudo conectar con el servidor.')
    )

    mostrarRegistro()
    completarFormulario()

    expect(
      await screen.findByText(
        'No se pudo conectar con el servidor.'
      )
    ).toBeInTheDocument()
  })

  it('bloquea el formulario durante el registro', () => {
    registrarPaciente.mockImplementation(
      () => new Promise(() => {})
    )

    mostrarRegistro()
    completarFormulario()

    expect(
      screen.getByRole('button', {
        name: 'Registrando...'
      })
    ).toBeDisabled()
  })
})
