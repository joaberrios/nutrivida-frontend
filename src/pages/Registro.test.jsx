import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Registro from './Registro'

const navegar = vi.fn()

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
    navegar.mockClear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
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
    contrasena = '1234',
    confirmarContrasena = '1234'
  } = {}) {
    fireEvent.change(screen.getByPlaceholderText('Ingresa tu nombre'), {
      target: { value: nombre }
    })

    fireEvent.change(screen.getByPlaceholderText('Ingresa tu apellido'), {
      target: { value: apellido }
    })

    fireEvent.change(screen.getByPlaceholderText('Ingresa tu correo'), {
      target: { value: correo }
    })

    fireEvent.change(screen.getByPlaceholderText('Crea una contraseña'), {
      target: { value: contrasena }
    })

    fireEvent.change(screen.getByPlaceholderText('Repite tu contraseña'), {
      target: { value: confirmarContrasena }
    })

    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }))
  }

  it('muestra el formulario de registro', () => {
    mostrarRegistro()

    expect(
      screen.getByRole('heading', { name: 'Crear cuenta' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Registrarse' })
    ).toBeInTheDocument()
  })

  it('muestra un error cuando faltan campos', () => {
    mostrarRegistro()

    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }))

    expect(
      screen.getByText('Debes completar todos los campos.')
    ).toBeInTheDocument()
  })

  it('rechaza correos de dominios no permitidos', () => {
    mostrarRegistro()

    completarFormulario({ correo: 'usuario@empresa.cl' })

    expect(
      screen.getByText(/Solo se permiten correos/i)
    ).toBeInTheDocument()
  })

  it('rechaza contraseñas que no coinciden', () => {
    mostrarRegistro()

    completarFormulario({
      contrasena: '1234',
      confirmarContrasena: '5678'
    })

    expect(
      screen.getByText('Las contraseñas no coinciden.')
    ).toBeInTheDocument()
  })

  it('impide registrar una cuenta existente', () => {
    mostrarRegistro()

    completarFormulario({
      correo: 'joa.berrios@duocuc.cl'
    })

    expect(
      screen.getByText('Ya existe una cuenta con ese correo electrónico.')
    ).toBeInTheDocument()
  })

  it('guarda correctamente una cuenta nueva', () => {
    mostrarRegistro()

    completarFormulario()

    const usuarios = JSON.parse(
      localStorage.getItem('nutrivida_usuarios')
    )

    expect(usuarios).toHaveLength(1)
    expect(usuarios[0].correo).toBe('usuario@gmail.com')

    expect(
      screen.getByText('Cuenta creada correctamente. Ya puedes iniciar sesión.')
    ).toBeInTheDocument()

    vi.runAllTimers()

    expect(navegar).toHaveBeenCalledWith('/login')
  })
})