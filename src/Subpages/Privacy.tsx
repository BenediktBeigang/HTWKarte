import { Box, Link, List, ListItem, Typography, useMediaQuery } from "@mui/material";
import { Header } from "../Header";

export const Privacy = () => {
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
        margin="auto"
        justifyContent="center"
        alignItems="center"
        sx={{
            paddingTop: (matches ? "7em" : "10em"),
            maxWidth: {
                xs: "90%",
                sm: "60%",
            },
            overflowX: "hidden",
            overflowY: "scroll",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
                display: "none",
            },
        }}
      >
        <Typography variant={matches ? "h2" : "h4"} gutterBottom>
          Datenschutz-Erklärung nach der DSGVO
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "2em" }}>
          <Typography variant="body1" gutterBottom component="div">
            Diese Datenschutzerklärung informiert Sie über die Art, den Umfang und den Zweck der
            Erhebung und Verwendung personenbezogener Daten der HTWKarte. Die App wird als privates
            Studienprojekt betrieben und speichert oder verarbeitet keine Nutzerdaten. Das Hosting
            erfolgt über Cloudflare. <br />
          </Typography>

          <Typography variant={matches ? "h4" : "h6"} gutterBottom component="div">
            Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck von deren
            Verwendung
          </Typography>
          <Typography variant="body1" gutterBottom component="div">
            <b style={{ marginBottom: "0.5em", display: "inline-block" }}>Nutzung der App</b>
            <br />
            Die HTWKarte erhebt oder speichert keine personenbezogenen Daten der Nutzer. Die App
            bietet lediglich eine Suchfunktion für Räume an. Alle Eingaben in die Suchleiste werden
            nur lokal verarbeitet und nicht gespeichert oder weitergeleitet. <br />
          </Typography>
          <Typography variant="body1" gutterBottom component="div">
            <b style={{ marginBottom: "0.5em", display: "inline-block" }}>Hosting</b>
            <br />
            Diese App wird von Cloudflare gehostet. Cloudflare verarbeitet bestimmte technische
            Daten (z.B. IP-Adressen) zur Bereitstellung und Absicherung der App. Weitere
            Informationen finden Sie in der{" "}
            <Link
              href="https://www.cloudflare.com/de-de/trust-hub/gdpr/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              Datenschutzrichtlinie
            </Link>{" "}
            von Cloudflare.
            <br />
          </Typography>
          <Typography variant="body1" gutterBottom component="div">
            <b style={{ marginBottom: "0.5em", display: "inline-block" }}>Ihre Rechte</b>
            <br />
            <List sx={{ marginBottom: "-2em" }}>
              <ListItem>
                • Sie haben das Recht: gemäß Art. 15 DSGVO Auskunft über Ihre von uns verarbeiteten
                personenbezogenen Daten zu verlangen.
              </ListItem>
              <ListItem>
                • gemäß Art. 16 DSGVO unverzüglich die Berichtigung unrichtiger oder
                Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen.
              </ListItem>
              <ListItem>
                • gemäß Art. 17 DSGVO die Löschung Ihrer bei uns gespeicherten personenbezogenen
                Daten zu verlangen.
              </ListItem>
              <ListItem>
                • gemäß Art. 18 DSGVO die Einschränkung der Verarbeitung Ihrer personenbezogenen
                Daten zu verlangen.
              </ListItem>
              <ListItem>
                • gemäß Art. 20 DSGVO Ihre personenbezogenen Daten, die Sie uns bereitgestellt
                haben, in einem strukturierten, gängigen und maschinenlesebaren Format zu erhalten
                oder die Übermittlung an einen anderen Verantwortlichen zu verlangen.
              </ListItem>
              <ListItem>
                • gemäß Art. 77 DSGVO sich bei einer Aufsichtsbehörde zu beschweren.
              </ListItem>
            </List>
            <br />
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "3em"}} gutterBottom component="div">
            <b style={{ marginBottom: "0.5em", display: "inline-block" }}>
              Änderungen dieser Datenschutzrichtlinie
            </b>
            <br />
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den
            aktuellen rechtlichen Anforderungen entspricht oder um Änderungen der HTWKarte in der
            Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue
            Datenschutzerklärung. <br />
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
