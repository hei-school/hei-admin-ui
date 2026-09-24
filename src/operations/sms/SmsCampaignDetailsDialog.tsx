import {DateField} from "@/operations/common/components/fields";
import {Dialog} from "@/ui/components";
import {HaList} from "@/ui/haList/HaList";
import {SmsCampaign} from "@haapi-b0fc7615/typescript-client";
import {Box, Chip, Stack, Typography} from "@mui/material";
import {FunctionField, TextField} from "react-admin";
import {
  SMS_CAMPAIGN_STATUS_COLOR,
  SMS_CAMPAIGN_STATUS_LABEL,
} from "./SmsCampaignStatusChip";
import {SmsMessageStatusChip} from "./SmsMessageStatusChip";

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
            <Chip
              size="small"
              variant="outlined"
              color="success"
              label={`${campaign.deliveredCount ?? 0} livrés`}
            />
            <Chip
              size="small"
              variant="outlined"
              color="error"
              label={`${campaign.failedCount ?? 0} échecs`}
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
            label="Statut"
            render={() => <SmsMessageStatusChip />}
            textAlign="center"
          />
          <TextField source="recipientSource" label="Source" />
          <DateField source="sentDatetime" label="Envoyé le" showTime />
          <DateField source="deliveredDatetime" label="Livré le" showTime />
        </HaList>
      </Box>
    </Dialog>
  );
};
