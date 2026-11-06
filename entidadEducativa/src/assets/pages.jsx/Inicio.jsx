import Barra from "../components/Barra";
import Logotipo from "../components/logotipo";
import "../style/inicio.css";


export default function Inicio(){


    return(
        <div>
            <Logotipo></Logotipo>
            <Barra></Barra>
            <div>
                <p>inicio vista visitantes</p>
            </div>
            <div className="contenido">
                contenido
            </div>
            
        </div>


    );


}