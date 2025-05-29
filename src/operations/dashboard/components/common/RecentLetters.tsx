import {PALETTE_COLORS} from "@/haTheme";
import {LetterItem} from "@/operations/letters/components";
import {useRole} from "@/security/hooks";
import {alpha, Box, Chip, Typography} from "@mui/material";
import {FileBox, MoveRight} from "lucide-react";
import {FC} from "react";
import {Button, Link, useGetList, useGetOne} from "react-admin";

export const RecentLetters: FC<{animate: boolean}> = ({animate}) => {
  const letters = useGetList("letters", {
    pagination: {page: 1, perPage: 4},
  });

  const role = useRole();

  const {data: letterStats} = useGetOne(
    "letters-stats",
    {id: undefined},
    {
      enabled: role.isManager() || role.isAdmin(),
    }
  );

  return (
    <Box
      sx={{
        mb: 4,
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.5s ease-out 0.6s",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        padding: "1.5rem",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box display="flex" gap="1rem">
          <FileBox color="rgba(59, 130, 246, 1)" />
          <Typography variant="h6" fontWeight="bold">
            Lettres récemment envoyées
          </Typography>
        </Box>
        <Chip
          label={`${letterStats?.pending!} en attente`}
          color="info"
          size="small"
          sx={{
            fontWeight: "bold",
            bgcolor: alpha("#3B82F6", 0.1),
            color: "rgba(59, 130, 246, 1)",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          width: "100%",
          overflow: "hidden",
        }}
      >
        {letters.data
          ?.slice(0, 4)
          .map((letter) => <LetterItem key={letter.id} letter={letter} />)}
      </Box>

      <Box sx={{display: "flex", justifyContent: "center", mt: 2}}>
        <Button
          component={Link}
          variant="text"
          to={"/profile?tab=letters"}
          endIcon={
            <MoveRight
              style={{
                fontWeight: 700,
              }}
            />
          }
          sx={{
            "textTransform": "none",
            "padding": "0.3rem 0.8rem",
            "color": "rgba(59, 130, 246, 1)",
            "&:hover": {
              borderColor: PALETTE_COLORS.yellow,
              bgcolor: alpha(PALETTE_COLORS.yellow, 0.1),
              color: PALETTE_COLORS.yellow,
            },
          }}
          label="Voir toutes les lettres"
        />
      </Box>
    </Box>
  );
};
