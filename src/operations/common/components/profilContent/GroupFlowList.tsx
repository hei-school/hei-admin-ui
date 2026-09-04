import {HaList} from "@/ui/haList/HaList";
import {GroupFlow} from "@haapi-b0fc7615/typescript-client";
import {SwapHoriz} from "@mui/icons-material";
import {Box, Chip} from "@mui/material";
import {DateField, FunctionField, useGetOne} from "react-admin";
import {GroupFlowEditButton} from "./GroupFlowEditButton";

interface GroupFlowListProps {
  studentId: string;
}

const GroupRefField = ({groupId}: {groupId?: string}) => {
  const {data: group} = useGetOne(
    "groups",
    {id: groupId},
    {enabled: !!groupId}
  );
  return <>{group?.ref ?? "..."}</>;
};

export const GroupFlowList = ({studentId}: GroupFlowListProps) => {
  return (
    <Box>
      <HaList
        icon={<SwapHoriz />}
        title="Historique de groupes"
        actions={null}
        resource="student-group-flows"
        filterIndicator={false}
        datagridProps={{rowClick: false}}
        listProps={{
          filterDefaultValues: {studentId},
          storeKey: `student-${studentId}-group-flows`,
        }}
      >
        <FunctionField
          label="Mouvement"
          render={(record: GroupFlow) =>
            record.move_type === "JOIN" ? (
              <Chip
                data-testid="group-flow-move-type"
                label="Rejoint"
                color="success"
                size="small"
              />
            ) : (
              <Chip
                data-testid="group-flow-move-type"
                label="Quitté"
                color="error"
                size="small"
              />
            )
          }
        />
        <FunctionField
          label="Groupe"
          render={(record: GroupFlow) => (
            <GroupRefField groupId={record.group_id} />
          )}
        />
        <DateField source="flow_datetime" label="Date" showTime />
        <FunctionField
          label=""
          render={(record: GroupFlow) => (
            <GroupFlowEditButton record={record} />
          )}
        />
      </HaList>
    </Box>
  );
};
