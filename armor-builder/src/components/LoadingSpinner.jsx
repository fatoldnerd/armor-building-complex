const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-spinner">
      <div className="flex flex-column flex-center">
        <div className="spinner"></div>
        <p className="mt-2">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;