import { useEffect, useRef, useState } from 'react';
import { asistenciaApi, academicoApi } from '../services/api';
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
  const [mesHistorial, setMesHistorial] = useState(() => new Date().toISOString().slice(0, 7));
  const [alumnosPorAula, setAlumnosPorAula] = useState({});
  const [alumnosHistorialAula, setAlumnosHistorialAula] = useState([]);
  const [cargandoAlumnosHistorial, setCargandoAlumnosHistorial] = useState(false);
  const [idAulaHistorial, setIdAulaHistorial] = useState('');
  const solicitudAlumnosHistorial = useRef(0);

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
    } else if (rol === 4) {
      academicoApi.asignacionesMaestros()
        .then(async (data) => {
          const asignaciones = Array.isArray(data) ? data : [];
          const aulasAsignadas = Array.from(
            new Map(
              asignaciones.map((asignacion) => [
                String(asignacion.grado_seccion_id),
                {
                  grado_seccion_id: asignacion.grado_seccion_id,
                  nom_grado: asignacion.nom_grado,
                  nom_seccion: asignacion.nom_seccion,
                  ciclo: asignacion.ciclo
                }
              ])
            ).values()
          );
          setAulas(aulasAsignadas);
          const fechaInicial = new Date().toISOString().split('T')[0];
          const listasPorAula = await Promise.all(
            aulasAsignadas.map((aula) =>
              asistenciaApi.conuslAulaFecha(aula.grado_seccion_id, fechaInicial)
            )
          );
          const estudiantesPorAula = Object.fromEntries(
            aulasAsignadas.map((aula, index) => [
              String(aula.grado_seccion_id),
              Array.isArray(listasPorAula[index]) ? listasPorAula[index] : []
            ])
          );
          setAlumnosPorAula(estudiantesPorAula);
          if (aulasAsignadas[0]) {
            setIdAula(String(aulasAsignadas[0].grado_seccion_id));
            const listaInicial = Array.isArray(listasPorAula[0]) ? listasPorAula[0] : [];
            setAsistenciasAula(listaInicial);
            if (listaInicial[0]) {
              setNuevaAsistencia((actual) => ({
                ...actual,
                alumno_id: listaInicial[0].alumno_id,
                asignacion_grado_id: listaInicial[0].asignacion_grado_id
              }));
            }
          }
        })
        .catch((err) => setError(err.message || 'Error al cargar las aulas y estudiantes asignados.'));
    } else {
      academicoApi.gradosSecciones().then((data) => {
        if (Array.isArray(data)) {
          setAulas(data);
          if (data[0]) {
            const aulaInicial = data[0];
            const fechaInicial = new Date().toISOString().split('T')[0];
            setIdAula(String(aulaInicial.grado_seccion_id));
            setCargandoAula(true);
            asistenciaApi.conuslAulaFecha(aulaInicial.grado_seccion_id, fechaInicial)
              .then((asistencias) => {
                const lista = Array.isArray(asistencias) ? asistencias : [];
                setAsistenciasAula(lista);
                setNuevaAsistencia((actual) => {
                  const alumnoInicial = lista[0];
                  return {
                    ...actual,
                    alumno_id: alumnoInicial?.alumno_id || '',
                    asignacion_grado_id: alumnoInicial?.asignacion_grado_id || '',
                    fecha: fechaInicial
                  };
                });
              })
              .catch((err) => setError(err.message || 'Error al cargar estudiantes del aula.'))
              .finally(() => setCargandoAula(false));
          }
        }
      }).catch((err) => setError(err.message || 'Error al cargar las aulas.'));

    }
  }, [esAlumno, rol, usuario]);

  const cargarHistorial = async (id, mes = mesHistorial) => {
    if (!id) return;
    setCargandoHistorial(true);
    setError('');
    try {
      const data = await asistenciaApi.consulHistorialAlumno(id, mes);
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
      if (idAula && nuevaAsistencia.fecha) {
        setFechaConsulta(nuevaAsistencia.fecha);
        const data = await asistenciaApi.conuslAulaFecha(idAula, nuevaAsistencia.fecha);
        setAsistenciasAula(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err.message || 'Error al registrar asistencia.');
    }
  };

  const aulaSeleccionada = aulas.find(
    (aula) => String(aula.grado_seccion_id) === String(idAula)
  );
  const aulaHistorial = aulas.find(
    (aula) => String(aula.grado_seccion_id) === idAulaHistorial
  );
  const alumnosHistorial = rol === 4
    ? alumnosPorAula[String(aulaHistorial?.grado_seccion_id)] || []
    : alumnosHistorialAula;

  const handleSeleccionarAulaHistorial = async (gradoSeccionId) => {
    const solicitudActual = ++solicitudAlumnosHistorial.current;
    setIdAulaHistorial(gradoSeccionId);
    setIdAlumnoHistorial('');
    setAlumnosHistorialAula([]);
    setHistorial([]);
    setResumenHistorial(null);
    setError('');

    if (!gradoSeccionId || rol === 4) {
      setCargandoAlumnosHistorial(false);
      return;
    }

    setCargandoAlumnosHistorial(true);
    try {
      const fechaActual = new Date().toISOString().split('T')[0];
      const data = await asistenciaApi.conuslAulaFecha(gradoSeccionId, fechaActual);
      if (solicitudActual === solicitudAlumnosHistorial.current) {
        setAlumnosHistorialAula(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      if (solicitudActual === solicitudAlumnosHistorial.current) {
        setError(err.message || 'Error al cargar estudiantes del aula.');
      }
    } finally {
      if (solicitudActual === solicitudAlumnosHistorial.current) {
        setCargandoAlumnosHistorial(false);
      }
    }
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Control y Registro de Asistencias</h1>
      <p>Seguimiento diario de puntualidad y asistencia por grado y sección.</p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {/* Historial de Asistencia de Alumno */}
      <section style={{ marginBottom: '2.5rem' }}>
        <h2>{esAlumno ? 'Mi Historial de Asistencia' : 'Historial de Asistencia por Estudiante'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const alumnoId = esAlumno
              ? usuario?.perfil?.alumno_id || usuario?.id_usuario
              : idAlumnoHistorial;
            cargarHistorial(alumnoId);
          }}
        >
            {[1, 2, 3, 4].includes(rol) && (
              <label>
                Filtrar por aula:{' '}
                <select
                  value={idAulaHistorial}
                  disabled={aulas.length === 0 || cargandoAlumnosHistorial}
                  onChange={(e) => handleSeleccionarAulaHistorial(e.target.value)}
                >
                  <option value="">-- Selecciona un aula --</option>
                  {aulas.map((aula) => (
                    <option
                      key={aula.grado_seccion_id}
                      value={aula.grado_seccion_id}
                    >
                      {aula.nom_grado}, Sección {aula.nom_seccion} ({aula.ciclo})
                    </option>
                  ))}
                </select>
                {' '}
              </label>
            )}
            {!esAlumno && (
              <label>
                Seleccionar Estudiante:{' '}
                <select
                  value={idAlumnoHistorial}
                  disabled={!idAulaHistorial || cargandoAlumnosHistorial}
                  onChange={(e) => {
                    setIdAlumnoHistorial(e.target.value);
                    setHistorial([]);
                    setResumenHistorial(null);
                    setError('');
                  }}
                >
                  <option value="">-- Selecciona un estudiante --</option>
                  {alumnosHistorial.map((a) => (
                    <option key={a.alumno_id} value={a.alumno_id}>
                      {a.nombre} {a.apellido} (Carné: {a.carne})
                    </option>
                  ))}
                </select>
              </label>
            )}
            {' '}
            <label>
              Mes a consultar:{' '}
              <input
                type="month"
                required
                value={mesHistorial}
                onChange={(e) => {
                  setMesHistorial(e.target.value);
                  setHistorial([]);
                  setResumenHistorial(null);
                  setError('');
                }}
              />
            </label>
            {' '}
            <button
              className="sesion"
              type="submit"
              disabled={cargandoHistorial || (!esAlumno && !idAlumnoHistorial)}
            >
              {cargandoHistorial ? 'Consultando…' : 'Consultar mes'}
            </button>
        </form>

        {cargandoHistorial && <p>Cargando historial...</p>}
        {!esAlumno && [1, 2, 3, 4].includes(rol) && aulas.length === 0 && !error && (
          <p>{rol === 4 ? 'No tienes aulas asignadas para consultar.' : 'No hay aulas disponibles para consultar.'}</p>
        )}
        {cargandoAlumnosHistorial && <p role="status">Cargando estudiantes del aula…</p>}
        {!esAlumno && idAulaHistorial && !cargandoAlumnosHistorial && alumnosHistorial.length === 0 && !error && (
          <p>No hay estudiantes asignados a esta aula.</p>
        )}
        {!cargandoHistorial && resumenHistorial?.total === 0 && (
          <p>No hay asistencias registradas para el mes seleccionado.</p>
        )}

        {resumenHistorial && (
          <p style={{ marginTop: '1rem' }}>
            <strong>Resumen:</strong> Total registros: {resumenHistorial.total} |
            Presentes: <span style={{ color: 'green' }}>{resumenHistorial.presentes}</span> |
            Tardes: <span style={{ color: 'orange' }}>{resumenHistorial.tardes}</span> |
            Ausencias: <span style={{ color: 'red' }}>{resumenHistorial.ausentes}</span>
          </p>
        )}

        {historial.length > 0 && (
          <table className='tablaUsuarios'>
            <thead className='encabezado' >
              <tr >
                <th>Fecha</th>
                <th>Estado de Asistencia</th>
                <th>Grado y Sección</th>
                <th>Ciclo</th>
              </tr>
            </thead>
            <tbody className='tablacontenido' >
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
              <div className='listaUsuarios'>
                <h3>Lista de Estudiantes ({fechaConsulta})</h3>
                <table className='tablaUsuarios'>
                  <thead  className='encabezado'>
                    <tr >
                      <th>Carné</th>
                      <th>Nombre del Estudiante</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody className='tablacontenido' >
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
                            className="btn-us sesion"
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
            <p>Elige un estudiante inscrito en esa aula</p>
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
