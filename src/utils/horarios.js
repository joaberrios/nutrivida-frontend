const ZONA_HORARIA = 'America/Santiago'
const INTERVALO_MINUTOS = 30
const DURACION_PLAN = 50

// Obtener la fecha y hora actual de Chile
function obtenerMomentoChile(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(fecha)

  const valores = Object.fromEntries(
    partes.map((parte) => [parte.type, parte.value])
  )

  return {
    fecha: `${valores.year}-${valores.month}-${valores.day}`,
    minutos: Number(valores.hour) * 60 + Number(valores.minute)
  }
}

export function obtenerFechaChile(fecha = new Date()) {
  return obtenerMomentoChile(fecha).fecha
}

// Obtener el horario de atencion segun el dia
export function obtenerHorarioAtencion(fecha) {
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return null
  }

  const fechaCalendario = new Date(`${fecha}T00:00:00Z`)

  if (
    Number.isNaN(fechaCalendario.getTime()) ||
    fechaCalendario.toISOString().slice(0, 10) !== fecha
  ) {
    return null
  }

  const dia = fechaCalendario.getUTCDay()

  if (dia === 0 || dia === 6) {
    return null
  }

  return {
    inicio: 9 * 60,
    fin: dia === 5 ? 13 * 60 : 17 * 60
  }
}

// Obtener la duracion del servicio en minutos
export function obtenerDuracionServicio(servicio) {
  if (!servicio) return null

  const duracion = String(servicio.duracion ?? '').trim()

  if (
    duracion === '—' &&
    String(servicio.codigo).startsWith('PL')
  ) {
    return DURACION_PLAN
  }

  const coincidencia = duracion.match(/^(\d+)\s*min$/i)

  if (!coincidencia) return null

  const minutos = Number(coincidencia[1])

  return minutos > 0 && minutos <= 480
    ? minutos
    : null
}

// Convertir minutos a formato HH:MM
function formatearHora(minutos) {
  const hora = Math.floor(minutos / 60)
  const minuto = minutos % 60

  return `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`
}

// Generar horarios permitidos para una consulta
export function obtenerHorariosPermitidos(
  fecha,
  servicio,
  ahora = new Date()
) {
  const horario = obtenerHorarioAtencion(fecha)
  const duracion = obtenerDuracionServicio(servicio)
  const momento = obtenerMomentoChile(ahora)

  if (!horario || !duracion || fecha < momento.fecha) {
    return []
  }

  const horas = []

  for (
    let minutos = horario.inicio;
    minutos + duracion <= horario.fin;
    minutos += INTERVALO_MINUTOS
  ) {
    if (
      fecha === momento.fecha &&
      minutos <= momento.minutos
    ) {
      continue
    }

    horas.push(formatearHora(minutos))
  }

  return horas
}
