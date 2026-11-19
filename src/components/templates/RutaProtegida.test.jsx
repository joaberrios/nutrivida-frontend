import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { AutenticacionContext } from '../../context/AutenticacionContext'
import RutaProtegida from './RutaProtegida'

// Preparar una sesion ficticia para comprobar los permisos.
function mostrarRuta(ruta, rol = null, sesionVencida = false) {
  const sesion = {
    autenticado: Boolean(rol),
    usuario: rol ? { id: 1, rol } : null,
    token: rol ? 'token-de-prueba' : null,
    sesionVencida
  }

  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AutenticacionContext.Provider value={sesion}>
        <Routes>
          <Route
            path="/login"
            element={<h1>Iniciar sesion</h1>}
          />

          <Route element={<RutaProtegida />}>
            <Route
              path="/menu"
              element={<h1>Menu principal</h1>}
            />
          </Route>

          <Route
            element={<RutaProtegida roles={['administrador']} />}
          >
            <Route
              path="/admin-servicios"
              element={<h1>Administracion de servicios</h1>}
            />
          </Route>

          <Route
            element={<RutaProtegida roles={['paciente']} />}
          >
            <Route
              path="/nueva-cita"
              element={<h1>Agendar cita</h1>}
            />
          </Route>
        </Routes>
      </AutenticacionContext.Provider>
    </MemoryRouter>
  )
}

describe('Rutas protegidas de NutriVida', () => {
  afterEach(() => {
    cleanup()
  })

  it('redirige al login cuando no existe una sesion', () => {
    mostrarRuta('/menu')

    expect(
      screen.getByText('Iniciar sesion')
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Menu principal')
    ).not.toBeInTheDocument()
  })

  it('permite acceder al menu a un usuario autenticado', () => {
    mostrarRuta('/menu', 'paciente')

    expect(
      screen.getByText('Menu principal')
    ).toBeInTheDocument()
  })

  it('impide que un paciente ingrese a administracion', () => {
    mostrarRuta('/admin-servicios', 'paciente')

    expect(
      screen.getByText('Acceso denegado')
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Administracion de servicios')
    ).not.toBeInTheDocument()
  })

  it('permite ingresar a un administrador autorizado', () => {
    mostrarRuta('/admin-servicios', 'administrador')

    expect(
      screen.getByText('Administracion de servicios')
    ).toBeInTheDocument()
  })

  it('permite que un paciente pueda agendar una cita', () => {
    mostrarRuta('/nueva-cita', 'paciente')

    expect(
      screen.getByText('Agendar cita')
    ).toBeInTheDocument()
  })

  it('redirige al login cuando la sesion ya vencio', () => {
    mostrarRuta('/nueva-cita', null, true)

    expect(
      screen.getByText('Iniciar sesion')
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Agendar cita')
    ).not.toBeInTheDocument()
  })
})
