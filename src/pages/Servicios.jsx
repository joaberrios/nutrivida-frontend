import { Container } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import PlantillaPublica from '../components/templates/PlantillaPublica'
import ListaServicios from '../components/organisms/ListaServicios'

function Servicios() {
  const [searchParams] = useSearchParams()
  const categoria = searchParams.get('categoria')

  return (
    <PlantillaPublica>
      <Container className="py-5">
        <h1 className="text-center mb-2">
          {categoria || 'Servicios y Planes'}
        </h1>

        <p className="text-center text-muted mb-4">
          {categoria
            ? `Explora los servicios disponibles en ${categoria}.`
            : 'Conoce nuestros servicios de asesoría nutricional.'}
        </p>

        <ListaServicios categoria={categoria} />
      </Container>
    </PlantillaPublica>
  )
}

export default Servicios