import Barra from "../components/Barra";
import Logotipo from "../components/logotipo";
import "../style/sesion.css";


export default function Sesion(){



    return(
        <div className="fondoImg" >
            <Logotipo></Logotipo>
            
            <div className="iniciarS" > 
                <div className="contF" >
                    <div className="tituloF" >
                        <h1>Iniciar sesion</h1>
                    </div> 
                    <div className="formu">
                        <form className="formulario" >
                            <label >Usuario</label>
                            <input type="text" placeholder="usuario" />
                            <label >contraseña</label>
                            <input type="password" placeholder="- - - - - - - -" />
                            <button>Iniciar </button>
                        </form>
                       
                    </div>
                    
                </div>

            </div>
        </div>

    );


}