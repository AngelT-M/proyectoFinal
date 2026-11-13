import { useEffect, useRef, useState } from 'react';
import { asistenciaApi, academicoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';
import ConsultaAsistenciaAula from '../components/Asistencias/ConsultaAsistenciaAula';
import FormularioRegistrarAsistencia from '../components/Asistencias/FormularioRegistrarAsistencia';
import HistorialAsistencia from '../components/Asistencias/HistorialAsistencia';

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

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}


      {puedeRegistrar && (
        <>
          <ConsultaAsistenciaAula
            aulas={aulas}
            idAula={idAula}
            setIdAula={setIdAula}
            fechaConsulta={fechaConsulta}
            setFechaConsulta={setFechaConsulta}
            asistenciasAula={asistenciasAula}
            setAsistenciasAula={setAsistenciasAula}
            setNuevaAsistencia={setNuevaAsistencia}
            cargandoAula={cargandoAula}
            onSubmit={handleConsultarAula}
          />
          <FormularioRegistrarAsistencia
            aulaSeleccionada={aulaSeleccionada}
            asistenciasAula={asistenciasAula}
            nuevaAsistencia={nuevaAsistencia}
            setNuevaAsistencia={setNuevaAsistencia}
            onSubmit={handleRegistrar}
          />
        </>
      )}

      <HistorialAsistencia
        esAlumno={esAlumno}
        rol={rol}
        aulas={aulas}
        idAulaHistorial={idAulaHistorial}
        onSeleccionarAula={handleSeleccionarAulaHistorial}
        idAlumnoHistorial={idAlumnoHistorial}
        setIdAlumnoHistorial={setIdAlumnoHistorial}
        alumnosHistorial={alumnosHistorial}
        cargandoAlumnosHistorial={cargandoAlumnosHistorial}
        mesHistorial={mesHistorial}
        setMesHistorial={setMesHistorial}
        setHistorial={setHistorial}
        setResumenHistorial={setResumenHistorial}
        setError={setError}
        onSubmit={(e) => {
          e.preventDefault();
          const alumnoId = esAlumno
            ? usuario?.perfil?.alumno_id || usuario?.id_usuario
            : idAlumnoHistorial;
          cargarHistorial(alumnoId);
        }}
        cargandoHistorial={cargandoHistorial}
        resumenHistorial={resumenHistorial}
        historial={historial}
        error={error}
      />

    </main>
  );
}

export default Asistencias;
