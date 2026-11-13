export default function FormularioAsignarAlumno({
  alumnos,
  asignacion,
  setAsignacion,
  opcionesAulas,
  onSubmit
}) {
  return (
    <section className="seccion">
      <h2>Asignar Estudiante a un Aula (Matriculación)</h2>
      <form className="form" onSubmit={onSubmit}>
        <label className="entrada">
          Seleccionar Estudiante:{' '}
          <select
            value={asignacion.alumno_id}
            onChange={(e) => setAsignacion({ ...asignacion, alumno_id: e.target.value })}
          >
            {alumnos.map((alumno) => (
              <option key={alumno.alumno_id} value={alumno.alumno_id}>
                {alumno.nombre} {alumno.apellido} (Carné: {alumno.carne})
              </option>
            ))}
          </select>
        </label>
        <label className="entrada">
          Seleccionar Grado y Sección:{' '}
          <select
            value={asignacion.grado_seccion_id}
            onChange={(e) => setAsignacion({ ...asignacion, grado_seccion_id: e.target.value })}
          >
            {opcionesAulas}
          </select>
        </label>
        <button className="sesion" type="submit">Asignar Estudiante al Aula</button>
      </form>
    </section>
  );
}
