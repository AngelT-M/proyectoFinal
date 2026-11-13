import { useEffect, useState } from 'react';
import { usuarioApi } from '../services/api';
import '../style/usuarios.css';
import FormularioUsuario from '../components/Usuarios/FormularioUsuario';
import ListadoUsuarios from '../components/Usuarios/ListadoUsuarios';
import FormularioCambioPassword from '../components/Usuarios/FormularioCambioPassword';

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
        <FormularioUsuario
          usuario={nuevoUsuario}
          setUsuario={setNuevoUsuario}
          onSubmit={handleCrearUsuario}
        />
      )}
      
      <ListadoUsuarios
        cargando={cargando}
        rolesOrdenados={rolesOrdenados}
        usuariosPorRol={usuariosPorRol}
        getRolNombre={getRolNombre}
        onCambiarPassword={setIdCambioPassword}
        onDesactivar={handleDesactivar}
        onActivar={handleActivar}
      />

      {idCambioPassword && (
        <FormularioCambioPassword
          usuarioId={idCambioPassword}
          password={nuevoPassword}
          setPassword={setNuevoPassword}
          onSubmit={handleCambiarPassword}
          onCancelar={() => setIdCambioPassword(null)}
        />
      )}

    </main>
  );
}

export default Usuarios;
