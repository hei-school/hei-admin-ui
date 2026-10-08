import {SmsCampaignStatus} from "@haapi-b0fc7615/typescript-client";
import {Chip, ChipProps} from "@mui/material";
import {useRecordContext} from "react-admin";

export const SMS_CAMPAIGN_STATUS_LABEL: Record<SmsCampaignStatus, string> = {
  [SmsCampaignStatus.CREATED]: "Créée",
  [SmsCampaignStatus.PENDING]: "En cours",
  [SmsCampaignStatus.DELIVERED]: "Envoyée",
  [SmsCampaignStatus.FAILED]: "Échec",
};

export const SMS_CAMPAIGN_STATUS_COLOR: Record<
  SmsCampaignStatus,
  ChipProps["color"]
> = {
  [SmsCampaignStatus.CREATED]: "default",
  [SmsCampaignStatus.PENDING]: "warning",
  [SmsCampaignStatus.DELIVERED]: "success",
  [SmsCampaignStatus.FAILED]: "error",
};

export const SmsCampaignStatusChip = () => {
  const record = useRecordContext();
  const status = record?.status as SmsCampaignStatus | undefined;

  if (!status) {
    return null;
  }

  return (
    <Chip
      size="small"
      label={SMS_CAMPAIGN_STATUS_LABEL[status]}
      color={SMS_CAMPAIGN_STATUS_COLOR[status]}
    />
  );
};
