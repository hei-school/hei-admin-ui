import {ToRaRecord} from "@/providers/types";
import {useRole} from "@/security/hooks";
import {formatDate} from "@/utils/date";
import {Cor} from "@haapi-3d601c85/typescript-client";
import {Box, Typography, keyframes} from "@mui/material";
import {IdCard, Mail, MessageSquare, User, Users} from "lucide-react";
import {FC, ReactNode} from "react";
import {useRecordContext} from "react-admin";
import {AddCorComment} from "./components/AddCorComment";
import StatusChip from "./components/StatusChip";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const DetailCard: FC<{children: ReactNode; sx?: object}> = ({children, sx}) => (
  <Box
    sx={{
      "borderRadius": "20px",
      "boxShadow": "0 8px 32px rgba(0,0,0,0.1)",
      "backgroundColor": "rgba(255, 255, 255, 0.9)",
      "overflow": "hidden",
      "transition": "transform 0.3s ease-in-out",
      "animation": `${fadeIn} 0.5s ease-out forwards`,
      "&:hover": {
        transform: "scale(1.02)",
      },
      ...sx,
    }}
  >
    {children}
  </Box>
);

export const CorDetails = () => {
  const cor = useRecordContext<ToRaRecord<Cor>>();
  const {isStudent} = useRole();
  return (
    <Box
      sx={{
        padding: 2,
        gap: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <DetailCard>
        <Box
          sx={{
            padding: "15px 20px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <DetailTitle title="Description" />
        </Box>
        <Box sx={{padding: "20px"}}>
          <Typography
            sx={{
              padding: 1.5,
              background: "#f8f9fa",
              borderRadius: "8px",
              color: "#495057",
              border: "1px solid #dee2e6",
            }}
          >
            {cor?.description}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {xs: "1fr", sm: "repeat(3, 1fr)"},
              gap: 3,
              paddingTop: 3,
            }}
          >
            <SectionITem
              title="Statut"
              content={<StatusChip status={cor?.status} />}
            />
            <SectionITem
              title={`Date d'entretien`}
              content={formatDate(cor?.interview_date, true)}
            />
            <SectionITem
              title={`Date de création`}
              content={formatDate(cor?.creation_datetime, false)}
            />
          </Box>
        </Box>
      </DetailCard>

      <DetailCard>
        <Box
          sx={{
            padding: "15px 20px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <DetailTitle
            title="Informations de l'étudiant"
            icon={<User size={22} />}
          />
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {xs: "1fr", sm: "repeat(2, 1fr)"},
            gap: 3,
            padding: "20px",
          }}
        >
          <SectionITem
            content={cor?.concerned_student?.first_name!}
            title="Prénom"
          />
          <SectionITem
            content={cor?.concerned_student?.last_name!}
            title="Nom"
          />
          <SectionITem
            content={cor?.concerned_student?.ref!}
            title="Référence"
            icon={<IdCard />}
          />
          <SectionITem
            content={cor?.concerned_student?.email!}
            title="Email"
            icon={<Mail size={18} />}
          />
        </Box>
      </DetailCard>

      <DetailCard>
        <Box
          sx={{
            padding: "15px 20px",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <DetailTitle title="Intervenants" icon={<Users size={22} />} />
        </Box>
        <Box sx={{padding: "20px"}}>
          {cor?.interviewers && cor.interviewers.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {xs: "1fr", sm: "repeat(2, 1fr)"},
                gap: 3,
              }}
            >
              {cor.interviewers.map((interviewer) => (
                <Box
                  key={interviewer.id}
                  sx={{
                    padding: "15px",
                    borderRadius: "10px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <SectionITem
                    content={`${interviewer.first_name} ${interviewer.last_name}`}
                    title="Nom"
                    icon={<User size={18} />}
                  />
                  <Box sx={{mt: 2}}>
                    <SectionITem
                      content={interviewer.ref!}
                      title="Référence"
                      icon={<IdCard size={18} />}
                    />
                  </Box>
                  <Box sx={{mt: 2}}>
                    <SectionITem
                      content={interviewer.email!}
                      title="Email"
                      icon={<Mail size={18} />}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography sx={{color: "#6c757d", textAlign: "center"}}>
              Aucun intervenant pour le moment.
            </Typography>
          )}
        </Box>
      </DetailCard>

      <DetailCard>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
            padding: "20px",
          }}
        >
          <DetailTitle
            title={`Commentaires (${cor?.comments?.length})`}
            icon={<MessageSquare />}
          />
          {!isStudent() && <AddCorComment islist={false} />}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "0 20px 20px",
          }}
        >
          {cor?.comments && cor.comments.length > 0 ? (
            cor.comments.map((el, index) => (
              <Box
                key={index}
                sx={{
                  padding: "15px",
                  borderRadius: "10px",
                  backgroundColor: "#f8f9fa",
                  borderLeft: "4px solid",
                  borderImage: "linear-gradient(to bottom, #6a11cb, #2575fc) 1",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(el.creation_date, true)}
                  </Typography>
                </Box>
                <Typography sx={{color: "#343a40"}}>{el.comment}</Typography>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                textAlign: "center",
                padding: "30px 20px",
                color: "#6c757d",
                border: "2px dashed #dee2e6",
                borderRadius: "10px",
              }}
            >
              <MessageSquare
                size={40}
                style={{marginBottom: "10px", opacity: 0.6}}
              />
              <Typography variant="h6">Aucun commentaire</Typography>
            </Box>
          )}
        </Box>
      </DetailCard>
    </Box>
  );
};
const DetailTitle: FC<{title: string; icon?: ReactNode}> = ({icon, title}) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        color: "#343a40",
      }}
    >
      {icon}
      <Typography
        sx={{
          fontSize: "1.2rem",
          fontWeight: "bold",
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

const SectionITem: FC<{
  icon?: ReactNode;
  content: string | ReactNode;
  title: string;
}> = ({content, icon, title}) => {
  return (
    <Box>
      <Typography variant="body2" sx={{color: "#6c757d", marginBottom: "4px"}}>
        {title}
      </Typography>
      <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
        {icon && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              backgroundColor: "#e9ecef",
              color: "#495057",
            }}
          >
            {icon}
          </Box>
        )}
        <Typography sx={{fontWeight: 500, color: "#212529"}}>
          {content}
        </Typography>
      </Box>
    </Box>
  );
};
