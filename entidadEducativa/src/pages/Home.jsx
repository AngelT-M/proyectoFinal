import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import '../style/inicio.css';

function Home() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);

  return (
    <main className="contenido" >
      

      {usuario ? (
        <section >
          <h1>Sistema de Gestión Educativa - Centro Educativo Berea</h1>
          <p>Bienvenido a la plataforma web académica y administrativa.</p>

          <h2>Panel de Acceso Rápido</h2>
          <p>
            Has iniciado sesión como: <strong>{usuario.nom_usuario}</strong> ({usuario.rol_nombre})
          </p>

          <div >
            <h3>Módulos disponibles para tu rol:</h3>
            <ul >
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
        <section className='home-visitante' >
          {/*
          <h2></h2>
          <p>Para acceder a las funciones académicas y de gestión, por favor inicia sesión con tus credenciales institucionales.</p>
          <div >

            <Link to="/sesion">
              <button className="sesion" type="button">Ir a Iniciar Sesión</button>
            </Link>
          </div>
          */}
          <div className='panel-prin' >
            <div className='eslogan' >
              <div className='tm' >
                <h1>Un lugar para Crecer y <h1 className='progre' >Progresar</h1> </h1>
                <h1>Un mundo pordescubrir.</h1>
              </div>
              <div className='frace' >
                <p>Acompañamos a cada estudiante a descubrir su potencial,con una educación cercana, curiosa y conectada con la vida.</p>
              </div>
              
              <div className='sec-btn' >
                <button className='sesion' >CONTACTOS</button>
                <button className='sesion' >NOSOTROS</button>
              </div> 
            </div>

            <div className='eslogan-img'>
                <img className='img-eslogan' src="https://imagenes.elpais.com/resizer/v2/PO3W3FHL7FBZLDZLLPQY4VBMWU.jpg?auth=145bb445e9f80f6eb8da23cf4a19f985f3b865e7d51186dfbfeac19eb51db5d2&width=414" alt="" />
                <button className='sesion est' >informacion</button>
            </div>
            
          </div>

          <div className='cont-info-card' >
              <div className='info-card' >
                <div className='infro-img' > 
                  <img src="https://isp.edu.pa/wp-content/uploads/2025/06/high-schools.webp" alt="" />
                </div>
                <div>
                  <h2>nota</h2>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi dolor obcaecati animi cupiditate </p>
                </div>
              </div>

              <div className='info-card' >
                <div className='infro-img' > 
                  <img src="https://www.colegiolosandes.edu.gt/sites/default/files/Instalaciones-7_0.jpg" alt="" />
                </div>
                <div>
                  <h2>nota</h2>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi dolor obcaecati animi cupiditate </p>
                </div>
              </div>
             
              <div className='info-card' >
                <div className='infro-img' > 
                  <img src="https://images.squarespace-cdn.com/content/v1/61ae3ba53022ff35f79bb557/1676907677992-ZK5V9N08UPPKX9Z96KMY/colegio-interamericano-zona-16-ciudad-de-guatemala-topofilia-studio-fotografia-profesional-de-arquitectura-4.jpg" alt="" />
                </div>
                <div>
                  <h2>nota</h2>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi dolor obcaecati animi cupiditate </p>
                </div>
              </div>
             
              <div className='info-card' >
                <div className='infro-img' > 
                  <img src="https://www.guatemala.com/wp-content/uploads/2023/11/Historia-del-Colegio-Sagrado-Corazon-en-la-zona-1-de-la-Ciudad-de-Guatemala-1.jpg" alt="" />
                </div>
                <div>
                  <h2>nota</h2>
                  <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi dolor obcaecati animi cupiditate </p>
                </div>
              </div>

          </div>


        </section>
      )}
    </main>
  );
}

export default Home;
