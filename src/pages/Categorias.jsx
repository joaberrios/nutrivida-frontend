import { Container, Row, Col, Card } from 'react-bootstrap'

import PlantillaPublica from '../components/templates/PlantillaPublica'



function Categorias() {

 const categorias = [

  {

   nombre: 'Consultas',

   descripcion: 'Consultas y controles nutricionales personalizados.'

  },

  {

   nombre: 'Planes especializados',

   descripcion: 'Planes nutricionales según los objetivos y necesidades del paciente.'

  }

 ]



 return (

  <PlantillaPublica>

   <Container className="py-5">

    <h1 className="text-center mb-4">Categorías</h1>



    <Row className="g-4">

     {categorias.map((categoria) => (

      <Col key={categoria.nombre} xs={12} md={6}>

       <Card className="h-100 shadow-sm">

        <Card.Body>

         <Card.Title>{categoria.nombre}</Card.Title>



         <Card.Text>

          {categoria.descripcion}

         </Card.Text>

        </Card.Body>

       </Card>

      </Col>

     ))}

    </Row>

   </Container>

  </PlantillaPublica>

 )

}



export default Categorias