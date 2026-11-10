import { useEffect, useState } from 'react';
import { maestroApi } from '../services/api';
import { useAuth } from '../auth/useAuth';

function Profesores() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);
  const puedeEditar = [1, 2, 3].includes(rol);

  const [maestros, setMaestros] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [nuevo, setNuevo] = useState({
    carne_maestro: '',
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    email: '',
    tel_personal: '',
    tel_casa: '',
    usuario_id: ''
  });

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await maestroApi.mostrar();
      const listaMaestros = Array.isArray(data) ? data : [];
      setMaestros(listaMaestros);
      const usuarios = await maestroApi.usuariosDisponibles();
      setUsuariosDisponibles(Array.isArray(usuarios) ? usuarios : []);
    } catch (err) {
      setError(err.message || 'Error al cargar maestros.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await maestroApi.crear({
        ...nuevo,
        usuario_id: Number(nuevo.usuario_id)
      });
      setMensaje('Maestro registrado exitosamente.');
      setNuevo({
        carne_maestro: '',
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        email: '',
        tel_personal: '',
        tel_casa: '',
        usuario_id: ''
      });
      cargar();
    } catch (err) {
      setError(err.message || 'Error al registrar maestro.');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm(`¿Seguro que deseas eliminar al maestro #${id}?`)) return;
    setMensaje('');
    setError('');
    try {
      await maestroApi.eliminar(id);
      setMensaje(`Maestro #${id} eliminado.`);
      cargar();
    } catch (err) {
      setError(err.message || 'Error al eliminar maestro.');
    }
  };

  return (
    <main>
      <h1>Catedráticos y Docentes</h1>
      <p>Gestión del cuerpo docente de la institución.</p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {puedeEditar && (
        <section>
          <h2>Registrar Nuevo Maestro</h2>
          <form onSubmit={handleCrear}>
            <label>
              Carné de Maestro:
              <input
                type="text"
                required
                placeholder="Ej. M202604"
                value={nuevo.carne_maestro}
                onChange={(e) => setNuevo({ ...nuevo, carne_maestro: e.target.value })}
              />
            </label>
            <br />
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
              Fecha de Nacimiento:
              <input
                type="date"
                required
                value={nuevo.fecha_nacimiento}
                onChange={(e) => setNuevo({ ...nuevo, fecha_nacimiento: e.target.value })}
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                value={nuevo.email}
                onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })}
              />
            </label>
            <br />
            <label>
              Teléfono Personal:
              <input
                type="text"
                value={nuevo.tel_personal}
                onChange={(e) => setNuevo({ ...nuevo, tel_personal: e.target.value })}
              />
            </label>
            <br />
            <label>
              Teléfono de Casa:
              <input
                type="text"
                value={nuevo.tel_casa}
                onChange={(e) => setNuevo({ ...nuevo, tel_casa: e.target.value })}
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
                  {usuariosDisponibles.length
                    ? 'Selecciona un usuario disponible'
                    : 'No hay usuarios de maestro disponibles'}
                </option>
                {usuariosDisponibles.map((usuario) => (
                  <option key={usuario.usuario_id} value={usuario.usuario_id}>
                    {usuario.nom_usuario} (#{usuario.usuario_id})
                  </option>
                ))}
              </select>
            </label>
            <br />
            <button type="submit" disabled={cargando || usuariosDisponibles.length === 0}>
              Guardar Maestro
            </button>
          </form>
        </section>
      )}

      <section>
        <h2>Listado de Docentes</h2>
        {cargando ? (
          <p>Cargando lista...</p>
        ) : (
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Carné</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Fecha Nac.</th>
                {puedeEditar && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {maestros.map((m) => (
                <tr key={m.maestro_id}>
                  <td>{m.maestro_id}</td>
                  <td>{m.carne_maestro}</td>
                  <td>{m.nombre}</td>
                  <td>{m.apellido}</td>
                  <td>{m.email || '-'}</td>
                  <td>{m.tel_personal || m.tel_casa || '-'}</td>
                  <td>{m.fecha_nacimiento}</td>
                  {puedeEditar && (
                    <td>
                      <button type="button" onClick={() => handleEliminar(m.maestro_id)}>
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {maestros.length === 0 && (
                <tr>
                  <td colSpan={puedeEditar ? 8 : 7}>No hay maestros registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default Profesores;
