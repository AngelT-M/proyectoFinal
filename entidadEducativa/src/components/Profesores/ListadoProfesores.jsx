export default function ListadoProfesores({ maestros, cargando, puedeEditar, onEliminar }) {
  return (
    <section className="lisUsuarios" aria-labelledby="listado-docentes">
      <div>
        <span>
          {cargando
            ? 'Actualizando…'
            : ``}
        </span>
      </div>
      {cargando ? (
        <p role="status">Cargando el directorio de docentes…</p>
      ) : maestros.length === 0 ? (
        <div>
          <h3>Aún no hay docentes registrados</h3>
          <p>Cuando se registre un docente, sus datos aparecerán aquí.</p>
        </div>
      ) : (
        <div className="lisUsuarios">
          <table className="tablaUsuarios">
            <thead className="encabezado">
              <tr>
                <th scope="col">Carné</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Correo electrónico</th>
                <th scope="col">Teléfono</th>
                <th scope="col">Fecha de nacimiento</th>
                {puedeEditar && <th scope="col">Acciones</th>}
              </tr>
            </thead>
            <tbody className="tablacontenido">
              {maestros.map((maestro) => (
                <tr key={maestro.maestro_id}>
                  <td>{maestro.carne_maestro}</td>
                  <td>{maestro.nombre}</td>
                  <td>{maestro.apellido}</td>
                  <td>{maestro.email || 'No registrado'}</td>
                  <td>{maestro.tel_personal || maestro.tel_casa || 'No registrado'}</td>
                  <td>{maestro.fecha_nacimiento}</td>
                  {puedeEditar && (
                    <td className="cont-act">
                      <button
                        className="btn-us apagado"
                        type="button"
                        aria-label={`Eliminar del registro a ${maestro.nombre} ${maestro.apellido}`}
                        onClick={() => onEliminar(maestro.maestro_id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {puedeEditar && maestros.length > 0 && (
        <p>“Eliminar” quita el registro del directorio.</p>
      )}
    </section>
  );
}
