import ProfileShow from "./ProfileShow";
import ProfileEdit from "./ProfileEdit";

const profile = {
  show: ProfileShow,
  edit: <ProfileEdit isOwnProfile />,
  options: {label: "Profil"},
};

export default profile;
