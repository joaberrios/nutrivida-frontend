import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import { AutenticacionContext } from '../context/AutenticacionContext'
import { listarReservas } from '../services/reservasService'
import MisCitas from './MisCitas'

// Simular las solicitudes a la API REST.
vi.mock('../services/reservasService', () => ({
  listarReservas: vi.fn()
}))

vi.mock('../components/templates/PlantillaPublica', () => ({
  default: ({ children }) => <div>{children}</div>
}))

const cerrarSesion = vi.fn()
const tokenPrueba = 'token-ficticio-paciente'

const reservaPrueba = {
  id: 1,
  codigo_servicio: 'CN001',
  servicio: 'Consulta nutricional',
  nutricionista: 'Nutricionista 1',
  fecha_reserva: '2026-11-23',
  hora_reserva: '10:30:00',
  duracion_minutos: 50,
  precio: 35000,
  estado: 'confirmada'
}

// Preparar la pagina con una sesion ficticia.
function mostrarHistorial() {
  return render(
    <MemoryRouter initialEntries={['/mis-citas']}>
      <AutenticacionContext.Provider
        value={{
          token: tokenPrueba,
          autenticado: true,
          usuario: { id: 1, rol: 'paciente' },
          cerrarSesion
        }}
      >
        <Routes>
          <Route path="/mis-citas" element={<MisCitas />} />
          <Route path="/login" element={<h1>Iniciar sesion</h1>} />
          <Route path="/menu" element={<h1>Menu principal</h1>} />
          <Route path="/nueva-cita" element={<h1>Agendar cita</h1>} />
        </Routes>
      </AutenticacionContext.Provider>
    </MemoryRouter>
  )
}

describe('Historial de reservas de NutriVida', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('muestra el estado de carga mientras consulta la API', () => {
    listarReservas.mockImplementation(
      () => new Promise(() => {})
    )

    mostrarHistorial()

    expect(
      screen.getByText('Cargando tus reservas...')
    ).toBeInTheDocument()
  })

  it('muestra las reservas recibidas desde la API', async () => {
    listarReservas.mockResolvedValue([reservaPrueba])

    mostrarHistorial()

    expect(
      await screen.findByText('Consulta nutricional')
    ).toBeInTheDocument()

    expect(screen.getByText('Nutricionista 1')).toBeInTheDocument()
    expect(screen.getByText('10:30')).toBeInTheDocument()
    expect(screen.getByText('50 minutos')).toBeInTheDocument()
    expect(screen.getByText('confirmada')).toBeInTheDocument()

    expect(listarReservas).toHaveBeenCalledWith(
      tokenPrueba,
      expect.any(AbortSignal)
    )
  })

  it('informa cuando el paciente no tiene reservas', async () => {
    listarReservas.mockResolvedValue([])

    mostrarHistorial()

    expect(
      await screen.findByText('Todavía no tienes citas registradas.')
    ).toBeInTheDocument()
  })

  it('muestra un error cuando falla la conexion', async () => {
    listarReservas.mockRejectedValue(
      new Error('No se pudo conectar con el servidor.')
    )

    mostrarHistorial()

    expect(
      await screen.findByText('No se pudo conectar con el servidor.')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'Reintentar' })
    ).toBeInTheDocument()
  })

  it('permite recuperar el historial despues de un error', async () => {
    listarReservas
      .mockRejectedValueOnce(new Error('Error de conexion'))
      .mockResolvedValueOnce([reservaPrueba])

    mostrarHistorial()

    fireEvent.click(
      await screen.findByRole('button', { name: 'Reintentar' })
    )

    expect(
      await screen.findByText('Consulta nutricional')
    ).toBeInTheDocument()

    expect(listarReservas).toHaveBeenCalledTimes(2)
  })

  it('cierra la sesion cuando el servidor responde 401', async () => {
    const error = new Error('Token invalido o vencido')
    error.estado = 401

    listarReservas.mockRejectedValue(error)

    mostrarHistorial()

    expect(
      await screen.findByText('Iniciar sesion')
    ).toBeInTheDocument()

    expect(cerrarSesion).toHaveBeenCalled()
    expect(
      screen.queryByText('Mis citas')
    ).not.toBeInTheDocument()
  })

  it('permite volver al formulario de agendamiento', async () => {
    listarReservas.mockResolvedValue([])

    mostrarHistorial()

    await screen.findByText('Todavía no tienes citas registradas.')

    fireEvent.click(
      screen.getByRole('button', { name: 'Agendar nueva cita' })
    )

    expect(screen.getByText('Agendar cita')).toBeInTheDocument()
  })
})
