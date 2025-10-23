import {
  AccessTimeOutlined,
  CalendarToday,
  CheckCircle,
  Close,
  Description,
  EventAvailable,
  EventBusy,
  LocationOn,
  Person,
  Schedule,
  School,
  Unpublished,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import {FC, useState} from "react";
import {Confirm, useGetList, useRefresh, useUpdate} from "react-admin";

import defaultProfilePicture from "@/assets/blank-profile-photo.png";
import {useNotify} from "@/hooks";
import PdfViewer from "@/operations/common/components/PdfViewer";
import {useRole} from "@/security/hooks";
import {formatDate} from "@/utils/date";
import {EventAttendance, Letter} from "@haapi-b0fc7615/typescript-client";

interface AbsenceDetailDialogForStaffProps {
  open: boolean;
  onClose: () => void;
  absence: EventAttendance;
}

const STATUS_CONFIG = {
  MISSING: {
    color: "#f44336",
    bgColor: "#ffebee",
    label: "Absent",
    icon: <EventBusy />,
  },
  LATE: {
    color: "#ff9800",
    bgColor: "#fff8e1",
    label: "En retard",
    icon: <Schedule />,
  },
  PRESENT: {
    color: "#4caf50",
    bgColor: "#e8f5e8",
    label: "Présent",
    icon: <EventAvailable />,
  },
  UNCHECKED: {
    color: "#9e9e9e",
    bgColor: "#f5f5f5",
    label: "Non vérifié",
    icon: <AccessTimeOutlined />,
  },
};

const LETTER_STATUS_CONFIG = {
  RECEIVED: {
    color: "#4caf50",
    label: "Accepté",
    bgColor: "rgba(76, 175, 80, 0.1)",
  },
  REJECTED: {
    color: "#f44336",
    label: "Refusé",
    bgColor: "rgba(244, 67, 54, 0.08)",
  },
  PENDING: {
    color: "#ffc107",
    label: "En attente",
    bgColor: "rgba(255, 193, 7, 0.08)",
  },
};

export const AbsenceDetailDialogForStaff: FC<
  AbsenceDetailDialogForStaffProps
> = ({open, onClose, absence}) => {
  const {isManager, isAdmin, isTeacher} = useRole();
  const canManage = isManager() || isAdmin() || isTeacher();

  const attendanceStatus =
    (absence.event_participant as any)?.event_status || "MISSING";
  const statusConfig =
    STATUS_CONFIG[attendanceStatus as keyof typeof STATUS_CONFIG] ||
    STATUS_CONFIG.MISSING;

  const studentId = absence.event_participant?.id;
  const studentName =
    `${absence.event_participant?.first_name || ""} ${absence.event_participant?.last_name || ""}`.trim();

  const {
    data: letters = [],
    isLoading: lettersLoading,
    refetch: refetchLetters,
  } = useGetList(
    "users-letters",
    {
      meta: {userId: studentId, userName: studentName},
      filter: {},
    },
    {enabled: open && !!studentId}
  ) as {data: Letter[]; isLoading: boolean; refetch: () => void};

  const refresh = useRefresh();

  const handleRefresh = () => {
    refetchLetters();
    refresh();
  };

  if (!absence.event || !absence.event_participant) {
    return null;
  }

  const event = absence.event;
  const participant = absence.event_participant;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${statusConfig.color}, ${alpha(statusConfig.color, 0.7)})`,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {statusConfig.icon}
          <Typography variant="h6" fontWeight="bold">
            Détails de l'absence
          </Typography>
        </Stack>
        <IconButton onClick={onClose} sx={{color: "white"}}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{p: 3, mb: 3, bgcolor: "#fafafa"}}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mt: 3,
                borderRadius: 2,
                border: "2px solid #1976d2",
                bgcolor: "rgba(25, 118, 210, 0.05)",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#1976d2",
                }}
              >
                <Person />
                Informations de l'étudiant
              </Typography>
              <Divider sx={{mb: 2}} />
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                sx={{
                  p: 2,
                  bgcolor: "white",
                  borderRadius: 2,
                }}
              >
                <Box
                  component="img"
                  src={
                    (participant as any).profile_picture ||
                    defaultProfilePicture
                  }
                  alt="profile"
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #1976d2",
                  }}
                />
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {participant.first_name} {participant.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Référence: {participant.ref}
                  </Typography>
                  {participant.email && (
                    <Typography variant="body2" color="text.secondary">
                      Email: {participant.email}
                    </Typography>
                  )}
                </Box>
                <Box>
                  <Chip
                    icon={statusConfig.icon}
                    label={statusConfig.label}
                    sx={{
                      bgcolor: statusConfig.bgColor,
                      color: statusConfig.color,
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    }}
                  />
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                border: `2px solid ${statusConfig.color}`,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: statusConfig.color,
                }}
              >
                <CalendarToday />
                Informations de l'événement
              </Typography>
              <Divider sx={{mb: 2}} />
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Titre
                  </Typography>
                  <Typography variant="body1" fontWeight="600">
                    {event.title}
                  </Typography>
                </Box>
                {event.course && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="bold"
                      sx={{display: "flex", alignItems: "center", gap: 0.5}}
                    >
                      <School fontSize="small" />
                      Cours
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      {event.course.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Code: {event.course.code} • {event.course.credits} crédits
                      • {event.course.total_hours}h au total
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Type d'événement
                  </Typography>
                  <Chip
                    label={event.type}
                    size="small"
                    sx={{mt: 0.5, textTransform: "capitalize"}}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight="bold"
                  >
                    Date et heure
                  </Typography>
                  <Stack spacing={0.5} sx={{mt: 0.5}}>
                    <Typography variant="body2">
                      - Début: {formatDate(event.begin_datetime!, true)}
                    </Typography>
                    <Typography variant="body2">
                      - Fin: {formatDate(event.end_datetime!, true)}
                    </Typography>
                  </Stack>
                </Box>
                {event.location && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="bold"
                      sx={{display: "flex", alignItems: "center", gap: 0.5}}
                    >
                      <LocationOn fontSize="small" />
                      Lieu
                    </Typography>
                    <Stack spacing={0.5} sx={{mt: 0.5}}>
                      {event.location.room && (
                        <Typography variant="body2">
                          Salle: {event.location.room}
                        </Typography>
                      )}
                      {event.location.place && (
                        <Typography variant="body2">
                          Place: {event.location.place || "Non spécifié"}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                )}
                {event.groups && event.groups.length > 0 && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      Groupes
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{mt: 0.5}}>
                      {event.groups.map((group) => (
                        <Chip
                          key={group.id}
                          label={group.ref}
                          size="small"
                          sx={{
                            bgcolor: group.attributed_color,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                height: "100%",
                border: "2px solid #2196f3",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#2196f3",
                }}
              >
                <Description />
                Pièces justificatives
              </Typography>
              <Divider sx={{mb: 2}} />
              {lettersLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress size={40} />
                </Box>
              ) : letters.length === 0 ? (
                <Alert severity="info" sx={{borderRadius: 2}}>
                  <Typography variant="body2">
                    Aucun justificatif n'a été soumis pour cette absence.
                  </Typography>
                </Alert>
              ) : (
                <Stack spacing={2}>
                  {letters.map((letter) => (
                    <LetterCard
                      key={letter.id}
                      letter={letter}
                      canManage={canManage}
                      onUpdate={handleRefresh}
                    />
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

interface LetterCardProps {
  letter: Letter;
  canManage: boolean;
  onUpdate: () => void;
}

const LetterCard: FC<LetterCardProps> = ({letter, canManage, onUpdate}) => {
  const [showPdf, setShowPdf] = useState(false);
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [showRefuseDialog, setShowRefuseDialog] = useState(false);
  const [refusalReason, setRefusalReason] = useState("");
  const [update, {isLoading}] = useUpdate();
  const notify = useNotify();

  const statusConfig = LETTER_STATUS_CONFIG[letter.status!];
  const creationDate = formatDate(letter.creation_datetime!, false);
  const approvalDate = letter.approval_datetime
    ? formatDate(letter.approval_datetime, false)
    : null;

  const handleAccept = () => {
    update(
      "users-letters",
      {
        id: letter.id,
        data: {
          id: letter.id,
          status: "RECEIVED",
          reason_for_refusal: null,
        },
        meta: {method: "UPDATE"},
      },
      {
        onSuccess: () => {
          notify("Justificatif accepté avec succès", {type: "success"});
          onUpdate();
          setShowAcceptConfirm(false);
        },
        onError: () => {
          notify("Erreur lors de l'acceptation du justificatif", {
            type: "error",
          });
          setShowAcceptConfirm(false);
        },
      }
    );
  };

  const handleRefuse = () => {
    if (!refusalReason.trim()) {
      notify("Veuillez fournir une raison pour le refus.", {type: "warning"});
      return;
    }

    update(
      "users-letters",
      {
        id: letter.id,
        data: {
          id: letter.id,
          status: "REJECTED",
          reason_for_refusal: refusalReason,
        },
        meta: {method: "UPDATE"},
      },
      {
        onSuccess: () => {
          notify("Justificatif refusé avec succès", {type: "success"});
          onUpdate();
          setShowRefuseDialog(false);
          setRefusalReason("");
        },
        onError: () => {
          notify("Erreur lors du refus du justificatif", {type: "error"});
          setShowRefuseDialog(false);
        },
      }
    );
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 2,
          border: `2px solid ${statusConfig.color}`,
          bgcolor: statusConfig.bgColor,
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Chip
                label={statusConfig.label}
                size="small"
                sx={{
                  bgcolor: statusConfig.color,
                  color: "white",
                  fontWeight: "bold",
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Réf: {letter.ref}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {letter.description}
              </Typography>
            </Box>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                - Créé le: {creationDate}
              </Typography>
              {approvalDate && (
                <Typography variant="caption" color="text.secondary">
                  - Approuvé le: {approvalDate}
                </Typography>
              )}
            </Stack>
            {letter.reason_for_refusal && (
              <Alert severity="error" sx={{borderRadius: 1}}>
                <Typography variant="caption" fontWeight="bold">
                  Raison du refus:
                </Typography>
                <Typography variant="body2">
                  {letter.reason_for_refusal}
                </Typography>
              </Alert>
            )}
            <Stack direction="row" spacing={1}>
              {letter.file_url && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Description />}
                  onClick={() => setShowPdf(true)}
                  fullWidth
                >
                  Voir le fichier
                </Button>
              )}
            </Stack>
            {canManage && letter.status === "PENDING" && (
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CheckCircle />}
                  onClick={() => setShowAcceptConfirm(true)}
                  disabled={isLoading}
                  sx={{
                    "bgcolor": "#4caf50",
                    "&:hover": {bgcolor: "#45a049"},
                  }}
                  fullWidth
                >
                  Accepter
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Unpublished />}
                  onClick={() => setShowRefuseDialog(true)}
                  disabled={isLoading}
                  sx={{
                    "bgcolor": "#f44336",
                    "&:hover": {bgcolor: "#d32f2f"},
                  }}
                  fullWidth
                >
                  Refuser
                </Button>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
      {letter.file_url && (
        <Dialog
          open={showPdf}
          onClose={() => setShowPdf(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              height: "80vh",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Justificatif - {letter.ref}</Typography>
            <IconButton onClick={() => setShowPdf(false)}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{flex: 1, overflow: "auto"}}>
            <PdfViewer
              filename={letter.description || "Justificatif"}
              url={letter.file_url}
              sx={{height: "100%"}}
            />
          </DialogContent>
        </Dialog>
      )}
      <Confirm
        isOpen={showAcceptConfirm}
        title="Acceptation du justificatif"
        content="Voulez-vous vraiment accepter ce justificatif ?"
        onConfirm={handleAccept}
        onClose={() => setShowAcceptConfirm(false)}
      />
      <Confirm
        isOpen={showRefuseDialog}
        title="Refus du justificatif"
        content={
          <TextField
            required
            fullWidth
            label="Raison du refus"
            value={refusalReason}
            onChange={(e) => setRefusalReason(e.target.value)}
            multiline
            rows={3}
            sx={{mt: 2}}
          />
        }
        onConfirm={handleRefuse}
        onClose={() => {
          setShowRefuseDialog(false);
          setRefusalReason("");
        }}
      />
    </>
  );
};
