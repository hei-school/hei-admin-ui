import {ImportContactsOutlined as BookIcon} from "@mui/icons-material";
import {Box, LinearProgress, Typography} from "@mui/material";
import {List, useListContext} from "react-admin";

import EmptyBox from "@/assets/empty-box.webp";
import {ExamCard, ExamFilter} from "@/operations/exams/components";
import {useRole} from "@/security/hooks";
import {ResponsiveGrid} from "@/ui/components";
import {HaListTitle} from "@/ui/haList";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {CreateButton} from "@/ui/haToolbar";
import {Exam} from "@haapi/typescript-client";

export const ExamList = () => {
  const {isManager, isAdmin, isTeacher} = useRole();

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
      <Typography marginInline={5}>
        Veuillez trouver ci-joint la liste des différents examens.
      </Typography>
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
