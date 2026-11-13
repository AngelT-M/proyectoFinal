export default function ListadoEventos({ eventos, cargando }) {
  return (
    <section className="lisUsuarios">
      <h2>Próximos Eventos y Fechas Clave</h2>
      {cargando ? (
        <p>Cargando eventos...</p>
      ) : (
        <table className="tablaUsuarios">
          <thead className="encabezado">
            <tr>
              <th>Tipo</th>
              <th>Título</th>
              <th>Fecha Inicio</th>
              <th>Fecha Final</th>
              <th>Nivel</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody className="tablacontenido">
            {eventos.map((evento) => (
              <tr key={evento.actividad_id}>
                <td><strong>{evento.tipo_evento}</strong></td>
                <td>{evento.titulo}</td>
                <td>{evento.fecha_inicio}</td>
                <td>{evento.fecha_final}</td>
                <td>{evento.nom_nivel || 'General'}</td>
                <td>{evento.descripcion || '-'}</td>
              </tr>
            ))}
            {eventos.length === 0 && (
              <tr>
                <td colSpan="6">No hay eventos agendados en el calendario.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
