export default function TarjetaModulo({ titulo, imagen }) {
  return (
    <div className='usuario-card'>
      <div className='usuario-img'>
        <img src={imagen} alt={titulo} />
      </div>
      <div className='centrar normal'>
        <h2>{titulo}</h2>
      </div>
    </div>
  );
}
