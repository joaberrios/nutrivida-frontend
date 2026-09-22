import { Container, Row, Col } from 'react-bootstrap'
import FormularioLogin from '../organisms/FormularioLogin'

function LoginTemplate() {
  return (
    <Container>
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col xs={12} md={8} lg={5}>
          <div className="p-4 border rounded shadow">
            <h1 className="text-center text-success mb-2">
              NutriVida
            </h1>

            <p className="text-center text-muted mb-4">
              Clínica Nutricional
            </p>

            <FormularioLogin />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginTemplate