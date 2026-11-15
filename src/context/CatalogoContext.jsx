
import { createContext, useEffect, useState } from 'react'
import { listarServiciosApi } from '../services/serviciosService'

export const CatalogoContext = createContext()

export function CatalogoProvider({ children }) {
  const [servicios, setServicios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const controlador = new AbortController()

    async function cargarServicios() {
      setCargando(true)
      setError('')

      try {
        const datos = await listarServiciosApi(
          controlador.signal
        )

        if (!Array.isArray(datos)) {
          throw new Error('El catálogo recibido no es válido.')
        }

        if (!controlador.signal.aborted) {
          setServicios(datos)
        }
      } catch (error) {
        if (!controlador.signal.aborted) {
          setServicios([])
          setError(error.message)
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarServicios()

    return () => controlador.abort()
  }, [intento])

  function recargarCatalogo() {
    setIntento((anterior) => anterior + 1)
  }

  return (
    <CatalogoContext.Provider
      value={{
        servicios,
        cargando,
        error,
        recargarCatalogo
      }}
    >
      {children}
    </CatalogoContext.Provider>
  )
}
