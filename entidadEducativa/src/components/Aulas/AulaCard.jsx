function AulaCard({ aula, onEliminar }) {
  return (
    <div>
      <h3>{aula.nombre}</h3>
      <p>Capacidad: {aula.capacidad}</p>
      <p>Ubicación: {aula.ubicacion}</p>
      <button onClick={() => onEliminar(aula.id)}>Eliminar</button>
    </div>
  );
}

export default AulaCard;
