import {PALETTE_COLORS} from "@/haTheme";
import {ReactNode} from "react";
import {Link} from "react-router-dom";

interface EmailFieldProps {
  email: string;
  children?: ReactNode;
}

export const EmailField = ({email, children}: Readonly<EmailFieldProps>) => (
  <Link
    to={`mailto:${email}`}
    target="_blank"
    style={{
      color: PALETTE_COLORS.primary,
    }}
  >
    {children ?? email}
  </Link>
);
