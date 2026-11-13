function EventoCard({ evento, onEliminar }) {
  return (
    <div>
      <h3>{evento.titulo}</h3>
      <p>Descripción: {evento.descripcion}</p>
      <p>Fecha Inicio: {evento.fecha_inicio}</p>
      <p>Fecha Final: {evento.fecha_final}</p>
      <p>Tipo de Evento: {evento.tipo_evento}</p>
      <button onClick={() => onEliminar(evento.id)}>Eliminar</button>
    </div>
  );
}

export default EventoCard;
