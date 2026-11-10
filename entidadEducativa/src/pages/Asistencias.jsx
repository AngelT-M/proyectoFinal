import { useEffect, useState } from 'react';
import { asistenciaApi, academicoApi, alumnoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';

function Asistencias() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);
  const esAlumno = rol === 5;
  const puedeRegistrar = [1, 2, 3, 4].includes(rol);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Estados Historial Alumno
  const [idAlumnoHistorial, setIdAlumnoHistorial] = useState('');
  const [historial, setHistorial] = useState([]);
  const [resumenHistorial, setResumenHistorial] = useState(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [listaAlumnos, setListaAlumnos] = useState([]);

  // Estados Consulta por Aula y Fecha
  const [aulas, setAulas] = useState([]);
  const [idAula, setIdAula] = useState('');
  const [fechaConsulta, setFechaConsulta] = useState(new Date().toISOString().split('T')[0]);
  const [asistenciasAula, setAsistenciasAula] = useState([]);
  const [cargandoAula, setCargandoAula] = useState(false);

  // Formulario Tomar Asistencia
  const [nuevaAsistencia, setNuevaAsistencia] = useState({
    alumno_id: '',
    asignacion_grado_id: '',
    fecha: new Date().toISOString().split('T')[0],
    estado: 'PRESENTE'
  });

  useEffect(() => {
    if (esAlumno) {
      const alumnoId = usuario?.perfil?.alumno_id || usuario?.id_usuario;
      cargarHistorial(alumnoId);
    } else {
      academicoApi.gradosSecciones().then((data) => {
        if (Array.isArray(data)) {
          setAulas(data);
          if (data[0]) setIdAula(data[0].grado_seccion_id);
        }
      }).catch((err) => setError(err.message || 'Error al cargar las aulas.'));

      alumnoApi.mostrar().then((data) => {
        if (Array.isArray(data)) {
          setListaAlumnos(data);
          if (data[0]) setNuevaAsistencia((p) => ({ ...p, alumno_id: data[0].alumno_id }));
        }
      }).catch((err) => setError(err.message || 'Error al cargar estudiantes.'));
    }
  }, [esAlumno, usuario]);

  const cargarHistorial = async (id) => {
    if (!id) return;
    setCargandoHistorial(true);
    setError('');
    try {
      const data = await asistenciaApi.consulHistorialAlumno(id);
      const lista = data?.historial ?? (Array.isArray(data) ? data : []);
      setHistorial(lista);
      setResumenHistorial(data?.resumen ?? null);
    } catch (err) {
      setError(err.message || 'Error al consultar historial de asistencia.');
      setHistorial([]);
      setResumenHistorial(null);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const handleConsultarAula = async (e) => {
    e.preventDefault();
    if (!idAula || !fechaConsulta) return;
    setCargandoAula(true);
    setError('');
    try {
      const data = await asistenciaApi.conuslAulaFecha(idAula, fechaConsulta);
      const lista = Array.isArray(data) ? data : [];
      setAsistenciasAula(lista);
      setNuevaAsistencia((actual) => {
        const seleccion = lista.find((item) => String(item.alumno_id) === String(actual.alumno_id)) || lista[0];
        return seleccion
          ? {
              ...actual,
              alumno_id: seleccion.alumno_id,
              asignacion_grado_id: seleccion.asignacion_grado_id
            }
          : { ...actual, alumno_id: '', asignacion_grado_id: '' };
      });
    } catch (err) {
      setError(err.message || 'Error al consultar asistencia del aula.');
      setAsistenciasAula([]);
    } finally {
      setCargandoAula(false);
    }
  };

  const handleRegistrar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await asistenciaApi.crear({
        alumno_id: Number(nuevaAsistencia.alumno_id),
        asignacion_grado_id: Number(nuevaAsistencia.asignacion_grado_id),
        fecha: nuevaAsistencia.fecha,
        estado: nuevaAsistencia.estado
      });
      setMensaje('Asistencia registrada correctamente.');
      if (idAula && fechaConsulta) {
        const data = await asistenciaApi.conuslAulaFecha(idAula, fechaConsulta);
        setAsistenciasAula(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err.message || 'Error al registrar asistencia.');
    }
  };

  const aulaSeleccionada = aulas.find(
    (aula) => String(aula.grado_seccion_id) === String(idAula)
  );

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Control y Registro de Asistencias</h1>
      <p>Seguimiento diario de puntualidad y asistencia por grado y sección.</p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {/* Historial de Asistencia de Alumno */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2>{esAlumno ? 'Mi Historial de Asistencia' : 'Historial de Asistencia por Estudiante'}</h2>
        {!esAlumno && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              cargarHistorial(idAlumnoHistorial);
            }}
          >
            <label>
              Seleccionar Estudiante:{' '}
              <select
                value={idAlumnoHistorial}
                onChange={(e) => {
                  setIdAlumnoHistorial(e.target.value);
                  cargarHistorial(e.target.value);
                }}
              >
                <option value="">-- Selecciona un estudiante --</option>
                {listaAlumnos.map((a) => (
                  <option key={a.alumno_id} value={a.alumno_id}>
                    {a.nombre} {a.apellido} (Carné: {a.carne})
                  </option>
                ))}
              </select>
            </label>
            {' '}
            <button className="sesion" type="submit">Consultar Historial</button>
          </form>
        )}

        {cargandoHistorial && <p>Cargando historial...</p>}

        {resumenHistorial && (
          <p style={{ marginTop: '1rem' }}>
            <strong>Resumen:</strong> Total registros: {resumenHistorial.total} |
            Presentes: <span style={{ color: 'green' }}>{resumenHistorial.presentes}</span> |
            Tardes: <span style={{ color: 'orange' }}>{resumenHistorial.tardes}</span> |
            Ausencias: <span style={{ color: 'red' }}>{resumenHistorial.ausentes}</span>
          </p>
        )}

        {historial.length > 0 && (
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--gris-secod)' }}>
                <th>Fecha</th>
                <th>Estado de Asistencia</th>
                <th>Grado y Sección</th>
                <th>Ciclo</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.fecha}</td>
                  <td>
                    <strong
                      style={{
                        color:
                          item.estado === 'PRESENTE'
                            ? 'green'
                            : item.estado === 'TARDE'
                            ? 'orange'
                            : 'red'
                      }}
                    >
                      {item.estado}
                    </strong>
                  </td>
                  <td>{item.nom_grado ? `${item.nom_grado} - Sección ${item.nom_seccion}` : 'Aula escolar'}</td>
                  <td>{item.ciclo || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Sección para Docentes y Administradores: Consultar Aula y Registrar */}
      {puedeRegistrar && (
        <>
          <section style={{ marginBottom: '2.5rem' }}>
            <h2>Consultar Asistencia por Grado, Sección y Fecha</h2>
            <form onSubmit={handleConsultarAula}>
              <label>
                Grado y Sección:{' '}
                <select
                  value={idAula}
                  onChange={(e) => {
                    setIdAula(e.target.value);
                    setAsistenciasAula([]);
                    setNuevaAsistencia((actual) => ({
                      ...actual,
                      alumno_id: '',
                      asignacion_grado_id: ''
                    }));
                  }}
                >
                  {aulas.map((a) => (
                    <option key={a.grado_seccion_id} value={a.grado_seccion_id}>
                      {a.nom_grado} - Sección {a.nom_seccion} ({a.ciclo})
                    </option>
                  ))}
                </select>
              </label>
              <br /><br />
              <label>
                Fecha a consultar:{' '}
                <input
                  type="date"
                  required
                  value={fechaConsulta}
                  onChange={(e) => setFechaConsulta(e.target.value)}
                />
              </label>
              <br /><br />
              <button className="sesion" type="submit">Ver Lista de Asistencia del Aula</button>
            </form>

            {cargandoAula && <p>Consultando lista del aula...</p>}

            {asistenciasAula.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3>Lista de Estudiantes ({fechaConsulta})</h3>
                <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--gris-secod)' }}>
                      <th>Carné</th>
                      <th>Nombre del Estudiante</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistenciasAula.map((asig, idx) => (
                      <tr key={idx}>
                        <td>{asig.carne || '-'}</td>
                        <td>{asig.nombre} {asig.apellido}</td>
                        <td>{asig.fecha || fechaConsulta}</td>
                        <td>
                          <strong>{asig.estado || 'SIN REGISTRO'}</strong>
                        </td>
                        <td>
                          <button
                            className="sesion"
                            type="button"
                            onClick={() =>
                              setNuevaAsistencia({
                                alumno_id: asig.alumno_id,
                                asignacion_grado_id: asig.asignacion_grado_id,
                                fecha: fechaConsulta,
                                estado: 'PRESENTE'
                              })
                            }
                          >
                            Cargar en Formulario
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2>Registrar Asistencia</h2>
            <p>
              Aula seleccionada:{' '}
              <strong>
                {aulaSeleccionada
                  ? `${aulaSeleccionada.nom_grado} — Sección ${aulaSeleccionada.nom_seccion} (${aulaSeleccionada.ciclo})`
                  : 'Selecciona un aula y consulta su lista.'}
              </strong>
            </p>
            <p>Elige un estudiante inscrito en esa aula; no necesitas ingresar IDs.</p>
            <form onSubmit={handleRegistrar}>
              <label>
                Estudiante:{' '}
                <select
                  required
                  value={nuevaAsistencia.alumno_id}
                  disabled={asistenciasAula.length === 0}
                  onChange={(e) => {
                    const seleccion = asistenciasAula.find(
                      (item) => String(item.alumno_id) === e.target.value
                    );
                    if (seleccion) {
                      setNuevaAsistencia({
                        ...nuevaAsistencia,
                        alumno_id: seleccion.alumno_id,
                        asignacion_grado_id: seleccion.asignacion_grado_id
                      });
                    }
                  }}
                >
                  <option value="">-- Selecciona un estudiante del aula --</option>
                  {asistenciasAula.map((asignacion) => (
                    <option key={asignacion.asignacion_grado_id} value={asignacion.alumno_id}>
                      {asignacion.nombre} {asignacion.apellido} (Carné: {asignacion.carne})
                    </option>
                  ))}
                </select>
              </label>
              <br /><br />
              <label>
                Fecha:{' '}
                <input
                  type="date"
                  required
                  value={nuevaAsistencia.fecha}
                  onChange={(e) => setNuevaAsistencia({ ...nuevaAsistencia, fecha: e.target.value })}
                />
              </label>
              <br /><br />
              <label>
                Estado de Asistencia:{' '}
                <select
                  value={nuevaAsistencia.estado}
                  onChange={(e) => setNuevaAsistencia({ ...nuevaAsistencia, estado: e.target.value })}
                >
                  <option value="PRESENTE">PRESENTE</option>
                  <option value="TARDE">TARDE</option>
                  <option value="AUSENTE">AUSENTE</option>
                </select>
              </label>
              <br /><br />
              <button
                className="sesion"
                type="submit"
                disabled={!nuevaAsistencia.alumno_id || !nuevaAsistencia.asignacion_grado_id}
              >
                Guardar Asistencia
              </button>
            </form>
          </section>
        </>
      )}
    </main>
  );
}

export default Asistencias;
