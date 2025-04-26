import PersonIcon from "@mui/icons-material/Person";
import { HTWK_LIGHT_TEXT } from "../Color";
import BaseInfoBox from "./BaseInfoBox";
import BaseInfoRow from "./BaseInfoRow";
import { ContactInfo } from "./InfoDrawerTypes";

const ContactBox = ({ contact }: { contact: ContactInfo }) => {
  const contactContent = [];

  if (contact.person) contactContent.push(BaseInfoRow(contact.person));
  if (contact.email)
    contactContent.push(
      BaseInfoRow(
        <a style={{ color: HTWK_LIGHT_TEXT }} href={`mailto:${contact.email}`}>
          {contact.email}
        </a>,
      ),
    );
  if (contact.telephone && contact.telephone.length > 0) {
    const phoneNumber = contact.telephone[0].number;
    contactContent.push(
      BaseInfoRow(
        <a style={{ color: HTWK_LIGHT_TEXT + " !important" }} href={`tel:${phoneNumber}`}>
          {phoneNumber}
        </a>,
      ),
    );
  }
  if (contact.department) contactContent.push(BaseInfoRow(contact.department));

  return (
    <BaseInfoBox
      icon={<PersonIcon sx={{ alignSelf: "center", mb: "0.4em" }} />}
      content={contactContent}
    />
  );
};

export default ContactBox;
