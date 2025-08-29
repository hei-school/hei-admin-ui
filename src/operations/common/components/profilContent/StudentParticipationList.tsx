import {formatDate, getTime, isSameDay} from "@/utils/date";
import {
  EventAvailable,
  EventBusy,
  HelpOutline,
  Schedule,
  FilterList,
  Clear,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Collapse,
  IconButton,
} from "@mui/material";
import {useState} from "react";

interface AttendanceRecord {
  id: string | number;
  attendanceStatus: "MISSING" | "LATE" | "PRESENT" | "UNCHECKED";
  beginDatetime: string;
  endDatetime: string;
  eventType: string;
  eventTitle: string;
  eventDescription: string;
}

const STATUS_CONFIG = {
  MISSING: {
    color: "error" as const,
    icon: <EventBusy />,
    label: "Absent",
    bgColor: "#ffebee",
  },
  LATE: {
    color: "warning" as const,
    icon: <Schedule />,
    label: "En retard",
    bgColor: "#fff8e1",
  },
  PRESENT: {
    color: "success" as const,
    icon: <EventAvailable />,
    label: "Présent",
    bgColor: "#e8f5e8",
  },
  UNCHECKED: {
    color: "default" as const,
    icon: <HelpOutline />,
    label: "Non vérifié",
    bgColor: "#f5f5f5",
  },
};

interface FilterState {
  dateFrom: string;
  dateTo: string;
  status: string;
  eventType: string;
}

export function StudentParticipationList() {
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    status: "",
    eventType: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // const { data: studentsAttendance, isLoading } = useGetList(
  //   'student-participation',
  //   {
  //     pagination: { page: 1, perPage: 100 },
  //     sort: { field: 'beginDatetime', order: 'DESC' },
  //     filter: {
  //       from: filters.dateFrom || '2022-01-01T00:00:00.000Z',
  //       to: filters.dateTo || '2022-12-31T23:59:59.999Z'
  //     },
  //     meta: { id: 'student-id' }
  //   }
  // );

  const allAttendance: AttendanceRecord[] = [
    {
      id: "1",
      attendanceStatus: "MISSING",
      beginDatetime: "2022-02-03T08:00:00.000Z",
      endDatetime: "2022-02-03T12:00:00.000Z",
      eventType: "COURS",
      eventTitle: "PROG1",
      eventDescription: "Examen",
    },
    {
      id: "2",
      attendanceStatus: "LATE",
      beginDatetime: "2022-02-05T14:00:00.000Z",
      endDatetime: "2022-02-05T16:00:00.000Z",
      eventType: "TD",
      eventTitle: "PROG2",
      eventDescription: "Travaux dirigés",
    },
    {
      id: "3",
      attendanceStatus: "PRESENT",
      beginDatetime: "2022-02-07T09:00:00.000Z",
      endDatetime: "2022-02-07T11:00:00.000Z",
      eventType: "COURS",
      eventTitle: "MATH1",
      eventDescription: "Cours magistral",
    },
    {
      id: "4",
      attendanceStatus: "UNCHECKED",
      beginDatetime: "2022-02-10T10:00:00.000Z",
      endDatetime: "2022-02-10T12:00:00.000Z",
      eventType: "TP",
      eventTitle: "PROG1",
      eventDescription: "Travaux pratiques",
    },
    {
      id: "5",
      attendanceStatus: "MISSING",
      beginDatetime: "2022-02-12T08:00:00.000Z",
      endDatetime: "2022-02-12T10:00:00.000Z",
      eventType: "COURS",
      eventTitle: "ALGO1",
      eventDescription: "Algorithmes",
    },
  ];

  const filteredAttendance = allAttendance.filter((record) => {
    const recordDate = new Date(record.beginDatetime);
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

    if (fromDate && recordDate < fromDate) return false;
    if (toDate && recordDate > toDate) return false;

    if (filters.status && record.attendanceStatus !== filters.status) return false;

    if (filters.eventType && record.eventType !== filters.eventType) return false;

    return true;
  });

  const studentsAttendance = filteredAttendance;
  const isLoading = false;

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      status: "",
      eventType: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  const eventTypes = [...new Set(allAttendance.map(record => record.eventType))];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom sx={{fontWeight: "bold", mb: 2}}>
        Participation aux événements ({studentsAttendance.length})
      </Typography>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            sx={{ color: "primary.main" }}
          >
            <FilterList />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Filtres
          </Typography>
          {hasActiveFilters && (
            <Button
              startIcon={<Clear />}
              onClick={clearFilters}
              size="small"
              variant="outlined"
              color="secondary"
            >
              Effacer
            </Button>
          )}
        </Stack>
        <Collapse in={showFilters}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Date de début"
                type="date"
                size="small"
                fullWidth
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Date de fin"
                type="date"
                size="small"
                fullWidth
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                label="Statut"
                size="small"
                fullWidth
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <MenuItem value="">Tous les statuts</MenuItem>
                <MenuItem value="MISSING">Absent</MenuItem>
                <MenuItem value="LATE">En retard</MenuItem>
                <MenuItem value="PRESENT">Présent</MenuItem>
                <MenuItem value="UNCHECKED">Non vérifié</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                label="Type d'événement"
                size="small"
                fullWidth
                value={filters.eventType}
                onChange={(e) => handleFilterChange("eventType", e.target.value)}
              >
                <MenuItem value="">Tous les types</MenuItem>
                {eventTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Collapse>
      </Paper>
      {studentsAttendance.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Aucun résultat trouvé
          </Typography>
          <Typography variant="body2">
            Aucun événement ne correspond aux critères de filtrage sélectionnés.
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {studentsAttendance.map((record, index) => (
            <Grid item xs={12} md={6} key={index}>
              <AttendanceCard record={record} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

function AttendanceCard({record}: {record: AttendanceRecord}) {
  const statusConfig = STATUS_CONFIG[record.attendanceStatus];
  const beginDate = new Date(record.beginDatetime);
  const endDate = new Date(record.endDatetime);

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        border: `2px solid ${statusConfig.color === "error" ? "#f44336" : "#e0e0e0"}`,
        backgroundColor: statusConfig.bgColor,
      }}
    >
      <CardContent
        sx={{height: "100%", display: "flex", flexDirection: "column"}}
      >
        <Stack spacing={1.5} sx={{flex: 1}}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Chip
              icon={statusConfig.icon}
              label={statusConfig.label}
              color={statusConfig.color}
              variant="filled"
              size="small"
              sx={{fontWeight: "bold"}}
            />
            <Chip
              label={record.eventType}
              size="small"
              variant="outlined"
              sx={{textTransform: "capitalize"}}
            />
          </Stack>
          <Typography
            variant="h6"
            sx={{fontWeight: "bold", color: "#333", fontSize: "1.1rem"}}
          >
            {record.eventTitle}
          </Typography>
          <Box
            sx={{
              backgroundColor: "rgba(255,255,255,0.7)",
              p: 1.5,
              borderRadius: 1,
            }}
          >
            {isSameDay(beginDate, endDate) ? (
              <Stack spacing={0.5}>
                <Typography
                  variant="body2"
                  sx={{fontWeight: "bold", fontSize: "0.85rem"}}
                >
                  📅 {formatDate(record.beginDatetime, false)}
                </Typography>
                <Typography variant="body2" sx={{fontSize: "0.8rem"}}>
                  {getTime(record.beginDatetime)} -{" "}
                  {getTime(record.endDatetime)}
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={0.5}>
                <Typography
                  variant="body2"
                  sx={{fontWeight: "bold", fontSize: "0.85rem"}}
                >
                  Début: {formatDate(record.beginDatetime, true)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{fontWeight: "bold", fontSize: "0.85rem"}}
                >
                  Fin: {formatDate(record.endDatetime, true)}
                </Typography>
              </Stack>
            )}
          </Box>
          {record.eventDescription && (
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                fontStyle: "italic",
                backgroundColor: "rgba(255,255,255,0.5)",
                p: 1,
                borderRadius: 1,
                borderLeft: "3px solid #f44336",
                fontSize: "0.8rem",
                mt: "auto",
              }}
            >
              {record.eventDescription}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
