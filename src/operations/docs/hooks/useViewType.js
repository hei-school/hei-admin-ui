import {useLocation} from "react-router-dom";

export const useViewType = (utility) => {
  const location = useLocation();

  const endpoint = location.pathname.split("/");

  switch (utility) {
    case "LIST":
      return endpoint[endpoint.length - 1];
    case "SHOW":
      return endpoint[endpoint.length - 2];
    default:
      console.error("Utility not known.");
      return;
  }
};
