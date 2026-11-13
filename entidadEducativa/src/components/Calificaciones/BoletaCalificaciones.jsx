export default function BoletaCalificaciones({
  esAlumno,
  rol,
  clases,
  cargandoClases,
  idAsignacionBoleta,
  filtrarAlumnosBoleta,
  idAlumnoConsulta,
  setIdAlumnoConsulta,
  setBoleta,
  setErrorBoleta,
  setMensaje,
  cargandoListaAlumnos,
  listaAlumnos,
  cargarBoleta,
  errorBoleta,
  cargandoBoleta,
  boleta,
  cursosBoleta
}) {
  return (
    <section>
      <h2>Boleta de Calificaciones del Estudiante</h2>
      {!esAlumno && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            cargarBoleta(idAlumnoConsulta);
          }}
        >
          {rol === 4 && (
            <label>
              Filtrar por asignatura y aula:{' '}
              <select
                value={idAsignacionBoleta}
                disabled={cargandoClases}
                onChange={(e) => filtrarAlumnosBoleta(e.target.value)}
              >
                <option value="">
                  {cargandoClases ? 'Cargando tus asignaturas…' : '-- Selecciona una asignatura --'}
                </option>
                {clases.map((clase) => (
                  <option
                    key={clase.asignacion_curso_maestro_id}
                    value={clase.asignacion_curso_maestro_id}
                  >
                    {clase.nom_curso} — {clase.nom_grado}, Sección {clase.nom_seccion} ({clase.ciclo})
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            Seleccionar Estudiante:{' '}
            <select
              value={idAlumnoConsulta}
              disabled={cargandoListaAlumnos || (rol === 4 && !idAsignacionBoleta)}
              onChange={(e) => {
                setIdAlumnoConsulta(e.target.value);
                setBoleta(null);
                setErrorBoleta('');
                setMensaje('');
              }}
            >
              <option value="">-- Selecciona un estudiante --</option>
              {listaAlumnos.map((alumno) => (
                <option key={alumno.alumno_id} value={alumno.alumno_id}>
                  {alumno.nombre} {alumno.apellido} (Carné: {alumno.carne})
                </option>
              ))}
            </select>
          </label>
          {' '}
          <button
            className="sesion"
            type="submit"
            disabled={!idAlumnoConsulta || cargandoBoleta || cargandoListaAlumnos}
          >
            {cargandoBoleta ? 'Consultando…' : 'Ver Boleta de Notas'}
          </button>
        </form>
      )}

      {errorBoleta && <p role="alert" style={{ color: 'red' }}>{errorBoleta}</p>}
      {!esAlumno && cargandoListaAlumnos && <p role="status">Cargando estudiantes…</p>}
      {!esAlumno && !cargandoListaAlumnos && listaAlumnos.length === 0 && !errorBoleta && (
        <p>
          {rol === 4
            ? idAsignacionBoleta
              ? 'No hay estudiantes asignados a esta asignatura y aula.'
              : 'Selecciona una asignatura para buscar entre sus estudiantes.'
            : 'No hay estudiantes disponibles para consultar.'}
        </p>
      )}
      {cargandoBoleta && <p>Consultando calificaciones...</p>}

      {boleta && (
        <div>
          <h3>Boleta Oficial de Notas</h3>
          {Array.isArray(boleta) ? (
            boleta.length === 0 ? (
              <p>No se registran calificaciones asentadas aún.</p>
            ) : (
              cursosBoleta.map(([curso, bimestresCurso]) => (
                <section key={curso} className="lisUsuarios">
                  <h4>{curso}</h4>
                  {Object.entries(bimestresCurso).map(([bimestreId, grupo]) => (
                    <div key={`${curso}-${bimestreId}`}>
                      <h5>{grupo.nombre}</h5>
                      <table className="tablaUsuarios">
                        <thead className="encabezado">
                          <tr>
                            <th>Actividad de Evaluación</th>
                            <th>Punteo Obtenido</th>
                            <th>Punteo Máximo</th>
                          </tr>
                        </thead>
                        <tbody className="tablacontenido">
                          {grupo.calificaciones.map((item, idx) => (
                            <tr key={item.calificacion_id || `${item.bimestre_id}-${item.nom_actividad}-${idx}`}>
                              <td>{item.nom_actividad || '-'}</td>
                              <td style={{ fontWeight: 'bold', color: 'green' }}>
                                {item.punteo_obtenido ?? '-'} pts
                              </td>
                              <td>{item.punteo_maximo ?? '-'} pts</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </section>
              ))
            )
          ) : (
            <pre>{JSON.stringify(boleta, null, 2)}</pre>
          )}
        </div>
      )}
    </section>
  );
}
