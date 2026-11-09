import Button from 'react-bootstrap/Button'

// Botón único reutilizable para toda la aplicación.
// Acepta texto o children y conserva las propiedades de React Bootstrap.
function Boton({ texto, children, tipo = 'button', variant = 'success', ...props }) {
  return (
    <Button type={tipo} variant={variant} {...props}>
      {children ?? texto}
    </Button>
  )
}

export default Boton
