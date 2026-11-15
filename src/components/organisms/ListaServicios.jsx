
import { useContext, useState } from 'react'
import {
  Row,
  Col,
  Alert,
  Spinner,
  Button
} from 'react-bootstrap'

import { CatalogoContext } from '../../context/CatalogoContext'
import TarjetaServicio from '../molecules/TarjetaServicio'
import Buscador from '../atoms/Buscador'

function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function obtenerCategoria(texto) {
  const categoria = normalizar(texto)

  if (categoria === 'consultas') {
    return 'consulta'
  }

  if (categoria === 'planes especializados') {
    return 'plan especializado'
  }

  return categoria
}

function ListaServicios({ categoria = null }) {
  const {
    servicios,
    cargando,
    error,
    recargarCatalogo
  } = useContext(CatalogoContext)

  const [busqueda, setBusqueda] = useState('')

  const serviciosFiltrados = servicios.filter((servicio) => {
    const nombre = normalizar(servicio.nombre)
    const tipo = obtenerCategoria(servicio.tipo)

    const textoBusqueda = normalizar(busqueda)
    const categoriaSeleccionada = obtenerCategoria(categoria)

    const coincideBusqueda =
      nombre.includes(textoBusqueda)

    const coincideCategoria =
      !categoriaSeleccionada ||
      tipo === categoriaSeleccionada

    return coincideBusqueda && coincideCategoria
  })

  if (cargando) {
    return (
      <div className="text-center py-5" role="status">
        <Spinner animation="border" variant="success" />

        <p className="mt-3">
          Cargando servicios disponibles...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <p>{error}</p>

        <Button
          variant="outline-danger"
          onClick={recargarCatalogo}
        >
          Reintentar
        </Button>
      </Alert>
    )
  }

  if (servicios.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        Actualmente no hay servicios disponibles.
      </Alert>
    )
  }

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
