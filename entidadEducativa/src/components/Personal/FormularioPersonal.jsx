export default function FormularioPersonal({
  nuevo,
  setNuevo,
  usuariosParaCargo,
  cargando,
  onSubmit
}) {
  return (
    <section>
      <h2>Registrar Personal Administrativo</h2>
      <form onSubmit={onSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            required
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          />
        </label>
        <br />
        <label>
          Apellido:
          <input
            type="text"
            required
            value={nuevo.apellido}
            onChange={(e) => setNuevo({ ...nuevo, apellido: e.target.value })}
          />
        </label>
        <br />
        <label>
          Cargo:
          <select
            value={nuevo.cargo}
            onChange={(e) => setNuevo({ ...nuevo, cargo: e.target.value, usuario_id: '' })}
          >
            <option value="DIRECTOR">DIRECTOR</option>
            <option value="SUBDIRECTOR">SUBDIRECTOR</option>
            <option value="SECRETARIA">SECRETARIA</option>
            <option value="CONTADOR">CONTADOR</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>
        <br />
        <label>
          Email institucional:
          <input
            type="email"
            required
            value={nuevo.email}
            onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
          />
        </label>
        <br />
        <label>
          Teléfono:
          <input
            type="text"
            value={nuevo.telefono}
            onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })}
          />
        </label>
        <br />
        <label>
          Cuenta de usuario:
          <select
            required
            value={nuevo.usuario_id}
            onChange={(e) => setNuevo({ ...nuevo, usuario_id: e.target.value })}
          >
            <option value="">
              {usuariosParaCargo.length
                ? 'Selecciona un usuario disponible'
                : 'No hay usuarios disponibles para este cargo'}
            </option>
            {usuariosParaCargo.map((usuario) => (
              <option key={usuario.usuario_id} value={usuario.usuario_id}>
                {usuario.nom_usuario} (#{usuario.usuario_id})
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit" disabled={cargando || usuariosParaCargo.length === 0}>
          Guardar Personal
        </button>
      </form>
    </section>
  );
}
