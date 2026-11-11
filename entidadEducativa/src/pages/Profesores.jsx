import { useEffect, useState } from 'react';
import { maestroApi } from '../services/api';
import { useAuth } from '../auth/useAuth';
import '../style/usuarios.css';

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
    const maestro = maestros.find((item) => item.maestro_id === id);
    const nombre = maestro ? `${maestro.nombre} ${maestro.apellido}` : `#${id}`;
    if (!window.confirm(`¿Seguro que deseas eliminar a ${nombre} del registro de docentes?`)) return;
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
      <header>
        <p>Gestión académica</p>
        <h1>Catedráticos y docentes</h1>
        <p>Consulta el directorio docente o registra a un nuevo integrante de la institución.</p>
      </header>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {puedeEditar && (
        <section aria-labelledby="registro-docente">
          <div>
            <div>
              <h2 id="registro-docente">Registrar docente</h2>
              <p>Completa sus datos y vincula una cuenta de usuario disponible.</p>
            </div>
            <span>Nuevo registro</span>
          </div>
          <form onSubmit={handleCrear}>
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
                <span>
                  La cuenta debe existir previamente y todavía no estar vinculada a otro docente.
                </span>
              </label>
            </div>
            {!cargando && usuariosDisponibles.length === 0 && (
              <p>
                Para registrar un docente, primero crea o libera una cuenta con rol de maestro.
              </p>
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
            </div>
          </form>
        </section>
      )}

      <section className="lisUsuarios" aria-labelledby="listado-docentes">
        <div>
          <div>
            <h2 id="listado-docentes">Directorio de docentes</h2>
            <p>Información de contacto y datos de cada docente registrado.</p>
          </div>
          <span>
            {cargando
              ? 'Actualizando…'
              : `${maestros.length} ${maestros.length === 1 ? 'docente' : 'docentes'}`}
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
          <div>
            <table className="tablaUsuarios">
              <thead className="encabezado">
                <tr>
                  <th scope="col">ID</th>
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
                {maestros.map((m) => (
                  <tr key={m.maestro_id}>
                    <td>{m.maestro_id}</td>
                    <td>{m.carne_maestro}</td>
                    <td>{m.nombre}</td>
                    <td>{m.apellido}</td>
                    <td>{m.email || 'No registrado'}</td>
                    <td>{m.tel_personal || m.tel_casa || 'No registrado'}</td>
                    <td>{m.fecha_nacimiento}</td>
                    {puedeEditar && (
                      <td className="cont-act">
                        <button
                          className="btn-us apagado"
                          type="button"
                          aria-label={`Eliminar del registro a ${m.nombre} ${m.apellido}`}
                          onClick={() => handleEliminar(m.maestro_id)}
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
          <p>
            “Eliminar” quita el registro del directorio.
          </p>
        )}
      </section>
    </main>
  );
}

export default Profesores;
