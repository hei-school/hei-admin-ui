import {PALETTE_COLORS} from "@/haTheme";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import {FeeArchiveRowActions} from "@/operations/fees/components/FeeArchiveRowActions";
import {
  FeeRecord,
  useFeesToArchive,
} from "@/operations/fees/hooks/useFeesToArchive";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList/HaList";
import {ArchiveStatusEnum} from "@haapi-b0fc7615/typescript-client";
import ArchiveIcon from "@mui/icons-material/Archive";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  alpha,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {useState} from "react";
import {FunctionField, TextField, WrapperField} from "react-admin";
import {CATEGORY} from "./constants";

const TABS = [
  {
    key: ArchiveStatusEnum.TO_ARCHIVE,
    label: "À archiver",
    color: PALETTE_COLORS.warning,
  },
  {
    key: ArchiveStatusEnum.REJECTED,
    label: "Rejetés",
    color: PALETTE_COLORS.red,
  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const categoryLabel = (fee: FeeRecord) =>
  CATEGORY.find((c) => c.value === fee.category)?.label ?? fee.category ?? "—";

const rejectedByLabel = (fee: FeeRecord) =>
  [fee.rejected_by_first_name, fee.rejected_by_last_name]
    .filter(Boolean)
    .join(" ");

const RejectionReasonCell = ({
  fee,
  onSelect,
}: {
  fee: FeeRecord;
  onSelect: (fee: FeeRecord) => void;
}) => {
  const reason = fee.rejection_reason ?? "";
  if (!reason) {
    return null;
  }
  return (
    <Tooltip title="Voir le motif du rejet">
      <IconButton
        size="small"
        data-testid={`rejection-reason-${fee.id}`}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(fee);
        }}
        sx={{color: PALETTE_COLORS.primary}}
      >
        <ChatBubbleOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

const FeesToArchiveList = () => {
  const [tab, setTab] = useState<TabKey>(ArchiveStatusEnum.TO_ARCHIVE);
  const [selectedRejection, setSelectedRejection] = useState<FeeRecord | null>(
    null
  );
  const {isAllowed, toArchiveFees, rejectedFees, refetch} = useFeesToArchive();

  return (
    <Box
      sx={{
        width: "calc(100% - 20px)",
        margin: "50px auto",
      }}
    >
      {!isAllowed ? (
        <Box
          sx={{
            borderRadius: "10px",
            boxShadow: "2px 2px 15px rgba(0,0,0,.1)",
            backgroundColor: "white",
          }}
          display="flex"
          justifyContent="center"
          py={6}
        >
          <Typography color="text.secondary">
            Cette page est réservée aux gestionnaires et administrateurs.
          </Typography>
        </Box>
      ) : (
        <HaList
          key={tab}
          icon={<ArchiveIcon color="primary" />}
          title="Archivage des frais"
          resource="fees"
          filterIndicator={false}
          actions={null}
          wrapperSx={{
            "marginTop": 0,
            "& th:last-child": {
              textAlign: "center !important",
              paddingRight: "1rem !important",
            },
            "& th:last-child span": {
              justifyContent: "center !important",
            },
          }}
          emptyListMessage={
            tab === ArchiveStatusEnum.TO_ARCHIVE
              ? "Aucun frais en attente d'archivage."
              : "Aucun frais rejeté."
          }
          filterButtons={
            <Box sx={{display: "flex", gap: 1.5}}>
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
          }
          listProps={{
            filterDefaultValues: {archive_status: tab},
            perPage: 500,
            pagination: false,
            storeKey: false,
          }}
          datagridProps={{rowClick: false}}
        >
          <TextField source="student_ref" label="Référence" />
          <TextField source="student_first_name" label="Prénom" />
          <FunctionField label="Catégorie" render={categoryLabel} />
          <FunctionField
            label="Reste à payer"
            render={(fee: FeeRecord) => renderMoney(fee.remaining_amount ?? 0)}
          />
          <DateField source="due_datetime" label="Échéance" showTime={false} />
          <DateField
            source="archive_requested_datetime"
            label="Demandé le"
            showTime={false}
            emptyText=""
          />
          {tab === ArchiveStatusEnum.REJECTED && (
            <FunctionField label="Rejeté par" render={rejectedByLabel} />
          )}
          {tab === ArchiveStatusEnum.REJECTED && (
            <DateField
              source="rejected_datetime"
              label="Rejeté le"
              showTime={false}
              emptyText=""
            />
          )}
          {tab === ArchiveStatusEnum.REJECTED && (
            <FunctionField
              label="Motif"
              render={(fee: FeeRecord) => (
                <RejectionReasonCell
                  fee={fee}
                  onSelect={setSelectedRejection}
                />
              )}
            />
          )}
          <WrapperField label="Action" textAlign="center">
            <FeeArchiveRowActions tab={tab} onDone={refetch} />
          </WrapperField>
        </HaList>
      )}
      {selectedRejection && (
        <Dialog
          title="Motif du rejet"
          open
          onClose={() => setSelectedRejection(null)}
          maxWidth="sm"
        >
          <Box sx={{p: 2.5}}>
            <Typography variant="body2" color="text.secondary" sx={{mb: 1.5}}>
              {selectedRejection.student_ref} —{" "}
              {selectedRejection.student_first_name}
            </Typography>
            <Typography variant="body1" sx={{whiteSpace: "pre-wrap"}}>
              {selectedRejection.rejection_reason}
            </Typography>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};

export default FeesToArchiveList;
