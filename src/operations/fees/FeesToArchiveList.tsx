import {PALETTE_COLORS} from "@/haTheme";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import {FeeArchiveRowActions} from "@/operations/fees/components/FeeArchiveRowActions";
import {
  FeeRecord,
  useFeesToArchive,
} from "@/operations/fees/hooks/useFeesToArchive";
import {HaList} from "@/ui/haList/HaList";
import {ArchiveStatusEnum} from "@haapi-b0fc7615/typescript-client";
import ArchiveIcon from "@mui/icons-material/Archive";
import {alpha, Box, Button, Typography} from "@mui/material";
import {Home} from "lucide-react";
import {useState} from "react";
import {FunctionField, TextField, WrapperField} from "react-admin";
import {Link as RouterLink} from "react-router-dom";
import CustomBreadcrumbs from "../utils/CustomBreadcrumbs";
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

const archivedByLabel = (fee: FeeRecord) =>
  [fee.archived_by_first_name, fee.archived_by_last_name]
    .filter(Boolean)
    .join(" ") || "—";

const FeesToArchiveList = () => {
  const [tab, setTab] = useState<TabKey>(ArchiveStatusEnum.TO_ARCHIVE);
  const {isAllowed, toArchiveFees, rejectedFees, refetch} = useFeesToArchive();

  return (
    <Box
      sx={{
        width: "calc(100% - 20px)",
        margin: "50px auto",
      }}
    >
      <Box sx={{px: 2, pb: 2}}>
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
          {tab === ArchiveStatusEnum.REJECTED && (
            <FunctionField label="Rejeté par" render={archivedByLabel} />
          )}
          <WrapperField label="Action">
            <FeeArchiveRowActions tab={tab} onDone={refetch} />
          </WrapperField>
        </HaList>
      )}
    </Box>
  );
};

export default FeesToArchiveList;
