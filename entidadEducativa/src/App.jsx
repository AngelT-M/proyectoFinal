import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import RutaProtegida from './auth/RutaProtegida';

import Home from './pages/Home';
import Sesion from './pages/Sesion';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Personal from './pages/Personal';
import Profesores from './pages/Profesores';
import Estudiantes from './pages/Estudiantes';
import Materias from './pages/Materias';
import Aulas from './pages/Aulas';
import Inscripciones from './pages/Inscripciones';
import Calificaciones from './pages/Calificaciones';
import Asistencias from './pages/Asistencias';
import Examenes from './pages/Examenes';
import Finanzas from './pages/Finanzas';
import Eventos from './pages/Eventos';
import Periodos from './pages/Periodos';
import Contactos from './components/Home/Contactos';
import Ubicacion from './components/Home/Ubicacion';
import Nosotros from './components/Home/Nosotros';

function PaginaNoEncontrada() {
  return (
    <main style={{ padding: '2rem' }}>
      <h2>404 - Página No Encontrada</h2>
      <p>La ruta a la que intentas acceder no existe.</p>
      <Link to="/">Volver al Inicio</Link>
    </main>
  );
}

function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        

        <Route path="/" element={<Home />} />
        <Route path="/sesion" element={<Sesion />} />
        <Route path="/login" element={<Sesion />} />
        <Route path='/contactos' element={<Contactos/>} />
        <Route path='/ubicacion' element={<Ubicacion/>}/>
        <Route path='/nosotros' element={<Nosotros/>}/>
        
        <Route

          path="/dashboard"
          element={
            <RutaProtegida rolesPermitidos={[1]}>
              <Dashboard />
            </RutaProtegida>
          }
        />
        
        <Route
          path="/usuarios"
          element={
            <RutaProtegida rolesPermitidos={[1]}>
              <Usuarios />
            </RutaProtegida>
          }
        />

        <Route
          path="/personal"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3]}>
              <Personal />
            </RutaProtegida>
          }
        />
        <Route
          path="/profesores"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3]}>
              <Profesores />
            </RutaProtegida>
          }
        />
        <Route
          path="/maestros"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3]}>
              <Profesores />
            </RutaProtegida>
          }
        />
        <Route
          path="/inscripciones"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3]}>
              <Inscripciones />
            </RutaProtegida>
          }
        />
        <Route
          path="/asignaciones"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3]}>
              <Inscripciones />
            </RutaProtegida>
          }
        />

        <Route
          path="/estudiantes"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3, 5]}>
              <Estudiantes />
            </RutaProtegida>
          }
        />
        <Route
          path="/alumnos"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3, 5]}>
              <Estudiantes />
            </RutaProtegida>
          }
        />

        <Route
          path="/materias"
          element={
            <RutaProtegida>
              <Materias />
            </RutaProtegida>
          }
        />
        <Route
          path="/cursos"
          element={
            <RutaProtegida>
              <Materias />
            </RutaProtegida>
          }
        />

        <Route
          path="/aulas"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3]}>
              <Aulas />
            </RutaProtegida>
          }
        />
        <Route
          path="/periodos"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3]}>
              <Periodos />
            </RutaProtegida>
          }
        />

       
        <Route
          path="/calificaciones"
          element={
            <RutaProtegida>
              <Calificaciones />
            </RutaProtegida>
          }
        />
        <Route
          path="/evaluaciones"
          element={
            <RutaProtegida>
              <Calificaciones />
            </RutaProtegida>
          }
        />

        <Route
          path="/asistencias"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3, 4]}>
              <Asistencias />
            </RutaProtegida>
          }
        />

        
        <Route
          path="/examenes"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3, 4]}>
              <Examenes />
            </RutaProtegida>
          }
        />

        <Route
          path="/finanzas"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3, 5]}>
              <Finanzas />
            </RutaProtegida>
          }
        />
        <Route
          path="/pagos"
          element={
            <RutaProtegida rolesPermitidos={[1, 2, 3, 5]}>
              <Finanzas />
            </RutaProtegida>
          }
        />

        <Route
          path="/eventos"
          element={
            <RutaProtegida>
              <Eventos />
            </RutaProtegida>
          }
        />
        <Route
          path="/calendario"
          element={
            <RutaProtegida>
              <Eventos />
            </RutaProtegida>
          }
        />

      
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>
    </div>
  );
}

export default App;
