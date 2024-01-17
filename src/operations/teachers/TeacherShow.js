import { EditButton } from "react-admin";

import { HaShow } from "../common/components/HaShow";
import { ProfileLayout } from "../profile/ProfileShow";
import { BUTTON_PROPS } from "../common/constants/button_props";

const ActionsOnShow = ({ basePath, data, resource }) => {
  return (
    <EditButton basePath={basePath} resource={resource} record={data} {...BUTTON_PROPS}/>
  );
};

const TeacherShow = () => {
  return (
    <HaShow
      sx={{
        '& .RaShow-card': {
          backgroundColor: 'transparent',
          boxShadow: 'none'
        }
      }}
      actions={false}
      title="Enseignants"
    >
      <ProfileLayout actions={<ActionsOnShow />} />
    </HaShow>
  );
};

export default TeacherShow;
