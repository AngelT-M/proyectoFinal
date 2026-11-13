export default function FormularioCambioPassword({ usuarioId, password, setPassword, onSubmit, onCancelar }) {
  return (
    <section>
      <h3>Cambiar Contraseña para Usuario #{usuarioId}</h3>
      <form onSubmit={onSubmit}>
        <label>
          Nueva Contraseña:
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Guardar Nueva Contraseña</button>
        <button type="button" onClick={onCancelar}>Cancelar</button>
      </form>
    </section>
  );
}
