import backgroundImg from "@/assets/Fond-HEI-1.png";
import managerImg from "@/assets/Jeune_panneau.png";
import {PALETTE_COLORS} from "@/haTheme";
import authProvider from "@/providers/authProvider";
import {alpha, Box, Typography} from "@mui/material";
import {FC} from "react";
import {useGetOne} from "react-admin";

export const WelcomingCard: FC<{animate: boolean; isLarge: boolean}> = ({
  animate,
  isLarge,
}) => {
  const {data: user} = useGetOne("profile", {
    id: authProvider.getCachedWhoami().id,
  });
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <Box
      sx={{
        "width": "100%",
        "height": {xs: "25vh", md: isLarge ? "30vh" : "35vh"},
        "position": "relative",
        "borderRadius": "1.5rem",
        "backgroundColor": alpha(PALETTE_COLORS.primary, 0.95),
        "backgroundImage": `url(${backgroundImg})`,
        "backgroundPosition": "left top",
        "backgroundSize": "cover",
        "backgroundRepeat": "no-repeat",
        "padding": {xs: "1.5rem", md: "2.5rem"},
        "boxShadow": "0 10px 30px rgba(0, 25, 72, 0.15)",
        "transition": "all 0.3s ease-in-out",
        "mb": 3,
        "&:hover": {
          boxShadow: "0 15px 40px rgba(0, 25, 72, 0.2)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease-out",
        }}
      >
        <Typography
          variant="h2"
          fontSize={{xs: "1.8rem", md: isLarge ? "2.5rem" : "2rem"}}
          fontWeight="bold"
          color={PALETTE_COLORS.white}
          sx={{
            textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            mb: 1,
          }}
        >
          {getGreeting()} {user?.first_name ?? user?.last_name} 👋
        </Typography>
        <Typography
          variant="h4"
          fontSize={{xs: "1.2rem", md: isLarge ? "1.5rem" : "1.3rem"}}
          fontWeight="bold"
          color={PALETTE_COLORS.yellow}
          sx={{textShadow: "0 2px 8px rgba(0,0,0,0.3)"}}
        >
          Continuons à bâtir l'excellence 🚀🛠️
        </Typography>
        <Typography
          color={PALETTE_COLORS.white}
          sx={{
            opacity: 0.9,
            fontStyle: "italic",
            mt: 1,
          }}
        >
          Penser. Travailler. Impacter.
        </Typography>
        <Typography
          width={{xs: "100%", md: "50%"}}
          fontSize={{xs: "1rem", md: isLarge ? "1.2rem" : "1.1rem"}}
          marginTop="1rem"
          color={PALETTE_COLORS.white}
          sx={{opacity: 0.85}}
        >
          Parce que chaque pensée nourrit l'innovation, chaque action construit
          l'avenir, et chaque geste a un impact durable.
        </Typography>
      </Box>

      <Box
        component="img"
        src={managerImg}
        sx={{
          position: "absolute",
          bottom: -23,
          right: {xs: "-5vw", md: "2vw"},
          width: {xs: "15rem", md: isLarge ? "19.8rem" : "18rem"},
          objectFit: "cover",
          zIndex: 10,
          opacity: animate ? 1 : 0,
          transform: animate ? "translateX(0)" : "translateX(100px)",
          transition: "all 0.8s ease-out 0.3s",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "30%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(PALETTE_COLORS.yellow, 0.2)} 0%, rgba(255,255,255,0) 70%)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha("#4CAF50", 0.15)} 0%, rgba(255,255,255,0) 70%)`,
          zIndex: 0,
        }}
      />
    </Box>
  );
};
