import { useEffect, useState } from 'react';
import { academicoApi } from '../services/api';

function Periodos() {
  const [cicloActual] = useState(() => new Date().getFullYear());
  const [cicloSeleccionado, setCicloSeleccionado] = useState(() => String(new Date().getFullYear()));
  const [bimestres, setBimestres] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardandoId, setGuardandoId] = useState(null);
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    academicoApi.bimestres()
      .then((lista) => setBimestres(Array.isArray(lista) ? lista : []))
      .catch((err) => setError(err.message || 'No fue posible cargar los periodos escolares.'))
      .finally(() => setCargando(false));
  }, []);

  const ciclos = [...new Set([
    ...bimestres.map((bimestre) => String(bimestre.ciclo)),
    String(cicloActual),
    String(cicloActual + 1),
    cicloSeleccionado
  ])].sort((a, b) => Number(b) - Number(a));

  const bimestresCiclo = bimestres
    .filter((bimestre) => String(bimestre.ciclo) === cicloSeleccionado)
    .sort((a, b) => Number(a.orden) - Number(b.orden));

  const cambiarFecha = (id, campo, valor) => {
    setBimestres((lista) => lista.map((bimestre) =>
      String(bimestre.bimestre_id) === String(id)
        ? { ...bimestre, [campo]: valor }
        : bimestre
    ));
  };

  const guardarFechas = async (bimestre) => {
    setError('');
    setMensaje('');
    setGuardandoId(bimestre.bimestre_id);
    try {
      const actualizado = await academicoApi.actualizarFechasBimestre(bimestre.bimestre_id, {
        fecha_inicio: bimestre.fecha_inicio || null,
        fecha_fin: bimestre.fecha_fin || null
      });
      setBimestres((lista) => lista.map((item) =>
        String(item.bimestre_id) === String(actualizado.bimestre_id) ? actualizado : item
      ));
      setMensaje(`Fechas de ${bimestre.nombre} guardadas.`);
    } catch (err) {
      setError(err.message || 'No fue posible guardar las fechas del periodo.');
    } finally {
      setGuardandoId(null);
    }
  };

  const crearCiclo = async () => {
    setError('');
    setMensaje('');
    setCreando(true);
    try {
      const creados = await academicoApi.crearBimestresCiclo({ ciclo: Number(cicloSeleccionado) });
      setBimestres((lista) => [...lista, ...creados]);
      setMensaje(`Se crearon los periodos para el ciclo ${cicloSeleccionado}.`);
    } catch (err) {
      setError(err.message || 'No fue posible crear los periodos del ciclo.');
    } finally {
      setCreando(false);
    }
  };

  return (
    <main>
      <h1>Administración de bimestres</h1>
      <p>Configura las fechas de cada periodo por ciclo escolar. Las fechas deben estar completas y no superponerse.</p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}

      <label>
        Ciclo escolar:{' '}
        <select value={cicloSeleccionado} onChange={(e) => setCicloSeleccionado(e.target.value)}>
          {ciclos.map((ciclo) => <option key={ciclo} value={ciclo}>{ciclo}</option>)}
        </select>
      </label>

      {cargando ? (
        <p>Cargando periodos...</p>
      ) : bimestresCiclo.length === 0 ? (
        <section>
          <p>Este ciclo todavía no tiene periodos configurados.</p>
          <button type="button" onClick={crearCiclo} disabled={creando}>
            {creando ? 'Creando...' : `Crear periodos para ${cicloSeleccionado}`}
          </button>
        </section>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Periodo</th>
                <th>Fecha de inicio</th>
                <th>Fecha final</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {bimestresCiclo.map((bimestre) => (
                <tr key={bimestre.bimestre_id}>
                  <td>{bimestre.nombre}</td>
                  <td>
                    <input
                      type="date"
                      value={bimestre.fecha_inicio || ''}
                      onChange={(e) => cambiarFecha(bimestre.bimestre_id, 'fecha_inicio', e.target.value)}
                      aria-label={`Inicio de ${bimestre.nombre}`}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={bimestre.fecha_fin || ''}
                      onChange={(e) => cambiarFecha(bimestre.bimestre_id, 'fecha_fin', e.target.value)}
                      aria-label={`Fin de ${bimestre.nombre}`}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => guardarFechas(bimestre)}
                      disabled={guardandoId !== null}
                    >
                      {guardandoId === bimestre.bimestre_id ? 'Guardando...' : 'Guardar fechas'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Las fechas de Recuperación son opcionales; los demás periodos pueden configurarse cuando el calendario esté definido.</p>
        </div>
      )}
    </main>
  );
}

export default Periodos;
