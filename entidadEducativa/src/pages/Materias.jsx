import { useCallback, useEffect, useState } from 'react';
import { academicoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';
import FormularioCurso from '../components/Materias/FormularioCurso';
import FormularioEdicionCurso from '../components/Materias/FormularioEdicionCurso';
import ListadoCursos from '../components/Materias/ListadoCursos';

function Materias() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);
  const esAdmin = rol === 1;
  const esDocente = rol === 4;
  const consultaAsignaciones = esDocente || rol === 5;

  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [mostrarFormCursos, setMostrarFormCursos] = useState(false);
  const [nuevo, setNuevo] = useState({ nom_curso: '', descripcion: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [editandoData, setEditandoData] = useState({ nom_curso: '', descripcion: '' });

  const cargarCursos = useCallback(async () => {
    try {
      const data = consultaAsignaciones
        ? await academicoApi.asignacionesMaestros()
        : await academicoApi.cursos();
      setCursos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar cursos.');
    } finally {
      setCargando(false);
    }
  }, [consultaAsignaciones]);

  useEffect(() => {
    cargarCursos();
  }, [cargarCursos]);

  const handleCrear = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await academicoApi.crearCurso(nuevo);
      setMensaje('Curso creado exitosamente.');
      setMostrarFormCursos(false);
      setNuevo({ nom_curso: '', descripcion: '' });
      cargarCursos();
    } catch (err) {
      setError(err.message || 'Error al crear curso.');
    }
  };

  const iniciarEdicion = (c) => {
    setEditandoId(c.curso_id);
    setEditandoData({ nom_curso: c.nom_curso, descripcion: c.descripcion || '' });
  };

  const handleActualizar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await academicoApi.actualizarCurso(editandoId, editandoData);
      setMensaje('Curso actualizado correctamente.');
      setEditandoId(null);
      cargarCursos();
    } catch (err) {
      setError(err.message || 'Error al actualizar curso.');
    }
  };

  return (
    <main>
      <h1>Cursos y Asignaturas</h1>
      <p>
        {esDocente
          ? 'Consulta las materias que impartes en cada aula y ciclo escolar.'
          : rol === 5
            ? 'Consulta los cursos asignados a tu aula y ciclo escolar.'
            : 'Catálogo institucional de asignaturas académicas.'}
      </p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {esAdmin && (
        <section>
          <div>
            <button
            className='sesion'
            type='button'
            onClick={()=> setMostrarFormCursos(!mostrarFormCursos)}
            >
              {mostrarFormCursos ? 'cancelar':'+ nuevo curso'}
            </button>
          </div>

          {mostrarFormCursos && (
            <FormularioCurso
              nuevo={nuevo}
              setNuevo={setNuevo}
              onSubmit={handleCrear}
              onCancelar={() => setMostrarFormCursos(false)}
            />
          )} 
        </section>
      )}

      {esAdmin && editandoId && (
        <FormularioEdicionCurso
          editandoId={editandoId}
          editandoData={editandoData}
          setEditandoData={setEditandoData}
          onSubmit={handleActualizar}
          onCancelar={() => setEditandoId(null)}
        />
      )}

      <ListadoCursos
        cursos={cursos}
        cargando={cargando}
        consultaAsignaciones={consultaAsignaciones}
        rol={rol}
        esAdmin={esAdmin}
        onEditar={iniciarEdicion}
      />
    </main>
  );
}

export default Materias;
