import React from "react";
import style from "./style.module.scss";

const LoaderAnimation = () => {
  return (
    <>
      <div className={style.ldsRing}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default LoaderAnimation;
