import FormularioActividad from './FormularioActividad';
import ListadoCalificacionesActividad from './ListadoCalificacionesActividad';

export default function ActividadesClase({
  clase,
  bimestres,
  nuevaAct,
  setNuevaAct,
  mostrarFormActividad,
  setMostrarFormActividad,
  onCrearActividad,
  cargandoActividades,
  actividades,
  actividadSeleccionada,
  onSeleccionarActividad,
  alumnosClase,
  cargandoAlumnos,
  notasTemp,
  setNotasTemp,
  onGuardarNota
}) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>
        Actividades de Evaluación ({clase.nom_curso} — {clase.nom_grado} {clase.nom_seccion})
      </h2>
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          className="sesion"
          type="button"
          onClick={() => setMostrarFormActividad(!mostrarFormActividad)}
        >
          + Crear Nueva Actividad
        </button>
      </div>

      {mostrarFormActividad && (
        <FormularioActividad
          clase={clase}
          bimestres={bimestres}
          nuevaAct={nuevaAct}
          setNuevaAct={setNuevaAct}
          onSubmit={onCrearActividad}
          onCancelar={() => setMostrarFormActividad(false)}
        />
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
                const actividad = actividades.find(
                  (item) => String(item.actividad_curso_id) === e.target.value
                );
                if (actividad) onSeleccionarActividad(actividad);
              }}
              style={{ padding: '0.4rem', fontSize: '1rem', minWidth: '320px' }}
            >
              {actividades.map((actividad) => (
                <option key={actividad.actividad_curso_id} value={actividad.actividad_curso_id}>
                  [{actividad.bimestre}] {actividad.nom_actividad} — Punteo máx: {actividad.punteo_maximo} pts
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {actividadSeleccionada && (
        <ListadoCalificacionesActividad
          actividad={actividadSeleccionada}
          alumnos={alumnosClase}
          cargando={cargandoAlumnos}
          notasTemp={notasTemp}
          setNotasTemp={setNotasTemp}
          onGuardarNota={onGuardarNota}
        />
      )}
    </div>
  );
}
