export default function ListadoPersonal({ personal, cargando, puedeEditar, onEliminar }) {
  return (
    <section className="lisUsuarios">
      <h2>Listado de Personal</h2>
      {cargando ? (
        <p>Cargando lista...</p>
      ) : (
        <table className="tablaUsuarios">
          <thead className="encabezado">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cargo</th>
              <th>Email</th>
              <th>Teléfono</th>
              {puedeEditar && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody className="tablacontenido">
            {personal.map((empleado) => (
              <tr key={empleado.personal_id}>
                <td>{empleado.nombre}</td>
                <td>{empleado.apellido}</td>
                <td>{empleado.cargo}</td>
                <td>{empleado.email}</td>
                <td>{empleado.telefono || '-'}</td>
                {puedeEditar && (
                  <td className="cont-act">
                    <button className="btn-us apagado" type="button" onClick={() => onEliminar(empleado.personal_id)}>
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {personal.length === 0 && (
              <tr>
                <td colSpan={puedeEditar ? 7 : 6}>No hay personal registrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
