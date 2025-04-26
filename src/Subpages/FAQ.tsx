import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { Header } from "../UI/Header";
import { faqData } from "./faqData";

type FaqDataInJson = { question: string; answer: string };

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
          "::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        <Typography variant="h2" style={{ textAlign: "center", marginBottom: "0.5em" }}>
          faq
        </Typography>
        <Stack gap={2} sx={{ marginBottom: "2em" }}>
          {faqData.map((faq: FaqDataInJson, index: number) => (
            <Box key={index}>
              <Typography variant="h6">{faq.question}</Typography>
              <Typography variant="body2">{faq.answer}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};
