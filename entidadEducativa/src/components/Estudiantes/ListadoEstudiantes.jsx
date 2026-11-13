export default function ListadoEstudiantes({
  rol,
  alumnos,
  cargando,
  esGestionador,
  onEliminar
}) {
  return (
    <section className="lisUsuarios">
      <h2>{rol === 5 ? 'Tus Datos Registrados' : 'Listado de Estudiantes'}</h2>
      {cargando ? (
        <p>Cargando información...</p>
      ) : rol === 5 ? (
        alumnos.length === 0 ? (
          <p>No se encontró información de alumno asociada a tu cuenta.</p>
        ) : (
          alumnos.map((alumno) => (
            <article key={alumno.alumno_id}>
              <h3>{alumno.nombre} {alumno.apellido}</h3>
              <p><strong>Carné:</strong> {alumno.carne}</p>
              <p><strong>Fecha de nacimiento:</strong> {alumno.fecha_nacimiento || 'No registrada'}</p>
              <p><strong>Email:</strong> {alumno.email || 'No registrado'}</p>
              <p><strong>Encargado:</strong> {alumno.nom_encargado || 'No registrado'}</p>
              <p><strong>Teléfono del encargado:</strong> {alumno.tel_encargado || 'No registrado'}</p>
            </article>
          ))
        )
      ) : (
        <table className="tablaUsuarios">
          <thead className="encabezado">
            <tr>
              <th>Carné</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Fecha Nac.</th>
              <th>Email</th>
              <th>Encargado</th>
              <th>Tel. Encargado</th>
              {esGestionador && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody className="tablacontenido">
            {alumnos.map((alumno) => (
              <tr key={alumno.alumno_id}>
                <td>{alumno.carne}</td>
                <td>{alumno.nombre}</td>
                <td>{alumno.apellido}</td>
                <td>{alumno.fecha_nacimiento}</td>
                <td>{alumno.email || '-'}</td>
                <td>{alumno.nom_encargado}</td>
                <td>{alumno.tel_encargado}</td>
                {esGestionador && (
                  <td className="cont-act">
                    <button className="btn-us apagado" type="button" onClick={() => onEliminar(alumno.alumno_id)}>
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {alumnos.length === 0 && (
              <tr>
                <td colSpan={esGestionador ? 9 : 8}>No se encontraron estudiantes.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
