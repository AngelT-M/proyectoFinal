import { useEffect, useState } from 'react';
import { academicoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';

function Aulas() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);
  const puedeAbrir = [1, 2, 3].includes(rol);

  const [aulas, setAulas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [mostrarFormAulas, setMostrarFormAulas] = useState(false);
  const [nueva, setNueva] = useState({
    grado_id: '',
    seccion_id: '',
    cantidad_estudiantes: 30,
    ciclo: new Date().getFullYear()
  });

  const cargarDatos = async () => {
    setCargando(true);
    setError('');
    try {
      const [resAulas, resGrados, resSecciones] = await Promise.all([
        academicoApi.gradosSecciones(),
        academicoApi.grados(),
        academicoApi.secciones()
      ]);
      setAulas(Array.isArray(resAulas) ? resAulas : []);
      setGrados(Array.isArray(resGrados) ? resGrados : []);
      setSecciones(Array.isArray(resSecciones) ? resSecciones : []);
      if (resGrados?.[0]?.grado_id) {
        setNueva((prev) => ({
          ...prev,
          grado_id: prev.grado_id || resGrados[0].grado_id,
          seccion_id: prev.seccion_id || resSecciones?.[0]?.seccion_id || ''
        }));
      }
    } catch (err) {
      setError(err.message || 'Error al cargar datos de aulas.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleAbrirAula = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await academicoApi.abrirAula({
        grado_id: Number(nueva.grado_id),
        seccion_id: Number(nueva.seccion_id),
        cantidad_estudiantes: Number(nueva.cantidad_estudiantes),
        ciclo: Number(nueva.ciclo)
      });
      setMensaje('Aula abierta exitosamente.');
      cargarDatos();
    } catch (err) {
      setError(err.message || 'Error al abrir aula.');
    }
  };

  const handleEliminarAula = async (aula) => {
    const nombre = `${aula.nom_grado} - Sección ${aula.nom_seccion} (${aula.ciclo})`;
    if (!window.confirm(`¿Eliminar el aula ${nombre}? Solo se pueden eliminar aulas sin estudiantes ni docentes asignados.`)) return;

    setMensaje('');
    setError('');
    try {
      await academicoApi.eliminarAula(aula.grado_seccion_id);
      setMensaje(`Aula ${nombre} eliminada.`);
      setMostrarFormAulas(false);
      await cargarDatos();
    } catch (err) {
      setError(err.message || 'Error al eliminar el aula.');
    }
  };

  const gradosPorNivel = grados.reduce((grupos, grado) => {
    const nivel = grado.nom_nivel || 'Otros niveles';
    if (!grupos[nivel]) grupos[nivel] = [];
    grupos[nivel].push(grado);
    return grupos;
  }, {});

  const aulasPorCiclo = aulas.reduce((grupos, aula) => {
    const ciclo = String(aula.ciclo || 'Sin ciclo');
    if (!grupos[ciclo]) grupos[ciclo] = [];
    grupos[ciclo].push(aula);
    return grupos;
  }, {});
  const ciclosOrdenados = Object.keys(aulasPorCiclo).sort(
    (a, b) => Number(b) - Number(a)
  );

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Aulas Aperturadas (Grados y Secciones)</h1>
      <p>Consulta de grados, secciones asignadas y cupos disponibles.</p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {puedeAbrir && (
        <section style={{ marginBottom: '2rem' }}>
          <button
          className='sesion'
          type='button'
          onClick={()=>setMostrarFormAulas(!mostrarFormAulas)}
          >
             {mostrarFormAulas ? 'cancelar': '+ crear nueva Aula'}
          </button>
          {mostrarFormAulas && (
            <div>
              <h2>Abrir Nueva Aula</h2>
              <form onSubmit={handleAbrirAula}>
                <label>
                  Grado:{' '}
                  <select
                    value={nueva.grado_id}
                    onChange={(e) => setNueva({ ...nueva, grado_id: e.target.value })}
                  >
                    {Object.entries(gradosPorNivel).map(([nivel, gradosNivel]) => (
                      <optgroup key={nivel} label={nivel}>
                        {gradosNivel.map((g) => (
                          <option key={g.grado_id} value={g.grado_id}>
                            {g.nom_grado}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>
             
                <label>
                  Sección:{' '}
                  <select
                    value={nueva.seccion_id}
                    onChange={(e) => setNueva({ ...nueva, seccion_id: e.target.value })}
                  >
                    {secciones.map((s) => (
                      <option key={s.seccion_id} value={s.seccion_id}>
                        Sección {s.nom_seccion}
                      </option>
                    ))}
                  </select>
                </label>
             
                <label>
                  Cupo de Estudiantes:{' '}
                  <input
                    type="number"
                    min={1}
                    max={255}
                    required
                    value={nueva.cantidad_estudiantes}
                    onChange={(e) => setNueva({ ...nueva, cantidad_estudiantes: e.target.value })}
                  />
                </label>
              
                <label>
                  Ciclo Lectivo:{' '}
                  <input
                    type="number"
                    min={2000}
                    max={2100}
                    required
                    value={nueva.ciclo}
                    onChange={(e) => setNueva({ ...nueva, ciclo: e.target.value })}
                  />
                </label>
                
                <button className="sesion" type="submit">Abrir Aula</button>
              </form>
            </div>
          )}
        </section>
      )}

      <section>
        <h2>Listado de Aulas</h2>
        {cargando ? (
          <p>Cargando aulas...</p>
        ) : (
          aulas.length === 0 ? (
            <p>No hay aulas registradas para este ciclo.</p>
          ) : (
            ciclosOrdenados.map((ciclo) => (
              <section className='lisUsuarios'  key={ciclo}>
                <h3>Ciclo escolar {ciclo}</h3>
                <table className='tablaUsuarios' >
                  <thead className='encabezado' >
                    <tr >
                      <th>Nivel Educativo</th>
                      <th>Grado</th>
                      <th>Sección</th>
                      <th>Capacidad</th>
                      {puedeAbrir && <th>Acciones</th>}
                    </tr>
                  </thead>
                  <tbody className='tablacontenido' >
                    {aulasPorCiclo[ciclo].map((a) => (
                      <tr key={a.grado_seccion_id}>
                        <td>{a.nom_nivel || 'Nivel General'}</td>
                        <td><strong>{a.nom_grado || `Grado #${a.grado_id}`}</strong></td>
                        <td>Sección {a.nom_seccion || a.seccion_id}</td>
                        <td>{a.cantidad_estudiantes} alumnos máx.</td>
                        {puedeAbrir && (
                          <td className='cont-act' >
                            <button className='btn-us apagado'  type="button" onClick={() => handleEliminarAula(a)}>
                              Eliminar aula
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))
          )
        )}
      </section>
    </main>
  );
}

export default Aulas;
