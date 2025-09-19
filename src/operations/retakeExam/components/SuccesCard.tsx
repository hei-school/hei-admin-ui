import {CheckCircle, Payment} from "@mui/icons-material";
import {Alert, Box, Card, CardContent, Typography} from "@mui/material";

export const SuccessCard = ({record}: {record: any}) => (
  <Card
    sx={{
      border: "1px solid #e8f5e8",
      backgroundColor: "#f8fffe",
      boxShadow: "0 2px 8px rgba(76, 175, 80, 0.15)",
      minWidth: 300,
      maxWidth: 350,
      flex: "0 0 auto",
    }}
  >
    <CardContent sx={{padding: "16px 20px !important"}}>
      <Box display="flex" alignItems="center" mb={2}>
        <CheckCircle sx={{color: "#4caf50", mr: 1.5, fontSize: 24}} />
        <Typography variant="h6" fontWeight="600" color="#2e7d32">
          Inscription confirmée
        </Typography>
      </Box>

      <Box sx={{mb: 2}}>
        <Typography variant="body1" sx={{mb: 1}}>
          <strong>Matière:</strong> {record.course?.code} -{" "}
          {record.course?.name}
        </Typography>
        <Typography variant="body1" sx={{mb: 1}}>
          <strong>Session:</strong> Du{" "}
          {new Date(record.session?.date_from).toLocaleDateString()} au{" "}
          {new Date(record.session?.date_to).toLocaleDateString()}
        </Typography>
      </Box>

      <Alert
        icon={<Payment />}
        severity="warning"
        sx={{
          "fontSize": "14px",
          "& .MuiAlert-icon": {
            fontSize: "20px",
          },
        }}
      >
        <strong>Important:</strong> Frais de rattrapage pas encore payés.
      </Alert>
    </CardContent>
  </Card>
);
