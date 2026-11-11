import { useEffect, useState } from 'react';
import { finanzasApi, academicoApi, alumnoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';

function Finanzas() {
  const { usuario } = useAuth();
  const rol = Number(usuario?.rol_id || 0);

  const esAlumno = rol === 5;
  const esSecretaria = rol === 3;
  const esGestionador = [1, 2, 3].includes(rol);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Estados Consulta de Cargos
  const [idAlumnoConsulta, setIdAlumnoConsulta] = useState('');
  const [cargos, setCargos] = useState([]);
  const [cargandoCargos, setCargandoCargos] = useState(false);
  const [listaAlumnos, setListaAlumnos] = useState([]);

  // Estados Generar Cargos por Grado (Roles 1, 2, 3)
  const [grados, setGrados] = useState([]);
  const [gradoConfigId, setGradoConfigId] = useState('');
  const [tiposPago, setTiposPago] = useState([]);
  const [cargandoTiposPago, setCargandoTiposPago] = useState(false);
  const [errorTiposPago, setErrorTiposPago] = useState('');
  const [guardandoTipoPago, setGuardandoTipoPago] = useState(false);
  const [tipoPagoMensaje, setTipoPagoMensaje] = useState('');
  const [tipoPagoError, setTipoPagoError] = useState('');
  const [nuevoTipoPago, setNuevoTipoPago] = useState({
    descripcion: '',
    cantidad_pagos: '1',
    monto_base: ''
  });
  const [nuevoCargoMasivo, setNuevoCargoMasivo] = useState({
    pago_id: '',
    grado_id: '',
    fecha_vencimiento: ''
  });

  // Estados Cobro / Realizar Pago (Solo Secretaría - Rol 3)
  const [pago, setPago] = useState({
    cargo_id: '',
    concepto: '',
    monto_pagado: ''
  });

  // Estados Comprobante
  const [idPagoComprobante, setIdPagoComprobante] = useState('');
  const [listaComprobantes, setListaComprobantes] = useState([]);
  const [comprobante, setComprobante] = useState(null);
  const [cargandoComprobante, setCargandoComprobante] = useState(false);

  useEffect(() => {
    if (esAlumno) {
      const alumnoId = usuario?.perfil?.alumno_id || usuario?.id_usuario;
      cargarCargos(alumnoId);
    } else {
      if (esGestionador) {
        finanzasApi.comprobantes().then((data) => {
          if (Array.isArray(data)) setListaComprobantes(data);
        }).catch((err) => setError(err.message || 'Error al cargar comprobantes.'));
      }

      alumnoApi.mostrar().then((data) => {
        if (Array.isArray(data)) setListaAlumnos(data);
      }).catch(() => {});

      academicoApi.grados().then((data) => {
        if (Array.isArray(data)) {
          setGrados(data);
          if (data[0]) {
            const primerGradoId = String(data[0].grado_id);
            setGradoConfigId(primerGradoId);
            setNuevoCargoMasivo((prev) => ({ ...prev, grado_id: primerGradoId }));
          }
        }
      }).catch((err) => setError(err.message || 'Error al cargar los grados.'));
    }
  }, [esAlumno, esGestionador, usuario]);

  useEffect(() => {
    if (!esGestionador || !nuevoCargoMasivo.grado_id) return undefined;

    let solicitudVigente = true;
    setCargandoTiposPago(true);
    setErrorTiposPago('');
    finanzasApi.pagosPorGrado(nuevoCargoMasivo.grado_id)
      .then((data) => {
        if (solicitudVigente) setTiposPago(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (solicitudVigente) {
          setTiposPago([]);
          setErrorTiposPago(err.message || 'Error al cargar las cuotas del grado.');
        }
      })
      .finally(() => {
        if (solicitudVigente) setCargandoTiposPago(false);
      });

    return () => {
      solicitudVigente = false;
    };
  }, [esGestionador, nuevoCargoMasivo.grado_id]);

  const cargarCargos = async (idAlumno) => {
    if (!idAlumno) return;
    setCargandoCargos(true);
    setError('');
    try {
      const data = await finanzasApi.cargosAlumnos(idAlumno);
      setCargos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al consultar los cargos del estudiante.');
      setCargos([]);
    } finally {
      setCargandoCargos(false);
    }
  };

  const handleGenerarCargos = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await finanzasApi.generarAcargo({
        pago_id: Number(nuevoCargoMasivo.pago_id),
        grado_id: Number(nuevoCargoMasivo.grado_id),
        fecha_vencimiento: nuevoCargoMasivo.fecha_vencimiento
      });
      setMensaje('Cargos generados exitosamente para los alumnos del grado.');
    } catch (err) {
      setError(err.message || 'Error al generar cargos por grado.');
    }
  };

  const handleCrearTipoPago = async (e) => {
    e.preventDefault();
    setTipoPagoMensaje('');
    setTipoPagoError('');
    setGuardandoTipoPago(true);
    try {
      const creado = await finanzasApi.crearPago({
        ...nuevoTipoPago,
        cantidad_pagos: Number(nuevoTipoPago.cantidad_pagos),
        monto_base: Number(nuevoTipoPago.monto_base),
        grado_id: Number(gradoConfigId)
      });
      setNuevoTipoPago({ descripcion: '', cantidad_pagos: '1', monto_base: '' });
      if (String(gradoConfigId) === String(nuevoCargoMasivo.grado_id)) {
        setTiposPago((actuales) => [...actuales, creado]);
        setNuevoCargoMasivo((actual) => ({ ...actual, pago_id: String(creado.pago_id) }));
        setTipoPagoMensaje('Cuota creada y seleccionada para generar cargos en este grado.');
      } else {
        setTipoPagoMensaje('Cuota creada. Selecciona ese mismo grado en la sección de generación para usarla.');
      }
    } catch (err) {
      setTipoPagoError(err.message || 'Error al crear la cuota.');
    } finally {
      setGuardandoTipoPago(false);
    }
  };

  const handleRealizarPago = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      const res = await finanzasApi.realizarPago({
        cargo_id: Number(pago.cargo_id),
        monto_pagado: Number(pago.monto_pagado)
      });
      setMensaje('Pago recibido y procesado con éxito.');
      setPago({ cargo_id: '', concepto: '', monto_pagado: '' });
      if (res?.pago_realizado_id) {
        setIdPagoComprobante(res.pago_realizado_id);
        const recibos = await finanzasApi.comprobantes();
        setListaComprobantes(Array.isArray(recibos) ? recibos : []);
      }
      if (idAlumnoConsulta) cargarCargos(idAlumnoConsulta);
    } catch (err) {
      setError(err.message || 'Error al procesar el pago.');
    }
  };

  const handleConsultarComprobante = async (e) => {
    e.preventDefault();
    if (!idPagoComprobante) return;
    setCargandoComprobante(true);
    setError('');
    try {
      const data = await finanzasApi.comprobante(idPagoComprobante);
      setComprobante(data);
    } catch (err) {
      setError(err.message || 'Error al consultar el comprobante.');
      setComprobante(null);
    } finally {
      setCargandoComprobante(false);
    }
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Control de Finanzas y Pagos</h1>
      <p>Gestión de colegiaturas, cargos, pagos de matrícula y emisión de recibos.</p>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}


      <section >
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
                {listaAlumnos.map((a) => (
                  <option key={a.alumno_id} value={a.alumno_id}>
                    {a.nombre} {a.apellido} (Carné: {a.carne})
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
          <table className='tablaUsuarios'>
            <thead className='encabezado' >
              <tr >
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
            <tbody className='tablacontenido' >
              {cargos.map((c) => (
                <tr key={c.cargo_id}>
                  <td><strong>{c.descripcion || `Cuota #${c.cargo_id}`}</strong></td>
                  <td>
                    {c.alumno_nombre ? `${c.alumno_nombre} ${c.alumno_apellido}` : 'Estudiante'}
                    {c.carne ? ` (${c.carne})` : ''}
                  </td>
                  <td>
                    {c.nom_grado ? `${c.nom_grado} - Secc. ${c.nom_seccion}` : 'Grado escolar'}
                  </td>
                  <td>Q {Number(c.monto_cobrar).toFixed(2)}</td>
                  <td style={{ color: Number(c.saldo_pendiente) > 0 ? '#b42318' : 'green', fontWeight: 'bold' }}>
                    Q {Number(c.saldo_pendiente ?? c.monto_cobrar).toFixed(2)}
                  </td>
                  <td>{c.fecha_vencimiento}</td>
                  <td>
                    <strong>{c.estado}</strong>
                  </td>
                  {esSecretaria && (
                    <td>
                      {c.estado !== 'PAGO_TOTAL' ? (
                        <button
                          className="sesion"
                          type="button"
                          onClick={() => setPago({
                            cargo_id: c.cargo_id,
                            concepto: c.descripcion || `Cargo #${c.cargo_id}`,
                            monto_pagado: c.saldo_pendiente || c.monto_cobrar
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


      {esSecretaria && (
        <section style={{ marginBottom: '2rem' }}>
          <h2>Caja: Registrar Cobro de Pago </h2>
          <form onSubmit={handleRealizarPago}>
            <p>
              {pago.concepto ? (
                <span>Concepto seleccionado: <strong>{pago.concepto}</strong></span>
              ) : (
                <span><em>Selecciona un cargo pendiente de la lista o usa el botón Cobrar en la tabla superior.</em></span>
              )}
            </p>
            <label>
              Cargo pendiente:
              <select
                required
                value={pago.cargo_id}
                onChange={(e) => {
                  const cargo = cargos.find((item) => String(item.cargo_id) === e.target.value);
                  setPago({
                    ...pago,
                    cargo_id: e.target.value,
                    concepto: cargo?.descripcion || `Cargo de ${cargo?.alumno_nombre || 'estudiante'}`,
                    monto_pagado: cargo?.saldo_pendiente || cargo?.monto_cobrar || ''
                  });
                }}
              >
                <option value="">-- Selecciona un cargo pendiente --</option>
                {cargos
                  .filter((cargo) => cargo.estado !== 'PAGO_TOTAL')
                  .map((cargo) => (
                    <option key={cargo.cargo_id} value={cargo.cargo_id}>
                      {cargo.descripcion || 'Cargo escolar'} — Q
                      {Number(cargo.saldo_pendiente ?? cargo.monto_cobrar).toFixed(2)}
                      {cargo.alumno_nombre ? ` — ${cargo.alumno_nombre} ${cargo.alumno_apellido}` : ''}
                    </option>
                  ))}
              </select>
            </label>
            <br /><br />
            <label>
              Monto a Pagar (Q):{' '}
              <input
                type="number"
                step="0.01"
                required
                min={1}
                placeholder="Ej. 450.00"
                value={pago.monto_pagado}
                onChange={(e) => setPago({ ...pago, monto_pagado: e.target.value })}
              />
            </label>
            <br /><br />
            <button className="sesion" type="submit">Emitir Recibo de Pago</button>
          </form>
        </section>
      )}

      {/* Sección 3: Generar Cargos Masivos por Grado (Roles 1, 2, 3) */}
      {esGestionador && (
        <>
          <section style={{ marginBottom: '2rem' }}>
            <h2>Configurar cuota para un grado</h2>
            <p>
              Define un concepto y su monto. La cuota quedará asociada al grado seleccionado
              y estará disponible para generar cargos masivos.
            </p>
            <form onSubmit={handleCrearTipoPago}>
              <label>
                Grado Escolar:{' '}
                <select
                  required
                  value={gradoConfigId}
                  onChange={(e) => setGradoConfigId(e.target.value)}
                >
                  {grados.map((g) => (
                    <option key={g.grado_id} value={g.grado_id}>
                      {g.nom_grado} {g.nom_nivel ? `(${g.nom_nivel})` : ''}
                    </option>
                  ))}
                </select>
              </label>
              <br /><br />
              <label>
                Concepto de la cuota:{' '}
                <input
                  type="text"
                  required
                  maxLength={150}
                  placeholder="Ej. Colegiatura mensual"
                  value={nuevoTipoPago.descripcion}
                  onChange={(e) => setNuevoTipoPago({ ...nuevoTipoPago, descripcion: e.target.value })}
                />
              </label>
              <br /><br />
              <label>
                Cantidad de pagos:{' '}
                <input
                  type="number"
                  required
                  min={1}
                  step={1}
                  value={nuevoTipoPago.cantidad_pagos}
                  onChange={(e) => setNuevoTipoPago({ ...nuevoTipoPago, cantidad_pagos: e.target.value })}
                />
              </label>
              <br /><br />
              <label>
                Monto por pago (Q):{' '}
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={nuevoTipoPago.monto_base}
                  onChange={(e) => setNuevoTipoPago({ ...nuevoTipoPago, monto_base: e.target.value })}
                />
              </label>
              <br /><br />
              {tipoPagoMensaje && <p role="status" style={{ color: 'green' }}>{tipoPagoMensaje}</p>}
              {tipoPagoError && <p role="alert" style={{ color: 'red' }}>{tipoPagoError}</p>}
              <button
                className="sesion"
                type="submit"
                disabled={guardandoTipoPago || !nuevoCargoMasivo.grado_id}
              >
                {guardandoTipoPago ? 'Guardando cuota...' : 'Crear cuota'}
              </button>
            </form>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2>Generar Cargos Masivos a Alumnos por Grado</h2>
            <form onSubmit={handleGenerarCargos}>
              <label>
                Tipo de Cuota / Pago:{' '}
                <select
                  required
                  value={nuevoCargoMasivo.pago_id}
                  onChange={(e) => setNuevoCargoMasivo({ ...nuevoCargoMasivo, pago_id: e.target.value })}
                  disabled={cargandoTiposPago || tiposPago.length === 0}
                >
                  <option value="">
                    {cargandoTiposPago
                      ? 'Cargando cuotas del grado...'
                      : tiposPago.length
                        ? '-- Selecciona una cuota --'
                        : 'No hay cuotas configuradas para este grado'}
                  </option>
                  {tiposPago.map((tipo) => (
                    <option key={tipo.pago_id} value={tipo.pago_id}>
                      {tipo.descripcion} — Q {Number(tipo.monto_base).toFixed(2)}
                    </option>
                  ))}
                </select>
              </label>
              <br /><br />
              <label>
                Grado Escolar:{' '}
                <select
                  required
                  value={nuevoCargoMasivo.grado_id}
                  onChange={(e) => {
                    setTiposPago([]);
                    setErrorTiposPago('');
                    setCargandoTiposPago(true);
                    setNuevoCargoMasivo({
                      ...nuevoCargoMasivo,
                      grado_id: e.target.value,
                      pago_id: ''
                    });
                  }}
                >
                  {grados.map((g) => (
                    <option key={g.grado_id} value={g.grado_id}>
                      {g.nom_grado} {g.nom_nivel ? `(${g.nom_nivel})` : ''}
                    </option>
                  ))}
                </select>
              </label>
              <br /><br />
              <label>
                Fecha Límite de Pago (Vencimiento):{' '}
                <input
                  type="date"
                  required
                  value={nuevoCargoMasivo.fecha_vencimiento}
                  onChange={(e) => setNuevoCargoMasivo({ ...nuevoCargoMasivo, fecha_vencimiento: e.target.value })}
                />
              </label>
              {errorTiposPago && <p role="alert">{errorTiposPago}</p>}
              {!cargandoTiposPago && !errorTiposPago && grados.length > 0 && tiposPago.length === 0 && (
                <p>No hay cuotas registradas para este grado. Selecciona otro grado o configura una cuota para este grado.</p>
              )}
              <br /><br />
              <button
                className="sesion"
                type="submit"
                disabled={cargandoTiposPago || tiposPago.length === 0 || !nuevoCargoMasivo.pago_id}
              >
                Generar Cargos para los Alumnos de este Grado
              </button>
            </form>
          </section>

          <section>
            <h2>Consultar Comprobante de Pago Oficial</h2>
            <form onSubmit={handleConsultarComprobante}>
              <label>
                Comprobante de pago:
                <select
                  required
                  value={idPagoComprobante}
                  onChange={(e) => {
                    setIdPagoComprobante(e.target.value);
                    setComprobante(null);
                  }}
                >
                  <option value="">-- Selecciona un comprobante --</option>
                  {listaComprobantes.map((recibo) => (
                    <option key={recibo.pago_realizado_id} value={recibo.pago_realizado_id}>
                      {recibo.alumno_nombre} {recibo.alumno_apellido} — {recibo.concepto}
                      {' '}— {recibo.fecha_pago} — Q{Number(recibo.monto_pagado).toFixed(2)}
                    </option>
                  ))}
                </select>
              </label>
              {listaComprobantes.length === 0 && <p>No hay comprobantes disponibles.</p>}
              {' '}
              <button className="sesion" type="submit">Ver Comprobante</button>
            </form>

            {cargandoComprobante && <p>Buscando recibo...</p>}

            {comprobante && (
              <fieldset style={{ marginTop: '1rem', padding: '1rem' }}>
                <legend><strong>Comprobante Oficial de Caja #{comprobante.pago_realizado_id}</strong></legend>
                <p><strong>Estudiante:</strong> {comprobante.alumno_nombre} {comprobante.alumno_apellido} (Carné: {comprobante.carne})</p>
                <p><strong>Concepto:</strong> {comprobante.concepto}</p>
                <p><strong>Monto Pagado:</strong> Q {Number(comprobante.monto_pagado).toFixed(2)}</p>
                <p><strong>Fecha de Pago:</strong> {comprobante.fecha_pago}</p>
                <p><strong>Encargado:</strong> {comprobante.nom_encargado} (Tel: {comprobante.tel_encargado})</p>
                <p><strong>Atendido por:</strong> {comprobante.cobrador_nombre} {comprobante.cobrador_apellido}</p>
              </fieldset>
            )}
          </section>
        </>
      )}
    </main>
  );
}

export default Finanzas;
