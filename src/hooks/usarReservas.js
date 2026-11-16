import { useEffect, useState } from 'react'
import { listarReservas } from '../services/reservasService'

export function usarReservas(token) {
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const controlador = new AbortController()

    async function cargarReservas() {
      setCargando(true)
      setError(null)
      setReservas([])

      try {
        if (!token) {
          const errorSesion = new Error('Debes iniciar sesión.')
          errorSesion.estado = 401
          throw errorSesion
        }

        const datos = await listarReservas(
          token,
          controlador.signal
        )

        if (!Array.isArray(datos)) {
          throw new Error('Las reservas recibidas no son válidas.')
        }

        if (!controlador.signal.aborted) {
          setReservas(datos)
        }
      } catch (error) {
        if (!controlador.signal.aborted) {
          setError(error)
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarReservas()

    return () => controlador.abort()
  }, [token, intento])

  function recargarReservas() {
    setIntento((anterior) => anterior + 1)
  }

  return {
    reservas,
    cargando,
    error,
    recargarReservas
  }
}
