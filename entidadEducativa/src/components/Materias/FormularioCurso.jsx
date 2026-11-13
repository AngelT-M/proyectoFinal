export default function FormularioCurso({ nuevo, setNuevo, onSubmit, onCancelar }) {
  return (
    <section className="Crear-form">
      <div className="form-nuevo">
      <h2>Crear Nuevo Curso</h2>
      <form className="form-cont" onSubmit={onSubmit}>
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
        <div>
          <button type="submit">Guardar Curso</button>
          <button className="sesion apagado" type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
      </div>
    </section>
  );
}
