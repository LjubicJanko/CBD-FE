import { ContactInfoData } from '../../../../types/Order';
import * as Styled from './ContactInfoForm.styles';

export type ContactInfoFormProps = {
  contactInfo?: ContactInfoData;
};

const ContactInfoForm = ({ contactInfo }: ContactInfoFormProps) => {
  return (
    <Styled.ContactInfoFormContainer>
      {contactInfo?.address}
    </Styled.ContactInfoFormContainer>
  );
};

export default ContactInfoForm;
