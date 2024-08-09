import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { Header } from "../UI/Header";
import { faqData } from "./faqData";

type FaqDataInJson = {
  question: string;
  answer: string;
};

export const FAQ = () => {
  const matches = useMediaQuery("(min-width:600px)");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        height: "100vh",
      }}
    >
      <Header />
      <Box
        maxWidth="80%"
        margin="auto"
        justifyContent="center"
        alignItems="center"
        sx={{
          paddingTop: matches ? "7em" : "10em",
          overflow: "auto",
          "::-webkit-scrollbar": {
            display: "none",
          },
          "scrollbar-width": "none",
        }}
      >
        <Box sx={{ justifyContent: "center", width: "auto", padding: "1em" }}>
          <Typography variant="h2" style={{ textAlign: "center" }}>
            faq
          </Typography>
        </Box>
        {faqData.map((faq: FaqDataInJson, index: number) => (
          <Grid
            container
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "3em",
            }}
          >
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ marginRight: { sm: "2em" }, marginBottom: { xs: "1.1em" } }}
            >
              <Typography variant="subtitle1">{faq.question}</Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ marginLeft: { sm: "2em" } }}>
              <Typography variant="body1">{faq.answer}</Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    </Box>
  );
};
