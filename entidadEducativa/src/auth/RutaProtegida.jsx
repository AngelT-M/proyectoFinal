import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function RutaProtegida({ children, rolesPermitidos }) {
  const { usuario, cargando } = useAuth();
  const ubicacion = useLocation();

  if (cargando) {
    return <p role="status">Comprobando sesión...</p>;
  }

  if (!usuario) {
    return <Navigate to="/sesion" replace state={{ from: ubicacion }} />;
  }

  if (rolesPermitidos && Array.isArray(rolesPermitidos)) {
    const rolActual = Number(usuario.rol_id);
    if (!rolesPermitidos.includes(rolActual)) {
      return (
        <section style={{ margin: '20px' }}>
          <h2>Acceso Denegado</h2>
          <p>Tu rol actual (<strong>{usuario.rol_nombre || 'Sin Rol'}</strong>) no tiene permisos para acceder a esta página.</p>
          <Link to="/">Volver al Inicio</Link>
        </section>
      );
    }
  }

  return children;
}

