import {ToRaRecord} from "@/providers/types";
import {formatDate} from "@/utils/date";
import {Cor} from "@haapi-b0fc7615/typescript-client";
import {Box, Typography} from "@mui/material";
import {IdCard, Mail, MessageSquare, User} from "lucide-react";
import {FC, ReactNode} from "react";
import {useRecordContext} from "react-admin";
import StatusChip from "./StatusChip";

const BOXSTYLE = {
  border: "1px solid  #ccc",
  borderRadius: "10px",
  padding: "10px",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  background: "white",
};

export const CorDetails = () => {
  const cor = useRecordContext<ToRaRecord<Cor>>();

  return (
    <Box
      sx={{
        padding: 2,
        gap: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={BOXSTYLE}>
        <Box>
          <Box>
            <Typography> Description</Typography>
            <Typography
              sx={{
                padding: 1.5,
                background: "#f4f4f6",
              }}
            >
              {cor?.description}
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {xs: "1fr", sm: "repeat(2, 1fr)"},
                gap: 1,
                padding: 1,
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
                title={`Date d'entretien`}
                content={formatDate(cor?.creation_datetime, false)}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={BOXSTYLE}>
        <DetailTitle
          title="Informations de l'étudiant"
          icon={<User size={22} />}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {xs: "1fr", sm: "repeat(2, 1fr)"},
            gap: 2,
            alignItems: "start",
            padding: "1px",
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
      </Box>
      <Box sx={BOXSTYLE}>
        <DetailTitle
          title={`Commentaires (${cor?.comments?.length})`}
          icon={<MessageSquare />}
        />
        <Box
          sx={{
            marginTop: "10px",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {cor?.comments?.map((el, items) => (
            <Box
              sx={{
                ...BOXSTYLE,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <StatusChip status={el.status} key={items} />
                <Typography fontWeight={500}>
                  {formatDate(el.creation_date, true)}
                </Typography>
              </Box>
              <Typography
                sx={{
                  margin: "10px",
                  padding: "4px",
                }}
              >
                {el.comment}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

const DetailTitle: FC<{
  title: String;
  icon?: ReactNode;
}> = ({icon, title}) => {
  return (
    <Box marginInline={1.5}>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Box>{icon}</Box>
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: "600",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

const SectionITem: FC<{
  title: string;
  icon?: ReactNode;
  content: string | ReactNode;
}> = ({content, icon, title}) => {
  return (
    <Box>
      <Typography textOverflow="ellipsis" color="GrayText" fontWeight={500}>
        {title}
      </Typography>
      <Box display="flex" alignItems="center" gap={1}>
        {icon}
        <Typography fontWeight={500}>{content}</Typography>
      </Box>
    </Box>
  );
};
