import { Box, Grid, Typography } from "@mui/material";
import { Header } from "./Header";
// import faqs from "./faqData.json";

type FaqDataInJson = {
  question: string;
  answer: string;
};

export const FAQ = () => {
  const faqs: FaqDataInJson[] = [
    {
      question: "What is the meaning of life?",
      answer: "42",
    },
    {
      question: "What is the airspeed velocity of an unladen swallow?",
      answer: "African or European?",
    },
    {
      question: "What is the best way to cook an egg?",
      answer: "Depends on the egg",
    },
  ];

  return (
    <Box sx={{display: 'flex', flexDirection: 'column'}}>
      <Header />
      <Box
        maxWidth="80%"
        margin="auto"
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <Box sx={{ justifyContent: "center" }}>faq</Box>
        {faqs.map((faq: FaqDataInJson, index: number) => (
          <Grid container key={index}>
            <Grid item xs={6}>
              <Typography variant="subtitle1">{faq.question}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{faq.answer}</Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    </Box>
  );
};
