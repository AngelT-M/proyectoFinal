function InscripcionCard({ inscripcion, onEliminar }) {
  return (
    <div>
      <h3>Inscripción #{inscripcion.id}</h3>
      <p>Alumno ID: {inscripcion.alumno_id}</p>
      <p>Grado Sección ID: {inscripcion.grado_seccion_id}</p>
      <button onClick={() => onEliminar(inscripcion.id)}>Eliminar</button>
    </div>
  );
}

export default InscripcionCard;
