import { useEffect, useState } from 'react';
import { academicoApi, examenesApi } from '../services/api';
import { useAuth } from '../auth/useAuth';
import FormularioExamen from '../components/Examenes/FormularioExamen';
import ListadoExamenes from '../components/Examenes/ListadoExamenes';

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
      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {/* Sección para enviar exámenes, disponible para docentes */}
      {puedeEnviar && (
        <FormularioExamen
          nuevoExamen={nuevoExamen}
          setNuevoExamen={setNuevoExamen}
          asignaciones={asignaciones}
          bimestresEnvio={bimestresEnvio}
          cargandoBimestres={cargandoBimestres}
          onCambiarAsignacion={cambiarAsignacion}
          onSubmit={handleEnviarExamen}
        />
      )}

      {/* Sección para Autorizar Exámenes (Dirección, Administración, Secretaría) */}
      {puedeAutorizar && (
        <>
          <hr />
          <ListadoExamenes
            examenes={examenes}
            examenesFiltrados={examenesFiltrados}
            ciclos={ciclos}
            bimestres={bimestres}
            cicloFiltro={cicloFiltro}
            bimestreFiltro={bimestreFiltro}
            setCicloFiltro={setCicloFiltro}
            setBimestreFiltro={setBimestreFiltro}
            onAutorizar={handleAutorizarExamen}
          />
        </>
      )}
    </main>
  );
}

export default Examenes;
