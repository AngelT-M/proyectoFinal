import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import IniciarSesion from '../components/Sesion/IniciarSesion';
import Logotipo from '../components/Logotipo';
import '../style/sesion.css';

export default function Sesion() {
  const { usuario, cargando, errorAuth, iniciarSesion, limpiarErrorAuth } = useAuth();
  const ubicacion = useLocation();
  const navegar = useNavigate();

  if (cargando) {
    return <p role="status">Comprobando sesión...</p>;
  }

  if (usuario) {
    return <Navigate to="/" replace />;
  }

  async function manejarInicioSesion(credenciales) {
    limpiarErrorAuth();
    await iniciarSesion(credenciales);
    navegar(ubicacion.state?.from?.pathname ?? '/', { replace: true });
  }

  return (
    <main className="fondoImg">

      <IniciarSesion onLogin={manejarInicioSesion} errorInicial={errorAuth} />
    </main>
  );
}
