import { Card, Form, Button, Alert } from 'react-bootstrap'

// Formulario reutilizable para crear y editar servicios.
function FormularioServicio({
  formulario,
  codigoEditando,
  mensaje,
  error,
  procesando,
  cargando,
  cambiarCampo,
  guardarServicio,
  cancelar
}) {
  return (
      <Card className="mb-4 shadow-sm">
        <Card.Body>

          <h4 className="mb-3">
            {codigoEditando
              ? 'Editar servicio'
              : 'Agregar servicio'}
          </h4>

          {mensaje && (
            <Alert variant="success">{mensaje}</Alert>
          )}

          {error && (
            <Alert variant="danger">{error}</Alert>
          )}

          <Form onSubmit={guardarServicio} noValidate>

            <fieldset disabled={procesando || cargando}>

              {[
                ['codigo', 'Código'],
                ['nombre', 'Nombre'],
                ['duracion', 'Duración'],
                ['profesional', 'Profesional'],
                ['precio', 'Precio'],
                ['descripcion', 'Descripción']
              ].map(([campo, etiqueta]) => (
                <Form.Group
                  className="mb-3"
                  key={campo}
                  controlId={campo}
                >
                  <Form.Label>{etiqueta}</Form.Label>

                  <Form.Control
                    name={campo}
                    type={campo === 'precio' ? 'number' : 'text'}
                    value={formulario[campo]}
                    onChange={cambiarCampo}
                    disabled={
                      campo === 'codigo' &&
                      Boolean(codigoEditando)
                    }
                  />
                </Form.Group>
              ))}

              <Form.Group
                className="mb-3"
                controlId="tipo"
              >
                <Form.Label>
                  Tipo de servicio
                </Form.Label>

                <Form.Select
                  name="tipo"
                  value={formulario.tipo}
                  onChange={cambiarCampo}
                >
                  <option value="">
                    Selecciona una categoría
                  </option>

                  <option value="Consulta">
                    Consulta
                  </option>

                  <option value="Plan especializado">
                    Plan especializado
                  </option>

                </Form.Select>
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="modalidad"
              >
                <Form.Label>Modalidad</Form.Label>

                <Form.Select
                  name="modalidad"
                  value={formulario.modalidad}
                  onChange={cambiarCampo}
                >
                  <option value="Presencial">
                    Presencial
                  </option>

                  <option value="Online (video)">
                    Online (video)
                  </option>

                  <option value="Híbrida">
                    Híbrida
                  </option>

                </Form.Select>
              </Form.Group>

              <Button
                type="submit"
                variant="success"
                className="me-2"
              >
                {procesando
                  ? 'Procesando...'
                  : codigoEditando
                    ? 'Guardar cambios'
                    : 'Agregar servicio'}
              </Button>

              {codigoEditando && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={cancelar}
                >
                  Cancelar
                </Button>
              )}

            </fieldset>

          </Form>
        </Card.Body>
      </Card>
  )
}

export default FormularioServicio
