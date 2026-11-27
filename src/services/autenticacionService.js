import instanciaApi from './api'

// Iniciar sesion mediante el backend
export async function iniciarSesion(datos) {
  const respuesta = await instanciaApi.post(
    '/api/auth/login',
    datos
  )

  return respuesta.data
}
