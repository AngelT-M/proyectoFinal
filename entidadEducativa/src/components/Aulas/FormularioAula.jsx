export default function FormularioAula({ nueva, setNueva, gradosPorNivel, secciones, onSubmit }) {
  return (
    <div>
      <h2>Abrir Nueva Aula</h2>
      <form onSubmit={onSubmit}>
        <label>
          Grado:{' '}
          <select
            value={nueva.grado_id}
            onChange={(e) => setNueva({ ...nueva, grado_id: e.target.value })}
          >
            {Object.entries(gradosPorNivel).map(([nivel, gradosNivel]) => (
              <optgroup key={nivel} label={nivel}>
                {gradosNivel.map((grado) => (
                  <option key={grado.grado_id} value={grado.grado_id}>
                    {grado.nom_grado}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <label>
          Sección:{' '}
          <select
            value={nueva.seccion_id}
            onChange={(e) => setNueva({ ...nueva, seccion_id: e.target.value })}
          >
            {secciones.map((seccion) => (
              <option key={seccion.seccion_id} value={seccion.seccion_id}>
                Sección {seccion.nom_seccion}
              </option>
            ))}
          </select>
        </label>

        <label>
          Cupo de Estudiantes:{' '}
          <input
            type="number"
            min={1}
            max={255}
            required
            value={nueva.cantidad_estudiantes}
            onChange={(e) => setNueva({ ...nueva, cantidad_estudiantes: e.target.value })}
          />
        </label>

        <label>
          Ciclo :{' '}
          <input
            type="number"
            min={2000}
            max={2100}
            required
            value={nueva.ciclo}
            onChange={(e) => setNueva({ ...nueva, ciclo: e.target.value })}
          />
        </label>

        <button className="sesion" type="submit">Abrir Aula</button>
      </form>
    </div>
  );
}
