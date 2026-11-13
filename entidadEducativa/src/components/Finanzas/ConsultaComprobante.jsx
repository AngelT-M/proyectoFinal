export default function ConsultaComprobante({
  idPagoComprobante,
  onSeleccionarComprobante,
  listaComprobantes,
  cargandoComprobante,
  comprobante,
  onSubmit
}) {
  return (
    <section className="form-nuevo">
      <h2>Consultar Comprobante de Pago Oficial</h2>
      <form className="form-cont" onSubmit={onSubmit}>
        <label>
          Comprobante de pago:
          <select
            required
            value={idPagoComprobante}
            onChange={(e) => onSeleccionarComprobante(e.target.value)}
          >
            <option value="">-- Selecciona un comprobante --</option>
            {listaComprobantes.map((recibo) => (
              <option key={recibo.pago_realizado_id} value={recibo.pago_realizado_id}>
                {recibo.alumno_nombre} {recibo.alumno_apellido} — {recibo.concepto}
                {' '}— {recibo.fecha_pago} — Q{Number(recibo.monto_pagado).toFixed(2)}
              </option>
            ))}
          </select>
        </label>
        {listaComprobantes.length === 0 && <p>No hay comprobantes disponibles.</p>}
        {' '}
        <button className="sesion" type="submit">Ver Comprobante</button>
      </form>

      {cargandoComprobante && <p>Buscando recibo...</p>}
      {comprobante && (
        <fieldset style={{ marginTop: '1rem', padding: '1rem' }}>
          <legend><strong>Comprobante Oficial de Caja #{comprobante.pago_realizado_id}</strong></legend>
          <p><strong>Estudiante:</strong> {comprobante.alumno_nombre} {comprobante.alumno_apellido} (Carné: {comprobante.carne})</p>
          <p><strong>Concepto:</strong> {comprobante.concepto}</p>
          <p><strong>Monto Pagado:</strong> Q {Number(comprobante.monto_pagado).toFixed(2)}</p>
          <p><strong>Fecha de Pago:</strong> {comprobante.fecha_pago}</p>
          <p><strong>Encargado:</strong> {comprobante.nom_encargado} (Tel: {comprobante.tel_encargado})</p>
          <p><strong>Atendido por:</strong> {comprobante.cobrador_nombre} {comprobante.cobrador_apellido}</p>
        </fieldset>
      )}
    </section>
  );
}
