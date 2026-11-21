 // Transformar los datos del formulario al formato esperado por la API.
export function crearServicioDTO(datos) {
  return {
    codigo: String(datos.codigo ?? '').trim().toUpperCase(),
    tipo: String(datos.tipo ?? '').trim(),
    nombre: String(datos.nombre ?? '').trim(),
    duracion: String(datos.duracion ?? '').trim(),
    modalidad: String(datos.modalidad ?? '').trim(),
    profesional: String(datos.profesional ?? '').trim(),
    precio: Number(datos.precio),
    descripcion: String(datos.descripcion ?? '').trim()
  }
}
