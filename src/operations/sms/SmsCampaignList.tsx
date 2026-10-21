import {DateField} from "@/operations/common/components/fields";
import {HaList} from "@/ui/haList/HaList";
import {SmsCampaign} from "@haapi-3d601c85/typescript-client";
import {Campaign as SmsCampaignIcon} from "@mui/icons-material";
import {Box, Typography} from "@mui/material";
import {ReactNode, useState} from "react";
import {CreateButton, FunctionField, Identifier, RaRecord} from "react-admin";
import {SmsCampaignDetailsDialog} from "./SmsCampaignDetailsDialog";
import {SmsCampaignStatusChip} from "./SmsCampaignStatusChip";
import {SmsCampaignStatusFilterButtons} from "./SmsCampaignStatusFilterButtons";

const truncate = (text?: string, max = 50) =>
  text && text.length > max ? `${text.slice(0, max)}…` : (text ?? "—");

const CenteredCell = ({children}: {children: ReactNode}) => (
  <Box sx={{display: "flex", justifyContent: "center", width: "100%"}}>
    {children}
  </Box>
);

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
        directActions={
          <CreateButton
            resource="sms-campaigns"
            variant="contained"
            label="Créer"
            data-testid="create-button"
          />
        }
        filterButtons={<SmsCampaignStatusFilterButtons />}
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
          render={() => (
            <CenteredCell>
              <SmsCampaignStatusChip />
            </CenteredCell>
          )}
          textAlign="center"
        />
        <FunctionField
          label="Destinataires"
          render={(campaign: SmsCampaign) => (
            <CenteredCell>
              <Typography variant="body2">
                {campaign.recipientCount ?? 0}
              </Typography>
            </CenteredCell>
          )}
          textAlign="center"
        />
        <FunctionField
          label="Livrés"
          render={(campaign: SmsCampaign) => (
            <CenteredCell>
              <Typography variant="body2" color="success.main">
                {campaign.deliveredCount ?? 0}
              </Typography>
            </CenteredCell>
          )}
          textAlign="center"
        />
        <FunctionField
          label="Échecs"
          render={(campaign: SmsCampaign) => (
            <CenteredCell>
              <Typography
                variant="body2"
                color={campaign.failedCount ? "error.main" : "text.secondary"}
              >
                {campaign.failedCount ?? 0}
              </Typography>
            </CenteredCell>
          )}
          textAlign="center"
        />
        <FunctionField
          label="Créée par"
          render={(campaign: SmsCampaign) => (
            <Box sx={{whiteSpace: "nowrap"}}>
              {campaign.createdByFirstName ?? campaign.createdByRef ?? "—"}
            </Box>
          )}
        />
        <DateField
          source="creationDatetime"
          label="Créée le"
          showTime
          sx={{pl: 3, whiteSpace: "nowrap"}}
        />
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
