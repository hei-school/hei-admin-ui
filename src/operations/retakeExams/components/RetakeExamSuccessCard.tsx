import {formatDate} from "@/utils/date";
import {RetakeExam} from "@haapi-b0fc7615/typescript-client";
import {CheckCircle, Payment} from "@mui/icons-material";
import {Alert, Card, CardContent, Typography} from "@mui/material";

interface RetakeExamSuccessCardProps {
  retakeExam?: RetakeExam;
}

export function RetakeExamSuccessCard({
  retakeExam,
}: Readonly<RetakeExamSuccessCardProps>) {
  if (!retakeExam) return null;

  const courseInfo =
    retakeExam.course?.code && retakeExam.course?.name
      ? `${retakeExam.course.code} - ${retakeExam.course.name}`
      : "—";

  const sessionInfo =
    retakeExam.session?.date_from && retakeExam.session?.date_to
      ? `Du ${formatDate(retakeExam.session.date_from)} au ${formatDate(
          retakeExam.session.date_to
        )}`
      : "—";

  return (
    <Card
      sx={{
        border: "1px solid #c8e6c9",
        backgroundColor: "#f9fff9",
        boxShadow: "0 2px 6px rgba(76,175,80,0.15)",
        minWidth: 300,
        maxWidth: 360,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{p: 2.5}}>
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#2e7d32",
            fontWeight: 600,
            mb: 2,
          }}
        >
          <CheckCircle sx={{color: "#4caf50", mr: 1.2}} />
          Inscription confirmée
        </Typography>
        <Typography variant="body2" sx={{mb: 1.2}}>
          <strong>Matière :</strong> {courseInfo}
        </Typography>
        <Typography variant="body2" sx={{mb: 2}}>
          <strong>Session :</strong> {sessionInfo}
        </Typography>
        <Alert
          icon={<Payment />}
          severity="warning"
          sx={{
            "fontSize": 14,
            "& .MuiAlert-icon": {fontSize: 20},
            "borderRadius": 1,
          }}
        >
          <strong>Important :</strong> frais de rattrapage pas encore payés
        </Alert>

        {retakeExam.id && (
          <Typography
            variant="caption"
            sx={{display: "block", mt: 1.5, color: "text.secondary"}}
          >
            ID d’inscription : {retakeExam.id}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
