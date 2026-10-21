import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import Precio from './Precio'

describe('Precio', () => {
  test('muestra el precio del servicio', () => {
    render(<Precio valor={35000} />)

    expect(
      screen.getByText(/\$35\.000/)
    ).toBeInTheDocument()
  })
})