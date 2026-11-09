import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Boton from './Boton'

describe('Boton', () => {
  it('muestra el texto del botón', () => {
    render(<Boton texto="Guardar" />)

    expect(
      screen.getByRole('button', { name: 'Guardar' })
    ).toBeInTheDocument()
  })

  it('permite mostrar contenido mediante children', () => {
    render(<Boton>Continuar</Boton>)

    expect(
      screen.getByRole('button', { name: 'Continuar' })
    ).toBeInTheDocument()
  })

  it('ejecuta la función al hacer clic', () => {
    const alHacerClick = vi.fn()

    render(
      <Boton onClick={alHacerClick}>
        Aceptar
      </Boton>
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Aceptar' })
    )

    expect(alHacerClick).toHaveBeenCalledTimes(1)
  })

  it('permite deshabilitar el botón', () => {
    render(<Boton disabled>Guardar</Boton>)

    expect(
      screen.getByRole('button', { name: 'Guardar' })
    ).toBeDisabled()
  })
})

describe('Demostración de manejo de errores', () => {
  it('prueba intencionalmente fallida', () => {
    expect(1).toBe(2)
  })
})