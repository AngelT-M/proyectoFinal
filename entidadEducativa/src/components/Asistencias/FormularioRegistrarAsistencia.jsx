export default function FormularioRegistrarAsistencia({
  aulaSeleccionada,
  asistenciasAula,
  nuevaAsistencia,
  setNuevaAsistencia,
  onSubmit
}) {
  return (
    <section className="form-nuevo">
      <h2>Registrar Asistencia</h2>
      <p>
        Aula seleccionada:{' '}
        <strong>
          {aulaSeleccionada
            ? `${aulaSeleccionada.nom_grado} — Sección ${aulaSeleccionada.nom_seccion} (${aulaSeleccionada.ciclo})`
            : 'Selecciona un aula y consulta su lista.'}
        </strong>
      </p>
      <p>Elige un estudiante inscrito en esa aula</p>
      <form className="form-cont" onSubmit={onSubmit}>
        <label>
          Estudiante:{' '}
          <select
            required
            value={nuevaAsistencia.alumno_id}
            disabled={asistenciasAula.length === 0}
            onChange={(e) => {
              const seleccion = asistenciasAula.find(
                (item) => String(item.alumno_id) === e.target.value
              );
              if (seleccion) {
                setNuevaAsistencia({
                  ...nuevaAsistencia,
                  alumno_id: seleccion.alumno_id,
                  asignacion_grado_id: seleccion.asignacion_grado_id
                });
              }
            }}
          >
            <option value="">-- Selecciona un estudiante del aula --</option>
            {asistenciasAula.map((asignacion) => (
              <option key={asignacion.asignacion_grado_id} value={asignacion.alumno_id}>
                {asignacion.nombre} {asignacion.apellido} (Carné: {asignacion.carne})
              </option>
            ))}
          </select>
        </label>
        <br /><br />
        <label>
          Fecha:{' '}
          <input
            type="date"
            required
            value={nuevaAsistencia.fecha}
            onChange={(e) => setNuevaAsistencia({ ...nuevaAsistencia, fecha: e.target.value })}
          />
        </label>
        <br /><br />
        <label>
          Estado de Asistencia:{' '}
          <select
            value={nuevaAsistencia.estado}
            onChange={(e) => setNuevaAsistencia({ ...nuevaAsistencia, estado: e.target.value })}
          >
            <option value="PRESENTE">PRESENTE</option>
            <option value="TARDE">TARDE</option>
            <option value="AUSENTE">AUSENTE</option>
          </select>
        </label>
        <br /><br />
        <button
          className="sesion"
          type="submit"
          disabled={!nuevaAsistencia.alumno_id || !nuevaAsistencia.asignacion_grado_id}
        >
          Guardar Asistencia
        </button>
      </form>
    </section>
  );
}
