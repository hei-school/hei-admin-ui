import {PALETTE_COLORS} from "@/haTheme";
import {ReactNode} from "react";
import {Link} from "react-router-dom";

interface EmailFieldProps {
  value: ReactNode;
}

export const EmailField = ({value}: Readonly<EmailFieldProps>) => (
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
