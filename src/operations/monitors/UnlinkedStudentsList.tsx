import {PALETTE_COLORS} from "@/haTheme";
import {ToRaRecord} from "@/providers/types";
import {MonitorStudentLink} from "@haapi-b0fc7615/typescript-client";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {useMemo} from "react";
import {Loading, useGetList} from "react-admin";

export const UnlinkedStudentsList = () => {
  const {data: links, isLoading} =
    useGetList<ToRaRecord<MonitorStudentLink>>("unlinked-students");

  const groupedData = useMemo(() => {
    if (!links) return [];
    const groups: Record<string, any> = {};

    links.forEach((item) => {
      const mId = item?.monitor?.id!;
      if (!groups[mId]) {
        groups[mId] = {
          monitor: item.monitor,
          requests: [],
        };
      }
      groups[mId].requests.push({
        id: item.id,
        student: item.student,
      });
    });
    return Object.values(groups);
  }, [links]);

  if (isLoading) return <Loading />;

  return (
    <Box sx={{bgcolor: "#f8fafc", minHeight: "100vh", py: 5}}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {groupedData.map((group: any) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={group.monitor.id}>
              <Paper
                elevation={0}
                sx={{
                  "height": "100%",
                  "borderRadius": 4,
                  "overflow": "hidden",
                  "border": "1px solid rgba(226, 232, 240, 0.8)",
                  "boxShadow": "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                  "transition": "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg ,${PALETTE_COLORS.primary} 0%, #818cf8 100%)`,
                    color: "white",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Avatar
                      src={group.monitor.profile_picture}
                      sx={{
                        width: 56,
                        height: 56,
                        border: "3px solid rgba(255,255,255,0.4)",
                        bgcolor: "white",
                        color: PALETTE_COLORS.yellow,
                        fontWeight: "bold",
                        FONTSIZE: "2rem",
                      }}
                    >
                      {group.monitor.first_name[0]}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{fontWeight: 700, lineHeight: 1.1}}
                      >
                        {group.monitor.first_name}
                      </Typography>
                      <Typography variant="subtitle2" sx={{opacity: 0.9}}>
                        {group.monitor.last_name}
                      </Typography>
                      <Chip
                        label={`${group.requests.length} demande(s)`}
                        size="small"
                        sx={{
                          mt: 1,
                          height: 20,
                          fontSize: "0.65rem",
                          bgcolor: "rgba(255,255,255,0.2)",
                          color: "white",
                          backdropFilter: "blur(4px)",
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.1)",
                    }}
                  />
                </Box>
                <Stack spacing={0} sx={{bgcolor: "white"}}>
                  {group.requests.map((req: any, index: number) => (
                    <Box
                      key={req.id || index}
                      sx={{
                        "display": "flex",
                        "alignItems": "center",
                        "p": 1.5,
                        "borderRadius": 2,
                        "&:hover": {bgcolor: "#f1f5f9"},
                      }}
                    >
                      <Avatar
                        src={req.student.profile_picture}
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 2,
                        }}
                      />
                      <Box sx={{flexGrow: 1, maxWidth: "30ch"}}>
                        <Typography
                          variant="body2"
                          maxWidth="20ch"
                          sx={{
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {req.student.first_name} {req.student.last_name}
                        </Typography>
                        <Typography
                          variant="caption"
                          maxWidth="25ch"
                          color="textSecondary"
                          sx={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {req.student.email}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
