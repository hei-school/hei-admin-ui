import {formatDate, getTime, isSameDay} from "@/utils/date";
import {AttendanceStatus} from "@haapi-b0fc7615/typescript-client";
import {
  Clear,
  EventAvailable,
  EventBusy,
  FilterList,
  HelpOutline,
  Schedule,
  Search,
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
import {useEffect, useMemo, useState} from "react";
import {useGetList, useGetOne, useRecordContext} from "react-admin";
import {useParams} from "react-router-dom";
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

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

const toIsoDateTime = (dateOnly: string, endOfDay = false) => {
  return `${dateOnly}T${endOfDay ? "23:59:59" : "00:00:00"}Z`;
};

const DEFAULT_FILTERS: FilterState = {
  dateFrom: "",
  dateTo: "",
  status: AttendanceStatus.MISSING,
  eventType: "",
};

const useStudentEntranceDate = (studentId?: string) => {
  const {data: student, isLoading: isStudentLoading} = useGetOne(
    "students",
    {id: studentId},
    {enabled: !!studentId}
  );
  const entranceDate = student?.entrance_datetime?.split("T")[0];
  return {entranceDate, isStudentLoading: !!studentId && isStudentLoading};
};

export const StudentParticipationList = () => {
  const profile = useRecordContext();

  const [pendingFilters, setPendingFilters] =
    useState<FilterState>(DEFAULT_FILTERS);

  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTERS);

  const [selectedAbsence, setSelectedAbsence] =
    useState<AttendanceRecord | null>(null);

  const {id: studentId} = useParams<{id: string}>();

  const effectiveStudentId =
    studentId ?? (profile?.id != null ? String(profile.id) : undefined);

  const {entranceDate, isStudentLoading} =
    useStudentEntranceDate(effectiveStudentId);

  useEffect(() => {
    if (entranceDate) {
      setPendingFilters((prev) =>
        prev.dateFrom === "" ? {...prev, dateFrom: entranceDate} : prev
      );
      setAppliedFilters((prev) =>
        prev.dateFrom === "" ? {...prev, dateFrom: entranceDate} : prev
      );
    }
  }, [entranceDate]);

  const queryParams = useMemo(() => {
    const from = appliedFilters.dateFrom || entranceDate;
    return {
      filter: {
        ...(from ? {from: toIsoDateTime(from)} : {}),
        to: toIsoDateTime(appliedFilters.dateTo || getToday(), true),
        attendanceStatus: appliedFilters.status || undefined,
      },
      meta: {id: profile?.id ?? effectiveStudentId},
    };
  }, [appliedFilters, profile?.id, entranceDate, effectiveStudentId]);

  const {
    data: rawAttendance = [],
    isLoading,
    error,
  } = useGetList("student-participation", queryParams, {
    enabled: !isStudentLoading,
  });

  const filteredAttendance = rawAttendance.filter((record) => {
    if (
      appliedFilters.eventType &&
      record.eventType !== appliedFilters.eventType
    )
      return false;
    return true;
  });

  const handlePendingFilterChange = (
    field: keyof FilterState,
    value: string
  ) => {
    setPendingFilters((prev) => ({...prev, [field]: value}));
  };

  const applyFilters = () => {
    setAppliedFilters(pendingFilters);
  };

  const clearFilters = () => {
    setPendingFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters =
    pendingFilters.dateFrom !== DEFAULT_FILTERS.dateFrom ||
    pendingFilters.dateTo !== "" ||
    pendingFilters.status !== AttendanceStatus.MISSING ||
    pendingFilters.eventType !== "";

  const hasPendingChanges =
    JSON.stringify(pendingFilters) !== JSON.stringify(appliedFilters);

  const eventTypes = [
    ...new Set(rawAttendance.map((record) => record.eventType)),
  ];

  if (isStudentLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress size={40} />
      </Box>
    );
  }

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
        <Typography
          variant="caption"
          component="pre"
          sx={{mt: 1, whiteSpace: "pre-wrap", color: "text.secondary"}}
        ></Typography>
      </Alert>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom sx={{fontWeight: "bold", mb: 2}}>
        Participation aux événements ({filteredAttendance.length})
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
                label={`${Object.values(appliedFilters).filter((v) => v !== "").length} actif(s)`}
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
                value={pendingFilters.dateFrom}
                onChange={(e) =>
                  handlePendingFilterChange("dateFrom", e.target.value)
                }
                InputLabelProps={{shrink: true}}
                helperText="Défaut: date d'entrée de l'étudiant chez HEI"
                sx={{bgcolor: "white"}}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Date de fin"
                type="date"
                size="small"
                fullWidth
                value={pendingFilters.dateTo}
                onChange={(e) =>
                  handlePendingFilterChange("dateTo", e.target.value)
                }
                InputLabelProps={{shrink: true}}
                helperText="Défaut: aujourd'hui"
                sx={{bgcolor: "white"}}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                label="Statut de présence"
                size="small"
                fullWidth
                value={pendingFilters.status}
                onChange={(e) =>
                  handlePendingFilterChange("status", e.target.value)
                }
                sx={{bgcolor: "white"}}
              >
                <MenuItem value={AttendanceStatus.MISSING}>🔴 Absent</MenuItem>
                {/* <MenuItem value={AttendanceStatus.LATE}>🟡 En retard</MenuItem> */}
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
                value={pendingFilters.eventType}
                onChange={(e) =>
                  handlePendingFilterChange("eventType", e.target.value)
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
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={applyFilters}
              disabled={!hasPendingChanges}
              sx={{
                borderRadius: 2,
                px: 3,
              }}
            >
              Appliquer les filtres
            </Button>
          </Box>
        </Box>
      </Paper>
      {filteredAttendance.length === 0 ? (
        <Alert severity="info" sx={{borderRadius: 2}}>
          <Typography variant="h6" gutterBottom>
            {appliedFilters.status === AttendanceStatus.MISSING
              ? "Aucune absence enregistrée"
              : "Aucun résultat trouvé"}
          </Typography>
          <Typography variant="body2">
            {appliedFilters.status === AttendanceStatus.MISSING
              ? "Cet étudiant n'a aucune absence pour la période sélectionnée."
              : "Aucun événement ne correspond aux critères de filtrage sélectionnés."}
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {filteredAttendance.map((record) => (
            <Grid item xs={12} md={6} key={record.id}>
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
};

const AttendanceCard = ({
  record,
  onClick,
}: {
  record: AttendanceRecord;
  onClick: () => void;
}) => {
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
};
