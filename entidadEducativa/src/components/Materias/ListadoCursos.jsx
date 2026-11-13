export default function ListadoCursos({
  cursos,
  cargando,
  consultaAsignaciones,
  rol,
  esAdmin,
  onEditar
}) {
  return (
    <section className="lisUsuarios">
      <h2>{consultaAsignaciones ? 'Mis cursos asignados' : 'Catálogo de Cursos'}</h2>
      {cargando ? (
        <p>Cargando cursos...</p>
      ) : (
        <table className="tablaUsuarios">
          <thead className="encabezado">
            <tr>
              <th>Nombre del Curso</th>
              {consultaAsignaciones ? (
                <>
                  {rol === 5 && <th>Docente</th>}
                  <th>Aula</th>
                  <th>Ciclo escolar</th>
                </>
              ) : (
                <th>Descripción</th>
              )}
              {esAdmin && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody className="tablacontenido">
            {cursos.map((curso) => (
              <tr key={consultaAsignaciones ? curso.asignacion_curso_maestro_id : curso.curso_id}>
                <td>{curso.nom_curso}</td>
                {consultaAsignaciones ? (
                  <>
                    {rol === 5 && (
                      <td>{`${curso.maestro_nombre || ''} ${curso.maestro_apellido || ''}`.trim() || 'No indicado'}</td>
                    )}
                    <td>{curso.nom_grado} — Sección {curso.nom_seccion}</td>
                    <td>{curso.ciclo}</td>
                  </>
                ) : (
                  <td>{curso.descripcion || '-'}</td>
                )}
                {esAdmin && (
                  <td className="cont-act">
                    <button className="btn-us apagado" type="button" onClick={() => onEditar(curso)}>
                      Editar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {cursos.length === 0 && (
              <tr>
                <td colSpan={consultaAsignaciones ? (rol === 5 ? 4 : 3) : esAdmin ? 4 : 3}>
                  {consultaAsignaciones
                    ? 'No tienes cursos asignados en este momento.'
                    : 'No hay cursos registrados.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
