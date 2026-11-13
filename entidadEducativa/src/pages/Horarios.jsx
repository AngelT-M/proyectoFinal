import { useEffect, useState } from 'react';
import { getHorarios, deleteHorario } from '../services/api';
import HorarioCard from '../components/Horarios/HorarioCard';

function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [filtros, setFiltros] = useState({ dia: '' });

  const cargar = async () => {
    const params = {};
    if (filtros.dia) params.dia = filtros.dia;
    const res = await getHorarios(params);
    setHorarios(res.data);
  };

  useEffect(() => { cargar(); }, []);

  const handleEliminar = async (id) => {
    await deleteHorario(id);
    cargar();
  };

  return (
    <div>
      <h1>Horarios</h1>
      <input placeholder="Día" value={filtros.dia} onChange={e => setFiltros({...filtros, dia: e.target.value})} />
      <button onClick={cargar}>Buscar</button>
      {horarios.map(h => (
        <HorarioCard key={h.id} horario={h} onEliminar={handleEliminar} />
      ))}
    </div>
  );
}

export default Horarios;
