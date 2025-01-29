import {useToggle} from "@/hooks/useToggle";
import {HaActionWrapper} from "@/ui/haToolbar";
import {
  Add as InsertIcon,
  PersonRemove as MoveIcon,
  Delete as RemoveIcon,
} from "@mui/icons-material";
import {Button} from "react-admin";
import {
  JoinGroupDialog,
  LeaveGroupDialog,
  MoveStudentDialog,
} from "./GroupFlowCreate";

export const InsertStudent = () => {
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

export const MoveStudent = () => {
  const [isOpen, , toggle] = useToggle();

  return (
    <div>
      <Button startIcon={<MoveIcon />} onClick={toggle} label="Migrer" />
      <MoveStudentDialog isOpen={isOpen} toggle={toggle} />
    </div>
  );
};

export const RemoveStudent = () => {
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
