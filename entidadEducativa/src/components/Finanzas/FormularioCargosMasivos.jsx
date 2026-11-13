export default function FormularioCargosMasivos({
  nuevoCargoMasivo,
  setNuevoCargoMasivo,
  tiposPago,
  grados,
  cargandoTiposPago,
  errorTiposPago,
  onCambiarGrado,
  onSubmit
}) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Generar Cargos Masivos a Alumnos por Grado</h2>
      <form onSubmit={onSubmit}>
        <label>
          Tipo de Cuota / Pago:{' '}
          <select
            required
            value={nuevoCargoMasivo.pago_id}
            onChange={(e) => setNuevoCargoMasivo({ ...nuevoCargoMasivo, pago_id: e.target.value })}
            disabled={cargandoTiposPago || tiposPago.length === 0}
          >
            <option value="">
              {cargandoTiposPago
                ? 'Cargando cuotas del grado...'
                : tiposPago.length
                  ? '-- Selecciona una cuota --'
                  : 'No hay cuotas configuradas para este grado'}
            </option>
            {tiposPago.map((tipo) => (
              <option key={tipo.pago_id} value={tipo.pago_id}>
                {tipo.descripcion} — Q {Number(tipo.monto_base).toFixed(2)}
              </option>
            ))}
          </select>
        </label>
        <br /><br />
        <label>
          Grado Escolar:{' '}
          <select
            required
            value={nuevoCargoMasivo.grado_id}
            onChange={(e) => onCambiarGrado(e.target.value)}
          >
            {grados.map((grado) => (
              <option key={grado.grado_id} value={grado.grado_id}>
                {grado.nom_grado} {grado.nom_nivel ? `(${grado.nom_nivel})` : ''}
              </option>
            ))}
          </select>
        </label>
        <br /><br />
        <label>
          Fecha Límite de Pago (Vencimiento):{' '}
          <input
            type="date"
            required
            value={nuevoCargoMasivo.fecha_vencimiento}
            onChange={(e) => setNuevoCargoMasivo({
              ...nuevoCargoMasivo,
              fecha_vencimiento: e.target.value
            })}
          />
        </label>
        {errorTiposPago && <p role="alert">{errorTiposPago}</p>}
        {!cargandoTiposPago && !errorTiposPago && grados.length > 0 && tiposPago.length === 0 && (
          <p>No hay cuotas registradas para este grado. Selecciona otro grado o configura una cuota para este grado.</p>
        )}
        <br /><br />
        <button
          className="sesion"
          type="submit"
          disabled={cargandoTiposPago || tiposPago.length === 0 || !nuevoCargoMasivo.pago_id}
        >
          Generar Cargos para los Alumnos de este Grado
        </button>
      </form>
    </section>
  );
}
