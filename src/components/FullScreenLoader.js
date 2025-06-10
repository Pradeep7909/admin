import { useEffect } from "react";

const FullScreenLoader = ({ isLoading }) => {
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Enable scrolling
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="full-screen-loader">
      <div className="custom-spinner"></div>
    </div>
  );
};

export default FullScreenLoader;
