import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import * as powerbi from "powerbi-client";
import style from "../css/Tableros.module.css";
import {url} from '../../../config/URL.jsx'

function Tableros() {
  const location = useLocation();
  const proyectoId = location.state?.proyectoId;
  const dashboardId = location.state?.dashboardId;
  const nombreDashboard = location.state?.nombreDashboard;

  const [currentDashboard, setCurrentDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reportContainerRef = useRef(null);
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(
          `${url}/dashboards_con_embed/${proyectoId}/?usuario_id=${usuario.id}`
        );
        const data = await response.json();

        if (response.ok && data.dashboards?.length > 0) {
          const dashboardEncontrado = data.dashboards.find(
            (d) => d.id === dashboardId
          );
          if (dashboardEncontrado) {
            setCurrentDashboard(dashboardEncontrado);
          } else {
            setError("No se encontró el dashboard solicitado.");
          }
        } else {
          setError("No se encontraron dashboards activos.");
        }
      } catch (err) {
        console.error("Error al cargar dashboard:", err);
        setError("Error de conexión al backend.");
      } finally {
        setLoading(false);
      }
    };

    if (proyectoId && dashboardId) fetchDashboard();
  }, [proyectoId, dashboardId]);

  // 🔹 Renderizar Power BI
  useEffect(() => {
    if (!currentDashboard || !reportContainerRef.current) return;

    const { embed_url, embed_token } = currentDashboard;

    try {
      const powerbiService = new powerbi.service.Service(
        powerbi.factories.hpmFactory,
        powerbi.factories.wpmpFactory,
        powerbi.factories.routerFactory
      );

      powerbiService.reset(reportContainerRef.current);

      powerbiService.embed(reportContainerRef.current, {
        type: "report",
        embedUrl: embed_url,
        accessToken: embed_token,
        tokenType: powerbi.models.TokenType.Embed,
        permissions: powerbi.models.Permissions.All,
        settings: {
          panes: {
            filters: { visible: false },
            pageNavigation: { visible: true },
          },
          background: powerbi.models.BackgroundType.Transparent,
        },
      });
    } catch (err) {
      console.error("Error al renderizar Power BI:", err);
      setError("No se pudo renderizar el dashboard.");
    }
  }, [currentDashboard]);

  return (
    <div className={style.cuerpo}>
      <div className={style.contenedor}>
        <h1 className={style.titulo}>
          {nombreDashboard || currentDashboard?.nombre_dashboard || "Dashboard"}
        </h1>

        {loading && <p style={{ color: "white", fontSize: 25 }}>Cargando dashboard...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div
          ref={reportContainerRef}
          style={{
            height: "700px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "10px",
            overflow: "hidden",
            backgroundColor: "white",
          }}
        ></div>
      </div>
    </div>
  );
}

export default Tableros;
