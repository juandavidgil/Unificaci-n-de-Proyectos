import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from '../css/Usuario-Proyecto.module.css';
import { url } from '../../../config/URL.jsx';
import ATM from '../../../assets/ATM.png';
import Cartagena from '../../../assets/Cartagena.png';
import Chia from '../../../assets/Chia.png';
import MOVIDIC from '../../../assets/MOVIDIC.png';
import Silvania from '../../../assets/Silvania.jpg';
import VUS from '../../../assets/VUS.png';
import Neiva from '../../../assets/Neiva.jpg';
import Data from '../../../assets/dataTools.jpg';

const ProyectosUsuario = () => {
  const navigate = useNavigate();
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);

  const imagenesProyectos = {
    "Guayaquil": ATM,
    "VUS": VUS,
    "MOVIDIC": MOVIDIC,
    "Chía": Chia,
    "Silvania": Silvania,
    "Neiva": Neiva,
    "Cartagena": Cartagena,
    "Data": Data
  };

  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  useEffect(() => {
    const cargarProyectos = async () => {
      const cacheProyectos = sessionStorage.getItem('proyectos_usuario');
      if (cacheProyectos) {
        setProyectos(JSON.parse(cacheProyectos));
        setLoading(false);
        return;
      }

      if (!usuario?.id) {
        console.warn("No se encontró usuario en localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${url}/proyectos_usuario/${usuario.id}/`);
        const data = await response.json();

        if (response.ok) {
          setProyectos(data);
          sessionStorage.setItem('proyectos_usuario', JSON.stringify(data));
        } else {
          console.error('Error al obtener los proyectos:', data);
        }
      } catch (error) {
        console.error('Error de conexión:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarProyectos();
  }, []);

 
  const CerrarSesion = () => {
    localStorage.removeItem('usuario');
    sessionStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div className={style.cuerpo}>
        <div className={style.contenedor}>
          <h2 className={style.titulo}>Cargando tus módulos...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={style.cuerpo}>
      <div className={style.contenedor}>
        <h2 className={style.titulo}>MÓDULOS</h2>
        <p className={style.subtitulo}>
          Aquí puedes ver los módulos en los que estás participando.
        </p>

        <div className={style.contenedorTarjetas}>
          {proyectos.length > 0 ? (
            proyectos.map((proyecto) => {
              const imagen = imagenesProyectos[proyecto.nombre_proyecto] || Data;
              return (
                <div
                  key={proyecto.id}
                  className={style.tarjeta}
                  onClick={() =>
                    navigate('/dashboard', { state: { id: proyecto.id } })
                  }
                >
                  <div className={style.imagenContenedor}>
                    <img
                      src={imagen}
                      alt={proyecto.nombre_proyecto}
                      className={style.imagenTarjeta}
                    />
                  </div>
                  <h3 className={style.nombre}>{proyecto.nombre_proyecto}</h3>
                </div>
              );
            })
          ) : (
            <p style={{ color: 'white' }}>No tienes módulos asignados.</p>
          )}
        </div>

        <button className={style.CerrarSesion} onClick={CerrarSesion}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default ProyectosUsuario;
