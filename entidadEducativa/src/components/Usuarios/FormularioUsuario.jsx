export default function FormularioUsuario({ usuario, setUsuario, onSubmit }) {
  return (
    <section className="CrearUsuario">
      <h2>Crear Nuevo Usuario</h2>
      <form onSubmit={onSubmit}>
        <label>
          Nombre de Usuario:
          <input
            type="text"
            required
            value={usuario.nom_usuario}
            onChange={(e) => setUsuario({ ...usuario, nom_usuario: e.target.value })}
          />
        </label>
        <br />
        <label>
          Contraseña inicial (mín. 8 caracteres):
          <input
            type="password"
            required
            minLength={8}
            value={usuario.password}
            onChange={(e) => setUsuario({ ...usuario, password: e.target.value })}
          />
        </label>
        <br />
        <label>
          Rol:
          <select
            value={usuario.rol_id}
            onChange={(e) => setUsuario({ ...usuario, rol_id: e.target.value })}
          >
            <option value={1}>1 - Administrador</option>
            <option value={2}>2 - Director</option>
            <option value={3}>3 - Secretaria</option>
            <option value={4}>4 - Maestro</option>
            <option value={5}>5 - Alumno</option>
          </select>
        </label>
        <br />
        <label>
          Estado:
          <select
            value={usuario.estado}
            onChange={(e) => setUsuario({ ...usuario, estado: e.target.value })}
          >
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </label>
        <br />
        <button type="submit">Guardar Usuario</button>
      </form>
    </section>
  );
}
