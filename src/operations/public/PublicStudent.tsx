import {
  PublicStudent,
  getPublicStudent,
  getStudentByPublicId,
  httpStatusOf,
} from "@/operations/badges/badgeApi";
import authProvider from "@/providers/authProvider";
import {getRedirectUrl, goToExternalURL} from "@/security/casdoorSetting";
import {rememberRedirectAfterLogin} from "@/security/redirectAfterLogin";
import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {CircularProgress} from "@mui/material";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import "./style/publicStudent.css";

type Tone = "success" | "warning" | "error" | "default";

const STATUS_LABELS: Record<string, {label: string; tone: Tone}> = {
  ENABLED: {label: "Actif", tone: "success"},
  SUSPENDED: {label: "Suspendu", tone: "warning"},
  DISABLED: {label: "Désactivé", tone: "error"},
  ALUMNI: {label: "Ancien étudiant", tone: "default"},
};

const SPECIALIZATION_LABELS: Record<string, string> = {
  COMMON_CORE: "Tronc commun",
  EL: "Écosystème Logiciel",
  TN: "Transformation Numérique",
};

const isLoggedIn = () => !!authProvider.getCachedWhoami().bearer;

/**
 * Page opened by the badge QR code (public, like the calendar). Admins and managers
 * are redirected to the full student profile, others see the public information.
 */
export const PublicStudentView = () => {
  const {publicId = ""} = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<PublicStudent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const {role} = authProvider.getCachedWhoami();
  const isStaff =
    role === WhoamiRoleEnum.ADMIN || role === WhoamiRoleEnum.MANAGER;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (isLoggedIn() && isStaff) {
          try {
            const {id} = await getStudentByPublicId(publicId);
            if (!cancelled)
              navigate(`/students/${id}/show?tab=fees`, {replace: true});
            return;
          } catch (e) {
            // expired session: fall back to the public information
            const status = httpStatusOf(e);
            if (status !== 401 && status !== 403) throw e;
          }
        }
        const publicStudent = await getPublicStudent(publicId);
        if (!cancelled) setStudent(publicStudent);
      } catch (e) {
        if (cancelled) return;
        setError(
          httpStatusOf(e) === 404
            ? "Ce badge n'existe pas."
            : "Impossible de charger le badge, réessayez."
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [publicId, isStaff, navigate]);

  const login = async () => {
    setIsRedirecting(true);
    rememberRedirectAfterLogin(window.location.pathname);
    try {
      goToExternalURL(await getRedirectUrl());
    } catch {
      setIsRedirecting(false);
      setError("Impossible d'ouvrir la page de connexion.");
    }
  };

  const status = student?.status ? STATUS_LABELS[student.status] : undefined;

  return (
    <div className="public-student">
      <header className="public-student__toolbar">
        <div className="public-student__toolbar-title">
          Haute École d'Informatique
        </div>
        <div className="public-student__toolbar-subtitle">Carte d'étudiant</div>
      </header>

      <main className="public-student__content">
        <div className="public-student__card">
          <div className="public-student__card-header">Étudiant</div>
          <div className="public-student__card-body">
            {error ? (
              <div className="public-student__message public-student__message--error">
                {error}
              </div>
            ) : !student ? (
              <CircularProgress sx={{color: "#001948", my: 6}} />
            ) : (
              <>
                {!student.is_valid && (
                  <div className="public-student__message public-student__message--warning">
                    Ce badge a été annulé.
                  </div>
                )}
                {student.profile_picture ? (
                  <img
                    className="public-student__photo"
                    src={student.profile_picture}
                    alt={`${student.first_name ?? ""} ${student.last_name ?? ""}`}
                  />
                ) : (
                  <div className="public-student__photo" />
                )}
                <div>
                  <div className="public-student__last-name">
                    {student.last_name}
                  </div>
                  <div>{student.first_name}</div>
                </div>
                <div className="public-student__ref">{student.ref}</div>
                <div className="public-student__pills">
                  {student.level && (
                    <span className="public-student__pill">
                      {student.level}
                    </span>
                  )}
                  {status && (
                    <span
                      className={`public-student__pill public-student__pill--${status.tone}`}
                    >
                      {status.label}
                    </span>
                  )}
                </div>
                {student.specialization_field && (
                  <div>
                    {SPECIALIZATION_LABELS[student.specialization_field] ??
                      student.specialization_field}
                  </div>
                )}
                {!isLoggedIn() ? (
                  <button
                    className="public-student__button"
                    disabled={isRedirecting}
                    onClick={login}
                  >
                    Se connecter
                  </button>
                ) : role === WhoamiRoleEnum.TEACHER ? (
                  <>
                    <div className="public-student__message public-student__message--info">
                      Pour pointer la présence, ouvrez l'événement puis utilisez
                      « Scanner les badges ».
                    </div>
                    <button
                      className="public-student__button"
                      onClick={() => navigate("/events")}
                    >
                      Mes événements
                    </button>
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
