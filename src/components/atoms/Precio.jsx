function Precio({ valor }) {
  return (
    <h5>
      ${valor.toLocaleString('es-CL')}
    </h5>
  )
}

export default Precio