export default function HistorialAsistencia({
  esAlumno,
  rol,
  aulas,
  idAulaHistorial,
  onSeleccionarAula,
  idAlumnoHistorial,
  setIdAlumnoHistorial,
  alumnosHistorial,
  cargandoAlumnosHistorial,
  mesHistorial,
  setMesHistorial,
  setHistorial,
  setResumenHistorial,
  setError,
  onSubmit,
  cargandoHistorial,
  resumenHistorial,
  historial,
  error
}) {
  return (
    <section className="form-nuevo" style={{ marginBottom: '2.5rem' }}>
      <h2>{esAlumno ? 'Mi Historial de Asistencia' : 'Historial de Asistencia por Estudiante'}</h2>
      <form className="form-cont" onSubmit={onSubmit}>
        {[1, 2, 3, 4].includes(rol) && (
          <label>
            Filtrar por aula:{' '}
            <select
              value={idAulaHistorial}
              disabled={aulas.length === 0 || cargandoAlumnosHistorial}
              onChange={(e) => onSeleccionarAula(e.target.value)}
            >
              <option value="">-- Selecciona un aula --</option>
              {aulas.map((aula) => (
                <option key={aula.grado_seccion_id} value={aula.grado_seccion_id}>
                  {aula.nom_grado}, Sección {aula.nom_seccion} ({aula.ciclo})
                </option>
              ))}
            </select>
          </label>
        )}
        {!esAlumno && (
          <label>
            Seleccionar Estudiante:{' '}
            <select
              value={idAlumnoHistorial}
              disabled={!idAulaHistorial || cargandoAlumnosHistorial}
              onChange={(e) => {
                setIdAlumnoHistorial(e.target.value);
                setHistorial([]);
                setResumenHistorial(null);
                setError('');
              }}
            >
              <option value="">-- Selecciona un estudiante --</option>
              {alumnosHistorial.map((alumno) => (
                <option key={alumno.alumno_id} value={alumno.alumno_id}>
                  {alumno.nombre} {alumno.apellido} (Carné: {alumno.carne})
                </option>
              ))}
            </select>
          </label>
        )}
        {' '}
        <label>
          Mes a consultar:{' '}
          <input
            type="month"
            required
            value={mesHistorial}
            onChange={(e) => {
              setMesHistorial(e.target.value);
              setHistorial([]);
              setResumenHistorial(null);
              setError('');
            }}
          />
        </label>
        {' '}
        <button
          className="sesion"
          type="submit"
          disabled={cargandoHistorial || (!esAlumno && !idAlumnoHistorial)}
        >
          {cargandoHistorial ? 'Consultando…' : 'Consultar mes'}
        </button>
      </form>

      {cargandoHistorial && <p>Cargando historial...</p>}
      {!esAlumno && [1, 2, 3, 4].includes(rol) && aulas.length === 0 && !error && (
        <p>{rol === 4 ? 'No tienes aulas asignadas para consultar.' : 'No hay aulas disponibles para consultar.'}</p>
      )}
      {cargandoAlumnosHistorial && <p role="status">Cargando estudiantes del aula…</p>}
      {!esAlumno && idAulaHistorial && !cargandoAlumnosHistorial && alumnosHistorial.length === 0 && !error && (
        <p>No hay estudiantes asignados a esta aula.</p>
      )}
      {!cargandoHistorial && resumenHistorial?.total === 0 && (
        <p>No hay asistencias registradas para el mes seleccionado.</p>
      )}

      {resumenHistorial && (
        <p style={{ marginTop: '1rem' }}>
          <strong>Resumen:</strong> Total registros: {resumenHistorial.total} |
          Presentes: <span style={{ color: 'green' }}>{resumenHistorial.presentes}</span> |
          Tardes: <span style={{ color: 'orange' }}>{resumenHistorial.tardes}</span> |
          Ausencias: <span style={{ color: 'red' }}>{resumenHistorial.ausentes}</span>
        </p>
      )}

      {historial.length > 0 && (
        <table className="tablaUsuarios">
          <thead className="encabezado">
            <tr>
              <th>Fecha</th>
              <th>Estado de Asistencia</th>
              <th>Grado y Sección</th>
              <th>Ciclo</th>
            </tr>
          </thead>
          <tbody className="tablacontenido">
            {historial.map((item, idx) => (
              <tr key={idx}>
                <td>{item.fecha}</td>
                <td>
                  <strong
                    style={{
                      color: item.estado === 'PRESENTE'
                        ? 'green'
                        : item.estado === 'TARDE'
                          ? 'orange'
                          : 'red'
                    }}
                  >
                    {item.estado}
                  </strong>
                </td>
                <td>{item.nom_grado ? `${item.nom_grado} - Sección ${item.nom_seccion}` : 'Aula escolar'}</td>
                <td>{item.ciclo || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
