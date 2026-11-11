import { useEffect, useState } from 'react';
import { usuarioApi } from '../services/api';
import '../style/usuarios.css';


function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(''); 



  // Formulario nuevo usuario
  const [mostrarFormUsuario, setMostrarFormUsuario] = useState(false);
  
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
      setMostrarFormUsuario(false);
      setNuevoUsuario({ 
        nom_usuario: '', 
        password: '', 
        rol_id: 4, 
        estado: 'ACTIVO' });
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

  const handleActivar = async (id) => {
    setMensaje('');
    setError('');
    try {
      await usuarioApi.actualizar(id, { estado: 'ACTIVO' });
      setMensaje(`Usuario #${id} reactivado.`);
      cargarUsuarios();
    } catch (err) {
      setError(err.message || 'Error al reactivar usuario.');
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

  const usuariosPorRol = usuarios.reduce((grupos, usuario) => {
    const rolId = Number(usuario.rol_id);
    grupos[rolId] ??= [];
    grupos[rolId].push(usuario);
    return grupos;
  }, {});
  const rolesOrdenados = Object.keys(usuariosPorRol).sort((a, b) => Number(a) - Number(b));

  return (
    <main>
      <h1>Gestión de Usuarios</h1>


      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      <div className='btn-sec' >
        <button
          className='sesion'
          type='button'
          onClick={()=> setMostrarFormUsuario(!mostrarFormUsuario)}
        >
          {mostrarFormUsuario ? `Cancelar`: `+ Crear usuario`}
        </button>
      </div>

      {mostrarFormUsuario && (
        <section className='CrearUsuario'>
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
      )}
      
      
      <section className='lisUsuarios' >
        <h2>Listado de Cuentas de Usuario</h2>
        {cargando ? (
          <p>Cargando lista...</p>
        ) : rolesOrdenados.length === 0 ? (
          <p>No hay usuarios registrados.</p>
        ) : rolesOrdenados.map((rolId) => (
          <section className='cienpor'  key={rolId} aria-labelledby={`usuarios-rol-${rolId}`}>
            <h3 id={`usuarios-rol-${rolId}`}>{getRolNombre(rolId)}</h3>
            <table className='tablaUsuarios'>
              <thead className='encabezado'>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className='tablacontenido'>
                {usuariosPorRol[rolId].map((u) => (
                  <tr key={u.usuario_id}>
                    <td>{u.usuario_id}</td>
                    <td>{u.nom_usuario}</td>
                    <td>{u.estado}</td>
                    <td className='cont-act'>
                      {u.estado === 'ACTIVO' ? (
                        <>
                          <button className='btn-us' type="button" onClick={() => setIdCambioPassword(u.usuario_id)}>
                            Cambiar Contraseña
                          </button>
                          <button className='btn-us apagado' type="button" onClick={() => handleDesactivar(u.usuario_id)}>
                            Desactivar
                          </button>
                        </>
                      ) : (
                        <button className='btn-us' type="button" onClick={() => handleActivar(u.usuario_id)}>
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



    </main>
  );
}

export default Usuarios;
