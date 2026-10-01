import {QrCodeScanner, Refresh} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import QrScanner from "qr-scanner";
import {FormEvent, useCallback, useEffect, useRef, useState} from "react";
import {parsePublicId} from "../badgeApi";

const MAX_SCANS_PER_SECOND = 5;
const SAME_BADGE_COOLDOWN_MS = 4_000;
// A scan waiting for the server blocks the next ones: never wait forever.
const SCAN_TIMEOUT_MS = 15_000;
const SCAN_REGION_RATIO = 0.85;
const MAX_SCAN_REGION_PX = 800;

type ScanStatus = {severity: "info" | "warning" | "error"; message: string};

const scanRegionOf = (video: HTMLVideoElement): QrScanner.ScanRegion => {
  const size = Math.round(
    Math.min(video.videoWidth, video.videoHeight) * SCAN_REGION_RATIO
  );
  const scaledSize = Math.min(size, MAX_SCAN_REGION_PX);
  return {
    x: Math.round((video.videoWidth - size) / 2),
    y: Math.round((video.videoHeight - size) / 2),
    width: size,
    height: size,
    downScaledWidth: scaledSize,
    downScaledHeight: scaledSize,
  };
};

const truncate = (text: string, length = 60) =>
  text.length > length ? `${text.slice(0, length)}…` : text;

const withTimeout = <T,>(promise: Promise<T>, ms: number) =>
  new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timer);
        reject(error);
      }
    );
  });

const ACTIVE_STATUS: ScanStatus = {
  severity: "info",
  message: "Caméra active : présentez le QR code du badge au centre du cadre.",
};

export type BadgeScannerProps = {
  onScan: (publicId: string) => Promise<void> | void;
};

export const BadgeScanner = ({onScan}: BadgeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const isHandlingRef = useRef(false);
  const lastScanRef = useRef<{publicId: string; at: number} | null>(null);
  const onScanRef = useRef(onScan);
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);
  const [cameraId, setCameraId] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [status, setStatus] = useState<ScanStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [cameraStopped, setCameraStopped] = useState(false);
  const [manualValue, setManualValue] = useState("");
  const [manualError, setManualError] = useState<string | null>(null);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  const handle = useCallback(async (publicId: string) => {
    const last = lastScanRef.current;
    if (
      isHandlingRef.current ||
      (last?.publicId === publicId &&
        Date.now() - last.at < SAME_BADGE_COOLDOWN_MS)
    ) {
      return;
    }
    isHandlingRef.current = true;
    lastScanRef.current = {publicId, at: Date.now()};
    setIsChecking(true);
    try {
      await withTimeout(
        Promise.resolve(onScanRef.current(publicId)),
        SCAN_TIMEOUT_MS
      );
      setStatus(ACTIVE_STATUS);
    } catch {
      setStatus({
        severity: "error",
        message:
          "Le serveur ne répond pas : vérifiez la connexion puis rescannez le badge.",
      });
      // the same badge can be rescanned right away
      lastScanRef.current = null;
    } finally {
      isHandlingRef.current = false;
      setIsChecking(false);
    }
  }, []);

  // Detects a webcam that stops (used by another app, unplugged, put to sleep...).
  const watchCameraTrack = useCallback((video: HTMLVideoElement) => {
    const stream = video.srcObject as MediaStream | null;
    stream?.getVideoTracks().forEach((track) =>
      track.addEventListener("ended", () => {
        setCameraStopped(true);
        setStatus({
          severity: "error",
          message:
            "La caméra s'est arrêtée : cliquez sur « Relancer la caméra ».",
        });
      })
    );
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const scanner = new QrScanner(
      video,
      (result) => {
        const publicId = parsePublicId(result.data);
        if (publicId) {
          setStatus(null);
          handle(publicId);
        } else {
          setStatus({
            severity: "warning",
            message: `QR code lu, mais ce n'est pas un badge HEI : « ${truncate(result.data)} »`,
          });
        }
      },
      {
        returnDetailedScanResult: true,
        preferredCamera: "environment",
        maxScansPerSecond: MAX_SCANS_PER_SECOND,
        calculateScanRegion: scanRegionOf,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        onDecodeError: (error) => {
          if (error === QrScanner.NO_QR_CODE_FOUND) return;
          setStatus({
            severity: "error",
            message: `Le décodeur de QR code ne fonctionne pas : ${String(error)}`,
          });
        },
      }
    );
    scannerRef.current = scanner;
    let destroyed = false;

    scanner
      .start()
      .then(() => {
        if (!destroyed) {
          setStatus(ACTIVE_STATUS);
          watchCameraTrack(video);
        }
        return QrScanner.listCameras(true);
      })
      .then((availableCameras) => {
        if (!destroyed) setCameras(availableCameras);
      })
      .catch(() => {
        if (!destroyed)
          setCameraError(
            "Aucune caméra accessible. Branchez une webcam ou autorisez la caméra dans le navigateur, sinon saisissez le lien du badge."
          );
      });

    return () => {
      destroyed = true;
      scanner.destroy();
      scannerRef.current = null;
    };
  }, [handle, watchCameraTrack]);

  const restartCamera = async () => {
    const scanner = scannerRef.current;
    const video = videoRef.current;
    if (!scanner || !video) return;
    scanner.stop();
    isHandlingRef.current = false;
    lastScanRef.current = null;
    try {
      await scanner.start();
      setCameraStopped(false);
      setStatus(ACTIVE_STATUS);
      watchCameraTrack(video);
    } catch {
      setStatus({
        severity: "error",
        message:
          "Impossible de relancer la caméra : vérifiez qu'aucune autre application ne l'utilise.",
      });
    }
  };

  const changeCamera = (id: string) => {
    setCameraId(id);
    scannerRef.current
      ?.setCamera(id)
      .then(() => videoRef.current && watchCameraTrack(videoRef.current))
      .catch(() => undefined);
  };

  const submitManual = async (event: FormEvent) => {
    event.preventDefault();
    const publicId = parsePublicId(manualValue);
    if (!publicId) {
      setManualError("Lien de badge invalide.");
      return;
    }
    setManualError(null);
    lastScanRef.current = null;
    await handle(publicId);
    setManualValue("");
  };

  return (
    <Stack gap={2}>
      {cameraError ? (
        <Alert severity="info">{cameraError}</Alert>
      ) : (
        <>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: 420,
              aspectRatio: "4 / 3",
              mx: "auto",
              borderRadius: 2,
              overflow: "hidden",
              bgcolor: "black",
            }}
          >
            <video
              ref={videoRef}
              muted
              playsInline
              style={{width: "100%", height: "100%", objectFit: "cover"}}
            />
          </Box>
          {isChecking ? (
            <Alert severity="info" icon={<CircularProgress size={20} />}>
              Vérification du badge…
            </Alert>
          ) : (
            status && (
              <Alert severity={status.severity} sx={{wordBreak: "break-word"}}>
                {status.message}
              </Alert>
            )
          )}
          <Button
            variant={cameraStopped ? "contained" : "text"}
            size="small"
            startIcon={<Refresh />}
            onClick={restartCamera}
            sx={{alignSelf: "center"}}
          >
            Relancer la caméra
          </Button>
          {cameras.length > 1 && (
            <TextField
              select
              size="small"
              label="Caméra"
              value={cameraId}
              onChange={(event) => changeCamera(event.target.value)}
            >
              {cameras.map((camera, index) => (
                <MenuItem key={camera.id} value={camera.id}>
                  {camera.label || `Caméra ${index + 1}`}
                </MenuItem>
              ))}
            </TextField>
          )}
        </>
      )}
      <Box component="form" onSubmit={submitManual} display="flex" gap={1}>
        <TextField
          size="small"
          fullWidth
          label="Ou lien du badge"
          value={manualValue}
          error={!!manualError}
          helperText={manualError ?? " "}
          onChange={(event) => setManualValue(event.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<QrCodeScanner />}
          sx={{alignSelf: "flex-start"}}
        >
          Valider
        </Button>
      </Box>
    </Stack>
  );
};
