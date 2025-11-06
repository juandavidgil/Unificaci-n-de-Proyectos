import React from 'react';
import '../styles/boton.css';
import { RxArrowRight } from "react-icons/rx";

function Boton({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="boton-principal">
      <span>Ingresar</span>
      <RxArrowRight />
    </button>
  );
}

export default Boton;
