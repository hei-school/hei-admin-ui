import {useToggle} from "@/hooks/useToggle";
import {renderMoney} from "@/operations/common/utils/money";
import {payingApi} from "@/providers/api";
import {toApiIds} from "@/providers/feeProvider";
import {useRole} from "@/security/hooks";
import {formatDate} from "@/utils/date";
import {ArchiveStatusEnum, Fee} from "@haapi-3d601c85/typescript-client";
import ArchiveIcon from "@mui/icons-material/Archive";
import CancelIcon from "@mui/icons-material/Cancel";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {Home} from "lucide-react";
import {useState} from "react";
import {Confirm, useGetList, useNotify} from "react-admin";
import {Link as RouterLink} from "react-router-dom";
import CustomBreadcrumbs from "../utils/CustomBreadcrumbs";
import {CATEGORY} from "./constants";

type FeeRecord = Fee & {id: string};

const TO_ARCHIVE_COLOR = "#B27B00";
const REJECTED_COLOR = "#D32F2F";

const TABS = [
  {
    key: ArchiveStatusEnum.TO_ARCHIVE,
    label: "À archiver",
    color: TO_ARCHIVE_COLOR,
  },
  {key: ArchiveStatusEnum.REJECTED, label: "Rejetés", color: REJECTED_COLOR},
] as const;

type TabKey = (typeof TABS)[number]["key"];

const categoryLabel = (fee: FeeRecord) =>
  CATEGORY.find((c) => c.value === fee.category)?.label ?? fee.category ?? "—";

const FeeArchiveRowActions = ({
  fee,
  tab,
  onDone,
}: {
  fee: FeeRecord;
  tab: TabKey;
  onDone: () => void;
}) => {
  const notify = useNotify();
  const [showValidate, , toggleValidate] = useToggle();
  const [showReject, , toggleReject] = useToggle();
  const [showReArchive, , toggleReArchive] = useToggle();
  const {studentId, feeId} = toApiIds(fee.id);

  const doUpdate = async (
    status: ArchiveStatusEnum,
    successMessage: string
  ) => {
    try {
      await payingApi().updateFeeArchiveStatus(studentId, feeId, {status});
      notify(successMessage, {type: "success"});
      onDone();
    } catch (error) {
      console.error(error);
      notify("Une erreur s'est produite.", {type: "error"});
    }
  };

  const doReArchive = async () => {
    toggleReArchive();
    try {
      await payingApi().archiveStudentFee(studentId, feeId);
      notify("Demande d'archivage renvoyée.", {type: "success"});
      onDone();
    } catch (error) {
      console.error(error);
      notify("Une erreur s'est produite.", {type: "error"});
    }
  };

  if (tab === ArchiveStatusEnum.TO_ARCHIVE) {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end">
        <Button
          size="small"
          variant="outlined"
          color="warning"
          startIcon={<ArchiveIcon />}
          onClick={toggleValidate}
        >
          Archiver
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={toggleReject}
        >
          Rejeter
        </Button>
        <Confirm
          sx={{zIndex: 99999}}
          isOpen={showValidate}
          title="Archivage de frais"
          content="Confirmez-vous l'archivage de ce frais ? Il ne pourra plus être payé ni modifié."
          onConfirm={() => {
            toggleValidate();
            doUpdate(ArchiveStatusEnum.ARCHIVED, "Frais archivé avec succès.");
          }}
          onClose={toggleValidate}
          confirmColor="warning"
          confirm="Archiver"
        />
        <Confirm
          sx={{zIndex: 99999}}
          isOpen={showReject}
          title="Rejet de l'archivage"
          content="Confirmez-vous le rejet de cette demande d'archivage ?"
          onConfirm={() => {
            toggleReject();
            doUpdate(
              ArchiveStatusEnum.REJECTED,
              "Demande d'archivage rejetée."
            );
          }}
          onClose={toggleReject}
          confirmColor="warning"
          confirm="Rejeter"
        />
      </Box>
    );
  }

  return (
    <Box display="flex" justifyContent="flex-end">
      <Button
        size="small"
        variant="outlined"
        color="warning"
        startIcon={<UnarchiveIcon />}
        onClick={toggleReArchive}
      >
        Réarchiver
      </Button>
      <Confirm
        sx={{zIndex: 99999}}
        isOpen={showReArchive}
        title="Réarchivage de frais"
        content="Confirmez-vous l'envoi d'une nouvelle demande d'archivage pour ce frais ?"
        onConfirm={doReArchive}
        onClose={toggleReArchive}
        confirmColor="warning"
        confirm="Réarchiver"
      />
    </Box>
  );
};

const FeesToArchiveList = () => {
  const role = useRole();
  const [tab, setTab] = useState<TabKey>(ArchiveStatusEnum.TO_ARCHIVE);
  const isAllowed = role.isManager() || role.isAdmin();
  const {
    data: fees,
    isLoading,
    refetch,
  } = useGetList<FeeRecord>(
    "fees",
    {pagination: {page: 1, perPage: 500}},
    {enabled: isAllowed}
  );

  const toArchiveFees =
    fees?.filter(
      (fee) => fee.archive_status === ArchiveStatusEnum.TO_ARCHIVE
    ) ?? [];
  const rejectedFees =
    fees?.filter((fee) => fee.archive_status === ArchiveStatusEnum.REJECTED) ??
    [];
  const rows =
    tab === ArchiveStatusEnum.TO_ARCHIVE ? toArchiveFees : rejectedFees;

  return (
    <Box
      sx={{
        width: "calc(100% - 20px)",
        margin: "50px auto",
        borderRadius: "10px",
        boxShadow: "2px 2px 15px rgba(0,0,0,.1)",
        backgroundColor: "white",
        overflow: "hidden",
      }}
    >
      <Box sx={{px: 2, pt: 2}}>
        <CustomBreadcrumbs
          items={[
            {
              label: "Tableau de bord",
              component: RouterLink,
              to: "/",
              icon: <Home size={16} />,
            },
            {label: "Archivage des frais"},
          ]}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          borderBottom: "1px solid #F0F0F0",
        }}
      >
        <ArchiveIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Archivage des frais
        </Typography>
      </Box>

      {!isAllowed ? (
        <Box display="flex" justifyContent="center" py={6}>
          <Typography color="text.secondary">
            Cette page est réservée aux gestionnaires et administrateurs.
          </Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              p: 2,
              borderBottom: "1px solid #F0F0F0",
            }}
          >
            {TABS.map((t) => {
              const count =
                t.key === ArchiveStatusEnum.TO_ARCHIVE
                  ? toArchiveFees.length
                  : rejectedFees.length;
              const selected = tab === t.key;
              return (
                <Button
                  key={t.key}
                  size="small"
                  onClick={() => setTab(t.key)}
                  variant={selected ? "contained" : "outlined"}
                  sx={{
                    "borderRadius": 5,
                    "textTransform": "none",
                    "bgcolor": selected ? t.color : "transparent",
                    "borderColor": alpha(t.color, 0.5),
                    "color": selected ? "white" : t.color,
                    "&:hover": {
                      bgcolor: selected ? t.color : alpha(t.color, 0.08),
                    },
                  }}
                >
                  {t.label} ({count})
                </Button>
              );
            })}
          </Box>

          {isLoading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress />
            </Box>
          ) : rows.length === 0 ? (
            <Box display="flex" justifyContent="center" py={6}>
              <Typography color="text.secondary">
                {tab === ArchiveStatusEnum.TO_ARCHIVE
                  ? "Aucun frais en attente d'archivage."
                  : "Aucun frais rejeté."}
              </Typography>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{"& th": {fontWeight: 600, bgcolor: "#F0F0F0"}}}>
                  <TableCell>Référence</TableCell>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Catégorie</TableCell>
                  <TableCell>Reste à payer</TableCell>
                  <TableCell>Échéance</TableCell>
                  {tab === ArchiveStatusEnum.REJECTED && (
                    <TableCell>Rejeté par</TableCell>
                  )}
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((fee) => (
                  <TableRow key={fee.id} hover>
                    <TableCell>{fee.student_ref}</TableCell>
                    <TableCell>{fee.student_first_name}</TableCell>
                    <TableCell>{categoryLabel(fee)}</TableCell>
                    <TableCell>
                      {renderMoney(fee.remaining_amount ?? 0)}
                    </TableCell>
                    <TableCell>{formatDate(fee.due_datetime)}</TableCell>
                    {tab === ArchiveStatusEnum.REJECTED && (
                      <TableCell>
                        {[fee.archived_by_first_name, fee.archived_by_last_name]
                          .filter(Boolean)
                          .join(" ") || "—"}
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <FeeArchiveRowActions
                        fee={fee}
                        tab={tab}
                        onDone={() => refetch()}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </Box>
  );
};

export default FeesToArchiveList;
