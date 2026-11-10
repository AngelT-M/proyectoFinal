function AsistenciaCard({ asistencia, onEliminar }) {
  return (
    <div>
      <h3>Asistencia #{asistencia.id}</h3>
      <p>Usuario ID: {asistencia.usuario_id}</p>
      <p>Asignación Grado ID: {asistencia.asignacion_grado_id}</p>
      <p>Fecha: {asistencia.fecha}</p>
      <p>Estado: {asistencia.estado}</p>
      <button onClick={() => onEliminar(asistencia.id)}>Eliminar</button>
    </div>
  );
}

export default AsistenciaCard;
