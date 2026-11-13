export default function FormularioEdicionCurso({ editandoId, editandoData, setEditandoData, onSubmit, onCancelar }) {
  return (
    <section className="Crear-form">
      <div className="form-nuevo">
      <h2>Editar Curso #{editandoId}</h2>
      <form className="form-cont" onSubmit={onSubmit}>
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
        <div>
          <button type="submit">Actualizar Curso</button>
          <button className="sesion apagado" type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
      </div>
    </section>
  );
}
