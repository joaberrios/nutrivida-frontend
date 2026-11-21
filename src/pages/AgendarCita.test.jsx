import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CatalogoContext } from '../context/CatalogoContext'
import AgendarCita from './AgendarCita'

const { navegar } = vi.hoisted(() => ({ navegar: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom')
  return { ...original, useNavigate: () => navegar }
})

vi.mock('../components/templates/PlantillaPublica', () => ({
  default: ({ children }) => <div>{children}</div>
}))

// Simular la carga de profesionales sin acceder a la base de datos real.
vi.mock('../hooks/useNutricionistas', () => ({
  useNutricionistas: () => ({
    nutricionistas: [
      { id: 1, nombre: 'Nutricionista 1' },
      { id: 2, nombre: 'Nutricionista 2' }
    ],
    cargando: false,
    error: '',
    recargarNutricionistas: vi.fn()
  })
}))

const serviciosPrueba = [
  {
    codigo: 'CN001',
    nombre: 'Consulta nutricional',
    tipo: 'Consulta',
    duracion: '50 min',
    modalidad: 'Presencial',
    profesional: 'Nutricionista',
    precio: 35000,
    descripcion: 'Consulta de prueba'
  }
]

function mostrarFormulario() {
  const resultado = render(
    <MemoryRouter>
      <CatalogoContext.Provider
        value={{
          servicios: serviciosPrueba,
          cargando: false,
          error: '',
          recargarCatalogo: vi.fn()
        }}
      >
        <AgendarCita />
      </CatalogoContext.Provider>
    </MemoryRouter>
  )

  const controles = Array.from(resultado.container.querySelectorAll('select'))
  const servicio = controles.find(control =>
    Array.from(control.options).some(opcion => opcion.value === 'CN001')
  )
  const nutricionista = controles.find(control =>
    Array.from(control.options).some(opcion => opcion.textContent.trim() === 'Nutricionista 1')
  )
  const hora = controles.find(control => control !== servicio && control !== nutricionista)

  return {
    servicio,
    nutricionista,
    hora,
    fecha: resultado.container.querySelector('input[type="date"]')
  }
}

function seleccionarFecha(campos, fecha) {
  fireEvent.change(campos.servicio, { target: { value: 'CN001' } })
  fireEvent.change(campos.nutricionista, { target: { value: '1' } })
  fireEvent.change(campos.fecha, { target: { value: fecha } })
}

function obtenerHoras(control) {
  return within(control)
    .queryAllByRole('option')
    .map(opcion => opcion.value)
    .filter(valor => /^\d{2}:\d{2}$/.test(valor))
}

function botonContinuar() {
  return screen.getByRole('button', { name: /Continuar a confirmaci/i })
}

describe('Agendamiento de citas de NutriVida', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ toFake: ['Date'] })
    // Fecha fija para que las pruebas no dependan del reloj del equipo.
    vi.setSystemTime(new Date('2026-10-20T13:00:00Z'))
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('muestra el formulario para agendar citas', () => {
    const campos = mostrarFormulario()

    expect(screen.getByRole('heading', {
      name: 'Agendar cita nutricional'
    })).toBeInTheDocument()
    expect(campos.servicio).toBeInTheDocument()
    expect(campos.nutricionista).toBeInTheDocument()
    expect(campos.fecha).toBeInTheDocument()
    expect(campos.hora).toBeDisabled()
    expect(botonContinuar()).toBeDisabled()
    expect(within(campos.nutricionista).getByRole('option', {
      name: 'Nutricionista 1'
    })).toBeInTheDocument()
  })

  it('muestra los horarios de lunes a jueves respetando la duración', () => {
    const campos = mostrarFormulario()

    for (const fecha of ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29']) {
      seleccionarFecha(campos, fecha)
      const horas = obtenerHoras(campos.hora)
      expect(horas).toHaveLength(15)
      expect(horas[0]).toBe('09:00')
      expect(horas.at(-1)).toBe('16:00')
      expect(horas).not.toContain('16:30')
      expect(horas).not.toContain('17:00')
    }
  })

  it('limita los horarios de los viernes según la duración', () => {
    const campos = mostrarFormulario()
    seleccionarFecha(campos, '2026-10-23')

    const horas = obtenerHoras(campos.hora)
    expect(horas).toHaveLength(7)
    expect(horas[0]).toBe('09:00')
    expect(horas.at(-1)).toBe('12:00')
    expect(horas).not.toContain('12:30')
    expect(horas).not.toContain('13:00')
  })

  it('rechaza fechas anteriores al día actual', () => {
    const campos = mostrarFormulario()
    seleccionarFecha(campos, '2026-10-19')

    expect(obtenerHoras(campos.hora)).toHaveLength(0)
    expect(campos.hora).toBeDisabled()
    expect(botonContinuar()).toBeDisabled()
    fireEvent.click(botonContinuar())
    expect(navegar).not.toHaveBeenCalled()
  })

  it('impide agendar citas los fines de semana', () => {
    const campos = mostrarFormulario()

    for (const fecha of ['2026-10-24', '2026-10-25']) {
      seleccionarFecha(campos, fecha)
      expect(obtenerHoras(campos.hora)).toHaveLength(0)
      expect(campos.hora).toBeDisabled()
      expect(botonContinuar()).toBeDisabled()
      fireEvent.click(botonContinuar())
      expect(navegar).not.toHaveBeenCalled()
    }
  })

  it('permite continuar con una cita válida', () => {
    const campos = mostrarFormulario()
    seleccionarFecha(campos, '2026-10-21')
    fireEvent.change(campos.hora, { target: { value: '10:00' } })

    expect(botonContinuar()).toBeEnabled()
    fireEvent.click(botonContinuar())

    expect(navegar).toHaveBeenCalledTimes(1)
    expect(navegar).toHaveBeenCalledWith('/confirmar-cita', {
      state: expect.objectContaining({
        servicio: 'Consulta nutricional',
        codigoServicio: 'CN001',
        nutricionista: 'Nutricionista 1',
        fecha: '2026-10-21',
        hora: '10:00'
      })
    })
    expect(Number(navegar.mock.calls[0][1].state.nutricionistaId)).toBe(1)
  })
})

