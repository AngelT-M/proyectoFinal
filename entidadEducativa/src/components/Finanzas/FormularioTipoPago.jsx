export default function FormularioTipoPago({
  grados,
  gradoConfigId,
  setGradoConfigId,
  nuevoTipoPago,
  setNuevoTipoPago,
  tipoPagoMensaje,
  tipoPagoError,
  guardandoTipoPago,
  nuevoCargoMasivo,
  onSubmit
}) {
  return (
    <section className="form-nuevo" style={{ marginBottom: '2rem' }}>
      <h2>Configurar cuota para un grado</h2>
      <p>
        Define un concepto y su monto. La cuota quedará asociada al grado seleccionado
        y estará disponible para generar cargos masivos.
      </p>
      <form className="form-cont" onSubmit={onSubmit}>
        <label>
          Grado Escolar:{' '}
          <select required value={gradoConfigId} onChange={(e) => setGradoConfigId(e.target.value)}>
            {grados.map((grado) => (
              <option key={grado.grado_id} value={grado.grado_id}>
                {grado.nom_grado} {grado.nom_nivel ? `(${grado.nom_nivel})` : ''}
              </option>
            ))}
          </select>
        </label>
        <br /><br />
        <label>
          Concepto de la cuota:{' '}
          <input
            type="text"
            required
            maxLength={150}
            placeholder="Ej. Colegiatura mensual"
            value={nuevoTipoPago.descripcion}
            onChange={(e) => setNuevoTipoPago({ ...nuevoTipoPago, descripcion: e.target.value })}
          />
        </label>
        <br /><br />
        <label>
          Cantidad de pagos:{' '}
          <input
            type="number"
            required
            min={1}
            step={1}
            value={nuevoTipoPago.cantidad_pagos}
            onChange={(e) => setNuevoTipoPago({ ...nuevoTipoPago, cantidad_pagos: e.target.value })}
          />
        </label>
        <br /><br />
        <label>
          Monto por pago (Q):{' '}
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={nuevoTipoPago.monto_base}
            onChange={(e) => setNuevoTipoPago({ ...nuevoTipoPago, monto_base: e.target.value })}
          />
        </label>
        <br /><br />
        {tipoPagoMensaje && <p role="status" style={{ color: 'green' }}>{tipoPagoMensaje}</p>}
        {tipoPagoError && <p role="alert" style={{ color: 'red' }}>{tipoPagoError}</p>}
        <button
          className="sesion"
          type="submit"
          disabled={guardandoTipoPago || !nuevoCargoMasivo.grado_id}
        >
          {guardandoTipoPago ? 'Guardando cuota...' : 'Crear cuota'}
        </button>
      </form>
    </section>
  );
}
