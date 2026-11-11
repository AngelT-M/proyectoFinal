import { useCallback, useEffect, useState } from 'react';
import { alumnoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';

function Estudiantes() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);
  const esGestionador = [1, 2, 3].includes(rol);

  const [alumnos, setAlumnos] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [nuevo, setNuevo] = useState({
    carne: '',
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    email: '',
    nom_encargado: '',
    tel_personal: '',
    tel_encargado: '',
    usuario_id: ''
  });

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const data = await alumnoApi.mostrar();
      const listaAlumnos = Array.isArray(data) ? data : [];
      setAlumnos(listaAlumnos);
      if (esGestionador) {
        const usuarios = await alumnoApi.usuariosDisponibles();
        setUsuariosDisponibles(Array.isArray(usuarios) ? usuarios : []);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar alumnos.');
    } finally {
      setCargando(false);
    }
  }, [esGestionador]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleCrear = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await alumnoApi.crear({
        ...nuevo,
        usuario_id: Number(nuevo.usuario_id)
      });
      setMensaje('Estudiante registrado exitosamente.');
      setNuevo({
        carne: '',
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        email: '',
        nom_encargado: '',
        tel_personal: '',
        tel_encargado: '',
        usuario_id: ''
      });
      cargar();
    } catch (err) {
      setError(err.message || 'Error al registrar estudiante.');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm(`¿Seguro que deseas eliminar al estudiante #${id}?`)) return;
    setMensaje('');
    setError('');
    try {
      await alumnoApi.eliminar(id);
      setMensaje(`Estudiante #${id} eliminado.`);
      cargar();
    } catch (err) {
      setError(err.message || 'Error al eliminar estudiante.');
    }
  };

  return (
    <main>
      <h1>{rol === 5 ? 'Mi Perfil de Alumno' : 'Gestión de Estudiantes'}</h1>
      <p>
        {rol === 5
          ? 'Consulta la información de tu registro como estudiante.'
          : 'Listado y registro de estudiantes matriculados en la institución.'}
      </p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {esGestionador && (
        <section>
          <h2>Inscribir / Registrar Nuevo Estudiante</h2>
          <form onSubmit={handleCrear}>
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
              Nombre del Encargado / Tutor:
              <input
                type="text"
                required
                value={nuevo.nom_encargado}
                onChange={(e) => setNuevo({ ...nuevo, nom_encargado: e.target.value })}
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
              Teléfono del Encargado:
              <input
                type="text"
                required
                value={nuevo.tel_encargado}
                onChange={(e) => setNuevo({ ...nuevo, tel_encargado: e.target.value })}
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
                    : 'No hay usuarios de alumno disponibles'}
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
              Guardar Estudiante
            </button>
          </form>
        </section>
      )}

      <section className='lisUsuarios' >
        <h2>{rol === 5 ? 'Tus Datos Registrados' : 'Listado de Estudiantes'}</h2>
        {cargando ? (
          <p>Cargando información...</p>
        ) : rol === 5 ? (
          alumnos.length === 0 ? (
            <p>No se encontró información de alumno asociada a tu cuenta.</p>
          ) : (
            alumnos.map((alumno) => (
              <article
                
                key={alumno.alumno_id}
               >
                <h3>{alumno.nombre} {alumno.apellido}</h3>
                <p><strong>Carné:</strong> {alumno.carne}</p>
                <p><strong>Fecha de nacimiento:</strong> {alumno.fecha_nacimiento || 'No registrada'}</p>
                <p><strong>Email:</strong> {alumno.email || 'No registrado'}</p>
                <p><strong>Encargado:</strong> {alumno.nom_encargado || 'No registrado'}</p>
                <p><strong>Teléfono del encargado:</strong> {alumno.tel_encargado || 'No registrado'}</p>
              </article>
            ))
          )
        ) : (
          <table className='tablaUsuarios'>
            <thead className='encabezado'>
              <tr>
                <th>ID</th>
                <th>Carné</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Fecha Nac.</th>
                <th>Email</th>
                <th>Encargado</th>
                <th>Tel. Encargado</th>
                {esGestionador && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody className='tablacontenido' >
              {alumnos.map((a) => (
                <tr key={a.alumno_id}>
                  <td>{a.alumno_id}</td>
                  <td>{a.carne}</td>
                  <td>{a.nombre}</td>
                  <td>{a.apellido}</td>
                  <td>{a.fecha_nacimiento}</td>
                  <td>{a.email || '-'}</td>
                  <td>{a.nom_encargado}</td>
                  <td>{a.tel_encargado}</td>
                  {esGestionador && (
                    <td className='cont-act' > 
                      <button className='btn-us apagado' type="button" onClick={() => handleEliminar(a.alumno_id)}>
                        Eliminar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {alumnos.length === 0 && (
                <tr>
                  <td colSpan={esGestionador ? 9 : 8}>No se encontraron estudiantes.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default Estudiantes;
