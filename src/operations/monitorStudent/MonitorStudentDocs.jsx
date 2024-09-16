import React from 'react';
import {Box, Typography, Button, styled} from '@mui/material';
import {Link, useParams} from 'react-router-dom';
import {
  AttachMoney as FeesIcon,
  CollectionsBookmark as TranscriptIcon,
  Inventory as DocsIcon,
  LibraryAddCheck as WorkStudyDocsIcon,
  Work as OtherDocsIcon,
  Newspaper as AnnouncementIcon,
} from "@mui/icons-material";
import {ListMenu, ListMenuItem} from '@/ui/haLayout/menu/utils';

const MonitorStudentDocs = () => {
  const {studentId} = useParams();

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontSize: '1.5rem', 
          color: '#DFA408',
          fontFamily: 'Arial, sans-serif', 
          fontWeight: 'bold',
        }}
      >
        Liste des Documents pour l'Étudiant
      </Typography>

        <ListMenuItem
          to={`/students/${studentId}/docs/students/TRANSCRIPT`}
          data-testid="transcript-docs"
          label="Bulletins"
          icon={<TranscriptIcon />}
        />
        <ListMenuItem
          to={`/students/${studentId}/docs/students/OTHER`}
          data-testid="other-docs"
          label="Autres"
          icon={<OtherDocsIcon />}
        />
    </Box>
  );
};

export default MonitorStudentDocs;
