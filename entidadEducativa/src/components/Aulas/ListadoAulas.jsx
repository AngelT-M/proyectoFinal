export default function ListadoAulas({ aulas, cargando, ciclosOrdenados, aulasPorCiclo, puedeAbrir, onEliminar }) {
  return (
    <section>
      <h2>Listado de Aulas</h2>
      {cargando ? (
        <p>Cargando aulas...</p>
      ) : aulas.length === 0 ? (
        <p>No hay aulas registradas para este ciclo.</p>
      ) : (
        ciclosOrdenados.map((ciclo) => (
          <section className="lisUsuarios" key={ciclo}>
            <h3>Ciclo escolar {ciclo}</h3>
            <table className="tablaUsuarios">
              <thead className="encabezado">
                <tr>
                  <th>Nivel Educativo</th>
                  <th>Grado</th>
                  <th>Sección</th>
                  <th>Capacidad</th>
                  {puedeAbrir && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody className="tablacontenido">
                {aulasPorCiclo[ciclo].map((aula) => (
                  <tr key={aula.grado_seccion_id}>
                    <td>{aula.nom_nivel || 'Nivel General'}</td>
                    <td><strong>{aula.nom_grado || `Grado #${aula.grado_id}`}</strong></td>
                    <td>Sección {aula.nom_seccion || aula.seccion_id}</td>
                    <td>{aula.cantidad_estudiantes} alumnos máx.</td>
                    {puedeAbrir && (
                      <td className="cont-act">
                        <button className="btn-us apagado" type="button" onClick={() => onEliminar(aula)}>
                          Eliminar aula
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))
      )}
    </section>
  );
}
