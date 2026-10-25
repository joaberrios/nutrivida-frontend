
import { useContext, useState } from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
import { ServiciosContext } from '../../context/ServiciosContext'
import TarjetaServicio from '../molecules/TarjetaServicio'
import Buscador from '../atoms/Buscador'

function ListaServicios({ categoria = null }) {
  const { servicios } = useContext(ServiciosContext)
  const [busqueda, setBusqueda] = useState('')

  const normalizar = (texto) =>
    String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()

  const serviciosFiltrados = servicios.filter((servicio) => {
    const nombre = normalizar(servicio.nombre)
    const tipo = normalizar(servicio.tipo)
    const textoBusqueda = normalizar(busqueda)
    const categoriaSeleccionada = normalizar(categoria)

    const coincideBusqueda = nombre.includes(textoBusqueda)

    let coincideCategoria = true

    if (categoriaSeleccionada === 'consultas') {
      coincideCategoria =
        tipo.includes('consulta') ||
        tipo.includes('evaluacion') ||
        tipo.includes('control') ||
        nombre.includes('consulta') ||
        nombre.includes('evaluacion') ||
        nombre.includes('control')
    }

    if (categoriaSeleccionada === 'planes especializados') {
      coincideCategoria =
        tipo.includes('plan') ||
        tipo.includes('programa') ||
        nombre.includes('plan') ||
        nombre.includes('programa')
    }

    return coincideBusqueda && coincideCategoria
  })

  return (
    <>
      <div className="mb-4">
        <Buscador
          valor={busqueda}
          alCambiar={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {serviciosFiltrados.length === 0 ? (
        <Alert variant="warning" className="text-center">
          No se encontraron servicios para esta categoría o búsqueda.
        </Alert>
      ) : (
        <Row className="g-4">
          {serviciosFiltrados.map((servicio) => (
            <Col key={servicio.codigo} xs={12} md={6} lg={4}>
              <TarjetaServicio
                codigo={servicio.codigo}
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
      )}
    </>
  )
}

export default ListaServicios
