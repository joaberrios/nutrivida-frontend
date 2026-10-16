
import { useContext, useState } from 'react'
import { Container, Card, Form, Button, Table, Alert } from 'react-bootstrap'
import { ServiciosContext } from '../context/ServiciosContext'

const formularioInicial = {
  codigo: '',
  tipo: '',
  nombre: '',
  duracion: '',
  modalidad: 'Presencial',
  profesional: '',
  precio: '',
  descripcion: ''
}

function AdminServicios() {
  const { servicios, agregarServicio, editarServicio, borrarServicio } =
    useContext(ServiciosContext)

  const [formulario, setFormulario] = useState(formularioInicial)
  const [codigoEditando, setCodigoEditando] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  function cambiarCampo(event) {
    const { name, value } = event.target

    setFormulario({
      ...formulario,
      [name]: value
    })
  }

  function guardarServicio(event) {
    event.preventDefault()
    setError('')
    setMensaje('')

    if (Object.values(formulario).some(valor => String(valor).trim() === '')) {
      setError('Debes completar todos los campos.')
      return
    }

    const precio = Number(formulario.precio)

    if (!Number.isFinite(precio) || precio <= 0) {
      setError('El precio debe ser mayor que cero.')
      return
    }

    const datos = {
      ...formulario,
      precio
    }

    if (!codigoEditando && servicios.some(s => s.codigo === datos.codigo)) {
      setError('Ya existe un servicio con ese código.')
      return
    }

    if (codigoEditando) {
      editarServicio(codigoEditando, datos)
      setMensaje('Servicio actualizado correctamente.')
    } else {
      agregarServicio(datos)
      setMensaje('Servicio agregado correctamente.')
    }

    setFormulario(formularioInicial)
    setCodigoEditando(null)
  }

  function seleccionarEditar(servicio) {
    setFormulario({ ...servicio })
    setCodigoEditando(servicio.codigo)
    setMensaje('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function eliminar(codigo) {
    if (window.confirm('¿Seguro que deseas eliminar este servicio?')) {
      borrarServicio(codigo)
      setMensaje('Servicio eliminado correctamente.')
      setError('')
    }
  }

  function cancelar() {
    setFormulario(formularioInicial)
    setCodigoEditando(null)
    setError('')
    setMensaje('')
  }

  return (
    <Container className="py-5">
      <h1 className="text-success mb-4">
        Administración de servicios
      </h1>

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <h4 className="mb-3">
            {codigoEditando ? 'Editar servicio' : 'Agregar servicio'}
          </h4>

          {mensaje && <Alert variant="success">{mensaje}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={guardarServicio}>
            {[
              ['codigo', 'Código'],
              ['tipo', 'Tipo de servicio'],
              ['nombre', 'Nombre'],
              ['duracion', 'Duración'],
              ['profesional', 'Profesional'],
              ['precio', 'Precio'],
              ['descripcion', 'Descripción']
            ].map(([campo, etiqueta]) => (
              <Form.Group className="mb-3" key={campo}>
                <Form.Label>{etiqueta}</Form.Label>
                <Form.Control
                  name={campo}
                  type={campo === 'precio' ? 'number' : 'text'}
                  value={formulario[campo]}
                  onChange={cambiarCampo}
                  disabled={campo === 'codigo' && Boolean(codigoEditando)}
                />
              </Form.Group>
            ))}

            <Form.Group className="mb-3">
              <Form.Label>Modalidad</Form.Label>
              <Form.Select
                name="modalidad"
                value={formulario.modalidad}
                onChange={cambiarCampo}
              >
                <option value="Presencial">Presencial</option>
                <option value="Online">Online</option>
                <option value="Híbrida">Híbrida</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="success" className="me-2">
              {codigoEditando ? 'Guardar cambios' : 'Agregar servicio'}
            </Button>

            {codigoEditando && (
              <Button variant="secondary" onClick={cancelar}>
                Cancelar
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>

      <h3 className="mb-3">Servicios registrados</h3>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Modalidad</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {servicios.map(servicio => (
              <tr key={servicio.codigo}>
                <td>{servicio.codigo}</td>
                <td>{servicio.nombre}</td>
                <td>{servicio.modalidad}</td>
                <td>
                  ${Number(servicio.precio).toLocaleString('es-CL')}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2 mb-1"
                    onClick={() => seleccionarEditar(servicio)}
                  >
                    Editar
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    className="mb-1"
                    onClick={() => eliminar(servicio.codigo)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  )
}

export default AdminServicios
