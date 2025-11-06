import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InicioDeSesion from './pages/login/Inicio-de-Sesion';
import DashBoard from './pages/usuario/pantallas/Dash-Board';
import Tableros from './pages/usuario/pantallas/Tableros';
import ProyectosUsuario from './pages/usuario/pantallas/Proyecto_Usuario';
import RutaProtegida from './RutaProtegida';


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<InicioDeSesion />} />

      <Route path="/proyectos-Usuario"
element={
    <RutaProtegida>
      <ProyectosUsuario/>
    </RutaProtegida>
  }
/>

        <Route path="/dashboard" 
        element={
    <RutaProtegida>
      <DashBoard/>
    </RutaProtegida>
  } />

        <Route path="/tableros/:id"
        element={
    <RutaProtegida>
      <Tableros/>
    </RutaProtegida>
  }/>
      </Routes>
    </Router>
  );
}

export default App;
