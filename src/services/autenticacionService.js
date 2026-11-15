
import { solicitarApi } from './api'

// Registrar un paciente
export async function registrarPaciente(datos) {
  return solicitarApi('/auth/register', {
    metodo: 'POST',
    datos
  })
}

// Iniciar sesión
export async function iniciarSesion(datos) {
  return solicitarApi('/auth/login', {
    metodo: 'POST',
    datos
  })
}

// Consultar el perfil del usuario autenticado
export async function consultarPerfil(token) {
  return solicitarApi('/auth/me', {
    metodo: 'GET',
    token
  })
}
