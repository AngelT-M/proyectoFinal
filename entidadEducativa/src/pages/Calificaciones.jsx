import { useEffect, useRef, useState } from 'react';
import { evaluacionesApi, academicoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';
import SelectorClase from '../components/Calificaciones/SelectorClase';
import ActividadesClase from '../components/Calificaciones/ActividadesClase';
import BoletaCalificaciones from '../components/Calificaciones/BoletaCalificaciones';

export default function Calificaciones() {
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

      {puedeCalificar && (
        <section>
          <SelectorClase
            clases={clases}
            claseSeleccionada={claseSeleccionada}
            cargando={cargandoClases}
            rol={rol}
            onSeleccionarClase={seleccionarClase}
          />
          {claseSeleccionada && (
            <ActividadesClase
              clase={claseSeleccionada}
              bimestres={bimestres}
              nuevaAct={nuevaAct}
              setNuevaAct={setNuevaAct}
              mostrarFormActividad={mostrarFormActividad}
              setMostrarFormActividad={setMostrarFormActividad}
              onCrearActividad={handleCrearActividad}
              cargandoActividades={cargandoActividades}
              actividades={actividades}
              actividadSeleccionada={actividadSeleccionada}
              onSeleccionarActividad={cargarAlumnosDeActividad}
              alumnosClase={alumnosClase}
              cargandoAlumnos={cargandoAlumnos}
              notasTemp={notasTemp}
              setNotasTemp={setNotasTemp}
              onGuardarNota={handleGuardarNotaIndividual}
            />
          )}
          <hr  />
        </section>
      )}
      <BoletaCalificaciones
        esAlumno={esAlumno}
        rol={rol}
        clases={clases}
        cargandoClases={cargandoClases}
        idAsignacionBoleta={idAsignacionBoleta}
        filtrarAlumnosBoleta={filtrarAlumnosBoleta}
        idAlumnoConsulta={idAlumnoConsulta}
        setIdAlumnoConsulta={setIdAlumnoConsulta}
        setBoleta={setBoleta}
        setErrorBoleta={setErrorBoleta}
        setMensaje={setMensaje}
        cargandoListaAlumnos={cargandoListaAlumnos}
        listaAlumnos={listaAlumnos}
        cargarBoleta={cargarBoleta}
        errorBoleta={errorBoleta}
        cargandoBoleta={cargandoBoleta}
        boleta={boleta}
        cursosBoleta={cursosBoleta}
      />
    </main>
  );
}


