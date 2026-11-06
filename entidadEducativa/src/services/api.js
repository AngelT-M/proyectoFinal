const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost/fs2026/entidad_educativa_api/public/api';

const resApi = 



async function  peticion(ruta, {metodo='GET', datos} = {}) {
    
    const Header = {'Content-Type': 'Application/json', Accept : 'Application/json'};


    const respuesta = await fetch(`${BASE_URL}/${ruta}`,{
        method: metodo,
        headers: Header,
        body: datos ? JSON.stringify(datos): undefined
    }).catch(()=>{
        throw new Error(`No hay conexion a la base de datos`);
    })

    json = await respuesta.json().catch(()=>null);


}