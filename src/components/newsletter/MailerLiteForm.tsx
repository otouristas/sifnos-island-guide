
import React from 'react';

interface MailerLiteFormProps {
  formId?: string;
  className?: string;
}

const MailerLiteForm = ({
  formId = "LnW40M",
  className = ""
}: MailerLiteFormProps) => {
  return (
    <div className={`ml-embedded ${className}`} data-form={formId}></div>
  );
};

export default MailerLiteForm;
