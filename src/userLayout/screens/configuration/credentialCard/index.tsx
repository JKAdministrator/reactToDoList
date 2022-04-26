import React from "react";
import style from "./style.module.scss";
import { Avatar, Card, FormGroup, Typography } from "@mui/material";
import { UserInfo } from "firebase/auth";

const CredentialCard: React.FC<UserInfo> = (props: UserInfo) => {
  const { displayName, email, phoneNumber, photoURL, providerId, uid } = props;
  return (
    <Card variant="outlined" sx={{}}>
      <FormGroup className={style.credentialCard}>
        <Typography variant="h6" component="h3" style={{ gridArea: "a1" }}>
          {providerId}
        </Typography>
        <Avatar
          alt="User image"
          src={photoURL && photoURL !== "" ? photoURL : "./noUserImage.png"}
          style={{
            gridArea: "a2",
            margin: "0.5rem",
            justifySelf: "center",
          }}
          sx={{ width: 80, height: 80 }}
        />
        <div
          className={style.credentialDataRowContainer}
          style={{ gridArea: "a3" }}
        >
          {providerId !== "google.com" ? (
            <Typography
              variant="body2"
              gutterBottom
              className={style.credentialDataRow}
              title={uid}
            >
              {props.uid}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              gutterBottom
              className={style.credentialDataRow}
              title={displayName ? displayName : ""}
            >
              {displayName}
            </Typography>
          )}

          {providerId === "password" ? (
            <Typography
              variant="body2"
              gutterBottom
              className={style.credentialDataRow}
            >
              *********
            </Typography>
          ) : (
            <Typography
              variant="body2"
              gutterBottom
              className={style.credentialDataRow}
              title={email ? email : ""}
              style={{ opacity: "0.7" }}
            >
              {email}
            </Typography>
          )}
        </div>
      </FormGroup>
    </Card>
  );
};

export default CredentialCard;
