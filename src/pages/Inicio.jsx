import { Container } from 'react-bootstrap'
import PlantillaPublica from '../components/templates/PlantillaPublica'

function Inicio() {
  return (
    <PlantillaPublica>
      <Container className="text-center mt-5">
        <h1>NutriVida</h1>

        <h2>Asesoría nutricional personalizada</h2>

        <p>
          Encuentra servicios y planes nutricionales adaptados a tus necesidades.
        </p>
      </Container>
    </PlantillaPublica>
  )
}

export default Inicio