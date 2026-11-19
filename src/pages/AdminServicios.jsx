import { Link } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'

import FormularioServicio from '../components/organisms/FormularioServicio'
import TablaServiciosAdmin from '../components/organisms/TablaServiciosAdmin'
import { useAdministracionServicios } from '../hooks/useAdministracionServicios'

function AdminServicios() {
  const {
    servicios,
    cargando,
    errorCatalogo,
    recargarCatalogo,
    formulario,
    codigoEditando,
    mensaje,
    error,
    procesando,
    cambiarCampo,
    guardarServicio,
    seleccionarEditar,
    eliminar,
    cancelar
  } = useAdministracionServicios()

  return (
    <Container className="py-5">
      <Button
        as={Link}
        to="/menu"
        variant="outline-success"
        className="mb-3"
      >
        Volver al menú
      </Button>

      <h1 className="text-success mb-4">
        Administración de servicios
      </h1>

      <FormularioServicio
        formulario={formulario}
        codigoEditando={codigoEditando}
        mensaje={mensaje}
        error={error}
        procesando={procesando}
        cargando={cargando}
        cambiarCampo={cambiarCampo}
        guardarServicio={guardarServicio}
        cancelar={cancelar}
      />

      <TablaServiciosAdmin
        servicios={servicios}
        cargando={cargando}
        errorCatalogo={errorCatalogo}
        recargarCatalogo={recargarCatalogo}
        procesando={procesando}
        seleccionarEditar={seleccionarEditar}
        eliminar={eliminar}
      />
    </Container>
  )
}

export default AdminServicios

