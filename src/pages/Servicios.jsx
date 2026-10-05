import { Container } from 'react-bootstrap'
import PlantillaPublica from '../components/templates/PlantillaPublica'
import ListaServicios from '../components/organisms/ListaServicios'

function Servicios() {
  return (
    <PlantillaPublica>
      <Container className="py-5">
        <h1 className="text-center mb-2">
          Servicios y Planes
        </h1>

        <p className="text-center text-muted mb-4">
          Conoce nuestros servicios de asesoría nutricional.
        </p>

        <ListaServicios />
      </Container>
    </PlantillaPublica>
  )
}

export default Servicios