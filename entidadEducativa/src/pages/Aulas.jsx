import { useEffect, useState } from 'react';
import { academicoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';
import FormularioAula from '../components/Aulas/FormularioAula';
import ListadoAulas from '../components/Aulas/ListadoAulas';

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
     
      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {puedeAbrir && (
        <section style={{ marginBottom: '2rem' }}>
          <button
          className='sesion'
          type='button'
          onClick={()=>setMostrarFormAulas(!mostrarFormAulas)}
          >
            + crear nueva Aula
          </button>
          {mostrarFormAulas && (
            <FormularioAula
              nueva={nueva}
              setNueva={setNueva}
              gradosPorNivel={gradosPorNivel}
              secciones={secciones}
              onSubmit={handleAbrirAula}
              onCancelar={() => setMostrarFormAulas(false)}
            />
          )}
        </section>
      )}

      <ListadoAulas
        aulas={aulas}
        cargando={cargando}
        ciclosOrdenados={ciclosOrdenados}
        aulasPorCiclo={aulasPorCiclo}
        puedeAbrir={puedeAbrir}
        onEliminar={handleEliminarAula}
      />
    </main>
  );
}

export default Aulas;
