function HorarioCard({ horario, onEliminar }) {
  return (
    <div>
      <h3>Horario #{horario.id}</h3>
      <p>Día: {horario.dia}</p>
      <p>Hora Inicio: {horario.hora_inicio}</p>
      <p>Hora Fin: {horario.hora_fin}</p>
      <p>Aula: {horario.aula}</p>
      <button onClick={() => onEliminar(horario.id)}>Eliminar</button>
    </div>
  );
}

export default HorarioCard;
