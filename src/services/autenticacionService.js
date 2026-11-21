import { solicitarApi } from './api'

import {
  crearRegistroDTO,
  crearInicioSesionDTO
} from '../dto/autenticacion.dto'

// Registrar un nuevo paciente.
export async function registrarPaciente(datos) {
  return solicitarApi('/auth/register', {
    metodo: 'POST',
    datos: crearRegistroDTO(datos)
  })
}

// Iniciar sesion de un usuario.
export async function iniciarSesion(datos) {
  return solicitarApi('/auth/login', {
    metodo: 'POST',
    datos: crearInicioSesionDTO(datos)
  })
}

// Consultar el perfil mediante JWT.
export async function consultarPerfil(token) {
  return solicitarApi('/auth/me', {
    metodo: 'GET',
    token
  })
}
