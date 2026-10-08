import {
  ArchiveWithConfirm,
  DeleteWithConfirm,
} from "@/operations/common/components";
import {DateField} from "@/operations/common/components/fields";
import {renderMoney} from "@/operations/common/utils/money";
import FeesActions from "@/operations/fees/components/FeesActions";
import {PSP_COLORS, PSP_VALUES, getFeeRowStyle} from "@/operations/fees/utils";
import {commentFunctionRenderer} from "@/operations/utils";
import {payingApi} from "@/providers/api";
import {toApiIds} from "@/providers/feeProvider";
import {useRole} from "@/security/hooks";
import {EMPTY_TEXT} from "@/ui/constants";
import {HaList} from "@/ui/haList/HaList";
import {formatDate} from "@/utils/date";
import {Fee, FeeStatusEnum} from "@haapi-b0fc7615/typescript-client";
import {WarningOutlined} from "@mui/icons-material";
import {Box, Chip} from "@mui/material";
import {FunctionField, Identifier, WrapperField} from "react-admin";

interface ManagerFeeListProps {
  studentId: string;
  studentRef: string;
}

export const ManagerFeeList = ({
  studentId,
  studentRef,
}: Readonly<ManagerFeeListProps>) => {
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
          rowClick: (id: Identifier) => `/fees/${id}/show`,
          rowStyle: getFeeRowStyle,
        }}
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
          render={(record: Fee) => renderMoney(record.remaining_amount)}
        />
        <FunctionField
          render={(fee: Fee) => fee?.mpbs?.at(-1)?.psp_id}
          label="Référence de la transaction"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee: Fee) => {
            const pspType = fee.mpbs?.at(-1)?.psp_type;
            return fee.mpbs ? (
              <Chip
                color={pspType ? PSP_COLORS[pspType] : undefined}
                label={pspType ? PSP_VALUES[pspType] : undefined}
              />
            ) : (
              EMPTY_TEXT
            );
          }}
          label="Type de transaction"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee: Fee) =>
            formatDate(fee?.mpbs?.at(-1)?.creation_datetime)
          }
          label="Ajout de la référence de transaction"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee: Fee) =>
            formatDate(fee?.mpbs?.at(-1)?.last_datetime_verification)
          }
          label="Dernière vérification par HEI"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee: Fee) =>
            formatDate(fee?.mpbs?.at(-1)?.psp_own_datetime_verification)
          }
          label="Vérification par PSP"
          emptyText={EMPTY_TEXT}
        />
        <FunctionField
          render={(fee: Fee) =>
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
                confirmTitle="Demande d'archivage"
                confirmContent="Confirmez-vous la demande d'archivage de ce frais ?"
                getDisabledReason={(record) =>
                  record.status !== FeeStatusEnum.PAID
                    ? "Un frais non payé ne peut pas être archivé."
                    : undefined
                }
                onArchive={(record) => {
                  const {feeId} = toApiIds(String(record.id));
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
