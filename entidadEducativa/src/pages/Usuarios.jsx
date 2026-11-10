import { useEffect, useState } from 'react';
import { usuarioApi } from '../services/api';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Formulario nuevo usuario
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nom_usuario: '',
    password: '',
    rol_id: 4,
    estado: 'ACTIVO'
  });

  // Formulario cambiar contraseña
  const [idCambioPassword, setIdCambioPassword] = useState(null);
  const [nuevoPassword, setNuevoPassword] = useState('');

  const cargarUsuarios = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await usuarioApi.mostrar();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await usuarioApi.crear({
        nom_usuario: nuevoUsuario.nom_usuario,
        password: nuevoUsuario.password,
        rol_id: Number(nuevoUsuario.rol_id),
        estado: nuevoUsuario.estado
      });
      setMensaje('Usuario creado exitosamente.');
      setNuevoUsuario({ nom_usuario: '', password: '', rol_id: 4, estado: 'ACTIVO' });
      cargarUsuarios();
    } catch (err) {
      setError(err.message || 'Error al crear usuario.');
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    if (!idCambioPassword) return;
    setMensaje('');
    setError('');
    try {
      await usuarioApi.cambiarContrasena(idCambioPassword, {
        password_nuevo: nuevoPassword
      });
      setMensaje(`Contraseña del usuario #${idCambioPassword} actualizada.`);
      setIdCambioPassword(null);
      setNuevoPassword('');
    } catch (err) {
      setError(err.message || 'Error al cambiar contraseña.');
    }
  };

  const handleDesactivar = async (id) => {
    if (!window.confirm(`¿Seguro que deseas desactivar el usuario #${id}?`)) return;
    setMensaje('');
    setError('');
    try {
      await usuarioApi.eliminar(id);
      setMensaje(`Usuario #${id} desactivado.`);
      cargarUsuarios();
    } catch (err) {
      setError(err.message || 'Error al desactivar usuario.');
    }
  };

  const getRolNombre = (id) => {
    const roles = {
      1: 'ADMIN',
      2: 'DIRECTOR',
      3: 'SECRETARIA',
      4: 'MAESTRO',
      5: 'ALUMNO'
    };
    return roles[Number(id)] || `Rol ${id}`;
  };

  return (
    <main>
      <h1>Gestión de Usuarios</h1>
      <p>Módulo exclusivo para Administradores del Sistema.</p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      <section>
        <h2>Crear Nuevo Usuario</h2>
        <form onSubmit={handleCrearUsuario}>
          <label>
            Nombre de Usuario:
            <input
              type="text"
              required
              value={nuevoUsuario.nom_usuario}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nom_usuario: e.target.value })}
            />
          </label>
          <br />
          <label>
            Contraseña inicial (mín. 8 caracteres):
            <input
              type="password"
              required
              minLength={8}
              value={nuevoUsuario.password}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
            />
          </label>
          <br />
          <label>
            Rol:
            <select
              value={nuevoUsuario.rol_id}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol_id: e.target.value })}
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
              value={nuevoUsuario.estado}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, estado: e.target.value })}
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </label>
          <br />
          <button type="submit">Guardar Usuario</button>
        </form>
      </section>

      {idCambioPassword && (
        <section>
          <h3>Cambiar Contraseña para Usuario #{idCambioPassword}</h3>
          <form onSubmit={handleCambiarPassword}>
            <label>
              Nueva Contraseña:
              <input
                type="password"
                required
                minLength={8}
                value={nuevoPassword}
                onChange={(e) => setNuevoPassword(e.target.value)}
              />
            </label>
            <button type="submit">Guardar Nueva Contraseña</button>
            <button type="button" onClick={() => setIdCambioPassword(null)}>Cancelar</button>
          </form>
        </section>
      )}

      <section>
        <h2>Listado de Cuentas de Usuario</h2>
        {cargando ? (
          <p>Cargando lista...</p>
        ) : (
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.usuario_id}>
                  <td>{u.usuario_id}</td>
                  <td>{u.nom_usuario}</td>
                  <td>{getRolNombre(u.rol_id)}</td>
                  <td>{u.estado}</td>
                  <td>
                    <button type="button" onClick={() => setIdCambioPassword(u.usuario_id)}>
                      Cambiar Contraseña
                    </button>
                    {u.estado === 'ACTIVO' && (
                      <button type="button" onClick={() => handleDesactivar(u.usuario_id)}>
                        Desactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="5">No hay usuarios registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default Usuarios;

