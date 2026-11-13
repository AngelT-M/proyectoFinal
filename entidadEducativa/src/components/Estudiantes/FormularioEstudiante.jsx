export default function FormularioEstudiante({
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
      <h2>Inscribir / Registrar Nuevo Estudiante</h2>
      <form className="form-cont" onSubmit={onSubmit}>
        <label>
          Carné:
          <input
            type="text"
            required
            placeholder="Ej. 2026010"
            value={nuevo.carne}
            onChange={(e) => setNuevo({ ...nuevo, carne: e.target.value })}
          />
        </label>
        <label>
          Nombre:
          <input
            type="text"
            required
            value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })}
          />
        </label>
        <label>
          Apellido:
          <input
            type="text"
            required
            value={nuevo.apellido}
            onChange={(e) => setNuevo({ ...nuevo, apellido: e.target.value })}
          />
        </label>
        <label>
          Fecha de Nacimiento:
          <input
            type="date"
            required
            value={nuevo.fecha_nacimiento}
            onChange={(e) => setNuevo({ ...nuevo, fecha_nacimiento: e.target.value })}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={nuevo.email}
            onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
          />
        </label>
        <label>
          Nombre del Encargado / Tutor:
          <input
            type="text"
            required
            value={nuevo.nom_encargado}
            onChange={(e) => setNuevo({ ...nuevo, nom_encargado: e.target.value })}
          />
        </label>
        <label>
          Teléfono Personal:
          <input
            type="text"
            value={nuevo.tel_personal}
            onChange={(e) => setNuevo({ ...nuevo, tel_personal: e.target.value })}
          />
        </label>
        <label>
          Teléfono del Encargado:
          <input
            type="text"
            required
            value={nuevo.tel_encargado}
            onChange={(e) => setNuevo({ ...nuevo, tel_encargado: e.target.value })}
          />
        </label>
        <label>
          Cuenta de usuario:
          <select
            required
            value={nuevo.usuario_id}
            onChange={(e) => setNuevo({ ...nuevo, usuario_id: e.target.value })}
          >
            <option value="">
              {usuariosDisponibles.length
                ? 'Selecciona un usuario disponible'
                : 'No hay usuarios de alumno disponibles'}
            </option>
            {usuariosDisponibles.map((usuario) => (
              <option key={usuario.usuario_id} value={usuario.usuario_id}>
                {usuario.nom_usuario} (#{usuario.usuario_id})
              </option>
            ))}
          </select>
        </label>
        <div>
          <button type="submit" disabled={cargando || usuariosDisponibles.length === 0}>
            Guardar Estudiante
          </button>
          <button className="sesion apagado" type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
      </div>
    </section>
  );
}
