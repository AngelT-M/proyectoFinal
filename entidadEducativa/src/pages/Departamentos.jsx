import { useEffect, useState } from 'react';
import { getDepartamentos, deleteDepartamento } from '../services/api';
import DepartamentoCard from '../components/DepartamentoCard';

function Departamentos() {
  const [departamentos, setDepartamentos] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: '' });

  const cargar = async () => {
    const params = {};
    if (filtros.nombre) params.nombre = filtros.nombre;
    const res = await getDepartamentos(params);
    setDepartamentos(res.data);
  };

  useEffect(() => { cargar(); }, []);

  const handleEliminar = async (id) => {
    await deleteDepartamento(id);
    cargar();
  };

  return (
    <div>
      <h1>Departamentos</h1>
      <input placeholder="Nombre" value={filtros.nombre} onChange={e => setFiltros({...filtros, nombre: e.target.value})} />
      <button onClick={cargar}>Buscar</button>
      {departamentos.map(d => (
        <DepartamentoCard key={d.id} departamento={d} onEliminar={handleEliminar} />
      ))}
    </div>
  );
}

export default Departamentos;
