import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, test, expect } from 'vitest'
import TarjetaServicio from './TarjetaServicio'

describe('TarjetaServicio', () => {
  test('muestra los datos del servicio', () => {
    render(
      <BrowserRouter>
        <TarjetaServicio
          codigo="CN001"
          nombre="Primera consulta nutricional"
          tipo="Consulta"
          descripcion="Evaluación inicial del paciente"
          duracion="50 min"
          modalidad="Presencial"
          profesional="Nutricionista"
          precio={35000}
        />
      </BrowserRouter>
    )

    expect(
      screen.getByText('Primera consulta nutricional')
    ).toBeInTheDocument()

    expect(
      screen.getByText('Ver servicio')
    ).toBeInTheDocument()
  })
})