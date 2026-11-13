import { useEffect, useState } from 'react';
import { personalApi } from '../services/api';
import { useAuth } from '../auth/useAuth';
import FormularioPersonal from '../components/Personal/FormularioPersonal';
import ListadoPersonal from '../components/Personal/ListadoPersonal';

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

  const [mostrarFormPersonal, setMostrarFormPersonal] = useState(false);
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
      setMostrarFormPersonal(false);
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
        <div> 
          <div>
            <button
            className='sesion'
            type='button'
            onClick={()=>setMostrarFormPersonal(!mostrarFormPersonal)}
            >
              {mostrarFormPersonal ? 'cancelar': '+ crear personal'}
            </button>
          </div>
        
          {mostrarFormPersonal && (
            <FormularioPersonal
              nuevo={nuevo}
              setNuevo={setNuevo}
              usuariosParaCargo={usuariosParaCargo}
              cargando={cargando}
              onSubmit={handleCrear}
            />
          )}
        </div>
      )}

      <ListadoPersonal
        personal={personal}
        cargando={cargando}
        puedeEditar={puedeEditar}
        onEliminar={handleEliminar}
      />
    </main>
  );
}

export default Personal;
