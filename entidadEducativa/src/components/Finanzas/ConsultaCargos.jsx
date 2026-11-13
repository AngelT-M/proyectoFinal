export default function ConsultaCargos({
  esAlumno,
  esSecretaria,
  listaAlumnos,
  idAlumnoConsulta,
  setIdAlumnoConsulta,
  cargarCargos,
  cargandoCargos,
  cargos,
  setPago
}) {
  return (
    <section>
      <h2>{esAlumno ? 'Mi Estado de Cuenta y Pagos' : 'Consultar Cargos por Estudiante'}</h2>
      {!esAlumno && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            cargarCargos(idAlumnoConsulta);
          }}
        >
          <label>
            Seleccionar Estudiante:{' '}
            <select
              value={idAlumnoConsulta}
              onChange={(e) => {
                setIdAlumnoConsulta(e.target.value);
                setPago({ cargo_id: '', concepto: '', monto_pagado: '' });
                cargarCargos(e.target.value);
              }}
            >
              <option value="">-- Selecciona un estudiante --</option>
              {listaAlumnos.map((alumno) => (
                <option key={alumno.alumno_id} value={alumno.alumno_id}>
                  {alumno.nombre} {alumno.apellido} (Carné: {alumno.carne})
                </option>
              ))}
            </select>
          </label>
          {' '}
          <button className="sesion" type="submit">Consultar Estado de Cuenta</button>
        </form>
      )}

      {cargandoCargos && <p>Cargando información de cobros...</p>}
      {cargos.length > 0 && (
        <table className="tablaUsuarios">
          <thead className="encabezado">
            <tr>
              <th>Concepto de Cobro</th>
              <th>Estudiante</th>
              <th>Grado y Sección</th>
              <th>Monto Total</th>
              <th>Saldo Pendiente</th>
              <th>Fecha Límite</th>
              <th>Estado</th>
              {esSecretaria && <th>Acción</th>}
            </tr>
          </thead>
          <tbody className="tablacontenido">
            {cargos.map((cargo) => (
              <tr key={cargo.cargo_id}>
                <td><strong>{cargo.descripcion || `Cuota #${cargo.cargo_id}`}</strong></td>
                <td>
                  {cargo.alumno_nombre ? `${cargo.alumno_nombre} ${cargo.alumno_apellido}` : 'Estudiante'}
                  {cargo.carne ? ` (${cargo.carne})` : ''}
                </td>
                <td>{cargo.nom_grado ? `${cargo.nom_grado} - Secc. ${cargo.nom_seccion}` : 'Grado escolar'}</td>
                <td>Q {Number(cargo.monto_cobrar).toFixed(2)}</td>
                <td style={{ color: Number(cargo.saldo_pendiente) > 0 ? '#b42318' : 'green', fontWeight: 'bold' }}>
                  Q {Number(cargo.saldo_pendiente ?? cargo.monto_cobrar).toFixed(2)}
                </td>
                <td>{cargo.fecha_vencimiento}</td>
                <td><strong>{cargo.estado}</strong></td>
                {esSecretaria && (
                  <td>
                    {cargo.estado !== 'PAGO_TOTAL' ? (
                      <button
                        className="sesion"
                        type="button"
                        onClick={() => setPago({
                          cargo_id: cargo.cargo_id,
                          concepto: cargo.descripcion || `Cargo #${cargo.cargo_id}`,
                          monto_pagado: cargo.saldo_pendiente || cargo.monto_cobrar
                        })}
                      >
                        Cobrar
                      </button>
                    ) : (
                      <span>Solvente</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
