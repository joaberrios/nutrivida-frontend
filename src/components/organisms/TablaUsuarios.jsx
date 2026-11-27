import { Button, Card, Spinner, Table } from 'react-bootstrap'

function TablaUsuarios({
  usuarios,
  cargando,
  procesando,
  consultar,
  seleccionarEditar,
  desactivar
}) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h4 className="text-success mb-3">
          Usuarios registrados
        </h4>

        {cargando ? (
          <Spinner animation="border" variant="success" />
        ) : usuarios.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : (
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline-info"
                        disabled={procesando}
                        onClick={() => consultar(usuario.id)}
                      >
                        Ver
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-primary"
                        disabled={procesando}
                        onClick={() => seleccionarEditar(usuario)}
                      >
                        Editar
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        disabled={procesando}
                        onClick={() => desactivar(usuario.id)}
                      >
                        Desactivar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  )
}

export default TablaUsuarios
