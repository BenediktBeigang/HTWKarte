import GitHubIcon from "@mui/icons-material/GitHub";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Typography } from "@mui/material";
import { Header } from "../Header";

export const Imprint = () => {
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
        maxWidth="40%"
        margin="auto"
        justifyContent="center"
        alignItems="center"
        sx={{ paddingTop: "5em" }}
      >
        <Typography variant="h2" gutterBottom>
          Impressum
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "2em" }}>
          <Box>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold" }}>
              Angaben gemäß § 5 TMG:
            </Typography>
            <Typography variant="body1" gutterBottom>
              Benedikt Beigang <br /> Hans-Beimler-Straße 46 <br /> 04159 Leipzig, Deutschland
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold" }}>
              Kontakt: <br />
            </Typography>
            <Typography variant="body1" gutterBottom>
              <Box sx={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                <MailOutlineIcon />
                <span>benedikt.beigang@stud.htwk-leipzig.de</span>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                <img
                  src="./Assets/Icons/discordIcon.svg"
                  alt="Discord Icon"
                  style={{ width: "1.5em" }}
                />
                <span>
                  <a href="https://discord.gg/Z3gcuy7ZB5" style={{ color: "#fff" }}>
                    HTWK Software Discord Server
                  </a>
                </span>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
                <GitHubIcon />
                GitHub
              </Box>
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" gutterBottom sx={{ fontWeight: "bold" }}>
              Haftungsausschluss:
            </Typography>
            <Typography variant="body1" gutterBottom>
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
