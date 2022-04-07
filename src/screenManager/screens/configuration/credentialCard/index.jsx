import React from "react";
import style from "./style.module.scss";
import { Avatar, Card, FormGroup, Typography } from "@mui/material";

const CredentialCard = (props) => {
  return (
    <Card variant="outlined" sx={{}}>
      <FormGroup className={style.credentialCard}>
        <Typography variant="h7" component="h3" style={{ gridArea: "a1" }}>
          {props.provider}
        </Typography>
        <Avatar
          alt="User image"
          src={
            props.image && props.image !== ""
              ? props.image
              : "./noUserImage.png"
          }
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
          {props.provider === "password" ? (
            <Typography
              variant="body2"
              gutterBottom
              className={style.credentialDataRow}
              title={props.uid}
            >
              {props.uid}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              gutterBottom
              className={style.credentialDataRow}
              title={props.name}
            >
              {props.name}
            </Typography>
          )}

          {props.provider === "password" ? (
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
              title={props.email}
              style={{ opacity: "0.7" }}
            >
              {props.email}
            </Typography>
          )}
        </div>
      </FormGroup>
    </Card>
  );
};

export default CredentialCard;
