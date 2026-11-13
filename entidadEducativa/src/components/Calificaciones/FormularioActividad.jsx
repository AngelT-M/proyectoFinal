export default function FormularioActividad({ clase, bimestres, nuevaAct, setNuevaAct, onSubmit, onCancelar }) {
  return (
    <section className="Crear-form">
      <div className="form-nuevo">
      <h2>Crear Actividad para {clase.nom_curso}</h2>
      <form className="form-cont" onSubmit={onSubmit}>
        <label>
          Bimestre:{' '}
          <select
            required
            value={nuevaAct.bimestre_id}
            onChange={(e) => setNuevaAct({ ...nuevaAct, bimestre_id: e.target.value })}
            disabled={bimestres.length === 0}
          >
            <option value="">-- Selecciona un periodo --</option>
            {bimestres.map((bimestre) => (
              <option key={bimestre.bimestre_id} value={bimestre.bimestre_id}>
                {bimestre.nombre}
                {bimestre.fecha_inicio && bimestre.fecha_fin
                  ? ` (${bimestre.fecha_inicio} al ${bimestre.fecha_fin})`
                  : ''}
              </option>
            ))}
          </select>
        </label>
        {bimestres.length === 0 && (
          <p>No hay periodos configurados para el ciclo de esta clase. Contacta a administración.</p>
        )}
        <label>
          Nombre de la Actividad:{' '}
          <input
            type="text"
            required
            placeholder="Ej. Tarea 1: Álgebra, Ensayo Literario"
            value={nuevaAct.nom_actividad}
            onChange={(e) => setNuevaAct({ ...nuevaAct, nom_actividad: e.target.value })}
          />
        </label>
        <label>
          Punteo Máximo:{' '}
          <input
            type="number"
            step="0.01"
            required
            min={1}
            max={100}
            value={nuevaAct.punteo_maximo}
            onChange={(e) => setNuevaAct({ ...nuevaAct, punteo_maximo: e.target.value })}
          /> pts
        </label>
        <label>
          Descripción o Instrucciones:{' '}
          <input
            type="text"
            placeholder="Breve descripción opcional"
            value={nuevaAct.descripcion}
            onChange={(e) => setNuevaAct({ ...nuevaAct, descripcion: e.target.value })}
          />
        </label>
        <div>
          <button className="sesion" type="submit">Guardar Actividad</button>
          <button className="sesion apagado" type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
      </div>
    </section>
  );
}
