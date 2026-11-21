import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useContext } from 'react'

import { CatalogoContext } from './CatalogoContext'
import { CatalogoProvider } from './CatalogoProvider'
import { listarServiciosApi } from '../services/serviciosService'

vi.mock('../services/serviciosService', () => ({
  listarServiciosApi: vi.fn()
}))

const servicioPrueba = {
  codigo: 'CN001',
  nombre: 'Consulta nutricional',
  precio: 35000
}

// Mostrar los estados del contexto real.
function CatalogoPrueba() {
  const {
    servicios,
    cargando,
    error,
    recargarCatalogo
  } = useContext(CatalogoContext)

  return (
    <div>
      {cargando && <p>Cargando servicios</p>}
      {error && <p>{error}</p>}

      <p data-testid="cantidad">{servicios.length}</p>

      {servicios.map(servicio => (
        <p key={servicio.codigo}>{servicio.nombre}</p>
      ))}

      <button onClick={recargarCatalogo}>
        Recargar
      </button>
    </div>
  )
}

function mostrarCatalogo() {
  return render(
    <CatalogoProvider>
      <CatalogoPrueba />
    </CatalogoProvider>
  )
}

describe('Catalogo de servicios mediante API REST', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('muestra el estado de carga', () => {
    listarServiciosApi.mockImplementation(
      () => new Promise(() => {})
    )

    mostrarCatalogo()

    expect(
      screen.getByText('Cargando servicios')
    ).toBeInTheDocument()
  })

  it('carga los servicios desde la API', async () => {
    listarServiciosApi.mockResolvedValue([servicioPrueba])

    mostrarCatalogo()

    expect(
      await screen.findByText('Consulta nutricional')
    ).toBeInTheDocument()

    expect(screen.getByTestId('cantidad')).toHaveTextContent('1')
    expect(listarServiciosApi).toHaveBeenCalledWith(
      expect.any(AbortSignal)
    )
  })

  it('acepta un catalogo sin servicios', async () => {
    listarServiciosApi.mockResolvedValue([])

    mostrarCatalogo()

    await waitFor(() => {
      expect(
        screen.queryByText('Cargando servicios')
      ).not.toBeInTheDocument()
    })

    expect(screen.getByTestId('cantidad')).toHaveTextContent('0')
  })

  it('informa los errores de conexion', async () => {
    listarServiciosApi.mockRejectedValue(
      new Error('Error de conexion')
    )

    mostrarCatalogo()

    expect(
      await screen.findByText('Error de conexion')
    ).toBeInTheDocument()
  })

  it('rechaza una respuesta que no sea un catalogo valido', async () => {
    listarServiciosApi.mockResolvedValue(null)

    mostrarCatalogo()

    expect(
      await screen.findByText('El catálogo recibido no es válido.')
    ).toBeInTheDocument()
  })

  it('actualiza el catalogo al solicitar una recarga', async () => {
    listarServiciosApi
      .mockResolvedValueOnce([servicioPrueba])
      .mockResolvedValueOnce([
        {
          ...servicioPrueba,
          nombre: 'Consulta actualizada'
        }
      ])

    mostrarCatalogo()

    await screen.findByText('Consulta nutricional')

    fireEvent.click(
      screen.getByRole('button', { name: 'Recargar' })
    )

    expect(
      await screen.findByText('Consulta actualizada')
    ).toBeInTheDocument()

    expect(
      screen.queryByText('Consulta nutricional')
    ).not.toBeInTheDocument()

    expect(listarServiciosApi).toHaveBeenCalledTimes(2)
  })
})


