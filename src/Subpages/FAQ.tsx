import { Box, Grid, Typography } from "@mui/material";
import { Header } from "../Header";
import { faqData } from "./faqData";

type FaqDataInJson = {
  question: string;
  answer: string;
};

export const FAQ = () => {
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
          paddingTop: "5em",
          overflow: "auto",
          "::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        <Box sx={{ justifyContent: "center", width: "auto", padding: "1em" }}>
          <Typography variant="h3" style={{ textAlign: "center" }}>
            faq
          </Typography>
        </Box>
        {faqData.map((faq: FaqDataInJson, index: number) => (
          <Grid
            container
            key={index}
            sx={{ display: "flex", justifyContent: "center", marginBottom: "3em" }}
          >
            <Grid item xs={12} sm={4} sx={{ marginRight: { sm: "2em" } }}>
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
