
import React, { useEffect, useRef } from 'react';

interface MailerLiteFormProps {
  formId?: string;
  className?: string;
}

const MailerLiteForm = ({
  formId = "LnW40M",
  className = ""
}: MailerLiteFormProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize the form if the ml function exists
    if (window.ml && containerRef.current) {
      // Small timeout to ensure the element is properly in the DOM
      setTimeout(() => {
        window.ml('show', {
          embedType: 'embed',
          embedId: formId,
          container: containerRef.current
        });
      }, 100);
    }
  }, [formId]);

  return (
    <div ref={containerRef} className={`ml-embedded ${className}`} data-form={formId}></div>
  );
};

export default MailerLiteForm;
