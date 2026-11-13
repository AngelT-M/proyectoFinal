function CalificacionCard({ calificacion, onEliminar }) {
  return (
    <div>
      <h3>Calificación #{calificacion.id}</h3>
      <p>Asignación Grado ID: {calificacion.asignacion_grado_id}</p>
      <p>Actividad Curso ID: {calificacion.actividad_curso_id}</p>
      <p>Punteo Obtenido: {calificacion.punteo_obtenido}</p>
      <p>Fecha de Registro: {calificacion.fecha_registro}</p>
      <button onClick={() => onEliminar(calificacion.id)}>Eliminar</button>
    </div>
  );
}

export default CalificacionCard;
