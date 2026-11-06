const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost/fs2026/entidad_educativa_api/public/api';

export function obToken() {return localStorage.getItem('token');}
export function guarToken(t){localStorage.setItem('token', t);}
export function delToken(){localStorage.removeItem('token');}



async function  peticion(ruta, {metodo='GET', datos, conToken = true} = {}) {
    
    const Header = {'Content-Type': 'Application/json', Accept : 'Application/json'};

    if (conToken) {
        const token = obToken();
        if(token) Header['Authorization'] = `Bearear ${token}`;
    }


    const respuesta = await fetch(`${BASE_URL}/${ruta}`,{
        method: metodo,
        headers: Header,
        body: datos ? JSON.stringify(datos): undefined
    }).catch(()=>{
        throw new Error(`No hay conexion al servidor`);
    })

    if(respuesta.status === 204) return null;

    const json = await respuesta.json().catch(()=>null);

    if (!respuesta.ok) {
        const msg = json?.mensaje ?? json?.message ?? respuesta.statusText;
        throw new Error(msg);
    }

    return json?.datos !== undefined ? json.datos : json;
}

function CrudApi(ruta){
    return{
        mostrar: ()=>peticion(ruta),
        buscar: (id) =>peticion(`${ruta}/${id}`),
        crear: (datos)=> peticion(ruta,{metodo:'POST',datos}),
        actualizar: (id,datos)=> peticion(`${ruta}/${id}`, {metodo:'PUT',datos}),
        eliminar: (id)=> peticion(`${ruta}/${id}`,{metodo:'DELETE'})
    }
}

export const authApi = {
    login: (datos) =>peticion('auth/login', {metodo: 'POST', datos, conToken: false}),
    logout: ()=> peticion('auth/logout', {metodo:'POST'}),
    me: ()=> peticion('auth/logout')
};


export const authAnteriorApi = {
    login: (datos) => peticion('autenticacion/login', {metodo:'POST', datos, conToken: false}),
    logout: ()=> peticion('autenticacion/logout',{metodo:'POST'})
}

export const usuarioApi = {
    ...CrudApi('usuarios'),
    cambiarContrasena: (id,datos)=> peticion(`usuarios/${id}`, {metodo:'PUT', datos})
};

export const alumnoApi = CrudApi('alumnos');
export const maestroApi = CrudApi('maestros');
export const personalApi = CrudApi('personal');


export const academicoApi = {
    nieveles: ()=>peticion('academico/niveles'),
    grados: ()=>peticion('academico/grados'),
    secciones: ()=>peticion('academico/secciones'),
    cursos: ()=>peticion('academico/cursos'),
    gradosSecciones: ()=>peticion('academico/grados-secciones'),

    crearCurso: (datos)=>peticion('academico/cursos', {metodo:'POST', datos}),
    actualizarCurso: (id,datos)=>peticion(`academico/curso/${id}`, {metodo:'PUT',datos }),
    abrirAula: (datos)=>peticion('academico/grados-secciones', {metodo:'POST',datos}),
    asignarAlumno: (datos)=>peticion('academico/asignaciones/alumnos', {metodo:'POST', datos}),
    asignarMaestro: (datos)=>peticion('academico/asignaciones/maestros', {metodo: 'POST', datos})
};


export const evaluacionesApi = {
    actividadesPorCurso: (idCurso)=> peticion(`evaluaciones/cursos/${idCurso}/actividades`),
    crearActividad: (idCurso, datos)=> peticion(`evaluaciones/cursos/${idCurso}/actividades`, {metodo:'POST', datos}),
    calificar: (datos)=> peticion('evaluaciones/calificaciones', {metodo:'POST', datos}),
    calificacionesActividad: (idActividad)=> peticion(`evaluaciones/actividades/${idActividad}/calificaciones`),
    boletaAlumno: (idAlumno)=> peticion(`evaluaciones/alumnos/${idAlumno}/boleta`),

    activiadCursoAlter: (idCurso)=> peticion(`cursos/${idCurso}/actividades`),
    crearActividadAlter: (idCurso, datos)=> peticion(`cursos/${idCurso}/actividades`, {metodo:'POST', datos}),
    calificarAlter: (datos)=> peticion(`calificaciones`, {metodo:'POST', datos}),
    boleteaAlumnoAlter: (idAlumno)=> peticion(`alumnos/${idAlumno}/boleta`)
}

export const asistenciaApi ={
    conuslAulaFecha: (idAula, fecha)=> {
        const paramFecha = fecha ? `?fecha=${encodeURIComponent(fecha)}`: '';

        return peticion(`asistencia/grado-seccion/${idAula}${paramFecha}`);
    },

    consulHistorialAlumno: (idAlumno)=> peticion(`alumnos/${idAlumno}/asistencia`),
    crear: (datos) => peticion(`asistencia`, {metodo:'POST', datos})
};


export const examenesApi = {    
    crear: (datos)=> peticion('examenes', {metodo:'POST', datos}),
    autorizar: (id)=> peticion(`examenes/${id}/autorizar`, {metodo:'PUT'})
}


export const finanzasApi = { 
    cargosAlumnos: (idAlumno) => peticion(`alumnos/${idAlumno}/cargos`),
    generarAcargo: (datos)=> peticion(`cargos-alumnos/generar`,{metodo:'POST',datos}),
    realizarPago: (datos)=> peticion(`pagos/realizar`, {metodo:'POST', datos}),
    comprobante: (idPago)=> peticion(`pagos/comprobante/${idPago}`),

    calendario: ()=> peticion('calendario'),
    crearEventoCalendario: (datos) => peticion('calendario', {metodo:'POST', datos})
}

export const dashboardApi = {
    resumen: ()=> peticion('dashboard/resumen')
}










