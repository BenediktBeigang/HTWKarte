import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { Box, Grid, Typography } from "@mui/material";
import { Header } from "../UI/Header";

const ContactInfo = ({
  icon,
  text,
  link,
  alt,
}: {
  icon: string;
  text: string;
  link: string;
  alt: string;
}) => (
  <Grid container alignItems="center" gap={2}>
    <Grid sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {icon === "mui_mail" ? (
        <MailOutlineIcon />
      ) : (
        <img src={icon} alt={alt} style={{ width: "1.5em" }} />
      )}
    </Grid>
    <Grid>
      <a href={link} style={{ color: "#fff" }}>
        {text}
      </a>
    </Grid>
  </Grid>
);

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
        margin="auto"
        justifyContent="center"
        alignItems="center"
        sx={{
          paddingTop: "5em",
          maxWidth: { xs: "90%", sm: "45%" },
          overflowX: "hidden",
          overflowY: "scroll",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Typography variant="h2" gutterBottom>
          Impressum
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "2em" }}>
          <Typography variant="body1" gutterBottom>
            <b style={{ marginBottom: "0.5em", display: "inline-block" }}>Postanschrift:</b> <br />
            HTWK Leipzig <br />
            Fachschaftsrat Informatik & Medien <br />
            Postfach 30 11 66 <br />
            04251 Leipzig
          </Typography>
          <Typography variant="body1" gutterBottom component="div">
            <b style={{ marginBottom: "0.5em", display: "inline-block" }}>
              Verantwortlicher der Website
            </b>
            <br />
            Benedikt Beigang <br />
            <ContactInfo
              icon="mui_mail"
              text="benedikt.beigang@stud.htwk-leipzig.de"
              link="mailto:benedikt.beigang@stud.htwk-leipzig.de"
              alt="Mail Icon"
            />
            <ContactInfo
              icon="/Icons/discord.svg"
              text="HTWK Software Discord Server (Bene)"
              link="https://discord.gg/Z3gcuy7ZB5"
              alt="Discord Icon"
            />
            <ContactInfo
              icon="/Icons/gitlab.svg"
              text="GitLab Repository"
              link="https://gitlab.dit.htwk-leipzig.de/htwk-software/htwkarte"
              alt="GitLab Icon"
            />
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b style={{ marginBottom: "0.5em", display: "inline-block" }}>Haftungsausschluss</b>
            <br />
            Die Inhalte der HTWKarte wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
            <br />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
