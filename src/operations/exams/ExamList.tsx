import {ImportContactsOutlined as BookIcon} from "@mui/icons-material";
import {Box, LinearProgress} from "@mui/material";
import {List, useListContext} from "react-admin";

import {ExamCard, ExamFilter} from "@/operations/exams/components";
import {useRole} from "@/security/hooks";
import {ResponsiveGrid} from "@/ui/components";
import {HaListTitle} from "@/ui/haList";
import {PrevNextPagination} from "@/ui/haList/PrevNextPagination";
import {CreateButton} from "@/ui/haToolbar";
import {ExamInfo} from "@haapi/typescript-client";

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
      <ExamsGridContent />
    </List>
  );
};

const ExamLoaderContent = () => {
  const {isLoading} = useListContext();
  return isLoading && <LinearProgress />;
};

const ExamActions = () => (
  <Box>
    <CreateButton resource="exams" />
    <ExamFilter />
  </Box>
);

const ExamsGridContent = () => {
  const {data: exams = [], isLoading} = useListContext();

  return (
    <ResponsiveGrid gap="1.5rem">
      {exams.map((exam: ExamInfo) => (
        <ExamCard key={exam.id} exam={exam} isLoading={isLoading} />
      ))}
    </ResponsiveGrid>
  );
};
