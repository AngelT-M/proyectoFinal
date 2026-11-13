import { useCallback, useEffect, useState } from 'react';
import { alumnoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';
import FormularioEstudiante from '../components/Estudiantes/FormularioEstudiante';
import ListadoEstudiantes from '../components/Estudiantes/ListadoEstudiantes';

function Estudiantes() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);
  const esGestionador = [1, 2, 3].includes(rol);

  const [alumnos, setAlumnos] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [mostarFormEstudiante, setMostrarFormEstudiante] = useState(false);
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
      setMostrarFormEstudiante(false);
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
          <button
            className="sesion"
            type="button"
            onClick={() => setMostrarFormEstudiante(!mostarFormEstudiante)}
          >
            + nuevo estudiante
          </button>

          {mostarFormEstudiante && (
            <FormularioEstudiante
              nuevo={nuevo}
              setNuevo={setNuevo}
              usuariosDisponibles={usuariosDisponibles}
              cargando={cargando}
              onSubmit={handleCrear}
              onCancelar={() => setMostrarFormEstudiante(false)}
            />
          )}
        </section>
      )}

      <ListadoEstudiantes
        rol={rol}
        alumnos={alumnos}
        cargando={cargando}
        esGestionador={esGestionador}
        onEliminar={handleEliminar}
      />
    </main>
  );
}

export default Estudiantes;
