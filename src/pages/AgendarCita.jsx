
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Row,
  Col
} from 'react-bootstrap'
import PlantillaPublica from '../components/templates/PlantillaPublica'
import { ServiciosContext } from '../context/ServiciosContext'

function obtenerFechaLocal(fecha = new Date()) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function obtenerDiaSemana(fecha) {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  return new Date(anio, mes - 1, dia).getDay()
}

function obtenerHorario(fecha) {
  if (!fecha) return null

  const dia = obtenerDiaSemana(fecha)

  if (dia === 0 || dia === 6) return null

  if (dia === 5) {
    return { inicio: '09:00', fin: '13:00' }
  }

  return { inicio: '09:00', fin: '17:00' }
}

function generarHoras(inicio, fin) {
  const horas = []

  let [hora, minuto] = inicio.split(':').map(Number)
  const [horaFin, minutoFin] = fin.split(':').map(Number)

  while (hora * 60 + minuto < horaFin * 60 + minutoFin) {
    horas.push(
      `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`
    )

    minuto += 30

    if (minuto >= 60) {
      hora += 1
      minuto -= 60
    }
  }

  return horas
}

function AgendarCita() {
  const { servicios } = useContext(ServiciosContext)
  const navigate = useNavigate()

  const [servicio, setServicio] = useState('')
  const [nutricionista, setNutricionista] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [error, setError] = useState('')

  const hoy = obtenerFechaLocal()
  const horario = obtenerHorario(fecha)

  const horasDisponibles = horario
    ? generarHoras(horario.inicio, horario.fin).filter((horarioCita) => {
        if (fecha !== hoy) return true

        const ahora = new Date()
        const horaActual = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`

        return horarioCita > horaActual
      })
    : []

  function cambiarFecha(event) {
    const nuevaFecha = event.target.value

    setFecha(nuevaFecha)
    setHora('')
    setError('')

    if (!nuevaFecha) return

    if (nuevaFecha < obtenerFechaLocal()) {
      setError('No puedes reservar en fechas pasadas.')
      return
    }

    if (!obtenerHorario(nuevaFecha)) {
      setError('No atendemos sábados ni domingos. Selecciona un día de lunes a viernes.')
    }
  }

  function enviarFormulario(event) {
    event.preventDefault()
    setError('')

    if (!servicio || !nutricionista || !fecha || !hora) {
      setError('Debes completar todos los campos.')
      return
    }

    if (fecha < obtenerFechaLocal()) {
      setError('No puedes reservar en fechas pasadas.')
      return
    }

    const horarioSeleccionado = obtenerHorario(fecha)

    if (!horarioSeleccionado) {
      setError('No se pueden agendar citas los fines de semana.')
      return
    }

    const horasValidas = generarHoras(
      horarioSeleccionado.inicio,
      horarioSeleccionado.fin
    )

    if (!horasValidas.includes(hora)) {
      setError('La hora seleccionada está fuera del horario de atención.')
      return
    }

    const [anio, mes, dia] = fecha.split('-').map(Number)
    const [horaNumero, minutoNumero] = hora.split(':').map(Number)
    const fechaCita = new Date(
      anio,
      mes - 1,
      dia,
      horaNumero,
      minutoNumero
    )

    if (fechaCita <= new Date()) {
      setError('La fecha y hora seleccionadas ya pasaron.')
      return
    }

    const servicioSeleccionado = servicios.find(
      (item) => String(item.codigo) === servicio
    )

    if (!servicioSeleccionado) {
      setError('El servicio seleccionado no está disponible.')
      return
    }

    navigate('/confirmar-cita', {
      state: {
        servicio: servicioSeleccionado.nombre,
        codigoServicio: servicioSeleccionado.codigo,
        nutricionista,
        fecha,
        hora
      }
    })
  }

  return (
    <PlantillaPublica>
      <Container className="py-5">
        <div className="text-center mb-4">
          <h1 className="text-success fw-bold">
            Agendar cita nutricional
          </h1>
          <p className="text-muted">
            Selecciona tu servicio y el horario de atención.
          </p>
        </div>

        <Card
          className="mx-auto shadow-sm border-0"
          style={{ maxWidth: '700px' }}
        >
          <Card.Body className="p-4">
            <h4 className="mb-4">Datos de la reserva</h4>

            <Alert variant="info">
              <strong>Horarios de atención:</strong>
              <div>Lunes a jueves: 09:00 a 17:00</div>
              <div>Viernes: 09:00 a 13:00</div>
              <div>Sábados y domingos: cerrado</div>
            </Alert>

            {error && (
              <Alert variant="danger">{error}</Alert>
            )}

            <Form onSubmit={enviarFormulario}>
              <Form.Group className="mb-3">
                <Form.Label>Servicio nutricional</Form.Label>
                <Form.Select
                  value={servicio}
                  onChange={(event) => setServicio(event.target.value)}
                  required
                >
                  <option value="">Selecciona un servicio</option>
                  {servicios.map((item) => (
                    <option key={item.codigo} value={item.codigo}>
                      {item.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nutricionista</Form.Label>
                <Form.Select
                  value={nutricionista}
                  onChange={(event) => setNutricionista(event.target.value)}
                  required
                >
                  <option value="">Selecciona un nutricionista</option>
                  <option value="Nutricionista 1">Nutricionista 1</option>
                  <option value="Nutricionista 2">Nutricionista 2</option>
                  <option value="Nutricionista 3">Nutricionista 3</option>
                  <option value="Nutricionista 4">Nutricionista 4</option>
                </Form.Select>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de atención</Form.Label>
                    <Form.Control
                      type="date"
                      min={hoy}
                      value={fecha}
                      onChange={cambiarFecha}
                      required
                    />
                    <Form.Text className="text-muted">
                      Atención de lunes a viernes.
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora de atención</Form.Label>
                    <Form.Select
                      value={hora}
                      onChange={(event) => setHora(event.target.value)}
                      disabled={!horario || fecha < hoy}
                      required
                    >
                      <option value="">
                        Selecciona una hora
                      </option>
                      {horasDisponibles.map((horaDisponible) => (
                        <option
                          key={horaDisponible}
                          value={horaDisponible}
                        >
                          {horaDisponible}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {fecha && !horario && (
                <Alert variant="warning">
                  Este día está cerrado. Elige una fecha de lunes a viernes.
                </Alert>
              )}

              {fecha && horario && horasDisponibles.length === 0 && (
                <Alert variant="warning">
                  No quedan horarios para este día. Selecciona otra fecha.
                </Alert>
              )}

              <div className="d-flex gap-2 flex-wrap mt-3">
                <Button variant="success" type="submit">
                  Continuar a confirmación
                </Button>

                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => navigate('/menu')}
                >
                  Volver al menú
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </PlantillaPublica>
  )
}

export default AgendarCita
