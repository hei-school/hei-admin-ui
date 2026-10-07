import {
  BADGE_PAGE_PATH,
  PublicStudent,
  StudentSituation,
  badgePublicIdOfPage,
  getBadgeOwner,
  getBadgeSituation,
  getPublicStudent,
  httpStatusOf,
  publicIdOfBadgePath,
  rememberBadgePublicId,
} from "@/operations/badges/badgeApi";
import authProvider from "@/providers/authProvider";
import {getRedirectUrl, goToExternalURL} from "@/security/casdoorSetting";
import {rememberRedirectAfterLogin} from "@/security/redirectAfterLogin";
import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {CircularProgress} from "@mui/material";
import {ReactNode, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {PublicNotFound} from "./PublicNotFound";
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

const INVALIDITY_MESSAGES = {
  REVOKED: "Ce badge a été révoqué.",
  EXPIRED: "Ce badge a expiré.",
};

const formatDate = (datetime: string) =>
  new Date(datetime).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const isLoggedIn = () => !!authProvider.getCachedWhoami().bearer;

class BadgeNotFound extends Error {}

const findOwnerIdForStaff = async (publicId: string) => {
  try {
    return (await getBadgeOwner(publicId)).id;
  } catch (e) {
    const status = httpStatusOf(e);
    if (status === 404) throw new BadgeNotFound();
    if (status !== 401 && status !== 403) throw e;
    return null;
  }
};

const getBadge = async (publicId: string) => {
  try {
    return await getPublicStudent(publicId);
  } catch (e) {
    if (httpStatusOf(e) === 404) throw new BadgeNotFound();
    throw e;
  }
};

/** /badges/<public id>: the address bar then only shows /badges, the tab keeps the id. */
const usePagePublicId = () => {
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const publicIdOfPath = publicIdOfBadgePath(pathname);

  useEffect(() => {
    if (publicIdOfPath === null) return;
    rememberBadgePublicId(publicIdOfPath);
    navigate(BADGE_PAGE_PATH, {replace: true});
  }, [publicIdOfPath, navigate]);

  return publicIdOfPath ?? badgePublicIdOfPage();
};

export const PublicStudentView = () => {
  const publicId = usePagePublicId();
  const navigate = useNavigate();
  const [student, setStudent] = useState<PublicStudent | null>(null);
  const [situation, setSituation] = useState<StudentSituation | null>(null);
  const [isNotFound, setIsNotFound] = useState(!publicId);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const {role} = authProvider.getCachedWhoami();
  const isStaff =
    role === WhoamiRoleEnum.ADMIN || role === WhoamiRoleEnum.MANAGER;
  const isTeacher = role === WhoamiRoleEnum.TEACHER;

  useEffect(() => {
    if (!publicId) {
      setIsNotFound(true);
      return;
    }
    let cancelled = false;
    setIsNotFound(false);
    setStudent(null);
    setSituation(null);
    setError(null);

    const loadSituation = () => {
      getBadgeSituation(publicId)
        .then((loaded) => {
          if (!cancelled) setSituation(loaded);
        })
        .catch(() => undefined);
    };

    const loadStudent = async () => {
      if (isLoggedIn() && isStaff) {
        const ownerId = await findOwnerIdForStaff(publicId);
        if (ownerId) {
          if (!cancelled)
            navigate(`/students/${ownerId}/show?tab=fees`, {replace: true});
          return;
        }
      }
      const badge = await getBadge(publicId);
      if (cancelled) return;
      setStudent(badge);
      if (badge.is_valid && isLoggedIn() && isTeacher) loadSituation();
    };

    void loadStudent().catch((e) => {
      if (cancelled) return;
      if (e instanceof BadgeNotFound) {
        setIsNotFound(true);
      } else {
        setError("Impossible de charger le badge, réessayez.");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [publicId, isStaff, isTeacher, navigate]);

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

  if (isNotFound) return <PublicNotFound />;

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
            <StudentCardBody
              error={error}
              student={student}
              situation={situation}
              actions={
                <StudentActions
                  isTeacher={isTeacher}
                  isRedirecting={isRedirecting}
                  onLogin={login}
                  onCheckAttendance={() => navigate("/badges/attendance")}
                />
              }
            />
          </div>
          <SchoolContact />
        </div>
      </main>
    </div>
  );
};

type StudentCardBodyProps = {
  error: string | null;
  student: PublicStudent | null;
  situation: StudentSituation | null;
  actions: ReactNode;
};

const StudentCardBody = ({
  error,
  student,
  situation,
  actions,
}: Readonly<StudentCardBodyProps>) => {
  if (error) {
    return (
      <div className="public-student__message public-student__message--error">
        {error}
      </div>
    );
  }

  if (!student) {
    return <CircularProgress sx={{color: "#001948", my: 6}} />;
  }

  if (!student.is_valid) {
    return (
      <div className="public-student__message public-student__message--warning">
        {INVALIDITY_MESSAGES[student.invalidity ?? "REVOKED"]}
      </div>
    );
  }

  const status = student.status ? STATUS_LABELS[student.status] : undefined;

  return (
    <>
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
        <div className="public-student__last-name">{student.last_name}</div>
        <div>{student.first_name}</div>
      </div>
      <div className="public-student__ref">{student.ref}</div>
      <div className="public-student__pills">
        {student.level && (
          <span className="public-student__pill">{student.level}</span>
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
      <BadgeValidity student={student} />
      <Situation situation={situation} />
      {actions}
    </>
  );
};

const BadgeValidity = ({student}: Readonly<{student: PublicStudent}>) => (
  <div className="public-student__validity">
    {student.academic_year && (
      <div className="public-student__academic-year">
        Année universitaire {student.academic_year}
      </div>
    )}
    <div>
      {student.expiration_datetime
        ? `Valable jusqu'au ${formatDate(student.expiration_datetime)}`
        : "Sans expiration"}
    </div>
  </div>
);

const Situation = ({
  situation,
}: Readonly<{situation: StudentSituation | null}>) => {
  if (situation?.status !== "SUSPENDED") return null;

  const lateFees = situation.late_fees ?? [];
  return (
    <div className="public-student__message public-student__message--error public-student__situation">
      <div>
        {situation.suspension_reason === "LATE_FEES"
          ? "Suspendu : frais en retard"
          : "Suspendu par l'administration"}
      </div>
      {lateFees.length > 0 && (
        <ul>
          {lateFees.map((lateFee, index) => (
            <li key={`${lateFee.label}-${lateFee.due_datetime}-${index}`}>
              {lateFee.label ?? "Frais"}
              {lateFee.due_datetime &&
                ` · échu le ${formatDate(lateFee.due_datetime)}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

type StudentActionsProps = {
  isTeacher: boolean;
  isRedirecting: boolean;
  onLogin: () => void;
  onCheckAttendance: () => void;
};

const StudentActions = ({
  isTeacher,
  isRedirecting,
  onLogin,
  onCheckAttendance,
}: Readonly<StudentActionsProps>) => {
  if (!isLoggedIn()) {
    return (
      <button
        className="public-student__button"
        disabled={isRedirecting}
        onClick={onLogin}
      >
        Se connecter
      </button>
    );
  }

  if (!isTeacher) return null;

  return (
    <button className="public-student__button" onClick={onCheckAttendance}>
      Pointer la présence
    </button>
  );
};

const SCHOOL_PHONE = "+261 34 94 041 16";
const SCHOOL_EMAIL = "contact@mail.hei.school";
const SCHOOL_ADDRESS = "Lot II 161R Ivandry, Antananarivo";

const SchoolContact = () => (
  <div className="public-student__contact">
    <div className="public-student__contact-title">
      Vous avez trouvé ce badge ?
    </div>
    <div>Merci de le rapporter chez HEI :</div>
    <a href={`tel:${SCHOOL_PHONE.replace(/\s/g, "")}`}>📞 {SCHOOL_PHONE}</a>
    <a href={`mailto:${SCHOOL_EMAIL}`}>✉ {SCHOOL_EMAIL}</a>
    <div>📍 {SCHOOL_ADDRESS}</div>
  </div>
);
