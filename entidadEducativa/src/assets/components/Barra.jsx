import { Link } from "react-router-dom";
import Sesion from "../pages.jsx/Sesion";
import "../style/barra.css";

export default function Barra(){


    return(
      
            <nav className="nav" >
                <div className="logo" >
                    <Link className="cont"  to="/">
                    <h2>Berear web Disk</h2>
                    <p>CENTRO EDUCATIVO</p>
                    </Link>
                </div>
                <div className="links">
                    <Link className="lin"  to="/" >Inicion</Link>
                    <Link className="lin" >Contactos</Link>
                    <Link className="lin" >Etapas Educativas</Link>
                    <Link className="lin" >Informacion</Link>
                </div>
                <div className="iniciar">
                    <Link className="sesion linone" to="/sesion">
                        <p>iniciar sesion</p>
                    </Link>
                </div>
            </nav>

    );


}