import { CheckCircle, Payment } from "@mui/icons-material";
import { Alert, Card, CardContent, Typography } from "@mui/material";

interface RetakeExamSuccessCardProps {
  record?: {
    course?: { code: string; name: string };
    session?: { date_from: string; date_to: string };
  };
}

export function RetakeExamSuccessCard({ record }: Readonly<RetakeExamSuccessCardProps>) {
  if (!record) return null;

  const courseInfo = record.course ? `${record.course.code} - ${record.course.name}` : "—";
  const sessionInfo = record.session
    ? `Du ${new Date(record.session.date_from).toLocaleDateString()} au ${new Date(record.session.date_to).toLocaleDateString()}`
    : "—";

  return (
    <Card sx={{ border: "1px solid #e8f5e8", backgroundColor: "#f8fffe", boxShadow: "0 2px 8px rgba(76,175,80,0.15)", minWidth: 300, maxWidth: 350 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", color: "#2e7d32", fontWeight: 600, mb: 2 }}>
          <CheckCircle sx={{ color: "#4caf50", mr: 1.5 }} />
          Inscription confirmée
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Matière:</strong> {courseInfo}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Session:</strong> {sessionInfo}
        </Typography>

        <Alert
          icon={<Payment />}
          severity="warning"
          sx={{ fontSize: 14, "& .MuiAlert-icon": { fontSize: 20 } }}
        >
          <strong>Important:</strong> Frais de rattrapage pas encore payés.
        </Alert>
      </CardContent>
    </Card>
  );
}
