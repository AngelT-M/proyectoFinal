const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost/fs2026/entidad_educativa_api/public/api';

export function obToken() { return localStorage.getItem('token'); }
export function guarToken(t) { localStorage.setItem('token', t); }
export function delToken() { localStorage.removeItem('token'); }

async function peticion(ruta, { metodo = 'GET', datos, conToken = true } = {}) {
    const Header = { 'Content-Type': 'application/json', Accept: 'application/json' };

    if (conToken) {
        const token = obToken();
        if (token) Header['Authorization'] = `Bearer ${token}`;
    }

    const respuesta = await fetch(`${BASE_URL}/${ruta}`, {
        method: metodo,
        headers: Header,
        body: datos ? JSON.stringify(datos) : undefined
    }).catch(() => {
        throw new Error('No hay conexion al servidor API (' + BASE_URL + ')');
    });

    if (respuesta.status === 204) return null;

    const json = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        const smg = json?.mensaje ?? json?.message ?? json?.error ?? respuesta.statusText;
        const error = new Error(typeof smg === 'string' ? smg : JSON.stringify(smg));
        error.status = respuesta.status;
        error.data = json;
        throw error;
    }

    if (json?.datos !== undefined) return json.datos;
    if (json?.data !== undefined) return json.data;
    return json;
}

function CrudApi(ruta) {
    return {
        mostrar: (params) => {
            const query = params ? '?' + new URLSearchParams(params).toString() : '';
            return peticion(`${ruta}${query}`);
        },
        buscar: (id) => peticion(`${ruta}/${id}`),
        crear: (datos) => peticion(ruta, { metodo: 'POST', datos }),
        actualizar: (id, datos) => peticion(`${ruta}/${id}`, { metodo: 'PUT', datos }),
        eliminar: (id) => peticion(`${ruta}/${id}`, { metodo: 'DELETE' })
    };
}

export const authApi = {
    login: (datos) => peticion('auth/login', { metodo: 'POST', datos, conToken: false }),
    logout: () => peticion('auth/logout', { metodo: 'POST' }),
    me: () => peticion('auth/me')
};

export const authAnteriorApi = {
    login: (datos) => peticion('autenticacion/login', { metodo: 'POST', datos, conToken: false }),
    logout: () => peticion('autenticacion/logout', { metodo: 'POST' })
};

export const usuarioApi = {
    ...CrudApi('usuarios'),
    disponibles: (recurso, rolId) => {
        const params = new URLSearchParams({ recurso });
        if (rolId) params.set('rol_id', rolId);
        return peticion(`usuarios/disponibles?${params.toString()}`);
    },
    cambiarContrasena: (id, datos) => peticion(`usuarios/${id}/password`, { metodo: 'PUT', datos })
};

export const alumnoApi = {
    ...CrudApi('alumnos'),
    usuariosDisponibles: () => usuarioApi.disponibles('alumnos')
};
export const maestroApi = {
    ...CrudApi('maestros'),
    usuariosDisponibles: () => usuarioApi.disponibles('maestros')
};
export const personalApi = {
    ...CrudApi('personal'),
    usuariosDisponibles: () => usuarioApi.disponibles('personal')
};

export const academicoApi = {
    niveles: () => peticion('academico/niveles'),
    nieveles: () => peticion('academico/niveles'),
    grados: () => peticion('academico/grados'),
    secciones: () => peticion('academico/secciones'),
    cursos: () => peticion('academico/cursos'),
    gradosSecciones: () => peticion('academico/grados-secciones'),
    bimestres: (ciclo) => {
        const query = ciclo ? `?ciclo=${encodeURIComponent(ciclo)}` : '';
        return peticion(`academico/bimestres${query}`);
    },

    crearCurso: (datos) => peticion('academico/cursos', { metodo: 'POST', datos }),
    actualizarCurso: (id, datos) => peticion(`academico/cursos/${id}`, { metodo: 'PUT', datos }),
    crearBimestresCiclo: (datos) => peticion('academico/bimestres', { metodo: 'POST', datos }),
    actualizarFechasBimestre: (id, datos) => peticion(`academico/bimestres/${id}`, { metodo: 'PUT', datos }),
    abrirAula: (datos) => peticion('academico/grados-secciones', { metodo: 'POST', datos }),
    eliminarAula: (id) => peticion(`academico/grados-secciones/${id}`, { metodo: 'DELETE' }),
    asignarAlumno: (datos) => peticion('academico/asignaciones/alumnos', { metodo: 'POST', datos }),
    asignarMaestro: (datos) => peticion('academico/asignaciones/maestros', { metodo: 'POST', datos }),
    asignacionesMaestros: () => peticion('academico/asignaciones/maestros')
};

export const evaluacionesApi = {
    actividadesPorCurso: (idAcm) => peticion(`evaluaciones/cursos/${idAcm}/actividades`),
    crearActividad: (idAcm, datos) => peticion(`evaluaciones/cursos/${idAcm}/actividades`, { metodo: 'POST', datos }),
    calificar: (datos) => peticion('evaluaciones/calificaciones', { metodo: 'POST', datos }),
    calificacionesActividad: (idActividad) => peticion(`evaluaciones/actividades/${idActividad}/calificaciones`),
    boletaAlumno: (idAlumno) => peticion(`evaluaciones/alumnos/${idAlumno}/boleta`),

    activiadCursoAlter: (idAcm) => peticion(`cursos/${idAcm}/actividades`),
    crearActividadAlter: (idAcm, datos) => peticion(`cursos/${idAcm}/actividades`, { metodo: 'POST', datos }),
    calificarAlter: (datos) => peticion('calificaciones', { metodo: 'POST', datos }),
    boleteaAlumnoAlter: (idAlumno) => peticion(`alumnos/${idAlumno}/boleta`)
};

export const asistenciaApi = {
    conuslAulaFecha: (idAula, fecha) => {
        const paramFecha = fecha ? `?fecha=${encodeURIComponent(fecha)}` : '';
        return peticion(`asistencia/grado-seccion/${idAula}${paramFecha}`);
    },
    consultarPorAulaYFecha: (idAula, fecha) => {
        const paramFecha = fecha ? `?fecha=${encodeURIComponent(fecha)}` : '';
        return peticion(`asistencia/grado-seccion/${idAula}${paramFecha}`);
    },
    consulHistorialAlumno: (idAlumno) => peticion(`alumnos/${idAlumno}/asistencia`),
    consultarHistorialAlumno: (idAlumno) => peticion(`alumnos/${idAlumno}/asistencia`),
    crear: (datos) => peticion('asistencia', { metodo: 'POST', datos })
};

export const examenesApi = {
    listar: () => peticion('examenes'),
    crear: (datos) => peticion('examenes', { metodo: 'POST', datos }),
    autorizar: (id, estado) => peticion(`examenes/${id}/autorizar`, { metodo: 'PUT', datos: { estado } })
};

export const finanzasApi = {
    cargosAlumnos: (idAlumno) => peticion(`alumnos/${idAlumno}/cargos`),
    generarAcargo: (datos) => peticion('cargos-alumnos/generar', { metodo: 'POST', datos }),
    generarCargo: (datos) => peticion('cargos-alumnos/generar', { metodo: 'POST', datos }),
    realizarPago: (datos) => peticion('pagos/realizar', { metodo: 'POST', datos }),
    comprobante: (idPago) => peticion(`pagos/comprobante/${idPago}`),
    comprobantes: () => peticion('pagos/comprobantes'),

    calendario: () => peticion('calendario'),
    crearEventoCalendario: (datos) => peticion('calendario', { metodo: 'POST', datos })
};

export const dashboardApi = {
    resumen: () => peticion('dashboard/resumen')
};

export default {
    authApi,
    usuarioApi,
    alumnoApi,
    maestroApi,
    personalApi,
    academicoApi,
    evaluacionesApi,
    asistenciaApi,
    examenesApi,
    finanzasApi,
    dashboardApi
};
