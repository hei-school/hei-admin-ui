import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {FC, useEffect, useState} from "react";
import {
  ChipField,
  Datagrid,
  FunctionField,
  Link,
  List,
  TextField,
  useGetList,
  useGetOne,
  useListContext,
} from "react-admin";

import {AnnouncementCard} from "@/operations/announcements/components/AnnoucementCard";
import {EmptyList3D} from "@/operations/common/components/EmptyList";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import {CATEGORY} from "@/operations/fees/constants";
import {commentFunctionRenderer} from "@/operations/utils";
import {NOOP_ID} from "@/utils/constants";
import {
  AdvancedFeesStatistics,
  Announcement,
  Fee,
} from "@haapi/typescript-client";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {BadgeDollarSign, BellDot, ExternalLink, UserRoundX} from "lucide-react";
import {CommentContent} from "./common/CommentContent";
import {RecentLetters} from "./common/RecentLetters";
import {WelcomingCard} from "./common/WelcomingCard";

export const AdminWelcome: FC = () => {
  const [animate, setAnimate] = useState(false);
  const {filterValues} = useListContext();
  const {data: stats} = useGetOne<AdvancedFeesStatistics & {id: string}>(
    "stats",
    {
      id: NOOP_ID,
      meta: {resource: "fees_stats", filters: filterValues},
    }
  );
  const {data: LastAnnouncements} = useGetList("announcements", {
    pagination: {
      page: 1,
      perPage: 4,
    },
  });

  useEffect(() => {
    setAnimate(true);
  }, []);

  const isLarge = useMediaQuery("(min-width:1700px)");

  return (
    <Box sx={{p: {xs: 1, md: 2}, overflow: "hidden", bgcolor: "#F9FAFB"}}>
      <WelcomingCard animate={animate} isLarge={isLarge} />
      <RecentLetters animate={animate} />

      <Grid
        container
        spacing={3}
        sx={{
          gap: {xs: 2, md: 2},
        }}
      >
        <Grid item xs={12} lg={7.5}>
          <Stack spacing={4} height="159vh">
            <Box
              sx={{
                width: "100%",
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.5s ease-out 0.8s",
                backgroundColor: "white",
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                position: "relative",
                borderRadius: "8px",
                height: "53vh",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  p: 2,
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  borderBottom: "1px solid",
                  borderColor: alpha("#F44336", 0.1),
                  background: `linear-gradient(135deg, ${alpha("#F44336", 0.1)} 0%, ${alpha("#F44336", 0.07)} 100%)`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "12px",
                  }}
                >
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
                  label={`${stats?.late_fees_count?.monthly} frais en retard`}
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
                title=" "
                resource="fees"
                empty={<EmptyList3D />}
                filter={{
                  status: "LATE",
                  monthFrom: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth() - 1,
                    1
                  ).toISOString(),
                  monthTo: new Date().toISOString(),
                }}
                pagination={false}
                sx={{
                  "padding": "0 !important",
                  "width": "100%",
                  "fontSize": isLarge ? "1rem" : "0.9rem !important",
                  "overflowY": "auto",
                  "height": "90%",
                  "&::-webkit-scrollbar": {
                    width: "0px",
                    background: "transparent",
                  },
                  "scrollbarWidth": "none",
                  "&": {
                    msOverflowStyle: "none",
                  },
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
                  width={"100%"}
                >
                  <TextField source="student_ref" label="Référence" />

                  <TextField source="student_first_name" label="Prénom" />
                  <DateField
                    source="due_datetime"
                    label="Date limite"
                    showTime={false}
                  />
                  <FunctionField
                    source="comment"
                    render={commentFunctionRenderer}
                    label="Commentaire"
                  />
                  <FunctionField
                    source="category"
                    label="Catégorie"
                    render={(record: any) => {
                      const cat = CATEGORY.find(
                        (c) => c.value === record.category
                      );
                      return cat ? cat.label : record.category;
                    }}
                  />
                  <FunctionField
                    label="Reste à payer"
                    render={(fee: Fee) => renderMoney(fee.remaining_amount!)}
                  />
                  <FunctionField
                    label="Voir dans Profil"
                    render={(record) => (
                      <Button
                        component={Link}
                        to={`/students/${record.student_id}/show?tab=fees`}
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
                        Voir
                      </Button>
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
                  borderColor: alpha("#FF9800", 0.2),
                  marginTop: "0.5rem",
                  padding: "5px",
                  position: "absolute",
                  width: "100%",
                  bottom: 0,
                  left: 0,
                  backgroundColor: "white",
                }}
              >
                <Button
                  variant="text"
                  component={Link}
                  to="/fees"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    textTransform: "none",
                    padding: "0.3rem 0.8rem",
                    color: "#F44336",
                  }}
                >
                  Tous les frais en retard
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
                height: "53vh",
                overflow: "hidden",
                position: "relative",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid",
                  borderColor: alpha("#FF9800", 0.1),
                  background: `linear-gradient(135deg, ${alpha("#FF9800", 0.1)} 0%, ${alpha("#FF9800  ", 0.07)} 100%)`,
                }}
              >
                <Box sx={{display: "flex", alignItems: "center"}}>
                  <UserRoundX
                    style={{
                      color: "#FF9800",
                      fontSize: "1.5rem",
                      marginRight: "0.5rem",
                    }}
                  />
                  <Typography variant="h6" fontWeight="bold">
                    Listes de étudiants suspendus
                  </Typography>
                </Box>
              </Box>
              <List
                exporter={false}
                hasCreate={false}
                title=" "
                actions={false}
                empty={<EmptyList3D />}
                resource="students"
                filter={{status: "SUSPENDED"}}
                pagination={false}
                sx={{
                  "padding": "0 !important",
                  "width": "100%",
                  "overflowY": "auto",
                  "height": "90%",
                  "&::-webkit-scrollbar": {
                    width: "0px",
                    background: "transparent",
                  },
                  "scrollbarWidth": "none",
                  "&": {
                    msOverflowStyle: "none",
                  },
                }}
              >
                <Datagrid
                  bulkActionButtons={false}
                  rowSx={() => ({
                    "borderLeft": "1px solid  #FF9800 ",
                    "padding": "5px",
                    "transition": "background-color 0.2s ease",
                    "&:hover": {
                      backgroundColor: `${alpha("#FF9800", 0.05)} !important`,
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
                      <Button
                        component={Link}
                        to={`/students/${record.id}/show`}
                        endIcon={
                          <ExternalLink
                            style={{
                              color: alpha("#FF9800", 0.7),
                            }}
                          />
                        }
                        sx={{
                          "color": alpha("#FF9800", 0.7),
                          "background": alpha("#FF9800", 0.1),
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
                  borderColor: alpha("#FF9800", 0.2),
                  marginTop: "0.5rem",
                  padding: "5px",
                  position: "absolute",
                  width: "100%",
                  bottom: 0,
                  left: 0,
                  backgroundColor: "white",
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
                    color: "#FF9800",
                  }}
                >
                  Tous les étudiants
                </Button>
              </Box>
            </Box>

            <CommentContent animate={animate} />
          </Stack>
        </Grid>

        <Grid
          item
          xs={12}
          lg={4.3}
          sx={{
            "backgroundColor": "white",
            "marginTop": "1rem",
            "borderRadius": "8px",
            "boxShadow": "0px 4px 20px rgba(0, 0, 0, 0.2)",
            "paddingLeft": "0 !important",
            "maxHeight": "160vh",
            "position": "relative",
            "opacity": animate ? 1 : 0,
            "transform": animate ? "translateY(0)" : "translateY(30px)",
            "transition": "all 0.5s ease-out 0.7s",
            "width": "90%",
            "marginInline": "auto",
            "height": "100%",
            "overflowY": "auto",
            "&::-webkit-scrollbar": {
              width: "0px",
              background: "transparent",
            },
            "scrollbarWidth": "none",
            "&": {
              msOverflowStyle: "none",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              mb: 2,
              gap: "0.5rem",
              position: "sticky",
              top: "-24px",
              backgroundColor: "white",
              zIndex: 1,
              height: "7vh",
              padding: "1rem",
            }}
          >
            <BellDot
              style={{
                color: "#ae46f9",
              }}
            />
            <Typography variant="h6" fontSize="1rem" fontWeight="bold">
              Les dernières annonces
            </Typography>
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
        </Grid>
      </Grid>
    </Box>
  );
};
