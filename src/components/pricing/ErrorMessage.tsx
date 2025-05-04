
interface ErrorMessageProps {
  errors: any;
}

export const ErrorMessage = ({ errors }: ErrorMessageProps) => {
  if (!errors || Object.keys(errors).length === 0) return null;
  
  return (
    <div className="p-4 bg-red-100 border border-red-300 rounded-lg shadow-sm">
      <p className="text-red-700 font-medium">Please correct the errors above and try again.</p>
    </div>
  );
};
