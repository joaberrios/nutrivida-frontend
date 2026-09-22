import Button from 'react-bootstrap/Button'

function BotonLogin(props) {
  return (
    <Button
      variant="success"
      type="submit"
      className="w-100"
    >
      {props.texto}
    </Button>
  )
}

export default BotonLogin