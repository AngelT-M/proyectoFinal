import { useEffect, useState } from 'react';
import { finanzasApi, academicoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';
import FormularioEvento from '../components/Eventos/FormularioEvento';
import ListadoEventos from '../components/Eventos/ListadoEventos';

function Eventos() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);
  const puedeCrear = [1, 2, 3].includes(rol);

  const [eventos, setEventos] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [mostrarFormEventos, setMostrarFormEventos] = useState(false);
  const [nuevo, setNuevo] = useState({
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_final: '',
    tipo_evento: 'ACADEMICO',
    nivel_id: ''
  });

  const cargarEventos = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await finanzasApi.calendario();
      setEventos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar eventos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEventos();
    academicoApi.niveles().then((res) => {
      if (Array.isArray(res)) setNiveles(res);
    }).catch(() => {});
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      // Normalizar fechas para formato Y-m-d H:i:s
      const formatFecha = (f) => (f.length === 16 ? `${f.replace('T', ' ')}:00` : f.replace('T', ' '));

      await finanzasApi.crearEventoCalendario({
        titulo: nuevo.titulo,
        descripcion: nuevo.descripcion,
        fecha_inicio: formatFecha(nuevo.fecha_inicio),
        fecha_final: formatFecha(nuevo.fecha_final),
        tipo_evento: nuevo.tipo_evento,
        nivel_id: nuevo.nivel_id ? Number(nuevo.nivel_id) : null
      });

      setMensaje('Evento agendado exitosamente.');
      setMostrarFormEventos(false);
      setNuevo({
        titulo: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_final: '',
        tipo_evento: 'ACADEMICO',
        nivel_id: ''
      });
      cargarEventos();
    } catch (err) {
      setError(err.message || 'Error al agendar evento.');
    }
  };

  return (
    <main>
      <h1>Calendario de Actividades y Eventos</h1>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {puedeCrear && (
        <section>
          <div>
            <button
            className='sesion'
            type='button'
            onClick={()=> setMostrarFormEventos(!mostrarFormEventos)}
            >
              + nuevo evento
            </button>
          </div>

          {mostrarFormEventos && (
            <FormularioEvento
              nuevo={nuevo}
              setNuevo={setNuevo}
              niveles={niveles}
              onSubmit={handleCrear}
              onCancelar={() => setMostrarFormEventos(false)}
            />
          )}

          
        </section>
      )}

      <ListadoEventos eventos={eventos} cargando={cargando} />
    </main>
  );
}

export default Eventos;
