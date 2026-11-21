 // Transformar los datos del registro al formato de la API.
export function crearRegistroDTO(datos) {
  return {
    nombre: String(datos.nombre ?? '').trim(),
    apellido: String(datos.apellido ?? '').trim(),
    correo: String(datos.correo ?? '').trim().toLowerCase(),
    contrasena: datos.contrasena
  }
}

// Transformar los datos del inicio de sesion.
export function crearInicioSesionDTO(datos) {
  return {
    correo: String(datos.correo ?? '').trim().toLowerCase(),
    contrasena: datos.contrasena
  }
}
