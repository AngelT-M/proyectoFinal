export default function ListadoCalificacionesActividad({
  actividad,
  alumnos,
  cargando,
  notasTemp,
  setNotasTemp,
  onGuardarNota
}) {
  return (
    <div className="lisUsuarios">
      <h3>
        Listado de Alumnos Asignados para Calificar: "{actividad.nom_actividad}"
        {' '}<span>({actividad.bimestre} — Máximo {actividad.punteo_maximo} pts)</span>
      </h3>
      {cargando ? (
        <p>Cargando lista de estudiantes asignados...</p>
      ) : alumnos.length === 0 ? (
        <p><em>No hay alumnos asignados a esta aula/sección actualmente.</em></p>
      ) : (
        <table className="tablaUsuarios">
          <thead className="encabezado">
            <tr>
              <th>Carné</th>
              <th>Nombre del Estudiante</th>
              <th>Nota Registrada</th>
              <th>Calificar / Modificar Nota (Máx: {actividad.punteo_maximo})</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody className="tablacontenido">
            {alumnos.map((alumno) => {
              const nombreCompleto = `${alumno.nombre} ${alumno.apellido}`;
              const notaActual = notasTemp[alumno.asignacion_grado_id] ?? '';

              return (
                <tr key={alumno.alumno_id}>
                  <td>{alumno.carne}</td>
                  <td><strong>{nombreCompleto}</strong></td>
                  <td>
                    {alumno.punteo_obtenido !== null && alumno.punteo_obtenido !== undefined
                      ? <span>{alumno.punteo_obtenido} / {actividad.punteo_maximo} pts</span>
                      : <span>Sin Calificar</span>}
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      max={Number(actividad.punteo_maximo)}
                      placeholder={`0 - ${actividad.punteo_maximo}`}
                      value={notaActual}
                      onChange={(e) => setNotasTemp({
                        ...notasTemp,
                        [alumno.asignacion_grado_id]: e.target.value
                      })}
                    />
                    {' '}pts
                  </td>
                  <td>
                    <button
                      className="btn-us"
                      type="button"
                      onClick={() => onGuardarNota(alumno.asignacion_grado_id, nombreCompleto)}
                    >
                      Guardar Nota
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
