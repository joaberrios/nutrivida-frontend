import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

// Mostrar usuarios registrados y sus acciones administrativas
function TablaUsuarios({
  usuarios,
  alEditar,
  alDesactivar,
  usuarioProcesandoId
}) {
  return (
    <Table striped bordered hover responsive className="align-middle">
      <thead className="table-success">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Estado</th>
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
              {usuario.activo ? 'Activo' : 'Inactivo'}
            </td>

            <td className="text-nowrap">
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                disabled={usuarioProcesandoId === usuario.id}
                onClick={() => alEditar(usuario)}
              >
                Editar
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                disabled={
                  !usuario.activo ||
                  usuarioProcesandoId === usuario.id
                }
                onClick={() => alDesactivar(usuario)}
              >
                Desactivar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default TablaUsuarios
