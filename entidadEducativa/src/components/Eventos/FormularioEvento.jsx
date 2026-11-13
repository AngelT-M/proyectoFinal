export default function FormularioEvento({ nuevo, setNuevo, niveles, onSubmit }) {
  return (
    <div>
      <h2>Agendar Nuevo Evento Escolar</h2>
      <form onSubmit={onSubmit}>
        <label>
          Título del Evento:
          <input
            type="text"
            required
            placeholder="Ej. Feria de Ciencias"
            value={nuevo.titulo}
            onChange={(e) => setNuevo({ ...nuevo, titulo: e.target.value })}
          />
        </label>
        <br />
        <label>
          Tipo de Evento:
          <select
            value={nuevo.tipo_evento}
            onChange={(e) => setNuevo({ ...nuevo, tipo_evento: e.target.value })}
          >
            <option value="INSTITUCIONAL">INSTITUCIONAL</option>
            <option value="ACADEMICO">ACADEMICO</option>
            <option value="EXAMEN">EXAMEN</option>
            <option value="DEPORTIVO">DEPORTIVO</option>
            <option value="CULTURAL">CULTURAL</option>
          </select>
        </label>
        <br />
        <label>
          Nivel Educativo (opcional):
          <select
            value={nuevo.nivel_id}
            onChange={(e) => setNuevo({ ...nuevo, nivel_id: e.target.value })}
          >
            <option value="">-- Todos los niveles --</option>
            {niveles.map((nivel) => (
              <option key={nivel.nivel_id} value={nivel.nivel_id}>
                {nivel.nom_nivel}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Fecha y Hora de Inicio:
          <input
            type="datetime-local"
            required
            value={nuevo.fecha_inicio}
            onChange={(e) => setNuevo({ ...nuevo, fecha_inicio: e.target.value })}
          />
        </label>
        <br />
        <label>
          Fecha y Hora de Finalización:
          <input
            type="datetime-local"
            required
            value={nuevo.fecha_final}
            onChange={(e) => setNuevo({ ...nuevo, fecha_final: e.target.value })}
          />
        </label>
        <br />
        <label>
          Descripción del Evento:
          <textarea
            value={nuevo.descripcion}
            onChange={(e) => setNuevo({ ...nuevo, descripcion: e.target.value })}
          />
        </label>
        <br />
        <button type="submit">Guardar Evento en Calendario</button>
      </form>
    </div>
  );
}
