
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
      try {
        console.log('Initializing MailerLite form with ID:', formId);
        window.ml('show', {
          embedType: 'embed',
          embedId: formId,
          container: containerRef.current
        });
      } catch (error) {
        console.error('Error initializing MailerLite form:', error);
      }
    } else {
      console.warn('MailerLite script not loaded or container not found', { 
        mlExists: !!window.ml, 
        containerExists: !!containerRef.current 
      });
      
      // Attempt to re-initialize after a delay in case script loads late
      const timer = setTimeout(() => {
        if (window.ml && containerRef.current) {
          console.log('Retry initializing MailerLite form');
          window.ml('show', {
            embedType: 'embed',
            embedId: formId,
            container: containerRef.current
          });
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [formId]);

  return (
    <div ref={containerRef} className={`ml-embedded ${className}`} data-form={formId}></div>
  );
};

export default MailerLiteForm;
