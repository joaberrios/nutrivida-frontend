import Button from 'react-bootstrap/Button'

function Boton({ texto, tipo = 'button', alHacerClick }) {
  return (
    <Button
      variant="success"
      type={tipo}
      onClick={alHacerClick}
    >
      {texto}
    </Button>
  )
}

export default Boton