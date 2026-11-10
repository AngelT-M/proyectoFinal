import { useEffect, useState } from 'react';
import { personalApi } from '../services/api';
import { useAuth } from '../auth/useAuth';

function obtenerRolCargo(cargo) {
  if (cargo === 'ADMIN') return 1;
  if (cargo === 'DIRECTOR' || cargo === 'SUBDIRECTOR') return 2;
  return 3;
}

function Personal() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);
  const puedeEditar = [1, 2, 3].includes(rol);

  const [personal, setPersonal] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [nuevo, setNuevo] = useState({
    nombre: '',
    apellido: '',
    cargo: 'SECRETARIA',
    email: '',
    telefono: '',
    usuario_id: ''
  });
  const usuariosParaCargo = usuariosDisponibles.filter(
    (usuario) => Number(usuario.rol_id) === obtenerRolCargo(nuevo.cargo)
  );

  const cargarPersonal = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await personalApi.mostrar();
      const listaPersonal = Array.isArray(data) ? data : [];
      setPersonal(listaPersonal);
      const usuarios = await personalApi.usuariosDisponibles();
      setUsuariosDisponibles(Array.isArray(usuarios) ? usuarios : []);
    } catch (err) {
      setError(err.message || 'Error al cargar personal.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPersonal();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await personalApi.crear({
        ...nuevo,
        usuario_id: Number(nuevo.usuario_id)
      });
      setMensaje('Personal administrativo registrado exitosamente.');
      setNuevo({
        nombre: '',
        apellido: '',
        cargo: 'SECRETARIA',
        email: '',
        telefono: '',
        usuario_id: ''
      });
      cargarPersonal();
    } catch (err) {
      setError(err.message || 'Error al registrar personal.');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm(`¿Seguro que deseas eliminar al empleado #${id}?`)) return;
    setMensaje('');
    setError('');
    try {
      await personalApi.eliminar(id);
      setMensaje(`Empleado #${id} eliminado.`);
      cargarPersonal();
    } catch (err) {
      setError(err.message || 'Error al eliminar empleado.');
    }
  };

  return (
    <main>
      <h1>Personal Administrativo</h1>
      <p>Directores, subdirectores, secretarias y contadores de la institución.</p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {puedeEditar && (
        <section>
          <h2>Registrar Personal Administrativo</h2>
          <form onSubmit={handleCrear}>
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
                onChange={(e) => setNuevo({
                  ...nuevo,
                  cargo: e.target.value,
                  usuario_id: ''
                })}
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
      )}

      <section>
        <h2>Listado de Personal</h2>
        {cargando ? (
          <p>Cargando lista...</p>
        ) : (
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Cargo</th>
                <th>Email</th>
                <th>Teléfono</th>
                {puedeEditar && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {personal.map((p) => (
                <tr key={p.personal_id}>
                  <td>{p.personal_id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.apellido}</td>
                  <td>{p.cargo}</td>
                  <td>{p.email}</td>
                  <td>{p.telefono || '-'}</td>
                  {puedeEditar && (
                    <td>
                      <button type="button" onClick={() => handleEliminar(p.personal_id)}>
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
    </main>
  );
}

export default Personal;
