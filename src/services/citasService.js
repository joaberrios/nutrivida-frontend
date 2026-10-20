
const CLAVE_CITAS = 'nutrivida_citas'

export function listarCitas() {
  const datos = localStorage.getItem(CLAVE_CITAS)

  if (!datos) return []

  const citas = JSON.parse(datos)

  if (!Array.isArray(citas)) {
    throw new Error('Los datos de las citas no son válidos.')
  }

  return citas
}

export function guardarCita(datos) {
  const citas = listarCitas()

  const ocupada = citas.some((cita) =>
    cita.nutricionista === datos.nutricionista &&
    cita.fecha === datos.fecha &&
    cita.hora === datos.hora
  )

  if (ocupada) {
    throw new Error(
      'Este nutricionista ya tiene una cita en la fecha y hora seleccionadas.'
    )
  }

  const nuevaCita = {
    ...datos,
    id: crypto.randomUUID(),
    estado: 'Confirmada'
  }

  localStorage.setItem(
    CLAVE_CITAS,
    JSON.stringify([...citas, nuevaCita])
  )

  return nuevaCita
}
