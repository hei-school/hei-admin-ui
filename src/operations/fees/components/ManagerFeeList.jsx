import {
  ArchiveWithConfirm,
  DeleteWithConfirm,
} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import FeesActions from "@/operations/fees/components/FeesActions";
import {PSP_COLORS, PSP_VALUES, rowStyle} from "@/operations/fees/utils";
import {commentFunctionRenderer} from "@/operations/utils";
import {payingApi} from "@/providers/api";
import {toApiIds} from "@/providers/feeProvider";
import {useRole} from "@/security/hooks";
import {EMPTY_TEXT} from "@/ui/constants";
import {HaList} from "@/ui/haList/HaList";
import {formatDate} from "@/utils/date";
import {WarningOutlined} from "@mui/icons-material";
import {Box, Chip} from "@mui/material";
import {FunctionField, WrapperField} from "react-admin";

export const ManagerFeeList = ({studentId, studentRef}) => {
  const role = useRole();
  return (
    <Box>
      <HaList
        icon={<WarningOutlined />}
        title={`Frais de ${studentRef}`}
        resource="fees"
        filterIndicator={false}
        actions={
          role.isManager() || role.isAdmin() ? (
            <FeesActions studentId={studentId} />
          ) : null
        }
        listProps={{
          filterDefaultValues: {studentId},
          storeKey: "fees",
          className: "manager-fee-list",
        }}
        datagridProps={{
          rowClick: (id) => `/fees/${id}/show`,
          rowStyle,
        }}
        editable={false}
      >
        <DateField
          source="due_datetime"
          label="Limite de paiement du frais"
          showTime={false}
        />
        <FunctionField
          source="comment"
          render={commentFunctionRenderer}
          label="Commentaire"
        />
        <FunctionField
          label="Reste à payer"
          render={(record) => renderMoney(record.remaining_amount)}
        />
        <FunctionField
          render={(fee) => fee?.mpbs?.at(-1)?.psp_id}
          label="Référence de la transaction"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee) =>
            fee.mpbs ? (
              <Chip
                color={PSP_COLORS[fee.mpbs?.at(-1)?.psp_type]}
                label={PSP_VALUES[fee.mpbs?.at(-1)?.psp_type]}
              />
            ) : (
              EMPTY_TEXT
            )
          }
          label="Type de transaction"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee) => formatDate(fee?.mpbs?.at(-1)?.creation_datetime)}
          label="Ajout de la référence de transaction"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee) =>
            formatDate(fee?.mpbs?.at(-1)?.last_datetime_verification)
          }
          label="Dernière vérification par HEI"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee) =>
            formatDate(fee?.mpbs?.at(-1)?.psp_own_datetime_verification)
          }
          label="Vérification par PSP"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee) =>
            formatDate(fee?.mpbs?.at(-1)?.successfully_verified_on)
          }
          label="Vérification réussie"
          emptyText={EMPTY_TEXT}
        />
        {!role.isMonitor() && (
          <WrapperField label="Actions">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.2,
              }}
            >
              <DeleteWithConfirm
                resourceType="fees"
                redirect={`/students/${studentId}/show/fees?tab=fees`}
                confirmTitle="Suppression de frais"
                confirmContent="Confirmez-vous la suppression de ce frais ?"
              />
              <ArchiveWithConfirm
                redirect={`/students/${studentId}/show/fees?tab=fees`}
                confirmTitle="Archivage de frais"
                confirmContent="Confirmez-vous l'archivage de ce frais ?"
                onArchive={(record) => {
                  const {feeId} = toApiIds(record.id);

                  return payingApi().archiveStudentFee(studentId, feeId, {
                    method: "PATCH",
                  });
                }}
              />
            </Box>
          </WrapperField>
        )}
      </HaList>
    </Box>
  );
};
