export default function FormularioEdicionCurso({ editandoId, editandoData, setEditandoData, onSubmit, onCancelar }) {
  return (
    <section>
      <h3>Editar Curso #{editandoId}</h3>
      <form onSubmit={onSubmit}>
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
        <button type="button" onClick={onCancelar}>Cancelar</button>
      </form>
    </section>
  );
}
