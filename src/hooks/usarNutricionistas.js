import { useEffect, useState } from 'react'
import { listarNutricionistas } from '../services/nutricionistasService'

export function usarNutricionistas() {
  const [nutricionistas, setNutricionistas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const controlador = new AbortController()

    async function cargarNutricionistas() {
      setCargando(true)
      setError('')

      try {
        const datos = await listarNutricionistas(
          controlador.signal
        )

        if (!Array.isArray(datos)) {
          throw new Error('Los datos recibidos no son válidos.')
        }

        if (!controlador.signal.aborted) {
          setNutricionistas(datos)
        }
      } catch (error) {
        if (!controlador.signal.aborted) {
          setNutricionistas([])
          setError(error.message)
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarNutricionistas()

    return () => controlador.abort()
  }, [intento])

  function recargarNutricionistas() {
    setIntento((anterior) => anterior + 1)
  }

  return {
    nutricionistas,
    cargando,
    error,
    recargarNutricionistas
  }
}
