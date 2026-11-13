export default function ListadoUsuarios({
  cargando,
  rolesOrdenados,
  usuariosPorRol,
  getRolNombre,
  onCambiarPassword,
  onDesactivar,
  onActivar
}) {
  return (
    <section className="lisUsuarios">
      <h2>Listado de Cuentas de Usuario</h2>
      {cargando ? (
        <p>Cargando lista...</p>
      ) : rolesOrdenados.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : rolesOrdenados.map((rolId) => (
        <section className="cienpor" key={rolId} aria-labelledby={`usuarios-rol-${rolId}`}>
          <h3 id={`usuarios-rol-${rolId}`}>{getRolNombre(rolId)}</h3>
          <table className="tablaUsuarios">
            <thead className="encabezado">
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="tablacontenido">
              {usuariosPorRol[rolId].map((usuario) => (
                <tr key={usuario.usuario_id}>
                  <td>{usuario.usuario_id}</td>
                  <td>{usuario.nom_usuario}</td>
                  <td>{usuario.estado}</td>
                  <td className="cont-act">
                    {usuario.estado === 'ACTIVO' ? (
                      <>
                        <button className="btn-us" type="button" onClick={() => onCambiarPassword(usuario.usuario_id)}>
                          Cambiar Contraseña
                        </button>
                        <button className="btn-us apagado" type="button" onClick={() => onDesactivar(usuario.usuario_id)}>
                          Desactivar
                        </button>
                      </>
                    ) : (
                      <button className="btn-us" type="button" onClick={() => onActivar(usuario.usuario_id)}>
                        Reactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </section>
  );
}
