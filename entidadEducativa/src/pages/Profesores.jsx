import { useEffect, useState } from 'react';
import { maestroApi } from '../services/api';
import { useAuth } from '../auth/useAuth';
import '../style/usuarios.css';
import FormularioProfesor from '../components/Profesores/FormularioProfesor';
import ListadoProfesores from '../components/Profesores/ListadoProfesores';

function Profesores() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);
  const puedeEditar = [1, 2, 3].includes(rol);

  const [maestros, setMaestros] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [mostrarForProfesores, setMostrarForProfesores] = useState(false);
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
      setMostrarForProfesores(false);
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
          <button
            className='sesion'
            type='button'
            onClick={()=> setMostrarForProfesores(!mostrarForProfesores)}
          >
            {mostrarForProfesores ? 'cancelar': '+ crear Profesro'}
          </button>
          {mostrarForProfesores && (
            <FormularioProfesor
              nuevo={nuevo}
              setNuevo={setNuevo}
              usuariosDisponibles={usuariosDisponibles}
              cargando={cargando}
              onSubmit={handleCrear}
              onCancelar={() => setMostrarForProfesores(false)}
            />
          )}
        </section>
      )}

      <ListadoProfesores
        maestros={maestros}
        cargando={cargando}
        puedeEditar={puedeEditar}
        onEliminar={handleEliminar}
      />
    </main>
  );
}

export default Profesores;
