import { Link } from 'react-router-dom';
import TarjetaModulo from './TarjetaModulo';

export default function HomeUsuarios({ usuario, rol }) {
  return (
    <section className=' home-usuarios'>
      <h1>Sistema de Gestión Educativa - Centro Educativo Berea</h1>
      <p>
        Has iniciado sesión como: <strong>{usuario.nom_usuario}</strong> ({usuario.rol_nombre})
      </p>

      <div>
        <div>
          <h2>Modulos disponibles</h2>
        </div>
        <div className='home-usuarios-cont'>
          
          {rol === 1 && (
            <>
              <Link to="/dashboard" className='home-usuarios-card normal'>
                <TarjetaModulo
                  titulo="Estado"
                  imagen="https://www.esic.edu/sites/default/files/2025-12/cuenta%20de%20resultados.jpg"
                />
              </Link>

              <Link to="/usuarios" className='home-usuarios-card normal'>
                <TarjetaModulo
                  titulo="Usuarios"
                  imagen="https://www.auladiv.com/assets/imgs/usuarios.png"
                />
              </Link>
            </>
          )}
          {[1, 2, 3].includes(rol) && (
            <>
              <Link to="/personal" className='home-usuarios-card normal'>
                <TarjetaModulo
                  titulo="Personal Administrativo"
                  imagen="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR1I-6ZlJ5G2WEcr7INPadIl7OO25pLUpvHGPKwEfnwbOm7Hh1RftznmL-&s=10"
                />
              </Link>

              <Link to="/maestros" className='home-usuarios-card normal'>
                <TarjetaModulo
                  titulo="Docentes / Maestros"
                  imagen="https://oes.fundacion-sm.org/wp-content/uploads/sites/14/2025/04/Docentes2-2167903430.jpg"
                />
              </Link>

              <Link to="/aulas" className='home-usuarios-card normal'  >
                <TarjetaModulo
                  titulo="Aulas"
                  imagen="https://plus.unsplash.com/premium_photo-1680807869780-e0876a6f3cd5?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                />
              </Link>

              <Link to="/periodos" className='home-usuarios-card normal'>
                <TarjetaModulo
                  titulo="Bimestres"
                  imagen="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT30uBr6HdagnR0EkDI1NNwuPxXviTbd0h1BELwd4tNmxafRi4EbYnv0vc&s=10"
                />
              </Link>

              <Link to="/alumnos" className='home-usuarios-card normal' >
                <TarjetaModulo
                  titulo="Alumnos"
                  imagen="https://www.realinfluencers.es/wp-content/uploads/2017/12/alumnos_discapacidad.jpg"
                />
              </Link>
              <Link to="/inscripciones"  className='home-usuarios-card normal' >
                <TarjetaModulo
                  titulo="Asignaciones Académicas"
                  imagen="https://media.mitsloanreview.mx/2022/01/Desarrollo-de-empleados-ge%CC%81nero-lugar-de-trabajo-hi%CC%81brido.jpg"
                />
              </Link>
            </>
          )}
          {rol === 5 && (
            <Link to="/alumnos" className='home-usuarios-card normal'>
              <TarjetaModulo
                  titulo="Mi Perfil de Alumno"
                  imagen="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQolS1ddLmtSZ_RBM290S48U3OpVWF5WRihX_ojO24_MYVEuqlYuLTTPJ1K&s=10"
                />
            </Link>          
          )}

          <Link to="/materias" className='home-usuarios-card normal' >
            <TarjetaModulo
                titulo="Cursos y Materias"
                imagen="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV1IgxPttlDbokKLKBk3DcOCMp3tsVNM-R5w0rABE7gOqlmvcjGkx6kDY&s=10"
              />
          </Link>
          <Link to="/calificaciones"  className='home-usuarios-card normal' >
            <TarjetaModulo
                titulo="Calificaciones y Boletas"
                imagen="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrHD4SKQN-bAT7jEBybhDFaVlYqAtaabhPOGiZ4hNeoaK2RQLbRGuNDgy3&s=10"
            />
          </Link>

          {[1, 2, 3, 4].includes(rol) && (
            <Link to="/asistencias"  className='home-usuarios-card normal'>
              <TarjetaModulo
                titulo="Asistencias"
                imagen="https://educrea.cl/wp-content/uploads/2019/10/TM-Asistencia-1200x630.png"
              />
            </Link>           
          )}

          {[1, 2, 3, 4].includes(rol) && (
              <Link to="/examenes"  className='home-usuarios-card normal'>
              <TarjetaModulo
                titulo=" Exámenes"
                imagen="https://cle.uncuyo.edu.ar/cache/ad53d5fb9ab5b99dfc2a964e0298c53e_315_600_c.png"
              />
              </Link> 
          )}

          {[1, 2, 3, 5].includes(rol) && (
            <Link to="/finanzas"  className='home-usuarios-card normal'>
              <TarjetaModulo
                titulo="Finanzas y Pagos"
                imagen="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaDyd5BtL8eYqnu79eK6z_IMoS79dFvVxZ9lffc8IZF539TlvT74FbiQw&s=10"
              />
            </Link> 
          )}

          <Link to="/eventos"  className='home-usuarios-card normal'>
            <TarjetaModulo
              titulo="Calendario de Eventos"
              imagen="https://q94ucsbhtqypkbse.public.blob.vercel-storage.com/productos/calendario-escritorio-mini-1778792246729.webp"
            />
          </Link> 
        </div>
      </div>
    </section>
  );
}
