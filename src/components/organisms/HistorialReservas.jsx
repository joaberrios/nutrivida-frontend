import { Table, Badge } from 'react-bootstrap'

function HistorialReservas({ reservas }) {
  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>Reserva</th>
          <th>Servicio</th>
          <th>Nutricionista</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Duración</th>
          <th>Precio</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        {reservas.map((reserva) => (
          <tr key={reserva.id}>
            <td>{reserva.id}</td>

            <td>{reserva.servicio}</td>

            <td>{reserva.nutricionista}</td>

            <td>
              {String(reserva.fecha_reserva).slice(0, 10)}
            </td>

            <td>
              {String(reserva.hora_reserva).slice(0, 5)}
            </td>

            <td>{reserva.duracion_minutos} minutos</td>

            <td>
              {Number(reserva.precio).toLocaleString('es-CL', {
                style: 'currency',
                currency: 'CLP'
              })}
            </td>

            <td>
              <Badge
                bg={
                  reserva.estado?.toLowerCase() === 'confirmada'
                    ? 'success'
                    : 'secondary'
                }
              >
                {reserva.estado}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default HistorialReservas
