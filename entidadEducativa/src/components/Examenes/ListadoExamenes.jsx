export default function ListadoExamenes({
  examenes,
  examenesFiltrados,
  ciclos,
  bimestres,
  cicloFiltro,
  bimestreFiltro,
  setCicloFiltro,
  setBimestreFiltro,
  onAutorizar
}) {
  return (
    <section>
      <h2>Historial de Exámenes</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <label>
          Ciclo escolar:
          <select value={cicloFiltro} onChange={(e) => setCicloFiltro(e.target.value)}>
            <option value="">Todos los ciclos</option>
            {ciclos.map((ciclo) => <option key={ciclo} value={ciclo}>{ciclo}</option>)}
          </select>
        </label>
        <label>
          Bimestre:
          <select value={bimestreFiltro} onChange={(e) => setBimestreFiltro(e.target.value)}>
            <option value="">Todos los bimestres</option>
            <option value="SIN_ESPECIFICAR">Sin especificar</option>
            {bimestres.map((bimestre) => (
              <option key={bimestre} value={bimestre}>{bimestre}</option>
            ))}
          </select>
        </label>
      </div>
      {examenes.length === 0 ? (
        <p>No hay exámenes registrados.</p>
      ) : examenesFiltrados.length === 0 ? (
        <p>No hay exámenes para el ciclo y bimestre seleccionados.</p>
      ) : (
        <div className="lisUsuarios">
          <table className="tablaUsuarios">
            <thead className="encabezado">
              <tr>
                <th>Examen</th>
                <th>Curso y aula</th>
                <th>Bimestre</th>
                <th>Docente</th>
                <th>Enviado</th>
                <th>Notas</th>
                <th>Archivo</th>
                <th>Estado y resolución</th>
              </tr>
            </thead>
            <tbody className="tablacontenido">
              {examenesFiltrados.map((examen) => (
                <tr key={examen.examen_id}>
                  <td><strong>{examen.titulo}</strong></td>
                  <td>
                    {examen.nom_curso} — {examen.nom_grado}, Sección {examen.nom_seccion}
                    {' '}({examen.ciclo})
                  </td>
                  <td>{examen.bimestre || 'Sin especificar'}</td>
                  <td>
                    {examen.maestro_nombre
                      ? `${examen.maestro_nombre} ${examen.maestro_apellido}`
                      : 'No indicado'}
                  </td>
                  <td>{examen.fecha_envio || '-'}</td>
                  <td>{examen.mensaje || '-'}</td>
                  <td>
                    <a href={examen.archivo_url} target="_blank" rel="noreferrer">Ver archivo</a>
                  </td>
                  <td>
                    <strong>{examen.estado}</strong>
                    {examen.estado === 'PENDIENTE' && (
                      <div>
                        <button
                          className="sesion"
                          type="button"
                          onClick={() => onAutorizar(examen, 'APROBADO')}
                        >
                          Aprobar
                        </button>
                        <button
                          className="btn-us apagado"
                          type="button"
                          onClick={() => onAutorizar(examen, 'RECHAZADO')}
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
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
