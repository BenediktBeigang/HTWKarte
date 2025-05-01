import PersonIcon from "@mui/icons-material/Person";
import { Divider, Link, Stack, Typography } from "@mui/material";
import { HTWK_LIGHT_TEXT } from "../Color";
import BaseInfoBox from "./BaseInfoBox";
import useInfoDrawer from "./useInfoDrawer";

const ContactBox = () => {
  const { contactCard } = useInfoDrawer();

  if (!contactCard) return <></>;

  return (
    <BaseInfoBox icon={<PersonIcon sx={{ alignSelf: "center", mb: "0.4em" }} />}>
      <Stack sx={{ paddingX: "1em", paddingY: "0.5em", gap: "0.5em", justifyContent: "left" }}>
        <Typography>{contactCard.person}</Typography>

        {contactCard.email && (
          <>
            <Divider sx={{ opacity: 0.2 }} />
            <Link
              sx={{
                color: HTWK_LIGHT_TEXT,
                textDecoration: "underline",
                paddingTop: "0.05em",
                fontSize: "1.1em",
                userSelect: "text",
                WebkitUserSelect: "text",
                MozUserSelect: "text",
              }}
              href={`mailto:${contactCard.email}`}
            >
              {contactCard.email}
            </Link>
          </>
        )}

        {contactCard.telephone && contactCard.telephone.length > 0 && (
          <>
            <Divider sx={{ opacity: 0.2 }} />
            <Link
              sx={{
                color: HTWK_LIGHT_TEXT,
                textDecoration: "underline",
                paddingTop: "0.05em",
                fontSize: "1.1em",
                userSelect: "text",
                WebkitUserSelect: "text",
                MozUserSelect: "text",
              }}
              href={`tel:${contactCard.telephone[0].number}`}
            >
              {contactCard.telephone[0].number}
            </Link>
          </>
        )}

        {contactCard.department && (
          <>
            <Divider sx={{ opacity: 0.2 }} />
            <Typography>{contactCard.department}</Typography>
          </>
        )}
      </Stack>
    </BaseInfoBox>
  );
};

export default ContactBox;
