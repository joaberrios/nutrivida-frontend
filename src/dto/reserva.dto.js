 // Convertir los datos del formulario al formato de la API.
export function crearReservaDTO(datos) {
  return {
    codigo_servicio: datos.codigoServicio,
    nutricionista_id: Number(datos.nutricionistaId),
    fecha_reserva: datos.fecha,
    hora_reserva: datos.hora
  }
}
