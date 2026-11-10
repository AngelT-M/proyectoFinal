import { useEffect, useState } from 'react';
import { finanzasApi, academicoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';

function Eventos() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);
  const puedeCrear = [1, 2, 3].includes(rol);

  const [eventos, setEventos] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

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
      <p>Agenda escolar institucional, académica y deportiva.</p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {puedeCrear && (
        <section>
          <h2>Agendar Nuevo Evento Escolar</h2>
          <form onSubmit={handleCrear}>
            <label>
              Título del Evento:
              <input
                type="text"
                required
                placeholder="Ej. Feria de Ciencias"
                value={nuevo.titulo}
                onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })}
              />
            </label>
            <br />
            <label>
              Tipo de Evento:
              <select
                value={nuevo.tipo_evento}
                onChange={(e) => setNuevo({ ...nuevo, tipo_evento: e.target.value })}
              >
                <option value="INSTITUCIONAL">INSTITUCIONAL</option>
                <option value="ACADEMICO">ACADEMICO</option>
                <option value="EXAMEN">EXAMEN</option>
                <option value="DEPORTIVO">DEPORTIVO</option>
                <option value="CULTURAL">CULTURAL</option>
              </select>
            </label>
            <br />
            <label>
              Nivel Educativo (opcional):
              <select
                value={nuevo.nivel_id}
                onChange={(e) => setNuevo({ ...nuevo, nivel_id: e.target.value })}
              >
                <option value="">-- Todos los niveles --</option>
                {niveles.map((n) => (
                  <option key={n.nivel_id} value={n.nivel_id}>
                    {n.nom_nivel}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <label>
              Fecha y Hora de Inicio:
              <input
                type="datetime-local"
                required
                value={nuevo.fecha_inicio}
                onChange={(e) => setNuevo({ ...nuevo, fecha_inicio: e.target.value })}
              />
            </label>
            <br />
            <label>
              Fecha y Hora de Finalización:
              <input
                type="datetime-local"
                required
                value={nuevo.fecha_final}
                onChange={(e) => setNuevo({ ...nuevo, fecha_final: e.target.value })}
              />
            </label>
            <br />
            <label>
              Descripción del Evento:
              <textarea
                value={nuevo.descripcion}
                onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
              />
            </label>
            <br />
            <button type="submit">Guardar Evento en Calendario</button>
          </form>
        </section>
      )}

      <section>
        <h2>Próximos Eventos y Fechas Clave</h2>
        {cargando ? (
          <p>Cargando eventos...</p>
        ) : (
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Título</th>
                <th>Fecha Inicio</th>
                <th>Fecha Final</th>
                <th>Nivel</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((ev) => (
                <tr key={ev.actividad_id}>
                  <td><strong>{ev.tipo_evento}</strong></td>
                  <td>{ev.titulo}</td>
                  <td>{ev.fecha_inicio}</td>
                  <td>{ev.fecha_final}</td>
                  <td>{ev.nom_nivel || 'General'}</td>
                  <td>{ev.descripcion || '-'}</td>
                </tr>
              ))}
              {eventos.length === 0 && (
                <tr>
                  <td colSpan="6">No hay eventos agendados en el calendario.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default Eventos;
