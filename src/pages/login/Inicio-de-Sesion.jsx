import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import style from '../login/Inicio-de-Sesion.module.css';
import Boton from '../../components/boton';
import BotonAdmin from '../../components/botonAdmin.jsx';
import { url } from '../../config/URL.jsx';

function InicioDeSesion() {
  const navigate = useNavigate();
  const location = useLocation();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

 
  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    setCorreo('');
    setPassword('');
  }, [location.key]);

  
  function Administrar() {
    window.location.href = 'http://127.0.0.1:8000/admin/';
  }

 
  const Ingresar = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();

      if (response.ok) {
       
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('powerbi_token', data.powerbi_token);

       
        precargarDatos(data.usuario.id);

        alert(`Bienvenido ${data.usuario.nombre}`);
        navigate('/proyectos-Usuario');
      } else {
        alert(data.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al conectar con el servidor');
    }
  };

 const precargarDatos = async (usuarioId) => {
  try {
    const proyectosRes = await fetch(`${url}/proyectos_usuario/${usuarioId}/`);
    const proyectos = await proyectosRes.json();

    if (!proyectosRes.ok) return;

    for (const proyecto of proyectos) {
      const dashboardsRes = await fetch(
        `${url}/dashboards_con_embed/${proyecto.id}/?usuario_id=${usuarioId}`
      );
      const dashboardsData = await dashboardsRes.json();

      if (dashboardsRes.ok) {
        sessionStorage.setItem(
          `dashboards_${proyecto.id}`,
          JSON.stringify(dashboardsData.dashboards || [])
        );
      }
    }

    sessionStorage.setItem('proyectos_usuario', JSON.stringify(proyectos));
  } catch (error) {
    console.warn('Error precargando proyectos o dashboards:', error);
  }
};

  return (
    <div className={style.contenedorPrincipal}>
      <div className={style.ladoIzquierdo}>
        <div className={style.contenidoIzquierdo}></div>
      </div>

      <div className={style.ladoDerecho}>
        <form className={style.formulario} onSubmit={Ingresar}>
          <h2>Inteligencia Corporativa</h2>

          <label>Correo electrónico</label>
          <input
            type='email'
            placeholder='Ingrese su correo electrónico'
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <input
            type='password'
            placeholder='Ingrese su contraseña'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <br />
          <div className={style.botonContainer}>
            <Boton onClick={Ingresar} texto='Ingresar' />
            <BotonAdmin onClick={Administrar} texto='Administrar' />
          </div>

          <p className={style.slogan}>"Producto No Para"</p>
        </form>
      </div>
    </div>
  );
}

export default InicioDeSesion;
