import { useContext, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { ServiciosContext } from '../../context/ServiciosContext'
import TarjetaServicio from '../molecules/TarjetaServicio'
import Buscador from '../atoms/Buscador'

function ListaServicios() {
  const { servicios } = useContext(ServiciosContext)
  const [busqueda, setBusqueda] = useState('')

  const serviciosFiltrados = servicios.filter((servicio) =>
    servicio.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <>
      <div className="mb-4">
        <Buscador
          valor={busqueda}
          alCambiar={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <Row className="g-4">
        {serviciosFiltrados.map((servicio) => (
          <Col key={servicio.codigo} xs={12} md={6} lg={4}>
            <TarjetaServicio
              nombre={servicio.nombre}
              tipo={servicio.tipo}
              descripcion={servicio.descripcion}
              duracion={servicio.duracion}
              modalidad={servicio.modalidad}
              profesional={servicio.profesional}
              precio={servicio.precio}
            />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default ListaServicios