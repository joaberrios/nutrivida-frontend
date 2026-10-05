import serviciosIniciales from '../data/servicios'

const CLAVE = 'servicios'

// Carga los datos iniciales si todavía no existen
function iniciarDatos() {
  const datos = localStorage.getItem(CLAVE)

  if (!datos) {
    localStorage.setItem(CLAVE, JSON.stringify(serviciosIniciales))
  }
}

// LISTAR
export function listarServicios() {
  iniciarDatos()

  const datos = localStorage.getItem(CLAVE)
  return JSON.parse(datos)
}

// CREAR
export function crearServicio(nuevoServicio) {
  const servicios = listarServicios()

  servicios.push(nuevoServicio)

  localStorage.setItem(CLAVE, JSON.stringify(servicios))

  return nuevoServicio
}

// ACTUALIZAR
export function actualizarServicio(codigo, servicioActualizado) {
  const servicios = listarServicios()

  const nuevosServicios = servicios.map((servicio) =>
    servicio.codigo === codigo
      ? { ...servicio, ...servicioActualizado }
      : servicio
  )

  localStorage.setItem(CLAVE, JSON.stringify(nuevosServicios))

  return nuevosServicios
}

// ELIMINAR
export function eliminarServicio(codigo) {
  const servicios = listarServicios()

  const nuevosServicios = servicios.filter(
    (servicio) => servicio.codigo !== codigo
  )

  localStorage.setItem(CLAVE, JSON.stringify(nuevosServicios))

  return nuevosServicios
}