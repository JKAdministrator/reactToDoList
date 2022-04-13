import React, { useEffect } from "react";
import style from "./style.module.scss";

interface IProps {
  mensaje: string;
}

const FatalErrorComponent: React.FC<IProps> = (props: IProps) => {
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={style.container}>
      <h1>Error</h1>
      <span>{props.mensaje}</span>
    </div>
  );
};

export default FatalErrorComponent;
