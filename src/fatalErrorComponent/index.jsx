import React, { useEffect } from "react";
import style from "./style.module.scss";

const FatalErrorComponent = (props) => {
  const { mensaje } = props;
  useEffect(() => {
    console.error(mensaje);
  }, []);
  return (
    <div className={style.container}>
      <h1>Error</h1>
      <span>{mensaje}</span>
    </div>
  );
};

export default FatalErrorComponent;
