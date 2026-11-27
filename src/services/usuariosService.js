import { solicitarApi } from './api'

const RUTA_USUARIOS = '/usuarios'

export function listarUsuarios(token) {
  return solicitarApi(RUTA_USUARIOS, { token })
}

export function consultarUsuario(id, token) {
  return solicitarApi(`${RUTA_USUARIOS}/${id}`, { token })
}

export function crearUsuario(datos, token) {
  return solicitarApi(RUTA_USUARIOS, {
    metodo: 'POST',
    datos,
    token
  })
}

export function actualizarUsuario(id, datos, token) {
  return solicitarApi(`${RUTA_USUARIOS}/${id}`, {
    metodo: 'PUT',
    datos,
    token
  })
}

export function desactivarUsuario(id, token) {
  return solicitarApi(`${RUTA_USUARIOS}/${id}`, {
    metodo: 'DELETE',
    token
  })
}
