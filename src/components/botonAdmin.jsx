import React from 'react';
import '../styles/boton.css';
import { RxArrowRight } from "react-icons/rx";

function BotonAdmin({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="boton-principal">
      <span>Administrar</span>
      <RxArrowRight />
    </button>
  );
}

export default BotonAdmin;