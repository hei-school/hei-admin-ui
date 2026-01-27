import {PALETTE_COLORS} from "@/haTheme";
import {Avatar} from "@mui/material";
import {useState} from "react";

interface ProfilePictureProps {
  src?: string;
  firstName?: string;
  lastName?: string;
  size?: number;
}

export const ProfilePicture = ({
  src,
  firstName,
  lastName,
  size = 40,
}: ProfilePictureProps) => {
  const [hasError, setHasError] = useState(false);
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}` || "?";
  const showImage = src && !hasError;

  return (
    <Avatar
      src={showImage ? src : undefined}
      alt={`${firstName ?? ""} ${lastName ?? ""}`}
      onError={() => setHasError(true)}
      sx={{
        width: size,
        height: size,
        border: `2px solid ${PALETTE_COLORS.primary}`,
        bgcolor: PALETTE_COLORS.primary,
        fontWeight: 600,
        fontSize: size * 0.4,
        flexShrink: 0,
      }}
    >
      {!showImage && initials}
    </Avatar>
  );
};
