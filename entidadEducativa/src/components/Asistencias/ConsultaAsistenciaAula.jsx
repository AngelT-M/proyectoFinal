export default function ConsultaAsistenciaAula({
  aulas,
  idAula,
  setIdAula,
  fechaConsulta,
  setFechaConsulta,
  asistenciasAula,
  setAsistenciasAula,
  setNuevaAsistencia,
  cargandoAula,
  onSubmit
}) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2>Consultar Asistencia por Grado, Sección y Fecha</h2>
      <form onSubmit={onSubmit}>
        <label>
          Grado y Sección:{' '}
          <select
            value={idAula}
            onChange={(e) => {
              setIdAula(e.target.value);
              setAsistenciasAula([]);
              setNuevaAsistencia((actual) => ({
                ...actual,
                alumno_id: '',
                asignacion_grado_id: ''
              }));
            }}
          >
            {aulas.map((aula) => (
              <option key={aula.grado_seccion_id} value={aula.grado_seccion_id}>
                {aula.nom_grado} - Sección {aula.nom_seccion} ({aula.ciclo})
              </option>
            ))}
          </select>
        </label>
        <br /><br />
        <label>
          Fecha a consultar:{' '}
          <input
            type="date"
            required
            value={fechaConsulta}
            onChange={(e) => setFechaConsulta(e.target.value)}
          />
        </label>
        <br /><br />
        <button className="sesion" type="submit">Ver Lista de Asistencia del Aula</button>
      </form>

      {cargandoAula && <p>Consultando lista del aula...</p>}

      {asistenciasAula.length > 0 && (
        <div className="listaUsuarios">
          <h3>Lista de Estudiantes ({fechaConsulta})</h3>
          <table className="tablaUsuarios">
            <thead className="encabezado">
              <tr>
                <th>Carné</th>
                <th>Nombre del Estudiante</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody className="tablacontenido">
              {asistenciasAula.map((asignacion, idx) => (
                <tr key={idx}>
                  <td>{asignacion.carne || '-'}</td>
                  <td>{asignacion.nombre} {asignacion.apellido}</td>
                  <td>{asignacion.fecha || fechaConsulta}</td>
                  <td><strong>{asignacion.estado || 'SIN REGISTRO'}</strong></td>
                  <td>
                    <button
                      className="btn-us sesion"
                      type="button"
                      onClick={() => setNuevaAsistencia({
                        alumno_id: asignacion.alumno_id,
                        asignacion_grado_id: asignacion.asignacion_grado_id,
                        fecha: fechaConsulta,
                        estado: 'PRESENTE'
                      })}
                    >
                      Cargar en Formulario
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
