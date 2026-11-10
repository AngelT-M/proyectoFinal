import { useEffect, useState } from 'react';
import { academicoApi, alumnoApi, maestroApi } from '../services/api';

function Inscripciones() {
  const [alumnos, setAlumnos] = useState([]);
  const [maestros, setMaestros] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [cursos, setCursos] = useState([]);

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Formulario Asignar Alumno
  const [asigAlumno, setAsigAlumno] = useState({ alumno_id: '', grado_seccion_id: '' });

  // Formulario Asignar Maestro
  const [asigMaestro, setAsigMaestro] = useState({ maestro_id: '', grado_seccion_id: '', curso_id: '' });

  const cargarCatalogos = async () => {
    setCargando(true);
    setError('');
    try {
      const [resAlumnos, resMaestros, resAulas, resCursos] = await Promise.all([
        alumnoApi.mostrar(),
        maestroApi.mostrar(),
        academicoApi.gradosSecciones(),
        academicoApi.cursos()
      ]);

      const listaAlumnos = Array.isArray(resAlumnos) ? resAlumnos : [];
      const listaMaestros = Array.isArray(resMaestros) ? resMaestros : [];
      const listaAulas = Array.isArray(resAulas) ? resAulas : [];
      const listaCursos = Array.isArray(resCursos) ? resCursos : [];

      setAlumnos(listaAlumnos);
      setMaestros(listaMaestros);
      setAulas(listaAulas);
      setCursos(listaCursos);

      if (listaAlumnos[0]) setAsigAlumno((p) => ({ ...p, alumno_id: listaAlumnos[0].alumno_id }));
      if (listaAulas[0]) {
        setAsigAlumno((p) => ({ ...p, grado_seccion_id: listaAulas[0].grado_seccion_id }));
        setAsigMaestro((p) => ({ ...p, grado_seccion_id: listaAulas[0].grado_seccion_id }));
      }
      if (listaMaestros[0]) setAsigMaestro((p) => ({ ...p, maestro_id: listaMaestros[0].maestro_id }));
      if (listaCursos[0]) setAsigMaestro((p) => ({ ...p, curso_id: listaCursos[0].curso_id }));
    } catch (err) {
      setError(err.message || 'Error al cargar catálogos de asignación.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const handleAsignarAlumno = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await academicoApi.asignarAlumno({
        alumno_id: Number(asigAlumno.alumno_id),
        grado_seccion_id: Number(asigAlumno.grado_seccion_id)
      });
      setMensaje('Estudiante asignado al aula exitosamente.');
    } catch (err) {
      setError(err.message || 'Error al asignar estudiante.');
    }
  };

  const handleAsignarMaestro = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await academicoApi.asignarMaestro({
        maestro_id: Number(asigMaestro.maestro_id),
        grado_seccion_id: Number(asigMaestro.grado_seccion_id),
        curso_id: Number(asigMaestro.curso_id)
      });
      setMensaje('Catedrático asignado al aula y curso exitosamente.');
    } catch (err) {
      setError(err.message || 'Error al asignar maestro.');
    }
  };

  const aulasPorNivel = aulas.reduce((grupos, aula) => {
    const nivel = aula.nom_nivel || 'Otros niveles';
    if (!grupos[nivel]) grupos[nivel] = [];
    grupos[nivel].push(aula);
    return grupos;
  }, {});

  const opcionesAulas = Object.entries(aulasPorNivel).map(([nivel, aulasNivel]) => (
    <optgroup key={nivel} label={nivel}>
      {aulasNivel.map((aula) => (
        <option key={aula.grado_seccion_id} value={aula.grado_seccion_id}>
          {aula.nom_grado} - Sección {aula.nom_seccion} ({aula.ciclo})
        </option>
      ))}
    </optgroup>
  ));

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Asignaciones Académicas</h1>
      <p>Inscripción de estudiantes a aulas y asignación de cátedras a docentes.</p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {cargando ? (
        <p>Cargando información...</p>
      ) : (
        <>
          <section style={{ marginBottom: '2.5rem' }}>
            <h2>1. Asignar Estudiante a un Aula (Matriculación)</h2>
            <form onSubmit={handleAsignarAlumno}>
              <label>
                Seleccionar Estudiante:{' '}
                <select
                  value={asigAlumno.alumno_id}
                  onChange={(e) => setAsigAlumno({ ...asigAlumno, alumno_id: e.target.value })}
                >
                  {alumnos.map((a) => (
                    <option key={a.alumno_id} value={a.alumno_id}>
                      {a.nombre} {a.apellido} (Carné: {a.carne})
                    </option>
                  ))}
                </select>
              </label>
              <br /><br />
              <label>
                Seleccionar Grado y Sección:{' '}
                <select
                  value={asigAlumno.grado_seccion_id}
                  onChange={(e) => setAsigAlumno({ ...asigAlumno, grado_seccion_id: e.target.value })}
                >
                  {opcionesAulas}
                </select>
              </label>
              <br /><br />
              <button className="sesion" type="submit">Asignar Estudiante al Aula</button>
            </form>
          </section>

          <section>
            <h2>2. Asignar Docente a un Aula y Curso (Cátedra)</h2>
            <form onSubmit={handleAsignarMaestro}>
              <label>
                Seleccionar Docente:{' '}
                <select
                  value={asigMaestro.maestro_id}
                  onChange={(e) => setAsigMaestro({ ...asigMaestro, maestro_id: e.target.value })}
                >
                  {maestros.map((m) => (
                    <option key={m.maestro_id} value={m.maestro_id}>
                      {m.nombre} {m.apellido} (Carné: {m.carne_maestro})
                    </option>
                  ))}
                </select>
              </label>
              <br /><br />
              <label>
                Seleccionar Grado y Sección:{' '}
                <select
                  value={asigMaestro.grado_seccion_id}
                  onChange={(e) => setAsigMaestro({ ...asigMaestro, grado_seccion_id: e.target.value })}
                >
                  {opcionesAulas}
                </select>
              </label>
              <br /><br />
              <label>
                Seleccionar Curso a Impartir:{' '}
                <select
                  value={asigMaestro.curso_id}
                  onChange={(e) => setAsigMaestro({ ...asigMaestro, curso_id: e.target.value })}
                >
                  {cursos.map((c) => (
                    <option key={c.curso_id} value={c.curso_id}>
                      {c.nom_curso}
                    </option>
                  ))}
                </select>
              </label>
              <br /><br />
              <button className="sesion" type="submit">Asignar Cátedra al Maestro</button>
            </form>
          </section>
        </>
      )}
    </main>
  );
}

export default Inscripciones;
