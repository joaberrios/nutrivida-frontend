import Form from 'react-bootstrap/Form'

function Buscador({ valor, alCambiar }) {
  return (
    <Form.Control
      type="text"
      placeholder="Buscar servicio..."
      value={valor}
      onChange={alCambiar}
    />
  )
}

export default Buscador