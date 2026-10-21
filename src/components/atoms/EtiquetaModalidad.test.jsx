import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import EtiquetaModalidad from './EtiquetaModalidad'

describe('EtiquetaModalidad', () => {
  test('muestra la modalidad del servicio', () => {
    render(<EtiquetaModalidad modalidad="Presencial" />)

    expect(
      screen.getByText('Presencial')
    ).toBeInTheDocument()
  })
})