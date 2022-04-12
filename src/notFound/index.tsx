import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/appContext";

async function getQuote() {
  try {
    let quote = await fetch(
      "https://programming-quotes-api.herokuapp.com/quotes/random"
    );
    let quotejson = await quote.json();
    return quotejson;
  } catch (e) {
    return {
      author: "Butler Lampson",
      en: "In handling resources, strive to avoid disaster rather than to attain an optimum.",
    };
  }
}

interface IQuote {
  author: string;
  en: string;
}

const NotFound: React.FC = () => {
  const [quote, setQuote] = useState<IQuote>({
    author: "",
    en: "",
  });

  //variables de estado
  const { getLanguageString, userLanguage } = useAppContext();

  useEffect(() => {
    getQuote().then((quote) => {
      setQuote(quote);
    });
  }, []);

  const getString = useCallback(
    (string: string): string => {
      return getLanguageString("signupForm", string);
    },
    [userLanguage]
  );

  return (
    <Box
      style={{
        display: "flex",
        flexFlow: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "1rem",
        width: "100%",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Typography variant="h1" component="h1">
        404
      </Typography>
      <img
        src="./notFound.png"
        style={{
          objectFit: "scale-down",
          maxWidth: "calc(100% - 2rem)",
          padding: "1rem",
        }}
        alt="Page Not found"
      ></img>
      <Box
        style={{
          padding: "1rem",
          width: "max-content",
          display: "flex",
          flexFlow: "column",
          gap: "0.5rem",
          alignItems: "flex-end",
          maxWidth: "calc(100% - 2rem)",
        }}
      >
        <Typography
          variant="body2"
          style={{
            maxWidth: "34rem",
            textAlign: "justify",
            fontStyle: "italic",
          }}
        >
          {quote && quote.en ? '"' + quote.en + '"' : ""}
        </Typography>
        <Typography
          variant="body1"
          style={{
            width: "max-content",
          }}
        >
          {quote && quote.author ? quote.author : ""}
        </Typography>
      </Box>
      <Button variant="contained">
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          {getString("goHome")}
        </Link>
      </Button>
    </Box>
  );
};

export default NotFound;
