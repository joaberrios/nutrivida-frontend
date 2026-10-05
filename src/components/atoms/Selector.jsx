import Form from 'react-bootstrap/Form'

function Selector({ opciones, valor, alCambiar }) {
  return (
    <Form.Select value={valor} onChange={alCambiar}>
      <option value="">Seleccione una opción</option>

      {opciones.map((opcion) => (
        <option key={opcion} value={opcion}>
          {opcion}
        </option>
      ))}
    </Form.Select>
  )
}

export default Selector
