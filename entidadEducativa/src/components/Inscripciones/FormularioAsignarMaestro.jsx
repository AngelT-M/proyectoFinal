export default function FormularioAsignarMaestro({
  maestros,
  cursos,
  asignacion,
  setAsignacion,
  opcionesAulas,
  onSubmit
}) {
  return (
    <section className="seccion form-nuevo">
      <h2>Asignar Docente a un Aula y Curso (Cátedra)</h2>
      <form className="form form-cont" onSubmit={onSubmit}>
        <label className="entrada">
          Seleccionar Docente:{' '}
          <select
            value={asignacion.maestro_id}
            onChange={(e) => setAsignacion({ ...asignacion, maestro_id: e.target.value })}
          >
            {maestros.map((maestro) => (
              <option key={maestro.maestro_id} value={maestro.maestro_id}>
                {maestro.nombre} {maestro.apellido} (Carné: {maestro.carne_maestro})
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
        <label className="entrada">
          Seleccionar Curso a Impartir:{' '}
          <select
            value={asignacion.curso_id}
            onChange={(e) => setAsignacion({ ...asignacion, curso_id: e.target.value })}
          >
            {cursos.map((curso) => (
              <option key={curso.curso_id} value={curso.curso_id}>
                {curso.nom_curso}
              </option>
            ))}
          </select>
        </label>
        <button className="sesion" type="submit">Asignar Cátedra al Maestro</button>
      </form>
    </section>
  );
}
