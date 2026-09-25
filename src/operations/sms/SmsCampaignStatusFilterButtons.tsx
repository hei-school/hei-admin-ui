import {SmsCampaignStatus} from "@haapi-b0fc7615/typescript-client";
import {Button, ButtonProps, Stack} from "@mui/material";
import {useListContext} from "react-admin";
import {SMS_CAMPAIGN_STATUS_LABEL} from "./SmsCampaignStatusChip";

const STATUS_FILTERS: {
  label: string;
  value?: SmsCampaignStatus;
  color: ButtonProps["color"];
}[] = [
  {label: "Toutes", color: "primary"},
  {
    label: SMS_CAMPAIGN_STATUS_LABEL[SmsCampaignStatus.CREATED],
    value: SmsCampaignStatus.CREATED,
    color: "inherit",
  },
  {
    label: SMS_CAMPAIGN_STATUS_LABEL[SmsCampaignStatus.PENDING],
    value: SmsCampaignStatus.PENDING,
    color: "warning",
  },
  {
    label: SMS_CAMPAIGN_STATUS_LABEL[SmsCampaignStatus.DELIVERED],
    value: SmsCampaignStatus.DELIVERED,
    color: "success",
  },
  {
    label: SMS_CAMPAIGN_STATUS_LABEL[SmsCampaignStatus.FAILED],
    value: SmsCampaignStatus.FAILED,
    color: "error",
  },
];

export const SmsCampaignStatusFilterButtons = () => {
  const {filterValues, setFilters} = useListContext();
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
      {STATUS_FILTERS.map((filter) => {
        const onClick = () => {
          const nextFilters = {...filterValues, status: filter.value};
          if (!filter.value) {
            delete nextFilters.status;
          }
          setFilters(nextFilters, {});
        };
        return (
          <Button
            key={filter.label}
            size="small"
            color={filter.color}
            variant={
              filterValues.status === filter.value ? "contained" : "outlined"
            }
            onClick={onClick}
            sx={{borderRadius: 5, textTransform: "none", minWidth: "5rem"}}
          >
            {filter.label}
          </Button>
        );
      })}
    </Stack>
  );
};
