import {Button} from "react-admin";
import {
  Add as InsertIcon,
  PersonRemove as MoveIcon,
  Delete as RemoveIcon,
} from "@mui/icons-material";
import {
  JoinGroupDialog,
  LeaveGroupDialog,
  MoveStudentDialog,
} from "./GroupFlowCreate";
import {HaActionWrapper} from "../../../ui/haToolbar";
import {useToggle} from "../../../hooks/useToggle";

export const InsertStudentButton = () => {
  const [isOpen, , toggle] = useToggle();

  return (
    <div>
      <HaActionWrapper>
        <Button
          startIcon={<InsertIcon />}
          onClick={toggle}
          label="Insérer"
          size="large"
        />
      </HaActionWrapper>
      <JoinGroupDialog isOpen={isOpen} toggle={toggle} />
    </div>
  );
};

export const MoveStudentButton = () => {
  const [isOpen, , toggle] = useToggle();

  return (
    <div>
      <Button startIcon={<MoveIcon />} onClick={toggle} label="Migrer" />
      <MoveStudentDialog isOpen={isOpen} toggle={toggle} />
    </div>
  );
};

export const RemoveStudentButton = () => {
  const [isOpen, , toggle] = useToggle();

  return (
    <div>
      <Button
        label="Retirer"
        startIcon={<RemoveIcon />}
        onClick={toggle}
        sx={{
          color: "red",
        }}
      />
      <LeaveGroupDialog isOpen={isOpen} toggle={toggle} />
    </div>
  );
};
