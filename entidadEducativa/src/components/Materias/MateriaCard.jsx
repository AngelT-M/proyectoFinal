function MateriaCard({ materia, onEliminar }) {
  return (
    <div>
      <h3>{materia.nombre}</h3>
      <p>Descripción: {materia.descripcion}</p>
      <button onClick={() => onEliminar(materia.id)}>Eliminar</button>
    </div>
  );
}

export default MateriaCard;
