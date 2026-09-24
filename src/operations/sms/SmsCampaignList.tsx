import {DateField} from "@/operations/common/components/fields";
import {HaList} from "@/ui/haList/HaList";
import {CreateButton} from "@/ui/haToolbar";
import {SmsCampaign} from "@haapi-b0fc7615/typescript-client";
import {Campaign as SmsCampaignIcon} from "@mui/icons-material";
import {Box, Typography} from "@mui/material";
import {useState} from "react";
import {FunctionField, Identifier, RaRecord, TextField} from "react-admin";
import {SmsCampaignDetailsDialog} from "./SmsCampaignDetailsDialog";
import {SmsCampaignStatusChip} from "./SmsCampaignStatusChip";

const truncate = (text?: string, max = 80) =>
  text && text.length > max ? `${text.slice(0, max)}…` : (text ?? "—");

export const SmsCampaignList = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<SmsCampaign | null>(
    null
  );

  return (
    <Box>
      <HaList
        icon={<SmsCampaignIcon />}
        title="Campagnes SMS"
        resource="sms-campaigns"
        actions={<CreateButton resource="sms-campaigns" />}
        datagridProps={{
          rowClick: (_id: Identifier, _resource: string, record: RaRecord) => {
            setSelectedCampaign(record as SmsCampaign);
            return false;
          },
        }}
        listProps={{title: "Campagnes SMS"}}
      >
        <FunctionField
          label="Message"
          render={(campaign: SmsCampaign) => truncate(campaign.message)}
        />
        <FunctionField
          label="Statut"
          render={() => <SmsCampaignStatusChip />}
          textAlign="center"
        />
        <FunctionField
          label="Destinataires"
          render={(campaign: SmsCampaign) => (
            <Typography variant="body2">
              {campaign.recipientCount ?? 0} ({campaign.deliveredCount ?? 0}{" "}
              livrés, {campaign.failedCount ?? 0} échecs)
            </Typography>
          )}
        />
        <TextField source="createdById" label="Créée par" />
        <DateField
          source="sendAt"
          label="Envoi programmé"
          showTime
          emptyText="Immédiat"
        />
        <DateField source="creationDatetime" label="Créée le" showTime />
      </HaList>
      {selectedCampaign && (
        <SmsCampaignDetailsDialog
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </Box>
  );
};
