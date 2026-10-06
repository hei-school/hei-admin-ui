import {
  PublicStudent,
  getPublicStudent,
  getStudentByPublicId,
  httpStatusOf,
  isBadgeExpired,
} from "@/operations/badges/badgeApi";
import authProvider from "@/providers/authProvider";
import {getRedirectUrl, goToExternalURL} from "@/security/casdoorSetting";
import {rememberRedirectAfterLogin} from "@/security/redirectAfterLogin";
import {WhoamiRoleEnum} from "@haapi-b0fc7615/typescript-client";
import {CircularProgress} from "@mui/material";
import {ReactNode, useEffect, useState} from "react";
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

type StudentContactInfo = {
  phone?: string;
  email?: string;
};

/** Returns null when the staff member is not allowed to see the full student. */
const fetchStudentIdForStaff = async (publicId: string) => {
  try {
    const {id} = await getStudentByPublicId(publicId);
    return {id};
  } catch (e) {
    const status = httpStatusOf(e);
    if (status !== 401 && status !== 403) throw e;
    return null;
  }
};

const getLoadErrorMessage = (e: unknown) =>
  httpStatusOf(e) === 404
    ? "Ce badge n'existe pas."
    : "Impossible de charger le badge, réessayez.";

export const PublicStudentView = ({
  publicId: publicIdProp,
}: {
  publicId?: string;
}) => {
  const params = useParams();
  const publicId = publicIdProp ?? params.publicId ?? "";
  const navigate = useNavigate();
  const [student, setStudent] = useState<PublicStudent | null>(null);
  const [studentContact, setStudentContact] =
    useState<StudentContactInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const {role} = authProvider.getCachedWhoami();
  const isStaff =
    role === WhoamiRoleEnum.ADMIN || role === WhoamiRoleEnum.MANAGER;
  const isTeacher = role === WhoamiRoleEnum.TEACHER;

  useEffect(() => {
    let cancelled = false;

    const loadStudentContact = () => {
      getStudentByPublicId(publicId)
        .then(({phone, email}) => {
          if (!cancelled) setStudentContact({phone, email});
        })
        .catch(() => undefined);
    };

    const loadStudent = async () => {
      if (isLoggedIn() && isStaff) {
        const staffStudent = await fetchStudentIdForStaff(publicId);
        if (staffStudent) {
          if (!cancelled)
            navigate(`/students/${staffStudent.id}/show?tab=fees`, {
              replace: true,
            });
          return;
        }
      }
      const publicStudent = await getPublicStudent(publicId);
      if (!cancelled) setStudent(publicStudent);
      if (isLoggedIn() && role === WhoamiRoleEnum.TEACHER) loadStudentContact();
    };

    // errors are shown on the page
    void loadStudent().catch((e) => {
      if (!cancelled) setError(getLoadErrorMessage(e));
    });
    return () => {
      cancelled = true;
    };
  }, [publicId, isStaff, role, navigate]);

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
              studentContact={studentContact}
              actions={
                <StudentActions
                  isTeacher={isTeacher}
                  isRedirecting={isRedirecting}
                  onLogin={login}
                  onOpenEvents={() => navigate("/events")}
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
  studentContact: StudentContactInfo | null;
  actions: ReactNode;
};

const StudentCardBody = ({
  error,
  student,
  studentContact,
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

  const status = student.status ? STATUS_LABELS[student.status] : undefined;

  return (
    <>
      {!student.is_valid && (
        <div className="public-student__message public-student__message--warning">
          {isBadgeExpired(student)
            ? `Ce badge a expiré : il était valable pour l'année ${student.academic_year ?? "précédente"}.`
            : "Ce badge a été annulé."}
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
      {actions}
      <StudentContact contact={studentContact} />
    </>
  );
};

type StudentActionsProps = {
  isTeacher: boolean;
  isRedirecting: boolean;
  onLogin: () => void;
  onOpenEvents: () => void;
};

const StudentActions = ({
  isTeacher,
  isRedirecting,
  onLogin,
  onOpenEvents,
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
    <>
      <div className="public-student__message public-student__message--info">
        Pour pointer la présence, ouvrez l'événement puis utilisez « Scanner les
        badges ».
      </div>
      <button className="public-student__button" onClick={onOpenEvents}>
        Mes événements
      </button>
    </>
  );
};

const StudentContact = ({
  contact,
}: Readonly<{contact: StudentContactInfo | null}>) => {
  if (!contact || !(contact.phone || contact.email)) return null;

  return (
    <div className="public-student__contact public-student__contact--student">
      <div className="public-student__contact-title">Contact de l'étudiant</div>
      {contact.phone && (
        <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
          📞 {contact.phone}
        </a>
      )}
      {contact.email && (
        <a href={`mailto:${contact.email}`}>✉ {contact.email}</a>
      )}
    </div>
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
    {SCHOOL_PHONE && (
      <a href={`tel:${SCHOOL_PHONE.replace(/\s/g, "")}`}>📞 {SCHOOL_PHONE}</a>
    )}
    <a href={`mailto:${SCHOOL_EMAIL}`}>✉ {SCHOOL_EMAIL}</a>
    <div>📍 {SCHOOL_ADDRESS}</div>
  </div>
);
