
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  iniciarSesion as iniciarSesionApi
} from '../services/autenticacionService'

export const AutenticacionContext = createContext(null)

export function AutenticacionProvider({ children }) {
  const [sesion, setSesion] = useState(null)
  const [sesionVencida, setSesionVencida] = useState(false)

  async function iniciarSesion(correo, contrasena) {
    const respuesta = await iniciarSesionApi({
      correo,
      contrasena
    })

    if (
      !respuesta.accessToken ||
      !respuesta.usuario ||
      !Number.isFinite(respuesta.expiresIn) ||
      respuesta.expiresIn <= 0
    ) {
      throw new Error('La respuesta del servidor no es válida.')
    }

    setSesion({
      token: respuesta.accessToken,
      usuario: respuesta.usuario,
      vencimiento: Date.now() + respuesta.expiresIn * 1000
    })

    setSesionVencida(false)

    return respuesta.usuario
  }

  function cerrarSesion() {
    setSesion(null)
    setSesionVencida(false)
  }

  useEffect(() => {
    if (!sesion) return

    const tiempoRestante =
      sesion.vencimiento - Date.now()

    const temporizador = setTimeout(() => {
      setSesion(null)
      setSesionVencida(true)
    }, Math.max(0, tiempoRestante))

    return () => clearTimeout(temporizador)
  }, [sesion])

  return (
    <AutenticacionContext.Provider
      value={{
        usuario: sesion?.usuario ?? null,
        token: sesion?.token ?? null,
        autenticado: Boolean(sesion),
        sesionVencida,
        iniciarSesion,
        cerrarSesion
      }}
    >
      {children}
    </AutenticacionContext.Provider>
  )
}

export function usarAutenticacion() {
  const contexto = useContext(AutenticacionContext)

  if (!contexto) {
    throw new Error(
      'El contexto de autenticación no está disponible.'
    )
  }

  return contexto
}
