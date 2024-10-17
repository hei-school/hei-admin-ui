import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  styled,
} from "@mui/material";
import {Link} from "react-admin";
import {Close} from "@mui/icons-material";
import {formatDate} from "../utils";

const StyledTypography = styled("h3")({
  color: "#3a3a3b",
  fontSize: "1em",
  marginTop: 10,
  marginBottom: 0,
  fontWeight: 600,
});

export const Title = ({content, label, link}) => {
  const style = {color: "#4a4b4d", my: 0.4, fontSize: "14px"};
  const getContent = !link ? (
    <span style={{color: "#282829"}}>{content}</span>
  ) : (
    <Link to={link}>{content}</Link>
  );

  return (
    <Typography sx={style}>
      {label}: {getContent}
    </Typography>
  );
};

export const ShowOne = ({showOne, setShowOne}) => {
  const {status, record} = showOne;

  const close = () => setShowOne({status: false, record: null});
  const student = record
    ? `${record.student.first_name} ${record.student.ref}`
    : "";
  const teacher =
    record && record.course_session.id
      ? `${record.course_session.awareded_course.main_teacher.first_name} ` +
        record.course_session.awareded_course.main_teacher.ref
      : "";

  const data = !(record && record.course_session.id)
    ? []
    : [
        {
          label: "Group",
          content: record.course_session.awareded_course.group.ref,
        },
        {
          label: "Cours",
          content: record.course_session.awareded_course.course.code,
        },
        {
          label: "Enseignant",
          link: `/teachers/${record.course_session.awareded_course.main_teacher.id}/show`,
          content: teacher,
        },
        {label: "Debut", content: formatDate(record.course_session.begin)},
        {label: "Fin", content: formatDate(record.course_session.end)},
      ];

  return (
    <Dialog open={status} onClose={close}>
      {record && (
        <>
          <DialogTitle
            component="div"
            sx={{
              pb: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{fontSize: "1em", fontWeight: "bold"}}>
              {" "}
              ID: #{record.id}{" "}
            </Typography>
            <IconButton onClick={close}>
              {" "}
              <Close />{" "}
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{minWidth: "300px"}}>
            <StyledTypography>Informations</StyledTypography>
            <Title
              label="Heure"
              content={formatDate(record.created_at) || "---"}
            />
            <Title
              label="Étudiant"
              link={`/students/${record.student.id}/show`}
              content={student}
            />
            <Title label="Lieu" content={record.place} />
            {record.course_session.id && (
              <>
                {record.is_late && (
                  <Title label="En retard de" content={record.late_of} />
                )}
                <StyledTypography>Cours</StyledTypography>
                {data.map((el, index) => (
                  <Title key={index} {...el} />
                ))}
              </>
            )}
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};
