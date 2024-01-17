import {Button} from "@mui/material";
import {EditButton, Link, Show, useRecordContext} from "react-admin";

import {AttachMoney} from "@mui/icons-material";
import {ProfileLayout} from "../profile/ProfileShow";

import {WhoamiRoleEnum} from "@haapi/typescript-client";
import authProvider from "../../providers/authProvider";
import {PALETTE_COLORS} from "../../ui/constants";
import {HaShow} from "../common/components/HaShow";
import {BUTTON_PROPS} from "../common/constants/button_props";

const ActionsOnShow = ({basePath, data, resource}) => {
  const record = useRecordContext();
  return (
    <>
      <EditButton
        basePath={basePath}
        resource={resource}
        record={data}
        {...BUTTON_PROPS}
      />
      {record && (
        <Button
          aria-label="fees"
          component={Link}
          to={`/students/${record.id}/fees`}
          startIcon={<AttachMoney />}
          {...BUTTON_PROPS}
        >
          Frais
        </Button>
      )}
    </>
  );
};

const StudentShow = () => {
  const role = authProvider.getCachedRole();
  return (
    <HaShow title="Étudiants" actions={false}>
      <ProfileLayout
        actions={role === WhoamiRoleEnum.MANAGER && <ActionsOnShow />}
      />
    </HaShow>
  );
};

export default StudentShow;
