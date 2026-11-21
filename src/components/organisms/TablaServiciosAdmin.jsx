import { Table, Button, Alert, Spinner } from 'react-bootstrap'

// Mostrar los servicios y sus acciones administrativas.
function TablaServiciosAdmin({
  servicios,
  cargando,
  errorCatalogo,
  recargarCatalogo,
  procesando,
  seleccionarEditar,
  eliminar
}) {
  return (
    <>
      <h3 className="mb-3">
        Servicios registrados
      </h3>

      {cargando ? (
        <div className="text-center py-4" role="status">

          <Spinner
            animation="border"
            variant="success"
          />

          <p className="mt-3">
            Cargando servicios...
          </p>

        </div>

      ) : errorCatalogo ? (
        <Alert variant="danger">

          <p>{errorCatalogo}</p>

          <Button
            variant="outline-danger"
            onClick={recargarCatalogo}
          >
            Reintentar
          </Button>

        </Alert>

      ) : servicios.length === 0 ? (
        <Alert variant="info">
          No hay servicios registrados.
        </Alert>

      ) : (
        <div
          className="w-100"
          role="region"
          aria-label="Tabla de servicios registrados"
          tabIndex={0}
          style={{
            overflowX: 'auto',
            borderRadius: '8px'
          }}
        >
          <Table
            striped
            bordered
            hover
            className="mb-0"
            style={{ minWidth: '750px' }}
          >
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
                    <div className="d-flex gap-2">

                      <Button
                        variant="warning"
                        size="sm"
                        disabled={procesando}
                        onClick={() => seleccionarEditar(servicio)}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        disabled={procesando}
                        onClick={() => eliminar(servicio.codigo)}
                      >
                        Eliminar
                      </Button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </Table>
        </div>
      )}
    </>
  )
}

export default TablaServiciosAdmin
