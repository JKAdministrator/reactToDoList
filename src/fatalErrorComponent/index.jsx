import React, { useEffect } from "react";
import style from "./style.module.scss";

const FatalErrorComponent = (props) => {
  const { mensaje } = props;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={style.container}>
      <h1>Error</h1>
      <span>{mensaje}</span>
    </div>
  );
};

export default FatalErrorComponent;
