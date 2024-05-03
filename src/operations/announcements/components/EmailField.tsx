import {Link} from "react-router-dom";

export const EmailField = ({value}: any) => (
  <Link to={`mailto:${value}`}>{value}</Link>
);
