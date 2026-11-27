import instanciaApi from './api'

// Listar todos los usuarios
export async function listarUsuarios() {
  const respuesta = await instanciaApi.get('/api/usuarios')
  return respuesta.data
}

// Consultar un usuario por identificador
export async function obtenerUsuario(id) {
  const respuesta = await instanciaApi.get(`/api/usuarios/${id}`)
  return respuesta.data.usuario
}

// Crear un usuario
export async function crearUsuario(datos) {
  const respuesta = await instanciaApi.post('/api/usuarios', datos)
  return respuesta.data
}

// Actualizar un usuario
export async function actualizarUsuario(id, datos) {
  const respuesta = await instanciaApi.put(`/api/usuarios/${id}`, datos)
  return respuesta.data
}

// Desactivar un usuario
export async function desactivarUsuario(id) {
  const respuesta = await instanciaApi.delete(`/api/usuarios/${id}`)
  return respuesta.data
}
