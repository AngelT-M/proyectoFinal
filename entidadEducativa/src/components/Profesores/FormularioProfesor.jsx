export default function FormularioProfesor({
  nuevo,
  setNuevo,
  usuariosDisponibles,
  cargando,
  onSubmit,
  onCancelar
}) {
  return (
    <section className="Crear-form">
      <div className="form-nuevo">
      <div>
        <div>
          <h2 id="registro-docente">Registrar docente</h2>
          <p>Completa sus datos y vincula una cuenta de usuario disponible.</p>
        </div>
        <span>Nuevo registro</span>
      </div>
      <form className="form-cont" onSubmit={onSubmit}>
        <div>
          <label>
            Carné de maestro <span>Obligatorio</span>
            <input
              type="text"
              required
              placeholder="Ej. M202604"
              value={nuevo.carne_maestro}
              onChange={(e) => setNuevo({ ...nuevo, carne_maestro: e.target.value })}
            />
          </label>
          <label>
            Nombre <span>Obligatorio</span>
            <input
              type="text"
              required
              value={nuevo.nombre}
              onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
            />
          </label>
          <label>
            Apellido <span>Obligatorio</span>
            <input
              type="text"
              required
              value={nuevo.apellido}
              onChange={(e) => setNuevo({ ...nuevo, apellido: e.target.value })}
            />
          </label>
          <label>
            Fecha de nacimiento <span>Obligatorio</span>
            <input
              type="date"
              required
              value={nuevo.fecha_nacimiento}
              onChange={(e) => setNuevo({ ...nuevo, fecha_nacimiento: e.target.value })}
            />
          </label>
          <label>
            Correo electrónico <span>Opcional</span>
            <input
              type="email"
              value={nuevo.email}
              onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
            />
          </label>
          <label>
            Teléfono personal <span>Opcional</span>
            <input
              type="tel"
              value={nuevo.tel_personal}
              onChange={(e) => setNuevo({ ...nuevo, tel_personal: e.target.value })}
            />
          </label>
          <label>
            Teléfono de casa <span>Opcional</span>
            <input
              type="tel"
              value={nuevo.tel_casa}
              onChange={(e) => setNuevo({ ...nuevo, tel_casa: e.target.value })}
            />
          </label>
          <label>
            Cuenta de usuario <span>Obligatorio</span>
            <select
              required
              value={nuevo.usuario_id}
              onChange={(e) => setNuevo({ ...nuevo, usuario_id: e.target.value })}
            >
              <option value="">
                {cargando
                  ? 'Cargando cuentas disponibles…'
                  : usuariosDisponibles.length
                    ? 'Selecciona una cuenta disponible'
                    : 'No hay cuentas de maestro disponibles'}
              </option>
              {usuariosDisponibles.map((usuario) => (
                <option key={usuario.usuario_id} value={usuario.usuario_id}>
                  {usuario.nom_usuario} (#{usuario.usuario_id})
                </option>
              ))}
            </select>
            <span>La cuenta debe existir previamente y todavía no estar vinculada a otro docente.</span>
          </label>
        </div>

        {!cargando && usuariosDisponibles.length === 0 && (
          <p>Para registrar un docente, primero crea o libera una cuenta con rol de maestro.</p>
        )}
        <div>
          <p>Los campos marcados como obligatorios deben completarse para guardar el registro.</p>
          <button
            className="btn-us"
            type="submit"
            disabled={cargando || usuariosDisponibles.length === 0}
          >
            {cargando ? 'Cargando datos…' : 'Registrar docente'}
          </button>
          <button className="sesion apagado" type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
      </div>
    </section>
  );
}
