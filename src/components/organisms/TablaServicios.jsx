import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'

// Mostrar servicios y sus acciones administrativas
function TablaServicios({
  servicios,
  alEditar,
  alDesactivar,
  codigoProcesando
}) {
  function mostrarPrecio(precio) {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(precio)
  }

  return (
    <Table striped bordered hover responsive className="align-middle">
      <thead className="table-success">
        <tr>
          <th>Codigo</th>
          <th>Nombre</th>
          <th>Categoria</th>
          <th>Precio</th>
          <th>Duracion</th>
          <th>Modalidad</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {servicios.map((servicio) => (
          <tr key={servicio.codigo}>
            <td>{servicio.codigo}</td>
            <td>{servicio.nombre}</td>
            <td>{servicio.tipo}</td>
            <td>{mostrarPrecio(servicio.precio)}</td>
            <td>{servicio.duracion}</td>
            <td>{servicio.modalidad}</td>

            <td className="text-nowrap">
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2 mb-1"
                disabled={codigoProcesando === servicio.codigo}
                onClick={() => alEditar(servicio)}
              >
                Editar
              </Button>

              <Button
                variant="outline-danger"
                size="sm"
                className="mb-1"
                disabled={codigoProcesando === servicio.codigo}
                onClick={() => alDesactivar(servicio)}
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

export default TablaServicios
