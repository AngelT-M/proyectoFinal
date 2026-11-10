import { useCallback, useEffect, useState } from 'react';
import { academicoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';

function Materias() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);
  const esAdmin = rol === 1;

  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const [nuevo, setNuevo] = useState({ nom_curso: '', descripcion: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [editandoData, setEditandoData] = useState({ nom_curso: '', descripcion: '' });

  const cargarCursos = useCallback(async () => {
    try {
      const data = rol === 5
        ? await academicoApi.asignacionesMaestros()
        : await academicoApi.cursos();
      setCursos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar cursos.');
    } finally {
      setCargando(false);
    }
  }, [rol]);

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
        {rol === 5
          ? 'Consulta los cursos asignados a tu aula y ciclo escolar.'
          : 'Catálogo institucional de asignaturas académicas.'}
      </p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {esAdmin && (
        <section>
          <h2>Crear Nuevo Curso</h2>
          <form onSubmit={handleCrear}>
            <label>
              Nombre del Curso:
              <input
                type="text"
                required
                value={nuevo.nom_curso}
                onChange={(e) => setNuevo({ ...nuevo, nom_curso: e.target.value })}
              />
            </label>
            <br />
            <label>
              Descripción:
              <textarea
                value={nuevo.descripcion}
                onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
              />
            </label>
            <br />
            <button type="submit">Guardar Curso</button>
          </form>
        </section>
      )}

      {esAdmin && editandoId && (
        <section>
          <h3>Editar Curso #{editandoId}</h3>
          <form onSubmit={handleActualizar}>
            <label>
              Nombre del Curso:
              <input
                type="text"
                required
                value={editandoData.nom_curso}
                onChange={(e) => setEditandoData({ ...editandoData, nom_curso: e.target.value })}
              />
            </label>
            <br />
            <label>
              Descripción:
              <textarea
                value={editandoData.descripcion}
                onChange={(e) => setEditandoData({ ...editandoData, descripcion: e.target.value })}
              />
            </label>
            <br />
            <button type="submit">Actualizar Curso</button>
            <button type="button" onClick={() => setEditandoId(null)}>Cancelar</button>
          </form>
        </section>
      )}

      <section>
        <h2>{rol === 5 ? 'Mis cursos asignados' : 'Catálogo de Cursos'}</h2>
        {cargando ? (
          <p>Cargando cursos...</p>
        ) : (
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                {rol !== 5 && <th>ID</th>}
                <th>Nombre del Curso</th>
                {rol === 5 ? (
                  <>
                    <th>Docente</th>
                    <th>Aula</th>
                    <th>Ciclo escolar</th>
                  </>
                ) : (
                  <th>Descripción</th>
                )}
                {esAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {cursos.map((c) => (
                <tr key={c.curso_id}>
                  {rol !== 5 && <td>{c.curso_id}</td>}
                  <td>{c.nom_curso}</td>
                  {rol === 5 ? (
                    <>
                      <td>{`${c.maestro_nombre || ''} ${c.maestro_apellido || ''}`.trim() || 'No indicado'}</td>
                      <td>{c.nom_grado} — Sección {c.nom_seccion}</td>
                      <td>{c.ciclo}</td>
                    </>
                  ) : (
                    <td>{c.descripcion || '-'}</td>
                  )}
                  {esAdmin && (
                    <td>
                      <button type="button" onClick={() => iniciarEdicion(c)}>
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {cursos.length === 0 && (
                <tr>
                  <td colSpan={rol === 5 ? 5 : esAdmin ? 4 : 3}>
                    {rol === 5 ? 'No tienes cursos asignados en este momento.' : 'No hay cursos registrados.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default Materias;
