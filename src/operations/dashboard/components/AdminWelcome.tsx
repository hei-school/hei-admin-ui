import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import {FC, useEffect, useState} from "react";
import {ChipField, FunctionField, TextField} from "react-admin";

import backgroundImg from "@/assets/Fond-HEI-1.png";
import managerImg from "@/assets/Jeune_panneau.png";

import {PALETTE_COLORS} from "@/haTheme";

import {AnnouncementCard} from "@/operations/announcements/components/AnnoucementCard";
import authProvider from "@/providers/authProvider";
import {Announcement} from "@haapi/typescript-client";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MailIcon from "@mui/icons-material/Mail";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {BadgeDollarSign, BellDot, ExternalLink, UserRoundX} from "lucide-react";
import {Datagrid, Link, List, useGetList, useGetOne} from "react-admin";
import {RecentLetters} from "./common/RecentLetters";

const mockStats = [
  {
    id: 1,
    title: "Total Students",
    count: 1254,
    icon: <PeopleAltIcon />,
    color: "#4CAF50",
    progress: 85,
  },
  {
    id: 2,
    title: "Active Courses",
    count: 42,
    icon: <SchoolIcon />,
    color: "#2196F3",
    progress: 70,
  },
  {
    id: 3,
    title: "New Messages",
    count: 18,
    icon: <MailIcon />,
    color: "#FF9800",
    progress: 45,
  },
  {
    id: 4,
    title: "Pending Issues",
    count: 7,
    icon: <WarningAmberIcon />,
    color: "#F44336",
    progress: 30,
  },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
};

export const AdminWelcome: FC = () => {
  const [animate, setAnimate] = useState(false);
  const {data: user} = useGetOne("profile", {
    id: authProvider.getCachedWhoami().id,
  });

  const {data: LastAnnouncements} = useGetList("announcements", {
    pagination: {
      page: 1,
      perPage: 4,
    },
  });

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <Box sx={{p: {xs: 1, md: 2}, overflow: "hidden", bgcolor: "#F9FAFB"}}>
      <Box
        sx={{
          "width": "100%",
          "height": {xs: "25vh", md: "30vh"},
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
            fontSize={{xs: "1.8rem", md: "2.5rem"}}
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
            fontSize={{xs: "1.2rem", md: "1.5rem"}}
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
            fontSize={{xs: "1rem", md: "1.2rem"}}
            marginTop="1rem"
            color={PALETTE_COLORS.white}
            sx={{opacity: 0.85}}
          >
            Parce que chaque pensée nourrit l'innovation, chaque action
            construit l'avenir, et chaque geste a un impact durable.
          </Typography>
        </Box>

        <Box
          component="img"
          src={managerImg}
          sx={{
            position: "absolute",
            bottom: -23,
            right: {xs: "-5vw", md: "2vw"},
            width: {xs: "15rem", md: "19.8rem"},
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

      <Grid container spacing={3} sx={{mb: 4}}>
        {mockStats.map((stat, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={stat.id}
            sx={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(30px)",
              transition: `all 0.5s ease-out ${0.2 + index * 0.1}s`,
            }}
          >
            <Card
              sx={{
                "borderRadius": "1rem",
                "overflow": "visible",
                "height": "100%",
                "position": "relative",
                "background": `linear-gradient(135deg, ${alpha(stat.color, 0.05)} 0%, ${alpha(stat.color, 0.15)} 100%)`,
                "boxShadow": `0 10px 20px ${alpha(stat.color, 0.1)}`,
                "border": `1px solid ${alpha(stat.color, 0.1)}`,
                "transition": "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: `0 15px 30px ${alpha(stat.color, 0.2)}`,
                },
              }}
            >
              <CardContent sx={{p: 3}}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: PALETTE_COLORS.typography.black,
                    }}
                  >
                    {stat.title}
                  </Typography>
                  <Avatar
                    sx={{
                      bgcolor: alpha(stat.color, 0.9),
                      boxShadow: `0 4px 10px ${alpha(stat.color, 0.3)}`,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    mb: 1.5,
                    color: stat.color,
                  }}
                >
                  {stat.count}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stat.progress}
                  sx={{
                    "height": 8,
                    "borderRadius": 4,
                    "backgroundColor": alpha(stat.color, 0.1),
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: stat.color,
                      borderRadius: 4,
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <RecentLetters />

      <Grid
        container
        spacing={3}
        sx={{
          gap: {xs: 2, md: 3},
        }}
      >
        <Grid item xs={12} lg={7.5}>
          <Stack spacing={4} height="100%">
            <Box
              sx={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.5s ease-out 0.8s",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                padding: "1rem",
                height: "50%",
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
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <BadgeDollarSign
                    style={{
                      color: "#F44336",
                      fontSize: "1.5rem",
                      marginRight: "0.5rem",
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Listes des frais en retard
                  </Typography>
                </Box>
                <Chip
                  label={`${4} Étudiants`}
                  color="error"
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: alpha("#F44336", 0.1),
                    color: "#F44336",
                    border: "1px solid rgba(244, 67, 54, 0.2)",
                  }}
                />
              </Box>
              <List
                exporter={false}
                hasCreate={false}
                actions={false}
                resource="fees"
                filter={{status: "LATE"}}
                pagination={false}
                sx={{
                  padding: "0 !important",
                }}
              >
                <Datagrid
                  bulkActionButtons={false}
                  rowSx={() => ({
                    "borderLeft": "1px solid  #F44336 ",
                    "padding": "5px",
                    "transition": "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: `${alpha("#F44336", 0.05)} !important`,
                    },
                  })}
                >
                  <FunctionField
                    render={(record) => <Avatar src={record.profile_picture} />}
                  />
                  <TextField source="ref" label="Référence" />
                  <TextField source="first_name" label="Prénom" />
                  <TextField source="last_name" label="Nom" />

                  <FunctionField
                    label="groupe"
                    render={() => {
                      return (
                        <ChipField
                          source="groups[0].ref"
                          variant="outlined"
                          sx={{
                            background: "groups[0].attributed_color",
                          }}
                        />
                      );
                    }}
                  />
                  <FunctionField
                    label="Profil"
                    render={(record) => (
                      <>
                        <Button
                          component={Link}
                          to={`/students/${record.id}/show`}
                          endIcon={
                            <ExternalLink
                              style={{
                                color: alpha("#F44336", 0.7),
                              }}
                            />
                          }
                          sx={{
                            "color": alpha("#F44336", 0.7),
                            "background": alpha("#F44336", 0.1),
                            "textTransform": "none",
                            "border": "1px solid transparent",
                            "padding": "5px 1rem",
                            "&:hover": {
                              border: "1px solid",
                            },
                          }}
                        >
                          Voir Profil
                        </Button>
                      </>
                    )}
                  />
                </Datagrid>
              </List>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTop: "1px solid",
                  borderColor: alpha("#F44336", 0.2),
                  marginTop: "0.5rem",
                  padding: "5px",
                }}
              >
                <Button
                  variant="text"
                  component={Link}
                  to="/students"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    textTransform: "none",
                    padding: "0.3rem 0.8rem",
                    color: "#F44336",
                  }}
                >
                  Tous les étudiants
                </Button>
              </Box>
            </Box>

            <Box
              sx={{
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.5s ease-out 0.8s",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                padding: "1rem",
                height: "50%",
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
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <UserRoundX
                    style={{
                      color: "#F44336",
                      fontSize: "1.5rem",
                      marginRight: "0.5rem",
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Listes de étudiants suspendus
                  </Typography>
                </Box>
                <Chip
                  label={`${4} Étudiants`}
                  color="error"
                  size="small"
                  sx={{
                    fontWeight: "bold",
                    bgcolor: alpha("#F44336", 0.1),
                    color: "#F44336",
                    border: "1px solid rgba(244, 67, 54, 0.2)",
                  }}
                />
              </Box>
              <List
                exporter={false}
                hasCreate={false}
                actions={false}
                resource="students"
                filter={{status: "SUSPENDED"}}
                pagination={false}
                sx={{
                  padding: "0 !important",
                }}
              >
                <Datagrid
                  bulkActionButtons={false}
                  rowSx={() => ({
                    "borderLeft": "1px solid  #F44336 ",
                    "padding": "5px",
                    "transition": "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: `${alpha("#F44336", 0.05)} !important`,
                    },
                  })}
                >
                  <FunctionField
                    render={(record) => <Avatar src={record.profile_picture} />}
                  />
                  <TextField source="ref" label="Référence" />
                  <TextField source="first_name" label="Prénom" />
                  <TextField source="last_name" label="Nom" />

                  <FunctionField
                    label="groupe"
                    render={() => {
                      return (
                        <ChipField
                          source="groups[0].ref"
                          variant="outlined"
                          sx={{
                            background: "groups[0].attributed_color",
                          }}
                        />
                      );
                    }}
                  />
                  <FunctionField
                    label="Profil"
                    render={(record) => (
                      <>
                        <Button
                          component={Link}
                          to={`/students/${record.id}/show`}
                          endIcon={
                            <ExternalLink
                              style={{
                                color: alpha("#F44336", 0.7),
                              }}
                            />
                          }
                          sx={{
                            "color": alpha("#F44336", 0.7),
                            "background": alpha("#F44336", 0.1),
                            "textTransform": "none",
                            "border": "1px solid transparent",
                            "padding": "5px 1rem",
                            "&:hover": {
                              border: "1px solid",
                            },
                          }}
                        >
                          Voir Profil
                        </Button>
                      </>
                    )}
                  />
                </Datagrid>
              </List>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTop: "1px solid",
                  borderColor: alpha("#F44336", 0.2),
                  marginTop: "0.5rem",
                  padding: "5px",
                }}
              >
                <Button
                  variant="text"
                  component={Link}
                  to="/students"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    textTransform: "none",
                    padding: "0.3rem 0.8rem",
                    color: "#F44336",
                  }}
                >
                  Tous les étudiants
                </Button>
              </Box>
            </Box>
          </Stack>
        </Grid>

        <Grid
          item
          xs={12}
          lg={4.3}
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            paddingLeft: "0 !important",
          }}
        >
          <Box
            sx={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.5s ease-out 0.7s",
              width: "90%",
              marginInline: "auto",
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
              <Box display="flex" gap="0.5rem" alignItems="center">
                <BellDot
                  style={{
                    color: "#ae46f9",
                  }}
                />
                <Typography variant="h6" fontSize="1  rem" fontWeight="bold">
                  Latest Announcements
                </Typography>
              </Box>

              <Chip
                label={`${4} New`}
                color="primary"
                size="small"
                sx={{
                  fontWeight: "bold",
                  bgcolor: alpha("#ae46f9", 0.1),
                  color: "#ae46f9",
                  border: "1px solid rgba(174, 70, 249, 0.2)",
                }}
              />
            </Box>

            <Stack
              spacing={8}
              sx={{
                padding: "1rem",
                marginTop: "7vh",
              }}
            >
              {LastAnnouncements?.map((announcement: Announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  id={announcement.id!}
                  scope={announcement.scope!}
                  title={announcement.title!}
                  author={announcement.author!}
                  creation_datetime={announcement.creation_datetime!}
                  isLoading={false}
                />
              ))}
            </Stack>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: 2,
                gap: 1,
                borderTop: "1px solid rgba(174, 70, 249, 0.2)",
                padding: "5px ",
              }}
            >
              <Button
                variant="text"
                component={Link}
                to="/announcements"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  textTransform: "none",
                  padding: "0.3rem 0.8rem",
                  color: "#ae46f9",
                }}
              >
                Tous les annonces
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
