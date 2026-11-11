import { useEffect, useState } from 'react';
import { academicoApi, examenesApi } from '../services/api';
import { useAuth } from '../auth/useAuth';

function Examenes() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);

  const puedeEnviar = rol === 4;
  const puedeAutorizar = [1, 2, 3].includes(rol);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [asignaciones, setAsignaciones] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [bimestresCatalogo, setBimestresCatalogo] = useState([]);
  const [bimestresEnvio, setBimestresEnvio] = useState([]);
  const [cicloFiltro, setCicloFiltro] = useState(() => String(new Date().getFullYear()));
  const [bimestreFiltro, setBimestreFiltro] = useState('');
  const [cargandoBimestres, setCargandoBimestres] = useState(false);

  // Formulario enviar examen
  const [nuevoExamen, setNuevoExamen] = useState({
    asignacion_curso_maestro_id: '',
    bimestre_id: '',
    titulo: '',
    mensaje: '',
    archivo_url: ''
  });

  useEffect(() => {
    const cargarListas = async () => {
      try {
        const solicitudes = [];
        if (puedeEnviar) solicitudes.push(academicoApi.asignacionesMaestros());
        if (puedeAutorizar) {
          solicitudes.push(examenesApi.listar());
          solicitudes.push(academicoApi.bimestres());
        }
        const resultados = await Promise.all(solicitudes);
        let indice = 0;
        if (puedeEnviar) {
          const lista = resultados[indice++];
          setAsignaciones(Array.isArray(lista) ? lista : []);
        }
        if (puedeAutorizar) {
          const lista = resultados[indice];
          setExamenes(Array.isArray(lista) ? lista : []);
          const periodos = resultados[indice + 1];
          setBimestresCatalogo(Array.isArray(periodos) ? periodos : []);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar las asignaciones o los exámenes.');
      }
    };

    cargarListas();
  }, [puedeEnviar, puedeAutorizar]);

  const cambiarAsignacion = async (asignacionId) => {
    setNuevoExamen((actual) => ({
      ...actual,
      asignacion_curso_maestro_id: asignacionId,
      bimestre_id: ''
    }));
    setBimestresEnvio([]);
    if (!asignacionId) return;

    const asignacion = asignaciones.find(
      (item) => String(item.asignacion_curso_maestro_id) === asignacionId
    );
    if (!asignacion) return;

    setCargandoBimestres(true);
    setError('');
    try {
      const lista = await academicoApi.bimestres(asignacion.ciclo);
      setBimestresEnvio(Array.isArray(lista) ? lista : []);
    } catch (err) {
      setError(err.message || 'No fue posible cargar los periodos del ciclo escolar.');
    } finally {
      setCargandoBimestres(false);
    }
  };

  const handleEnviarExamen = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await examenesApi.crear({
        asignacion_curso_maestro_id: Number(nuevoExamen.asignacion_curso_maestro_id),
        bimestre_id: Number(nuevoExamen.bimestre_id),
        titulo: nuevoExamen.titulo,
        mensaje: nuevoExamen.mensaje,
        archivo_url: nuevoExamen.archivo_url
      });
      setMensaje('Examen enviado exitosamente para su revisión y autorización.');
      setNuevoExamen({
        asignacion_curso_maestro_id: '',
        bimestre_id: '',
        titulo: '',
        mensaje: '',
        archivo_url: ''
      });
      if (puedeAutorizar) {
        const lista = await examenesApi.listar();
        setExamenes(Array.isArray(lista) ? lista : []);
      }
    } catch (err) {
      setError(err.message || 'Error al enviar examen.');
    }
  };

  const handleAutorizarExamen = async (examen, estado) => {
    setMensaje('');
    setError('');
    try {
      await examenesApi.autorizar(examen.examen_id, estado);
      setMensaje(`"${examen.titulo}" ${estado === 'APROBADO' ? 'aprobado' : 'rechazado'}.`);
      setExamenes((lista) =>
        lista.map((item) => String(item.examen_id) === String(examen.examen_id)
          ? { ...item, estado }
          : item)
      );
    } catch (err) {
      setError(err.message || 'Error al procesar la autorización del examen.');
    }
  };

  const ciclos = [...new Set([...examenes.map((examen) => String(examen.ciclo)), cicloFiltro])].sort(
    (a, b) => Number(b) - Number(a)
  );
  const bimestres = [...new Set([
    ...bimestresCatalogo.map((bimestre) => bimestre.nombre),
    ...examenes.map((examen) => examen.bimestre).filter(Boolean)
  ])];
  const examenesFiltrados = examenes.filter((examen) =>
    (!cicloFiltro || String(examen.ciclo) === cicloFiltro)
    && (!bimestreFiltro
      || (bimestreFiltro === 'SIN_ESPECIFICAR' ? !examen.bimestre : examen.bimestre === bimestreFiltro))
  );

  return (
    <main>
      <h1>Gestión y Autorización de Exámenes</h1>
      <p>Los docentes envían sus exámenes y el personal autorizado revisa y resuelve las solicitudes.</p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {/* Sección para enviar exámenes, disponible para docentes */}
      {puedeEnviar && (
        <section>
          <h2>Enviar Examen para Autorización</h2>
          <form onSubmit={handleEnviarExamen}>
            <label>
              Clase y aula:
              <select
                required
                value={nuevoExamen.asignacion_curso_maestro_id}
                onChange={(e) => cambiarAsignacion(e.target.value)}
                disabled={asignaciones.length === 0}
              >
                <option value="">-- Selecciona una clase asignada --</option>
                {asignaciones.map((asignacion) => (
                  <option
                    key={asignacion.asignacion_curso_maestro_id}
                    value={asignacion.asignacion_curso_maestro_id}
                  >
                    {asignacion.nom_curso} — {asignacion.nom_grado}, Sección {asignacion.nom_seccion}
                    {' '}({asignacion.ciclo})
                  </option>
                ))}
              </select>
            </label>
            {asignaciones.length === 0 && <p>No tienes clases asignadas disponibles.</p>}
            <br />
            <label>
              Título del Examen:
              <input
                type="text"
                required
                placeholder="Ej. Examen Parcial I - Matemáticas"
                value={nuevoExamen.titulo}
                onChange={(e) => setNuevoExamen({ ...nuevoExamen, titulo: e.target.value })}
              />
            </label>
            <br />
            <label>
              Bimestre:
              <select
                required
                value={nuevoExamen.bimestre_id}
                onChange={(e) => setNuevoExamen({ ...nuevoExamen, bimestre_id: e.target.value })}
                disabled={cargandoBimestres || bimestresEnvio.length === 0}
              >
                <option value="">-- Selecciona un periodo --</option>
                {bimestresEnvio.map((bimestre) => (
                  <option key={bimestre.bimestre_id} value={bimestre.bimestre_id}>
                    {bimestre.nombre}
                    {bimestre.fecha_inicio && bimestre.fecha_fin
                      ? ` (${bimestre.fecha_inicio} al ${bimestre.fecha_fin})`
                      : ''}
                  </option>
                ))}
              </select>
            </label>
            {cargandoBimestres && <p>Cargando periodos del ciclo...</p>}
            {!cargandoBimestres && nuevoExamen.asignacion_curso_maestro_id && bimestresEnvio.length === 0 && (
              <p>No hay periodos configurados para este ciclo escolar. Contacta a administración.</p>
            )}
            <br />
            <label>
              URL del Archivo (enlace público o documento):
              <input
                type="url"
                required
                placeholder="https://drive.google.com/..."
                value={nuevoExamen.archivo_url}
                onChange={(e) => setNuevoExamen({ ...nuevoExamen, archivo_url: e.target.value })}
              />
            </label>
            <br />
            <label>
              Mensaje o notas adicionales para revisión:
              <textarea
                value={nuevoExamen.mensaje}
                onChange={(e) => setNuevoExamen({ ...nuevoExamen, mensaje: e.target.value })}
              />
            </label>
            <br />
            <button type="submit">Enviar Examen</button>
          </form>
        </section>
      )}

      {/* Sección para Autorizar Exámenes (Dirección, Administración, Secretaría) */}
      {puedeAutorizar && (
        <>
          <hr />
          <section>
            <h2>Historial de Exámenes</h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <label>
                Ciclo escolar:
                <select value={cicloFiltro} onChange={(e) => setCicloFiltro(e.target.value)}>
                  <option value="">Todos los ciclos</option>
                  {ciclos.map((ciclo) => <option key={ciclo} value={ciclo}>{ciclo}</option>)}
                </select>
              </label>
              <label>
                Bimestre:
                <select value={bimestreFiltro} onChange={(e) => setBimestreFiltro(e.target.value)}>
                  <option value="">Todos los bimestres</option>
                  <option value="SIN_ESPECIFICAR">Sin especificar</option>
                  {bimestres.map((bimestre) => (
                    <option key={bimestre} value={bimestre}>{bimestre}</option>
                  ))}
                </select>
              </label>
            </div>
            {examenes.length === 0 ? (
              <p>No hay exámenes registrados.</p>
            ) : examenesFiltrados.length === 0 ? (
              <p>No hay exámenes para el ciclo y bimestre seleccionados.</p>
            ) : (
              <div className='lisUsuarios'>
                <table className='tablaUsuarios'>
                  <thead className='encabezado' >
                    <tr >
                      <th>Examen</th>
                      <th>Curso y aula</th>
                      <th>Bimestre</th>
                      <th>Docente</th>
                      <th>Enviado</th>
                      <th>Notas</th>
                      <th>Archivo</th>
                      <th>Estado y resolución</th>
                    </tr>
                  </thead>
                  <tbody className='tablacontenido' >
                    {examenesFiltrados.map((examen) => (
                      <tr key={examen.examen_id}>
                        <td><strong>{examen.titulo}</strong></td>
                        <td>
                          {examen.nom_curso} — {examen.nom_grado}, Sección {examen.nom_seccion}
                          {' '}({examen.ciclo})
                        </td>
                        <td>{examen.bimestre || 'Sin especificar'}</td>
                        <td>
                          {examen.maestro_nombre
                            ? `${examen.maestro_nombre} ${examen.maestro_apellido}`
                            : 'No indicado'}
                        </td>
                        <td>{examen.fecha_envio || '-'}</td>
                        <td>{examen.mensaje || '-'}</td>
                        <td>
                          <a href={examen.archivo_url} target="_blank" rel="noreferrer">
                            Ver archivo
                          </a>
                        </td>
                        <td>
                          <strong>{examen.estado}</strong>
                          {examen.estado === 'PENDIENTE' && (
                            <div >
                              <button
                                className="sesion"
                                type="button"
                                onClick={() => handleAutorizarExamen(examen, 'APROBADO')}
                              >
                                Aprobar
                              </button>
                              <button
                                className='btn-us apagado'
                                type="button"
                                onClick={() => handleAutorizarExamen(examen, 'RECHAZADO')}
                              >
                                Rechazar
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default Examenes;
