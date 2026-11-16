import { useState } from 'react'
import { Form, Button, Alert, Row, Col } from 'react-bootstrap'

import {
  obtenerFechaChile,
  obtenerHorarioAtencion,
  obtenerDuracionServicio,
  obtenerHorariosPermitidos
} from '../../utils/horarios'

function FormularioAgendamiento({
  servicios,
  nutricionistas,
  alContinuar,
  alVolver
}) {
  const [codigoServicio, setCodigoServicio] = useState('')
  const [nutricionistaId, setNutricionistaId] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [error, setError] = useState('')

  const hoy = obtenerFechaChile()

  const servicioSeleccionado = servicios.find(
    (servicio) => String(servicio.codigo) === codigoServicio
  )

  const nutricionistaSeleccionado = nutricionistas.find(
    (nutricionista) => String(nutricionista.id) === nutricionistaId
  )

  const duracion = obtenerDuracionServicio(servicioSeleccionado)

  const horarios = obtenerHorariosPermitidos(
    fecha,
    servicioSeleccionado
  )

  function cambiarServicio(evento) {
    setCodigoServicio(evento.target.value)
    setHora('')
    setError('')
  }

  function cambiarFecha(evento) {
    setFecha(evento.target.value)
    setHora('')
    setError('')
  }

  function enviarFormulario(evento) {
    evento.preventDefault()
    setError('')

    if (!servicioSeleccionado || !nutricionistaSeleccionado ||
        !fecha || !hora) {
      setError('Debes completar todos los campos.')
      return
    }

    const horariosValidos = obtenerHorariosPermitidos(
      fecha,
      servicioSeleccionado
    )

    if (!horariosValidos.includes(hora)) {
      setError('Selecciona una fecha y hora válidas.')
      return
    }

    alContinuar({
      servicio: servicioSeleccionado.nombre,
      codigoServicio: servicioSeleccionado.codigo,
      nutricionista: nutricionistaSeleccionado.nombre,
      nutricionistaId: nutricionistaSeleccionado.id,
      fecha,
      hora
    })
  }

  return (
    <Form onSubmit={enviarFormulario}>
      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <Form.Group className="mb-3" controlId="servicio">
        <Form.Label>Servicio nutricional</Form.Label>

        <Form.Select
          value={codigoServicio}
          onChange={cambiarServicio}
          required
        >
          <option value="">Selecciona un servicio</option>

          {servicios.map((servicio) => (
            <option
              key={servicio.codigo}
              value={servicio.codigo}
            >
              {servicio.nombre}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {servicioSeleccionado && duracion && (
        <Alert variant="light">
          Duración de la atención: {duracion} minutos.
        </Alert>
      )}

      {servicioSeleccionado && !duracion && (
        <Alert variant="warning">
          Este servicio no tiene una duración válida.
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="nutricionista">
        <Form.Label>Nutricionista</Form.Label>

        <Form.Select
          value={nutricionistaId}
          onChange={(evento) => {
            setNutricionistaId(evento.target.value)
            setError('')
          }}
          required
        >
          <option value="">Selecciona un nutricionista</option>

          {nutricionistas.map((nutricionista) => (
            <option
              key={nutricionista.id}
              value={nutricionista.id}
            >
              {nutricionista.nombre}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="fecha">
            <Form.Label>Fecha de atención</Form.Label>

            <Form.Control
              type="date"
              min={hoy}
              value={fecha}
              onChange={cambiarFecha}
              required
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3" controlId="hora">
            <Form.Label>Hora de atención</Form.Label>

            <Form.Select
              value={hora}
              onChange={(evento) => {
                setHora(evento.target.value)
                setError('')
              }}
              disabled={horarios.length === 0}
              required
            >
              <option value="">Selecciona una hora</option>

              {horarios.map((horario) => (
                <option key={horario} value={horario}>
                  {horario}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {fecha && fecha < hoy && (
        <Alert variant="warning">
          No puedes reservar en fechas pasadas.
        </Alert>
      )}

      {fecha && !obtenerHorarioAtencion(fecha) && (
        <Alert variant="warning">
          Selecciona un día de lunes a viernes.
        </Alert>
      )}

      {fecha && duracion && fecha >= hoy &&
        obtenerHorarioAtencion(fecha) &&
        horarios.length === 0 && (
          <Alert variant="warning">
            No quedan horarios permitidos para esta fecha.
          </Alert>
      )}

      <Form.Text className="d-block mb-3">
        La disponibilidad definitiva será comprobada
        al confirmar la reserva.
      </Form.Text>

      <div className="d-flex gap-2 flex-wrap">
        <Button
          variant="success"
          type="submit"
          disabled={!servicioSeleccionado ||
            !nutricionistaSeleccionado ||
            !horarios.includes(hora)}
        >
          Continuar a confirmación
        </Button>

        <Button
          variant="outline-secondary"
          type="button"
          onClick={alVolver}
        >
          Volver al menú
        </Button>
      </div>
    </Form>
  )
}

export default FormularioAgendamiento
