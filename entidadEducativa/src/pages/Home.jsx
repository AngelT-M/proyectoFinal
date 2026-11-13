import { useAuth } from '../auth/useAuth';
import '../style/inicio.css';
import Visitante from '../components/Home/visitante';
import HomeUsuarios from '../components/Home/HomeUsuarios';

export default function Home() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);

  return (
    <main className="contenido" >
      
      {usuario ? (
        <HomeUsuarios usuario={usuario} rol={rol} />
      ) : (
        <Visitante/>
      )}
    </main>
  );
}

