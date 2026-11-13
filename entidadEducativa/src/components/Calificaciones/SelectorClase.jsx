export default function SelectorClase({ clases, claseSeleccionada, cargando, rol, onSeleccionarClase }) {
  return (
    <>
      <h2>Seleccionar Clase Asignada</h2>
      {cargando ? (
        <p>Cargando tus clases...</p>
      ) : clases.length === 0 ? (
        <p><em>No tienes clases asignadas actualmente en el sistema.</em></p>
      ) : (
        <div>
          <label>
            <strong>Clase / Asignatura: </strong>
            <select
              value={claseSeleccionada?.asignacion_curso_maestro_id || ''}
              onChange={(e) => {
                const clase = clases.find(
                  (item) => String(item.asignacion_curso_maestro_id) === e.target.value
                );
                if (clase) onSeleccionarClase(clase);
              }}
              style={{ padding: '0.4rem', fontSize: '1rem', minWidth: '320px' }}
            >
              {clases.map((clase) => (
                <option key={clase.asignacion_curso_maestro_id} value={clase.asignacion_curso_maestro_id}>
                  {clase.nom_curso} — {clase.nom_grado} Sección {clase.nom_seccion} ({clase.ciclo})
                  {rol !== 4 ? ` [Prof. ${clase.maestro_nombre} ${clase.maestro_apellido}]` : ''}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </>
  );
}
