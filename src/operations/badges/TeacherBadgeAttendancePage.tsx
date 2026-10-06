import authProvider from "@/providers/authProvider";
import {Event} from "@haapi-b0fc7615/typescript-client";
import {EventAvailable, QrCodeScanner, Refresh} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {Title} from "react-admin";
import {
  checkAttendanceByPublicId,
  getTeacherEventsInProgress,
} from "./badgeApi";
import {BadgeScanner} from "./components/BadgeScanner";
import {ScanResultList} from "./components/ScanResults";
import {
  explainAttendanceError,
  presentResult,
  useScanResults,
} from "./scanResults";

const formatTime = (datetime?: string | Date) =>
  datetime
    ? new Date(datetime).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const eventLabel = (event: Event) => {
  const groups = event.groups?.map((group) => group.ref).join(", ");
  return [
    event.course?.code ?? event.title,
    `${formatTime(event.begin_datetime)} - ${formatTime(event.end_datetime)}`,
    groups,
  ]
    .filter(Boolean)
    .join(" · ");
};

export const TeacherBadgeAttendancePage = () => {
  const {id: teacherId} = authProvider.getCachedWhoami();
  const {results, pushResult} = useScanResults();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventId, setEventId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      const inProgress = await getTeacherEventsInProgress(teacherId ?? "");
      setEvents(inProgress);
      setEventId((current) =>
        inProgress.some((event) => event.id === current)
          ? current
          : (inProgress[0]?.id ?? "")
      );
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    // errors are handled by loadEvents itself
    void loadEvents();
  }, [loadEvents]);

  const event = events.find((candidate) => candidate.id === eventId);

  const onScan = async (publicId: string) => {
    if (!event?.id) return;
    try {
      const participant = await checkAttendanceByPublicId(event.id, publicId);
      pushResult(presentResult(participant));
    } catch (error) {
      pushResult({
        success: false,
        ...(await explainAttendanceError(
          publicId,
          error,
          "N'est pas inscrit(e) à ce cours."
        )),
      });
    }
  };

  return (
    <Box p={2} display="flex" justifyContent="center">
      <Title title="Scanner les badges" />
      <Paper sx={{width: "100%", maxWidth: 480, p: 3}}>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          <QrCodeScanner color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Scanner les badges
          </Typography>
        </Stack>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        ) : loadError ? (
          <Alert severity="error">
            Impossible de charger votre calendrier, réessayez.
          </Alert>
        ) : events.length === 0 ? (
          <Alert severity="info">
            Vous n'avez pas de cours en ce moment dans le calendrier. Le scanner
            s'ouvre 15 minutes avant le début du cours.
          </Alert>
        ) : events.length === 1 ? (
          <Alert severity="success" icon={<EventAvailable />}>
            <Typography fontWeight="bold">{event?.title}</Typography>
            {event && eventLabel(event)}
          </Alert>
        ) : (
          <TextField
            select
            fullWidth
            size="small"
            label="Cours en cours"
            value={eventId}
            onChange={(change) => setEventId(change.target.value)}
          >
            {events.map((candidate) => (
              <MenuItem key={candidate.id} value={candidate.id}>
                {eventLabel(candidate)}
              </MenuItem>
            ))}
          </TextField>
        )}
        <Button
          size="small"
          startIcon={<Refresh />}
          onClick={loadEvents}
          disabled={isLoading}
          sx={{mt: 1, mb: 2}}
        >
          Actualiser mes cours
        </Button>

        {event && (
          <>
            <BadgeScanner key={event.id} onScan={onScan} />
            <ScanResultList results={results} />
          </>
        )}
      </Paper>
    </Box>
  );
};
