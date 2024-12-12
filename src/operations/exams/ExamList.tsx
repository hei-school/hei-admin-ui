import {List, useListContext} from "react-admin";
import {
  ImportContactsOutlined as BookIcon,
  PermIdentityOutlined as PersonIcon,
  GradeOutlined as GradeIcon,
  PeopleOutline as GroupIcon,
  CalendarTodayOutlined as CalendarIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import {CreateButton} from "@/ui/haToolbar";
import {HaListTitle} from "@/ui/haList";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {ExamInfo} from "@haapi/typescript-client";
import {formatDate} from "@/utils/date";
import {PALETTE_COLORS} from "@/haTheme";
import {FilterExam} from "./components";

export const ExamList = () => {
  return (
    <Box>
      <List
        title="Examens"
        resource="exams"
        empty={false}
        actions={false}
        pagination={<PrevNextPagination />}
        sx={{mt: 1}}
      >
        <FilterExam />
        <Divider sx={{mt: 3, mb: 2}} />
        <HaListTitle
          title="Liste des examens"
          icon={<GradeIcon />}
          filterIndicator={true}
          actions={
            <Box>
              <CreateButton resource="exams" />
            </Box>
          }
          mainSearch={{label: "", source: ""}}
        />
        <ExamCard />
      </List>
    </Box>
  );
};

export const ExamCard = () => {
  const {data: exams = []} = useListContext();

  return (
    <Box sx={{padding: "20px", minHeight: "100vh"}}>
      <Grid container direction="row" spacing={4}>
        {exams.map((exam: ExamInfo) => (
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <Card
              sx={{
                "borderRadius": "12px",
                "boxShadow": "0 4px 16px rgba(0, 0, 0, 0.05)",
                "margin": "20px 0",
                "padding": "16px",
                "background": "linear-gradient(135deg, #f8f9fa, #f1f3f5)",
                "transition": "0.3s",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                },
                "width": "100%",
              }}
            >
              <CardHeader
                sx={{
                  borderRadius: "15px",
                }}
                title={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#005b87",
                    }}
                  >
                    <Typography variant="h6" sx={{fontWeight: "bold"}}>
                      {exam.title}
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "#005b87",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                      }}
                    >
                      Coef. {exam.coefficient}
                    </Box>
                  </Box>
                }
              />
              <CardContent sx={{padding: "16px"}}>
                <Typography
                  sx={{
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  <PersonIcon sx={{fontSize: "1.5rem", marginRight: "10px"}} />
                  Enseignant: {
                    exam.awarded_course?.main_teacher?.first_name
                  }{" "}
                  {exam.awarded_course?.main_teacher?.last_name}
                </Typography>
                <Typography
                  sx={{
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  <BookIcon sx={{fontSize: "1.5rem", marginRight: "10px"}} />
                  Cours: {exam.awarded_course?.course?.code}
                </Typography>

                <Typography
                  sx={{
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  <GroupIcon sx={{fontSize: "1.5rem", marginRight: "10px"}} />
                  Groupe: {exam.awarded_course?.group?.ref}
                </Typography>
                <Typography
                  sx={{
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  <CalendarIcon
                    sx={{
                      fontSize: "1.5rem",
                      marginRight: "10px",
                      color: PALETTE_COLORS.red,
                    }}
                  />
                  Date et heure: {formatDate(exam.examination_date)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
