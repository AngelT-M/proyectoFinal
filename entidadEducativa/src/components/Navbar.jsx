import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import Logotipo from './Logotipo';
import '../style/barra.css';

function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  const navegar = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  // En la pantalla de login, no mostrar la barra superior repetida
  if (location.pathname === '/sesion' || location.pathname === '/login') {
    return null;
  }

  async function manejarCierreSesion() {
    setError('');
    try {
      await cerrarSesion();
      navegar('/sesion');
    } catch (errorCierre) {
      setError(errorCierre.message);
    }
  }

  const rol = Number(usuario?.rol_id || 0);

  return (
    <>
      <Logotipo />
      <nav className="nav">
        <div className="logo">
          <Link className="cont" to="/">
            <h2>Berear web Disk</h2>
            <p>CENTRO EDUCATIVO</p>
          </Link>
        </div>

        <div className="links">
          {/*visitante  */}
          <Link className="lin" to="/">INICIO</Link>
          {!usuario&& (
            <>
              <Link className='lin' >CONTACTOS</Link>
              <Link className='lin' >UBICACION</Link>
              <Link className='lin' >NOSOTROS</Link>
            </>
          )}
          {usuario && (
            <>
              {/* Rol 1: Admin */}
              {rol === 1 && (
                <>
                  <Link className="lin" to="/dashboard">Dashboard</Link>
                  <Link className="lin" to="/usuarios">Usuarios</Link>
                </>
              )}

              {/* Roles 1, 2, 3: Admin, Director, Secretaria */}
              {[1, 2, 3].includes(rol) && (
                <>
                  <Link className="lin" to="/personal">Personal</Link>
                  <Link className="lin" to="/maestros">Maestros</Link>
                  <Link className="lin" to="/aulas">Aulas</Link>
                  <Link className="lin" to="/periodos">Bimestres</Link>
                  <Link className="lin" to="/inscripciones">Asignaciones</Link>
                </>
              )}

              {/* Roles 1, 2, 3, 5: Alumnos */}
              {[1, 2, 3, 5].includes(rol) && (
                <Link className="lin" to="/alumnos">Alumnos</Link>
              )}

              {/* Académico */}
              <Link className="lin" to="/materias">Cursos</Link>
              <Link className="lin" to="/calificaciones">Calificaciones</Link>
              {[1, 2, 3, 4].includes(rol) && (
                <Link className="lin" to="/asistencias">Asistencias</Link>
              )}

              {/* Exámenes para roles 1, 2, 3, 4 */}
              {[1, 2, 3, 4].includes(rol) && (
                <Link className="lin" to="/examenes">Exámenes</Link>
              )}

              {/* Finanzas para roles 1, 2, 3, 5 */}
              {[1, 2, 3, 5].includes(rol) && (
                <Link className="lin" to="/finanzas">Finanzas</Link>
              )}

              <Link className="lin" to="/eventos">Eventos</Link>
            </>
          )}
        </div>

        <div className="iniciar">
          {usuario ? (
            <>
              <span className="usuario">
                {usuario.nom_usuario || usuario.usuario || 'Mi cuenta'} ({usuario.rol_nombre})
              </span>
              <button className="sesion" type="button" onClick={manejarCierreSesion}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link className="sesion linone" to="/sesion">
              <p>Iniciar sesión</p>
            </Link>
          )}
        </div>
      </nav>
      {error && <p role="alert" >{error}</p>}
    </>
  );
}

export default Navbar;
