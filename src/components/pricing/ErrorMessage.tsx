
interface ErrorMessageProps {
  errors: any;
}

export const ErrorMessage = ({ errors }: ErrorMessageProps) => {
  if (!errors || Object.keys(errors).length === 0) return null;
  
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-red-600 font-medium">Please correct the errors above and try again.</p>
    </div>
  );
};
