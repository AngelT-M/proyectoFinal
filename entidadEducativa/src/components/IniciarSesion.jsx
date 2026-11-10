import { useState } from 'react';
import '../style/sesion.css';

export default function IniciarSesion({ onLogin, errorInicial = '' }) {
  const [nomUsuario, setNomUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setEnviando(true);

    try {
      await onLogin({ nom_usuario: nomUsuario, password });
    } catch (errorLogin) {
      setError(errorLogin.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="iniciarS">
      <section className="contF">
        <div className="tituloF">
          <h1>Iniciar sesión</h1>
        </div>
        <div className="formu">
          <form className="formulario" onSubmit={manejarEnvio}>
            <label htmlFor="nom_usuario">Usuario</label>
            <input
              id="nom_usuario"
              name="nom_usuario"
              type="text"
              placeholder="Usuario"
              autoComplete="username"
              value={nomUsuario}
              onChange={(evento) => setNomUsuario(evento.target.value)}
              required
            />
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              value={password}
              onChange={(evento) => setPassword(evento.target.value)}
              required
            />
            {(error || errorInicial) && (
              <p className="errorSesion" role="alert">
                {error || errorInicial}
              </p>
            )}
            <button type="submit" disabled={enviando}>
              {enviando ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

