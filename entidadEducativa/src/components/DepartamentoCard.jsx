function DepartamentoCard({ departamento, onEliminar }) {
  return (
    <div>
      <h3>{departamento.nombre}</h3>
      <p>Descripción: {departamento.descripcion}</p>
      <button onClick={() => onEliminar(departamento.id)}>Eliminar</button>
    </div>
  );
}

export default DepartamentoCard;
