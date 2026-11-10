import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import '../style/inicio.css';

function Home() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);

  return (
    <main className="contenido" style={{ padding: '2rem' }}>
      <h1>Sistema de Gestión Educativa - Centro Educativo Berea</h1>
      <p>Bienvenido a la plataforma web académica y administrativa.</p>

      {usuario ? (
        <section style={{ marginTop: '1.5rem' }}>
          <h2>Panel de Acceso Rápido</h2>
          <p>
            Has iniciado sesión como: <strong>{usuario.nom_usuario}</strong> ({usuario.rol_nombre})
          </p>

          <div style={{ marginTop: '1rem' }}>
            <h3>Módulos disponibles para tu rol:</h3>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
              {rol === 1 && (
                <>
                  <li><Link to="/dashboard">Dashboard General</Link> - Estadísticas globales del colegio</li>
                  <li><Link to="/usuarios">Gestión de Usuarios</Link> - Administrar cuentas de acceso</li>
                </>
              )}

              {[1, 2, 3].includes(rol) && (
                <>
                  <li><Link to="/personal">Personal Administrativo</Link> - Lista y registro de personal</li>
                  <li><Link to="/maestros">Docentes / Maestros</Link> - Registro y control de catedráticos</li>
                  <li><Link to="/aulas">Aulas (Grados y Secciones)</Link> - Estructura y cupos de salones</li>
                  <li><Link to="/alumnos">Alumnos</Link> - Registro de matrículas y estudiantes</li>
                  <li><Link to="/inscripciones">Asignaciones Académicas</Link> - Asignar alumnos y maestros a aulas</li>
                </>
              )}

              {rol === 5 && (
                <li><Link to="/alumnos">Mi Perfil de Alumno</Link> - Datos de matrícula y tutor</li>
              )}

              <li><Link to="/materias">Cursos y Materias</Link> - Catálogo de asignaturas</li>
              <li><Link to="/calificaciones">Calificaciones y Boletas</Link> - {rol === 5 ? 'Consultar mi boleta de notas' : 'Gestionar notas y actividades'}</li>
              {[1, 2, 3, 4].includes(rol) && (
                <li><Link to="/asistencias">Asistencias</Link> - Tomar y consultar asistencia</li>
              )}

              {[1, 2, 3, 4].includes(rol) && (
                <li><Link to="/examenes">Exámenes</Link> - {rol === 4 ? 'Enviar exámenes para revisión' : 'Revisar y autorizar exámenes enviados'}</li>
              )}

              {[1, 2, 3, 5].includes(rol) && (
                <li><Link to="/finanzas">Finanzas y Pagos</Link> - {rol === 5 ? 'Estado de cuenta de colegiaturas' : 'Control de pagos y cargos'}</li>
              )}

              <li><Link to="/eventos">Calendario de Eventos</Link> - Actividades escolares</li>
            </ul>
          </div>
        </section>
      ) : (
        <section style={{ marginTop: '1.5rem' }}>
          <h2>Bienvenido Visitante</h2>
          <p>Para acceder a las funciones académicas y de gestión, por favor inicia sesión con tus credenciales institucionales.</p>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/sesion">
              <button className="sesion" type="button">Ir a Iniciar Sesión</button>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}

export default Home;
