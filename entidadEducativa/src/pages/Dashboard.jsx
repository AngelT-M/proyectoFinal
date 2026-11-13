import { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';
import '../style/usuarios.css';
import '../style/dashboard.css';

function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarResumen = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await dashboardApi.resumen();
      setResumen(data);
    } catch (err) {
      setError(err.message || 'Error al cargar el resumen del dashboard.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarResumen();
  }, []);

  return (
    <main className='iniciarS menos' >
      {cargando && <p role="status">Cargando métricas del sistema...</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      {!cargando && resumen && (
        <section className=' contF dashboard ' >
          <h2>Resumen Institucional</h2>
          <ul className='dashboard-centrar' >
            {Object.entries(resumen).map(([clave, valor]) => {
              if (typeof valor === 'object' && valor !== null) {
                return (
                  <li key={clave}>
                    <strong>{clave.replace(/_/g, ' ').toUpperCase()}:</strong>
                    <ul>
                      {Object.entries(valor).map(([subK, subV]) => (
                        <li key={subK}>
                          {subK.replace(/_/g, ' ')}: <strong>{String(subV)}</strong>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return (
                <li key={clave}>
                  <strong>{clave.replace(/_/g, ' ').toUpperCase()}:</strong> {String(valor)}
                </li>
              );
            })}
          </ul>

          <button type="button" className='sesion'  onClick={cargarResumen}>Actualizar Métricas</button>
        </section>
      )}
    </main>
  );
}

export default Dashboard;

