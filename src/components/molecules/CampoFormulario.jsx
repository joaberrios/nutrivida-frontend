import Form from 'react-bootstrap/Form'
import CampoTexto from '../atoms/CampoTexto'

function CampoFormulario(props) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{props.etiqueta}</Form.Label>

      <CampoTexto
        tipo={props.tipo}
        placeholder={props.placeholder}
        valor={props.valor}
        alCambiar={props.alCambiar}
      />
    </Form.Group>
  )
}

export default CampoFormulario