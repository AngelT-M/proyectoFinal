function ProfesorCard({ profesor, onEliminar }) {
  return (
    <div>
      <h3>{profesor.nombre} {profesor.apellido}</h3>
      <p>Email: {profesor.email}</p>
      <p>Teléfono: {profesor.telefono}</p>
      <p>Especialidad: {profesor.especialidad}</p>
      <button onClick={() => onEliminar(profesor.id)}>Eliminar</button>
    </div>
  );
}

export default ProfesorCard;
