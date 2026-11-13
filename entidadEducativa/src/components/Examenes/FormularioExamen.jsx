export default function FormularioExamen({
  nuevoExamen,
  setNuevoExamen,
  asignaciones,
  bimestresEnvio,
  cargandoBimestres,
  onCambiarAsignacion,
  onSubmit
}) {
  return (
    <section>
      <h2>Enviar Examen para Autorización</h2>
      <form onSubmit={onSubmit}>
        <label>
          Clase y aula:
          <select
            required
            value={nuevoExamen.asignacion_curso_maestro_id}
            onChange={(e) => onCambiarAsignacion(e.target.value)}
            disabled={asignaciones.length === 0}
          >
            <option value="">-- Selecciona una clase asignada --</option>
            {asignaciones.map((asignacion) => (
              <option
                key={asignacion.asignacion_curso_maestro_id}
                value={asignacion.asignacion_curso_maestro_id}
              >
                {asignacion.nom_curso} — {asignacion.nom_grado}, Sección {asignacion.nom_seccion}
                {' '}({asignacion.ciclo})
              </option>
            ))}
          </select>
        </label>
        {asignaciones.length === 0 && <p>No tienes clases asignadas disponibles.</p>}
        <br />
        <label>
          Título del Examen:
          <input
            type="text"
            required
            placeholder="Ej. Examen Parcial I - Matemáticas"
            value={nuevoExamen.titulo}
            onChange={(e) => setNuevoExamen({ ...nuevoExamen, titulo: e.target.value })}
          />
        </label>
        <br />
        <label>
          Bimestre:
          <select
            required
            value={nuevoExamen.bimestre_id}
            onChange={(e) => setNuevoExamen({ ...nuevoExamen, bimestre_id: e.target.value })}
            disabled={cargandoBimestres || bimestresEnvio.length === 0}
          >
            <option value="">-- Selecciona un periodo --</option>
            {bimestresEnvio.map((bimestre) => (
              <option key={bimestre.bimestre_id} value={bimestre.bimestre_id}>
                {bimestre.nombre}
                {bimestre.fecha_inicio && bimestre.fecha_fin
                  ? ` (${bimestre.fecha_inicio} al ${bimestre.fecha_fin})`
                  : ''}
              </option>
            ))}
          </select>
        </label>
        {cargandoBimestres && <p>Cargando periodos del ciclo...</p>}
        {!cargandoBimestres && nuevoExamen.asignacion_curso_maestro_id && bimestresEnvio.length === 0 && (
          <p>No hay periodos configurados para este ciclo escolar. Contacta a administración.</p>
        )}
        <br />
        <label>
          URL del Archivo (enlace público o documento):
          <input
            type="url"
            required
            placeholder="https://drive.google.com/..."
            value={nuevoExamen.archivo_url}
            onChange={(e) => setNuevoExamen({ ...nuevoExamen, archivo_url: e.target.value })}
          />
        </label>
        <br />
        <label>
          Mensaje o notas adicionales para revisión:
          <textarea
            value={nuevoExamen.mensaje}
            onChange={(e) => setNuevoExamen({ ...nuevoExamen, mensaje: e.target.value })}
          />
        </label>
        <br />
        <button type="submit">Enviar Examen</button>
      </form>
    </section>
  );
}
