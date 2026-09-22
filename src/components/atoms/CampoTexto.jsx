import Form from 'react-bootstrap/Form'

function CampoTexto(props) {
  return (
    <Form.Control
      type={props.tipo}
      placeholder={props.placeholder}
      value={props.valor}
      onChange={props.alCambiar}
    />
  )
}

export default CampoTexto