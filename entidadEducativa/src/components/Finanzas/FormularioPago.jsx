export default function FormularioPago({ pago, setPago, cargos, onSubmit }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Caja: Registrar Cobro de Pago </h2>
      <form onSubmit={onSubmit}>
        <p>
          {pago.concepto ? (
            <span>Concepto seleccionado: <strong>{pago.concepto}</strong></span>
          ) : (
            <span><em>Selecciona un cargo pendiente de la lista o usa el botón Cobrar en la tabla superior.</em></span>
          )}
        </p>
        <label>
          Cargo pendiente:
          <select
            required
            value={pago.cargo_id}
            onChange={(e) => {
              const cargo = cargos.find((item) => String(item.cargo_id) === e.target.value);
              setPago({
                ...pago,
                cargo_id: e.target.value,
                concepto: cargo?.descripcion || `Cargo de ${cargo?.alumno_nombre || 'estudiante'}`,
                monto_pagado: cargo?.saldo_pendiente || cargo?.monto_cobrar || ''
              });
            }}
          >
            <option value="">-- Selecciona un cargo pendiente --</option>
            {cargos
              .filter((cargo) => cargo.estado !== 'PAGO_TOTAL')
              .map((cargo) => (
                <option key={cargo.cargo_id} value={cargo.cargo_id}>
                  {cargo.descripcion || 'Cargo escolar'} — Q
                  {Number(cargo.saldo_pendiente ?? cargo.monto_cobrar).toFixed(2)}
                  {cargo.alumno_nombre ? ` — ${cargo.alumno_nombre} ${cargo.alumno_apellido}` : ''}
                </option>
              ))}
          </select>
        </label>
        <br /><br />
        <label>
          Monto a Pagar (Q):{' '}
          <input
            type="number"
            step="0.01"
            required
            min={1}
            placeholder="Ej. 450.00"
            value={pago.monto_pagado}
            onChange={(e) => setPago({ ...pago, monto_pagado: e.target.value })}
          />
        </label>
        <br /><br />
        <button className="sesion" type="submit">Emitir Recibo de Pago</button>
      </form>
    </section>
  );
}
