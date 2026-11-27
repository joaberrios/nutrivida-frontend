import { Button, Card, Form, Row, Col, Spinner } from 'react-bootstrap'

function FormularioUsuario({
  formulario,
  idEditando,
  procesando,
  cambiarCampo,
  guardarUsuario,
  cancelar
}) {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <h4 className="text-success mb-3">
          {idEditando ? 'Editar usuario' : 'Crear usuario'}
        </h4>

        <Form onSubmit={guardarUsuario}>
          <fieldset disabled={procesando}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    name="nombre"
                    value={formulario.nombre}
                    onChange={cambiarCampo}
                    maxLength={100}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    name="apellido"
                    value={formulario.apellido}
                    onChange={cambiarCampo}
                    maxLength={100}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={formulario.correo}
                onChange={cambiarCampo}
                maxLength={255}
                required
              />
            </Form.Group>

            {!idEditando && (
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="contrasena"
                  value={formulario.contrasena}
                  onChange={cambiarCampo}
                  minLength={15}
                  maxLength={128}
                  autoComplete="new-password"
                  required
                />
                <Form.Text>
                  Mínimo 15 caracteres.
                </Form.Text>
              </Form.Group>
            )}

            <Form.Group className="mb-4">
              <Form.Label>Rol del usuario</Form.Label>
              <Form.Select
                name="rol"
                value={formulario.rol}
                onChange={cambiarCampo}
                required
              >
                <option value="paciente">Paciente</option>
                <option value="administrador">Administrador</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="success">
              {procesando ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Guardando...
                </>
              ) : idEditando ? (
                'Guardar cambios'
              ) : (
                'Crear usuario'
              )}
            </Button>

            {idEditando && (
              <Button
                type="button"
                variant="outline-secondary"
                className="ms-2"
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

export default FormularioUsuario
