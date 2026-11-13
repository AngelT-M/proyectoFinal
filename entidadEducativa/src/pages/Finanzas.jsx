import { useEffect, useState } from 'react';
import { finanzasApi, academicoApi, alumnoApi } from '../services/api';
import { useAuth } from '../auth/useAuth';
import ConsultaCargos from '../components/Finanzas/ConsultaCargos';
import FormularioPago from '../components/Finanzas/FormularioPago';
import FormularioTipoPago from '../components/Finanzas/FormularioTipoPago';
import FormularioCargosMasivos from '../components/Finanzas/FormularioCargosMasivos';
import ConsultaComprobante from '../components/Finanzas/ConsultaComprobante';

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

  const handleCambiarGradoCargos = (gradoId) => {
    setTiposPago([]);
    setErrorTiposPago('');
    setCargandoTiposPago(true);
    setNuevoCargoMasivo((actual) => ({
      ...actual,
      grado_id: gradoId,
      pago_id: ''
    }));
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Control de Finanzas y Pagos</h1>

      {mensaje && <p role="status" style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p role="alert" style={{ color: 'red' }}>{error}</p>}


      <ConsultaCargos
        esAlumno={esAlumno}
        esSecretaria={esSecretaria}
        listaAlumnos={listaAlumnos}
        idAlumnoConsulta={idAlumnoConsulta}
        setIdAlumnoConsulta={setIdAlumnoConsulta}
        cargarCargos={cargarCargos}
        cargandoCargos={cargandoCargos}
        cargos={cargos}
        setPago={setPago}
      />


      {esSecretaria && (
        <FormularioPago
          pago={pago}
          setPago={setPago}
          cargos={cargos}
          onSubmit={handleRealizarPago}
        />
      )}

      {/* Sección 3: Generar Cargos Masivos por Grado (Roles 1, 2, 3) */}
      {esGestionador && (
        <>
          <FormularioTipoPago
            grados={grados}
            gradoConfigId={gradoConfigId}
            setGradoConfigId={setGradoConfigId}
            nuevoTipoPago={nuevoTipoPago}
            setNuevoTipoPago={setNuevoTipoPago}
            tipoPagoMensaje={tipoPagoMensaje}
            tipoPagoError={tipoPagoError}
            guardandoTipoPago={guardandoTipoPago}
            nuevoCargoMasivo={nuevoCargoMasivo}
            onSubmit={handleCrearTipoPago}
          />
          <FormularioCargosMasivos
            nuevoCargoMasivo={nuevoCargoMasivo}
            setNuevoCargoMasivo={setNuevoCargoMasivo}
            tiposPago={tiposPago}
            grados={grados}
            cargandoTiposPago={cargandoTiposPago}
            errorTiposPago={errorTiposPago}
            onCambiarGrado={handleCambiarGradoCargos}
            onSubmit={handleGenerarCargos}
          />
          <ConsultaComprobante
            idPagoComprobante={idPagoComprobante}
            onSeleccionarComprobante={(id) => {
              setIdPagoComprobante(id);
              setComprobante(null);
            }}
            listaComprobantes={listaComprobantes}
            cargandoComprobante={cargandoComprobante}
            comprobante={comprobante}
            onSubmit={handleConsultarComprobante}
          />
        </>
      )}
    </main>
  );
}

export default Finanzas;
