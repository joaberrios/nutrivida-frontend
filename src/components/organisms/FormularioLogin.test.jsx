import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FormularioLogin from './FormularioLogin'

const navegar = vi.fn()

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
    navegar.mockClear()
  })

  afterEach(() => {
    cleanup()
  })

  function mostrarLogin() {
    render(
      <MemoryRouter>
        <FormularioLogin />
      </MemoryRouter>
    )
  }

  function ingresarDatos(correo, contrasena) {
    fireEvent.change(screen.getByPlaceholderText('Ingrese su correo'), {
      target: { value: correo }
    })

    fireEvent.change(screen.getByPlaceholderText('Ingrese su contraseña'), {
      target: { value: contrasena }
    })

    fireEvent.click(
      screen.getByRole('button', { name: /iniciar sesión/i })
    )
  }

  it('muestra el formulario de inicio de sesión', () => {
    mostrarLogin()

  expect(
    screen.getByRole('heading', { name: 'Iniciar sesión' })
  ).toBeInTheDocument()    
  expect(
      screen.getByPlaceholderText('Ingrese su correo')
    ).toBeInTheDocument()
  })

  it('muestra un error cuando los campos están vacíos', () => {
    mostrarLogin()

    fireEvent.click(
      screen.getByRole('button', { name: /iniciar sesión/i })
    )

    expect(
      screen.getByText('Debe completar todos los campos')
    ).toBeInTheDocument()
  })

  it('rechaza correos con dominios no permitidos', () => {
    mostrarLogin()
    ingresarDatos('usuario@empresa.cl', '1234')

    expect(
      screen.getByText(/Correo no permitido/i)
    ).toBeInTheDocument()
  })

  it('rechaza una contraseña incorrecta', () => {
    mostrarLogin()
    ingresarDatos('joa.berrios@duocuc.cl', '9999')

    expect(
      screen.getByText('Contraseña incorrecta')
    ).toBeInTheDocument()

    expect(navegar).not.toHaveBeenCalled()
  })

  it('permite iniciar sesión con una cuenta autorizada', () => {
    mostrarLogin()
    ingresarDatos('joa.berrios@duocuc.cl', '1212')

    expect(navegar).toHaveBeenCalledWith('/menu')
  })
})