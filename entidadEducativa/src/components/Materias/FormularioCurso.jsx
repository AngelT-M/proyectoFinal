export default function FormularioCurso({ nuevo, setNuevo, onSubmit }) {
  return (
    <div>
      <h2>Crear Nuevo Curso</h2>
      <form onSubmit={onSubmit}>
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
    </div>
  );
}
