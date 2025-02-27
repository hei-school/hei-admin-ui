import {PALETTE_COLORS} from "@/haTheme";
import {Link} from "react-router-dom";

export const EmailField = ({value}: any) => (
  <Link
    to={`mailto:${value}`}
    target="_blank"
    style={{
      color: PALETTE_COLORS.primary,
    }}
  >
    {value}
  </Link>
);
