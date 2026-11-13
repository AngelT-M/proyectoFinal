export default function FormularioCambioPassword({ usuarioId, password, setPassword, onSubmit, onCancelar }) {
  return (
    <section className="Crear-form">
      <div className="form-nuevo">
      <h2>Cambiar Contraseña para Usuario #{usuarioId}</h2>
      <form className="form-cont" onSubmit={onSubmit}>
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
        <div>
          <button type="submit">Guardar Nueva Contraseña</button>
          <button className="sesion apagado" type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
      </div>
    </section>
  );
}
