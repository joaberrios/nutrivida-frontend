import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Form, Button } from 'react-bootstrap'
import PlantillaPublica from '../components/templates/PlantillaPublica'
import { ServiciosContext } from '../context/ServiciosContext'

function AgendarCita() {
  const { servicios } = useContext(ServiciosContext)
  const navigate = useNavigate()

  const [servicio, setServicio] = useState('')
  const [nutricionista, setNutricionista] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')

  function enviarFormulario(e) {
    e.preventDefault()

    if (!servicio || !nutricionista || !fecha || !hora) {
      return
    }

    const servicioSeleccionado = servicios.find(
      (item) => item.codigo === servicio
    )

    navigate('/confirmar-cita', {
      state: {
        servicio: servicioSeleccionado.nombre,
        nutricionista,
        fecha,
        hora
      }
    })
  }

  return (
    <PlantillaPublica>
      <Container className="py-5">
        <h1 className="text-center mb-4">
          Agendar cita
        </h1>

        <Form
          onSubmit={enviarFormulario}
          className="mx-auto"
          style={{ maxWidth: '600px' }}
        >
          <Form.Group className="mb-3">
            <Form.Label>Servicio</Form.Label>

            <Form.Select
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              required
            >
              <option value="">Seleccione un servicio</option>

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
              onChange={(e) => setNutricionista(e.target.value)}
              required
            >
              <option value="">Seleccione un nutricionista</option>
              <option value="Nutricionista 1">Nutricionista 1</option>
              <option value="Nutricionista 2">Nutricionista 2</option>
              <option value="Nutricionista 3">Nutricionista 3</option>
              <option value="Nutricionista 4">Nutricionista 4</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>

            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>

            <Form.Control
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit">
            Continuar
          </Button>
        </Form>
      </Container>
    </PlantillaPublica>
  )
}

export default AgendarCita