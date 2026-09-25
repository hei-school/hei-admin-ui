import {DateField} from "@/operations/common/components/fields";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList/HaList";
import {
  SmsCampaign,
  SmsLog,
  SmsMessageStatus,
} from "@haapi-b0fc7615/typescript-client";
import {Box, Chip, Stack, Typography} from "@mui/material";
import {FunctionField, TextField} from "react-admin";
import {
  SMS_CAMPAIGN_STATUS_COLOR,
  SMS_CAMPAIGN_STATUS_LABEL,
} from "./SmsCampaignStatusChip";
import {SMS_RECIPIENT_SOURCE_LABEL} from "./constants";

interface SmsCampaignDetailsDialogProps {
  campaign: SmsCampaign;
  onClose: () => void;
}

export const SmsCampaignDetailsDialog = ({
  campaign,
  onClose,
}: SmsCampaignDetailsDialogProps) => {
  return (
    <Dialog
      title="Détails de la campagne SMS"
      open
      onClose={onClose}
      maxWidth="lg"
    >
      <Box p={2.5}>
        <Stack spacing={1.5} mb={3}>
          <Typography variant="body1">{campaign.message}</Typography>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            {campaign.status && (
              <Chip
                size="small"
                label={SMS_CAMPAIGN_STATUS_LABEL[campaign.status]}
                color={SMS_CAMPAIGN_STATUS_COLOR[campaign.status]}
              />
            )}
            <Chip
              size="small"
              variant="outlined"
              label={`${campaign.recipientCount ?? 0} destinataire(s)`}
            />
            {!!campaign.recipientsRejectedForBalance && (
              <Chip
                size="small"
                variant="outlined"
                color="warning"
                label={`${campaign.recipientsRejectedForBalance} rejetés (solde)`}
              />
            )}
          </Stack>
          {campaign.failureReason && (
            <Typography variant="body2" color="error">
              {campaign.failureReason}
            </Typography>
          )}
        </Stack>

        <HaList
          icon={undefined}
          actions={undefined}
          title="Journal d'envoi"
          resource="sms-campaign-logs"
          filterIndicator={false}
          datagridProps={{rowClick: false}}
          listProps={{
            title: "Journal d'envoi",
            filterDefaultValues: {campaignId: campaign.id},
          }}
        >
          <TextField source="phoneNumber" label="Numéro" />
          <FunctionField
            label="Source"
            render={(log: SmsLog) =>
              log.recipientSource
                ? SMS_RECIPIENT_SOURCE_LABEL[log.recipientSource]
                : "—"
            }
          />
          <DateField source="sentDatetime" label="Envoyé le" showTime />
          {!!campaign.failedCount && (
            <FunctionField
              label="Motif d'échec"
              render={(log: SmsLog) =>
                log.status === SmsMessageStatus.FAILED
                  ? (log.failureReason ?? "—")
                  : ""
              }
            />
          )}
        </HaList>
      </Box>
    </Dialog>
  );
};
