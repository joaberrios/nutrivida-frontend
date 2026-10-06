import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import Boton from './Boton'

describe('Boton', () => {
  test('muestra el texto del boton', () => {
    render(<Boton texto="Ver servicio" />)

    expect(
      screen.getByText('Ver servicio')
    ).toBeInTheDocument()
  })
})