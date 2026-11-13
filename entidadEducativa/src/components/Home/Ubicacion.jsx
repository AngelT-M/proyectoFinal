


export default function Ubicacion(){


    return(
        <section className="home-visitante">
            <div className='panel-prin' >
                <div className='eslogan' >
                    <div className='tm' >
                        <h1>Un lugar para Crecer y <span className='progre'>Progresar</span></h1>
                        <h1>Un mundo por descubrir.</h1>
                    </div>
                    <div className='frace' >
                        <p>Acompañamos a cada estudiante a descubrir su potencial,con una educación cercana, curiosa y conectada con la vida.</p>
                    </div>
                    
                    <div className='sec-btn' >
                        <button className='sesion' >UBICACIO</button>
                        <button className='sesion' >NOSOTROS</button>
                    </div> 
                </div>
                <div className='eslogan-img'>
                    <img className='img-eslogan' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTAVLG8c25x0a2_KxB5QkF4Brf33vxbUMcUp371QH79uqJS3cTxd7YNx9k&s=10" alt="" />
                    <button className='sesion est' >informacion</button>
                </div>
            </div>
            <div className="ubi" >
                    <iframe 
                    className="mapa"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.507855485245!2d-90.5202995241029!3d14.627088876426301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8589a224c1b0dddd%3A0xafe1e081d63e5245!2sCentro%20Cultural%20Miguel%20%C3%81ngel%20Asturias!5e0!3m2!1ses-419!2sgt!4v1794600180315!5m2!1ses-419!2sgt" 
                    width="100%" 
                    height="500" 
                    title="Ubicación del Centro Cultural Miguel Ángel Asturias"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy" 
                    referrerPolicy="strict-origin-when-cross-origin">
                    </iframe>
            </div>
        </section>

    );
}