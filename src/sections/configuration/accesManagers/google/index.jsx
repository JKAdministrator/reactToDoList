import React, { useEffect, useState } from "react";
import style from "./style.module.scss";
import { useAppContext } from "../../../../context/appContext";
import noUserImage from "./noUserImage.png";
import LoaderAnimation from "../../../../loaderAnimation";

export const AppContext = React.createContext();

const SectionConfigurationAccesAccountGoogle = () => {
  const { userData } = useAppContext();
  const [dataObject, setDataObject] = useState({
    displayName: "",
    email: "",
    state: "LOADING",
  });

  useEffect(() => {
    let loginData = userData.logins.find((l) => {
      return l.source === "google";
    });
    if (loginData) {
      setDataObject((_prevData) => {
        return { ..._prevData, ...loginData, state: "READY" };
      });
    } else {
      setDataObject((_prevData) => {
        return { ..._prevData, ...loginData, state: "EMPTY" };
      });
    }
  }, []);

  function handleDeleteClick(e) {
    setDataObject((_prevData) => {
      return { ..._prevData, state: "DELETING" };
    });
  }

  return (
    <>
      {dataObject.state === "READY" || dataObject.state === "DELETING" ? (
        <section className={style.section}>
          <h3>Google</h3>
          <img
            src={dataObject.photoURL ? dataObject.photoURL : noUserImage}
            alt="google user image"
          />
          <span id="googleDisplayName" name="googleDisplayName">
            {dataObject ? dataObject.displayName : ""}
          </span>
          <span id="googleEmail" name="googleEmail">
            {dataObject ? dataObject.email : ""}
          </span>
          <span id="credentialId" name="credentialId">
            ID : {dataObject ? dataObject.loginDocId : ""}
          </span>
          {userData?.logins && userData.logins.length > 0 ? (
            <button type="button" onClick={handleDeleteClick} name="delete">
              <img
                src="./icons/common/delete.png"
                className="icon"
                alt="delete account"
              ></img>
            </button>
          ) : (
            <></>
          )}

          {dataObject.state === "DELETING" ? (
            <div className={style.loaderContainer}>
              <LoaderAnimation></LoaderAnimation>
            </div>
          ) : (
            <></>
          )}
        </section>
      ) : (
        <></>
      )}

      {dataObject.state === "LOADING" ? (
        <div className={style.loaderContainer}>
          <LoaderAnimation></LoaderAnimation>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SectionConfigurationAccesAccountGoogle;
