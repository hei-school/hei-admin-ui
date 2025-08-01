import {ImportContactsOutlined as BookIcon} from "@mui/icons-material";
import {Box, Button, LinearProgress, Typography} from "@mui/material";
import {List, useListContext} from "react-admin";

import EmptyBox from "@/assets/empty-box.webp";
import {PALETTE_COLORS} from "@/haTheme";
import {ExamCard, ExamFilter} from "@/operations/exams/components";
import {useRole} from "@/security/hooks";
import {ResponsiveGrid} from "@/ui/components";
import {HaListTitle} from "@/ui/haList";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {CreateButton} from "@/ui/haToolbar";
import {Exam} from "@haapi/typescript-client";
import {useNavigate} from "react-router-dom";

export const ExamList = () => {
  const {isManager, isAdmin, isTeacher} = useRole();
  const navigate = useNavigate();

  return (
    <List
      sx={{
        "mt": 2,
        "& .RaList-content": {
          boxShadow: "none",
          backgroundColor: "none",
        },
      }}
      title="Liste des examens"
      perPage={12}
      actions={false}
      empty={false}
      pagination={<PrevNextPagination />}
    >
      <ExamLoaderContent />
      <HaListTitle
        filterIndicator
        title="Liste des examens"
        mainSearch={{source: "", label: ""}}
        icon={<BookIcon />}
        actions={(isManager() || isAdmin() || isTeacher()) && <ExamActions />}
      />
      <Box marginInline={5} display="flex" flexDirection="column" gap="1vh">
        <Typography>
          Veuillez trouver ci-joint la liste des différents examens.
        </Typography>
        <Button
          startIcon={<BookIcon />}
          size="medium"
          variant="outlined"
          sx={{
            backgroundColor: PALETTE_COLORS.white,
            colors: PALETTE_COLORS.primary,
            padding: "0.5rem 1.5rem",
            borderRadius: "0.4rem",
          }}
          onClick={() => navigate("/my-exam")}
        >
          Voir mes examens
        </Button>
      </Box>
      <ExamsGridContent />
    </List>
  );
};

const ExamLoaderContent = () => {
  const {isLoading} = useListContext();
  return isLoading && <LinearProgress />;
};

const ExamActions = () => (
  <Box data-testId="exam-actions-btn">
    <CreateButton resource="exams" />
    <ExamFilter />
  </Box>
);

const ExamsGridContent = () => {
  const {data: exams = [], isLoading} = useListContext();

  if (!isLoading && exams.length === 0) {
    return (
      <Box m={5} textAlign="center">
        <img src={EmptyBox} alt="No item found" />
        <Typography variant="h6" color="textSecondary">
          Aucun examen trouvé.
        </Typography>
      </Box>
    );
  }

  return (
    <ResponsiveGrid gap="1.5rem">
      {exams.map((exam: Exam) => (
        <ExamCard
          data-testId="exam-card"
          key={exam.id}
          exam={exam}
          isLoading={isLoading}
        />
      ))}
    </ResponsiveGrid>
  );
};
