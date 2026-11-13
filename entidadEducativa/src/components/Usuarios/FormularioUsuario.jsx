export default function FormularioUsuario({ usuario, setUsuario, onSubmit, mostrarFormUsuario,setMostrarFormUsuario }) {
  return (
    <section className="Crear-form">
      <div className="form-nuevo" >
          <h2>Crear Nuevo Usuario</h2>
        <form onSubmit={onSubmit} className="form-cont" >
          <label>
            <p>Nombre</p>
            <input
              type="text"
              required
              placeholder="Usuario"
              value={usuario.nom_usuario}
              onChange={(e) => setUsuario({ ...usuario, nom_usuario: e.target.value })}
            />
          </label>
          
          <label>
            <p>Contraseña inicial</p>
            <input
              type="password"
              required
              minLength={8}
              value={usuario.password}
              placeholder="mín. 8 caracteres"
              onChange={(e) => setUsuario({ ...usuario, password: e.target.value })}
            />
          </label>
          
          <label>
            <p>Rol</p>
            <select
              value={usuario.rol_id}
              onChange={(e) => setUsuario({ ...usuario, rol_id: e.target.value })}
            >
              <option value={1}>1) Administrador</option>
              <option value={2}>2) Director</option>
              <option value={3}>3) Secretaria</option>
              <option value={4}>4) Maestro</option>
              <option value={5}>5) Alumno</option>
            </select>
          </label>
          
          <label>
            <p>Estado</p>
            <select
              value={usuario.estado}
              onChange={(e) => setUsuario({ ...usuario, estado: e.target.value })}
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </label>

          
          <div>
             <button className="btn-us"  type="submit">Guardar Usuario</button> 
              <button
                className='sesion apagado'
                type='button'
                onClick={()=> setMostrarFormUsuario(!mostrarFormUsuario)}
              >
                Cancelar
              </button>
          </div>
        </form>
      </div>
    </section>
  );
}
