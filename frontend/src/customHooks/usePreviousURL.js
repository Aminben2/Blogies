import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
const usePreviousURL = () => {
  const location = useLocation();
  const prevLocationRef = useRef(null);

  useEffect(() => {
    prevLocationRef.current = location.pathname;
  }, [location]);

  return prevLocationRef.current;
};

export default usePreviousURL;
