import { useEffect, useRef, useState } from 'react';
import { evaluacionesApi, academicoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';

function Calificaciones() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);
  const esAlumno = rol === 5;
  const puedeCalificar = [1, 2, 3, 4].includes(rol);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [errorBoleta, setErrorBoleta] = useState('');

  // Estados para boleta personal o consulta por personal docente y administrativo.
  const [idAlumnoConsulta, setIdAlumnoConsulta] = useState('');
  const [boleta, setBoleta] = useState(null);
  const [cargandoBoleta, setCargandoBoleta] = useState(false);
  const [listaAlumnos, setListaAlumnos] = useState([]);
  const [cargandoListaAlumnos, setCargandoListaAlumnos] = useState(!esAlumno);
  const [idAsignacionBoleta, setIdAsignacionBoleta] = useState('');
  const solicitudAlumnosBoleta = useRef(0);

  // Estados para Selección de Clases Cátedras (Docente/Admin)
  const [clases, setClases] = useState([]);
  const [bimestres, setBimestres] = useState([]);
  const [claseSeleccionada, setClaseSeleccionada] = useState(null);
  const [cargandoClases, setCargandoClases] = useState(false);

  // Estados para Actividades de la Clase
  const [actividades, setActividades] = useState([]);
  const [actividadSeleccionada, setActividadSeleccionada] = useState(null);
  const [cargandoActividades, setCargandoActividades] = useState(false);

  // Estados para Listado de Alumnos Asignados a la Actividad / Clase
  const [alumnosClase, setAlumnosClase] = useState([]);
  const [cargandoAlumnos, setCargandoAlumnos] = useState(false);
  const [notasTemp, setNotasTemp] = useState({});

  // Formulario Crear Nueva Actividad
  const [mostrarFormActividad, setMostrarFormActividad] = useState(false);
  const [nuevaAct, setNuevaAct] = useState({
    bimestre_id: '',
    nom_actividad: '',
    punteo_maximo: 20,
    descripcion: ''
  });

  const cargarClasesDocente = async () => {
    setCargandoClases(true);
    try {
      const data = await academicoApi.asignacionesMaestros();
      const lista = Array.isArray(data) ? data : [];
      setClases(lista);
      if (lista.length > 0) {
        seleccionarClase(lista[0]);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar clases asignadas.');
    } finally {
      setCargandoClases(false);
    }
  };

  const seleccionarClase = async (clase) => {
    setClaseSeleccionada(clase);
    setActividadSeleccionada(null);
    setAlumnosClase([]);
    setBimestres([]);
    setNuevaAct((actual) => ({ ...actual, bimestre_id: '' }));
    setCargandoActividades(true);
    setError('');
    try {
      const [dataActividades, dataBimestres] = await Promise.all([
        evaluacionesApi.actividadesPorCurso(clase.asignacion_curso_maestro_id),
        academicoApi.bimestres(clase.ciclo)
      ]);
      const lista = Array.isArray(dataActividades) ? dataActividades : [];
      setBimestres(Array.isArray(dataBimestres) ? dataBimestres : []);
      setActividades(lista);
      if (lista.length > 0) {
        cargarAlumnosDeActividad(lista[0]);
      }
    } catch (err) {
      setError(err.message || 'Error al consultar actividades de la clase.');
      setActividades([]);
    } finally {
      setCargandoActividades(false);
    }
  };

  const cargarAlumnosDeActividad = async (actividad) => {
    setActividadSeleccionada(actividad);
    setCargandoAlumnos(true);
    setError('');
    try {
      const data = await evaluacionesApi.calificacionesActividad(actividad.actividad_curso_id);
      const lista = Array.isArray(data) ? data : [];
      setAlumnosClase(lista);

      // Precargar notas en el estado temporal
      const mapNotas = {};
      lista.forEach((al) => {
        mapNotas[al.asignacion_grado_id] = al.punteo_obtenido ?? '';
      });
      setNotasTemp(mapNotas);
    } catch (err) {
      setError(err.message || 'Error al cargar alumnos asignados a la actividad.');
      setAlumnosClase([]);
    } finally {
      setCargandoAlumnos(false);
    }
  };

  const cargarBoleta = async (idAlumno) => {
    if (!idAlumno) return;
    setCargandoBoleta(true);
    setErrorBoleta('');
    try {
      const data = await evaluacionesApi.boletaAlumno(idAlumno);
      setBoleta(data);
    } catch (err) {
      setErrorBoleta(err.message || 'Error al consultar la boleta de calificaciones.');
      setBoleta(null);
    } finally {
      setCargandoBoleta(false);
    }
  };

  const filtrarAlumnosBoleta = async (asignacionId) => {
    const solicitudActual = ++solicitudAlumnosBoleta.current;
    setIdAsignacionBoleta(asignacionId);
    setIdAlumnoConsulta('');
    setListaAlumnos([]);
    setBoleta(null);
    setErrorBoleta('');
    setMensaje('');

    if (!asignacionId) {
      setCargandoListaAlumnos(false);
      return;
    }

    setCargandoListaAlumnos(true);
    try {
      const data = await evaluacionesApi.alumnosParaBoleta(asignacionId);
      if (solicitudActual === solicitudAlumnosBoleta.current) {
        setListaAlumnos(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      if (solicitudActual === solicitudAlumnosBoleta.current) {
        setErrorBoleta(err.message || 'Error al cargar estudiantes de la asignatura.');
      }
    } finally {
      if (solicitudActual === solicitudAlumnosBoleta.current) {
        setCargandoListaAlumnos(false);
      }
    }
  };

  useEffect(() => {
    if (esAlumno) {
      const alumnoId = usuario?.perfil?.alumno_id || usuario?.id_usuario;
      cargarBoleta(alumnoId);
    } else if (puedeCalificar) {
      if (rol !== 4) {
        evaluacionesApi.alumnosParaBoleta()
          .then((data) => setListaAlumnos(Array.isArray(data) ? data : []))
          .catch((err) => {
            setErrorBoleta(err.message || 'Error al cargar estudiantes para consultar sus boletas.');
          })
          .finally(() => setCargandoListaAlumnos(false));
      } else {
        setCargandoListaAlumnos(false);
      }

      cargarClasesDocente();
    }
  }, [esAlumno, puedeCalificar, rol, usuario]);

  const cursosBoleta = Array.isArray(boleta)
    ? Object.entries(boleta.reduce((grupos, item) => {
      const curso = item.nom_curso || item.curso || 'Curso sin nombre';
      if (!grupos[curso]) grupos[curso] = {};
      const bimestreId = item.bimestre_id ?? item.bimestre ?? 'sin-bimestre';
      if (!grupos[curso][bimestreId]) {
        grupos[curso][bimestreId] = {
          nombre: item.bimestre || 'Bimestre sin nombre',
          calificaciones: []
        };
      }
      grupos[curso][bimestreId].calificaciones.push(item);
      return grupos;
    }, {}))
    : [];

  const handleCrearActividad = async (e) => {
    e.preventDefault();
    if (!claseSeleccionada) {
      setError('Debes tener una clase seleccionada.');
      return;
    }
    setMensaje('');
    setError('');
    try {
      await evaluacionesApi.crearActividad(claseSeleccionada.asignacion_curso_maestro_id, {
        ...nuevaAct,
        bimestre_id: Number(nuevaAct.bimestre_id),
        punteo_maximo: Number(nuevaAct.punteo_maximo)
      });
      setMensaje('Actividad creada exitosamente.');
      setMostrarFormActividad(false);
      setNuevaAct({
        bimestre_id: '',
        nom_actividad: '',
        punteo_maximo: 20,
        descripcion: ''
      });
      // Recargar actividades
      const data = await evaluacionesApi.actividadesPorCurso(claseSeleccionada.asignacion_curso_maestro_id);
      const lista = Array.isArray(data) ? data : [];
      setActividades(lista);
      if (lista.length > 0) {
        cargarAlumnosDeActividad(lista[lista.length - 1]);
      }
    } catch (err) {
      setError(err.message || 'Error al crear la actividad.');
    }
  };

  const handleGuardarNotaIndividual = async (asignacionGradoId, nombreAlumno) => {
    if (!actividadSeleccionada) return;
    const nota = notasTemp[asignacionGradoId];
    if (nota === '' || nota === undefined) {
      setError(`Ingresa una calificación válida para ${nombreAlumno}.`);
      return;
    }

    const valorNota = Number(nota);
    if (valorNota < 0 || valorNota > Number(actividadSeleccionada.punteo_maximo)) {
      setError(`La nota para ${nombreAlumno} debe estar entre 0 y el máximo de ${actividadSeleccionada.punteo_maximo} pts.`);
      return;
    }

    setMensaje('');
    setError('');
    try {
      await evaluacionesApi.calificar({
        asignacion_grado_id: Number(asignacionGradoId),
        actividad_curso_id: Number(actividadSeleccionada.actividad_curso_id),
        punteo_obtenido: valorNota
      });
      setMensaje(`Calificación de ${nombreAlumno} guardada correctamente (${valorNota}/${actividadSeleccionada.punteo_maximo} pts).`);
      // Refrescar lista
      cargarAlumnosDeActividad(actividadSeleccionada);
    } catch (err) {
      setError(err.message || `Error al guardar calificación de ${nombreAlumno}.`);
    }
  };

  return (
    <main >
      <h1>{esAlumno ? 'Mi Boleta de Calificaciones' : 'Gestión de Calificaciones y Evaluaciones'}</h1>
      <p>
        {esAlumno
          ? 'Consulta tus punteos oficiales por curso y bimestre.'
          : 'Selecciona una clase y califica a los alumnos asignados sin necesidad de recordar IDs.'}
      </p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {/* Módulo para Docentes y Personal Administrativo */}
      {puedeCalificar && (
        <section >
          <h2>1. Seleccionar Clase Asignada</h2>
          {cargandoClases ? (
            <p>Cargando tus clases...</p>
          ) : clases.length === 0 ? (
            <p><em>No tienes clases asignadas actualmente en el sistema.</em></p>
          ) : (
            <div>
              <label>
                <strong>Clase / Asignatura: </strong>
                <select
                  value={claseSeleccionada?.asignacion_curso_maestro_id || ''}
                  onChange={(e) => {
                    const c = clases.find((x) => String(x.asignacion_curso_maestro_id) === e.target.value);
                    if (c) seleccionarClase(c);
                  }}
                  style={{ padding: '0.4rem', fontSize: '1rem', minWidth: '320px' }}
                >
                  {clases.map((c) => (
                    <option key={c.asignacion_curso_maestro_id} value={c.asignacion_curso_maestro_id}>
                      {c.nom_curso} — {c.nom_grado} Sección {c.nom_seccion} ({c.ciclo})
                      {rol !== 4 ? ` [Prof. ${c.maestro_nombre} ${c.maestro_apellido}]` : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {claseSeleccionada && (
            <div style={{ marginTop: '2rem' }}>
              <h2>
                2. Actividades de Evaluación ({claseSeleccionada.nom_curso} — {claseSeleccionada.nom_grado} {claseSeleccionada.nom_seccion})
              </h2>

              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <button
                  className="sesion"
                  type="button"
                  onClick={() => setMostrarFormActividad(!mostrarFormActividad)}
                >
                  {mostrarFormActividad ? 'Cancelar Nueva Actividad' : '+ Crear Nueva Actividad'}
                </button>
              </div>

              {mostrarFormActividad && (
                <fieldset style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--color-blanco)', borderRadius: 'var(--radio)' }}>
                  <legend><strong>Crear Actividad para {claseSeleccionada.nom_curso}</strong></legend>
                  <form onSubmit={handleCrearActividad}>
                    <label>
                      Bimestre:{' '}
                      <select
                        required
                        value={nuevaAct.bimestre_id}
                        onChange={(e) => setNuevaAct({ ...nuevaAct, bimestre_id: e.target.value })}
                        disabled={bimestres.length === 0}
                      >
                        <option value="">-- Selecciona un periodo --</option>
                        {bimestres.map((bimestre) => (
                          <option key={bimestre.bimestre_id} value={bimestre.bimestre_id}>
                            {bimestre.nombre}
                            {bimestre.fecha_inicio && bimestre.fecha_fin
                              ? ` (${bimestre.fecha_inicio} al ${bimestre.fecha_fin})`
                              : ''}
                          </option>
                        ))}
                      </select>
                    </label>
                    {bimestres.length === 0 && (
                      <p>No hay periodos configurados para el ciclo de esta clase. Contacta a administración.</p>
                      )}
                      <label>
                      Nombre de la Actividad:{' '}
                      <input
                        type="text"
                        required
                        placeholder="Ej. Tarea 1: Álgebra, Ensayo Literario"
                        value={nuevaAct.nom_actividad}
                        onChange={(e) => setNuevaAct({ ...nuevaAct, nom_actividad: e.target.value })}
                        style={{ width: '300px', padding: '0.3rem' }}
                      />
                    </label>
                    <label>
                      Punteo Máximo:{' '}
                      <input
                        type="number"
                        step="0.01"
                        required
                        min={1}
                        max={100}
                        value={nuevaAct.punteo_maximo}
                        onChange={(e) => setNuevaAct({ ...nuevaAct, punteo_maximo: e.target.value })}
                        style={{ width: '100px', padding: '0.3rem' }}
                      /> pts
                    </label>
                    <label>
                      Descripción o Instrucciones:{' '}
                      <input
                        type="text"
                        placeholder="Breve descripción opcional"
                        value={nuevaAct.descripcion}
                        onChange={(e) => setNuevaAct({ ...nuevaAct, descripcion: e.target.value })}
                        style={{ width: '350px', padding: '0.3rem' }}
                      />
                    </label>
                    <button className="sesion" type="submit">Guardar Actividad</button>
                  </form>
                </fieldset>
              )}

              {cargandoActividades ? (
                <p>Cargando actividades de la clase...</p>
              ) : actividades.length === 0 ? (
                <p><em>No hay actividades registradas en esta clase. Crea la primera con el botón superior.</em></p>
              ) : (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label>
                    <strong>Seleccionar Actividad a Calificar: </strong>
                    <select
                      value={actividadSeleccionada?.actividad_curso_id || ''}
                      onChange={(e) => {
                        const act = actividades.find((x) => String(x.actividad_curso_id) === e.target.value);
                        if (act) cargarAlumnosDeActividad(act);
                      }}
                      style={{ padding: '0.4rem', fontSize: '1rem', minWidth: '320px' }}
                    >
                      {actividades.map((a) => (
                        <option key={a.actividad_curso_id} value={a.actividad_curso_id}>
                          [{a.bimestre}] {a.nom_actividad} — Punteo máx: {a.punteo_maximo} pts
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              {/* LISTADO DE ALUMNOS ASIGNADOS A ESTA CLASE PARA CALIFICAR */}
              {actividadSeleccionada && (
                <div className='lisUsuarios' >
                  <h3>
                    3. Listado de Alumnos Asignados para Calificar: "{actividadSeleccionada.nom_actividad}"
                    {' '}<span style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>({actividadSeleccionada.bimestre} — Máximo {actividadSeleccionada.punteo_maximo} pts)</span>
                  </h3>

                  {cargandoAlumnos ? (
                    <p>Cargando lista de estudiantes asignados...</p>
                  ) : alumnosClase.length === 0 ? (
                    <p><em>No hay alumnos asignados a esta aula/sección actualmente.</em></p>
                  ) : (
                    <table className='tablaUsuarios'>
                      <thead className='encabezado'>
                        <tr >
                          <th>Carné</th>
                          <th>Nombre del Estudiante</th>
                          <th>Nota Registrada</th>
                          <th>Calificar / Modificar Nota (Máx: {actividadSeleccionada.punteo_maximo})</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody className='tablacontenido' >
                        {alumnosClase.map((alumno) => {
                          const nombreCompleto = `${alumno.nombre} ${alumno.apellido}`;
                          const notaActual = notasTemp[alumno.asignacion_grado_id] ?? '';

                          return (
                            <tr key={alumno.alumno_id}>
                              <td>{alumno.carne}</td>
                              <td><strong>{nombreCompleto}</strong></td>
                              <td>
                                {alumno.punteo_obtenido !== null && alumno.punteo_obtenido !== undefined ? (
                                  <span style={{ color: 'green', fontWeight: 'bold' }}>
                                    {alumno.punteo_obtenido} / {actividadSeleccionada.punteo_maximo} pts
                                  </span>
                                ) : (
                                  <span style={{ color: '#888' }}>Sin Calificar</span>
                                )}
                              </td>
                              <td>
                                <input
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  max={Number(actividadSeleccionada.punteo_maximo)}
                                  placeholder={`0 - ${actividadSeleccionada.punteo_maximo}`}
                                  value={notaActual}
                                  onChange={(e) => {
                                    setNotasTemp({
                                      ...notasTemp,
                                      [alumno.asignacion_grado_id]: e.target.value
                                    });
                                  }}
                                  style={{ width: '90px', padding: '0.3rem', fontSize: '0.95rem' }}
                                />
                                {' '}pts
                              </td>
                              <td>
                                <button
                                  className="btn-us "
                                  type="button"
                                  onClick={() => handleGuardarNotaIndividual(alumno.asignacion_grado_id, nombreCompleto)}
                                >
                                  Guardar Nota
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}
          <hr style={{ margin: '3rem 0' }} />
        </section>
      )}

      {/* Sección: Boleta Oficial de Calificaciones */}
      <section>
        <h2>Boleta de Calificaciones del Estudiante</h2>
        {!esAlumno && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              cargarBoleta(idAlumnoConsulta);
            }}
            style={{ marginBottom: '1.5rem' }}
          >
            {rol === 4 && (
              <label>
                Filtrar por asignatura y aula:{' '}
                <select
                  value={idAsignacionBoleta}
                  disabled={cargandoClases}
                  onChange={(e) => filtrarAlumnosBoleta(e.target.value)}
                >
                  <option value="">
                    {cargandoClases ? 'Cargando tus asignaturas…' : '-- Selecciona una asignatura --'}
                  </option>
                  {clases.map((clase) => (
                    <option
                      key={clase.asignacion_curso_maestro_id}
                      value={clase.asignacion_curso_maestro_id}
                    >
                      {clase.nom_curso} — {clase.nom_grado}, Sección {clase.nom_seccion} ({clase.ciclo})
                    </option>
                  ))}
                </select>
                {' '}
              </label>
            )}
            <label>
              Seleccionar Estudiante:{' '}
              <select
                value={idAlumnoConsulta}
                disabled={cargandoListaAlumnos || (rol === 4 && !idAsignacionBoleta)}
                onChange={(e) => {
                  setIdAlumnoConsulta(e.target.value);
                  setBoleta(null);
                  setErrorBoleta('');
                  setMensaje('');
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
            <button
              className="sesion"
              type="submit"
              disabled={!idAlumnoConsulta || cargandoBoleta || cargandoListaAlumnos}
            >
              {cargandoBoleta ? 'Consultando…' : 'Ver Boleta de Notas'}
            </button>
          </form>
        )}

        {errorBoleta && <p role="alert" style={{ color: 'red' }}>{errorBoleta}</p>}
        {!esAlumno && cargandoListaAlumnos && <p role="status">Cargando estudiantes…</p>}
        {!esAlumno && !cargandoListaAlumnos && listaAlumnos.length === 0 && !errorBoleta && (
          <p>
            {rol === 4
              ? idAsignacionBoleta
                ? 'No hay estudiantes asignados a esta asignatura y aula.'
                : 'Selecciona una asignatura para buscar entre sus estudiantes.'
              : 'No hay estudiantes disponibles para consultar.'}
          </p>
        )}
        {cargandoBoleta && <p>Consultando calificaciones...</p>}

        {boleta && (
          <div>
            <h3>Boleta Oficial de Notas</h3>
            {Array.isArray(boleta) ? (
              boleta.length === 0 ? (
                <p>No se registran calificaciones asentadas aún.</p>
              ) : (
                cursosBoleta.map(([curso, bimestresCurso]) => (
                  <section key={curso} className='lisUsuarios'>
                    <h4>{curso}</h4>
                    {Object.entries(bimestresCurso).map(([bimestreId, grupo]) => (
                      <div key={`${curso}-${bimestreId}`}>
                        <h5>{grupo.nombre}</h5>
                        <table className='tablaUsuarios'>
                          <thead className='encabezado'>
                            <tr>
                              <th>Actividad de Evaluación</th>
                              <th>Punteo Obtenido</th>
                              <th>Punteo Máximo</th>
                            </tr>
                          </thead>
                          <tbody className='tablacontenido'>
                            {grupo.calificaciones.map((item, idx) => (
                              <tr key={item.calificacion_id || `${item.bimestre_id}-${item.nom_actividad}-${idx}`}>
                                <td>{item.nom_actividad || '-'}</td>
                                <td style={{ fontWeight: 'bold', color: 'green' }}>{item.punteo_obtenido ?? '-'} pts</td>
                                <td>{item.punteo_maximo ?? '-'} pts</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </section>
                ))
              )
            ) : (
              <pre>{JSON.stringify(boleta, null, 2)}</pre>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Calificaciones;
