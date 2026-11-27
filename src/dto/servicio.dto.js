 // Preparar los datos de un servicio para enviarlos al backend
export function crearServicioRequestDto(datos) {
  return {
    codigo: datos.codigo.trim().toUpperCase(),
    tipo: datos.tipo.trim(),
    nombre: datos.nombre.trim(),
    duracion: datos.duracion.trim(),
    modalidad: datos.modalidad.trim(),
    profesional: datos.profesional.trim(),
    precio: Number(datos.precio),
    descripcion: datos.descripcion.trim()
  }
}
