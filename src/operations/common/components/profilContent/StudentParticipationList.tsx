import {formatDate, getTime, isSameDay} from "@/utils/date";
import {AttendanceStatus} from "@haapi-b0fc7615/typescript-client";
import {
  Clear,
  EventAvailable,
  EventBusy,
  FilterList,
  HelpOutline,
  Schedule,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {useMemo, useState} from "react";
import {useGetList, useRecordContext} from "react-admin";
import {AbsenceDetailDialog} from "./AbsenceDetailDialog";

interface AttendanceRecord {
  id: string;
  attendanceStatus: AttendanceStatus;
  beginDatetime: string;
  endDatetime: string;
  eventType: string;
  eventTitle: string;
  eventDescription: string;
  location?: {
    room?: string;
    place?: string;
  };
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
  status: AttendanceStatus;
  eventType: string;
}

export function StudentParticipationList() {
  const profile = useRecordContext();
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "2025-04-01",
    dateTo: "",
    status: AttendanceStatus.MISSING,
    eventType: "",
  });
  const [selectedAbsence, setSelectedAbsence] =
    useState<AttendanceRecord | null>(null);

  const queryParams = useMemo(
    () => ({
      filter: {
        from: filters.dateFrom
          ? `${filters.dateFrom}T00:00:00.000Z`
          : "2025-04-01T00:00:00.000Z",
        to: filters.dateTo
          ? `${filters.dateTo}T23:59:59.999Z`
          : new Date().toISOString(),
        attendanceStatus: filters.status || undefined,
        title: [],
      },
      meta: {id: profile?.id},
    }),
    [filters.dateFrom, filters.dateTo, filters.status, profile?.id]
  );

  const {
    data: rawAttendance = [],
    isLoading,
    error,
  } = useGetList("student-participation", queryParams);

  const allAttendance = rawAttendance;

  const filteredAttendance = allAttendance.filter((record) => {
    const recordDate = new Date(record.beginDatetime);
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

    if (fromDate && recordDate < fromDate) return false;
    if (toDate && recordDate > toDate) return false;

    if (record.attendanceStatus !== filters.status) return false;

    if (filters.eventType && record.eventType !== filters.eventType)
      return false;

    return true;
  });

  const studentsAttendance = filteredAttendance;

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({...prev, [field]: value}));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "2025-04-01",
      dateTo: "",
      status: AttendanceStatus.MISSING,
      eventType: "",
    });
  };

  const hasActiveFilters =
    filters.dateFrom !== "2025-04-01" ||
    filters.dateTo !== "" ||
    filters.status !== AttendanceStatus.MISSING ||
    filters.eventType !== "";

  const eventTypes = [
    ...new Set(allAttendance.map((record) => record.eventType)),
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{m: 2}}>
        <Typography variant="h6" gutterBottom>
          Erreur de chargement
        </Typography>
        <Typography variant="body2">
          Impossible de charger les données de participation. Veuillez
          réessayer.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom sx={{fontWeight: "bold", mb: 2}}>
        Participation aux événements ({studentsAttendance.length})
      </Typography>
      <Paper sx={{p: 2, mb: 3, borderRadius: 2, bgcolor: "background.paper"}}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{mb: 2}}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <FilterList sx={{color: "primary.main"}} />
            <Typography variant="h6" sx={{fontWeight: "bold"}}>
              Filtres
            </Typography>
            {hasActiveFilters && (
              <Chip
                size="small"
                label={`${Object.values(filters).filter((v) => v !== "").length} actif(s)`}
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
          {hasActiveFilters && (
            <Button
              startIcon={<Clear />}
              onClick={clearFilters}
              size="small"
              variant="outlined"
              color="secondary"
            >
              Réinitialiser
            </Button>
          )}
        </Stack>
        <Box sx={{bgcolor: "grey.50", p: 2, borderRadius: 1}}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Date de début"
                type="date"
                size="small"
                fullWidth
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                InputLabelProps={{shrink: true}}
                helperText="Défaut: 1er avril 2025"
                sx={{bgcolor: "white"}}
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
                InputLabelProps={{shrink: true}}
                helperText="Optionnel"
                sx={{bgcolor: "white"}}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                label="Statut de présence"
                size="small"
                fullWidth
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                sx={{bgcolor: "white"}}
              >
                <MenuItem value={AttendanceStatus.MISSING}>🔴 Absent</MenuItem>
                <MenuItem value={AttendanceStatus.LATE}>🟡 En retard</MenuItem>
                <MenuItem value={AttendanceStatus.PRESENT}>🟢 Présent</MenuItem>
                <MenuItem value={AttendanceStatus.UNCHECKED}>
                  ⚪ Non vérifié
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                label="Type d'événement"
                size="small"
                fullWidth
                value={filters.eventType}
                onChange={(e) =>
                  handleFilterChange("eventType", e.target.value)
                }
                sx={{bgcolor: "white"}}
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
        </Box>
      </Paper>
      {studentsAttendance.length === 0 ? (
        <Alert severity="info" sx={{borderRadius: 2}}>
          <Typography variant="h6" gutterBottom>
            {filters.status === AttendanceStatus.MISSING
              ? "Aucune absence enregistrée"
              : "Aucun résultat trouvé"}
          </Typography>
          <Typography variant="body2">
            {filters.status === AttendanceStatus.MISSING
              ? "Cet étudiant n'a aucune absence pour la période sélectionnée."
              : "Aucun événement ne correspond aux critères de filtrage sélectionnés."}
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {studentsAttendance.map((record, index) => (
            <Grid item xs={12} md={6} key={index}>
              <AttendanceCard
                record={record}
                onClick={() => setSelectedAbsence(record)}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {selectedAbsence && (
        <AbsenceDetailDialog
          open={!!selectedAbsence}
          onClose={() => setSelectedAbsence(null)}
          absence={{
            id: selectedAbsence.id,
            title: selectedAbsence.eventTitle,
            description: selectedAbsence.eventDescription,
            beginDatetime: selectedAbsence.beginDatetime,
            endDatetime: selectedAbsence.endDatetime,
            eventType: selectedAbsence.eventType,
            attendanceStatus: selectedAbsence.attendanceStatus,
            location: selectedAbsence.location,
          }}
          studentId={String(profile?.id)}
        />
      )}
    </Box>
  );
}

function AttendanceCard({
  record,
  onClick,
}: {
  record: AttendanceRecord;
  onClick: () => void;
}) {
  const statusConfig =
    (
      STATUS_CONFIG as Record<
        string,
        {
          color: "error" | "warning" | "success" | "default";
          icon: JSX.Element;
          label: string;
          bgColor: string;
        }
      >
    )[record.attendanceStatus] ?? STATUS_CONFIG.UNCHECKED;
  const beginDate = new Date(record.beginDatetime);
  const endDate = new Date(record.endDatetime);

  return (
    <Card
      onClick={onClick}
      sx={{
        "height": "100%",
        "borderRadius": 2,
        "boxShadow": "0 2px 8px rgba(0,0,0,0.1)",
        "border": `2px solid ${statusConfig.color === "error" ? "#f44336" : "#e0e0e0"}`,
        "backgroundColor": statusConfig.bgColor,
        "cursor": "pointer",
        "transition": "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
        },
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
                  {formatDate(record.beginDatetime, false)}
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
          {record.location &&
            (record.location.room || record.location.place) && (
              <Box
                sx={{
                  backgroundColor: "rgba(255,255,255,0.7)",
                  p: 1,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{fontSize: "0.8rem", fontWeight: "500"}}
                >
                  {record.location.room || record.location.place}
                </Typography>
              </Box>
            )}
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
