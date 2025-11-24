import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import { FcMoneyTransfer, FcStatistics } from 'react-icons/fc';
import style from '../css/Dash-Board.module.css';
import { url } from '../../../../src/config/URL.jsx';
import indicadores from '../../../assets/indicadores.png'
import agenda from '../../../assets/agenda.png'
import financiero from '../../../assets/financiero.png'
import operativo from '../../../assets/operativo.png'
import aranda from '../../../assets/aranda.png'

function DashBoard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const proyectoId = location.state?.id;

  useEffect(() => {
    const fetchDashboards = async () => {
      if (!proyectoId) {
        setLoading(false);
        return;
      }

      const cacheKey = `dashboards_${proyectoId}`;
      const cacheData = sessionStorage.getItem(cacheKey);

      if (cacheData) {
        setDashboards(JSON.parse(cacheData));
        setLoading(false);
        return;
      }

      try {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        const response = await fetch(
          `${url}/dashboards_con_embed/${proyectoId}/?usuario_id=${usuario.id}`
        );
        const data = await response.json();

        if (response.ok) {
          const dashboardsData = data.dashboards || [];
          setDashboards(dashboardsData);
          sessionStorage.setItem(cacheKey, JSON.stringify(dashboardsData));
        } else {
          console.error('Error al obtener dashboards:', data);
        }
      } catch (error) {
        console.error('Error de conexión:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboards();
  }, [proyectoId]);

  const irTablero = (dashboard) => {
    navigate(`/tableros/${dashboard.id}`, {
      state: {
        proyectoId,
        dashboardId: dashboard.id,
        nombreDashboard: dashboard.nombre_dashboard,
      },
    });
  };

  const obtenerIcono = (nombre) => {
    const n = nombre.toLowerCase();
    if (n.includes('financiero')) return <img className={style.icono} src={financiero} alt="Financiero" />;
    if (n.includes('indicadores')) return <img className={style.icono} src={indicadores} alt="Indicadores" />;
    if (n.includes('operativo')) return <img className={style.icono} src={operativo} alt="Operativo" />;
    if (n.includes('agenda')) return <img className={style.icono} src={agenda} alt="Agenda" />;
    if (n.includes('aranda')) return <img className={style.icono} src={aranda} alt="aranda" />;
    return <FaChartBar size={70} color="#6366F1" />;
  };

  if (loading) {
    return (
      <div className={style.cuerpo}>
        <div className={style.contenedor}>
          <h2 className={style.titulo}>Cargando dashboards...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={style.cuerpo}>
      <div className={style.contenedor}>
        <h1 className={style.titulo}>Dashboards del Módulo</h1>
        <p className={style.subtitulo}>
          Selecciona un dashboard para visualizarlo.
        </p>

        <div className={style.contenedorTarjetas}>
          {dashboards.length > 0 ? (
            dashboards.map((dashboard) => (
              <button
                key={dashboard.id}
                className={style.tarjeta}
                onClick={() => irTablero(dashboard)}
              >
                <div className={style.iconoTarjeta}>
                  {obtenerIcono(dashboard.nombre_dashboard)}
                </div>
                <h3>{dashboard.nombre_dashboard}</h3>
              </button>
            ))
          ) : (
            <p style={{ color: 'white' }}>
              No hay dashboards disponibles para este módulo.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
