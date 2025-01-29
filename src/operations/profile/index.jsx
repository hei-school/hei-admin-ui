import ProfileEdit from "./ProfileEdit";
import ProfileShow from "./ProfileShow";

const profile = {
  show: ProfileShow,
  edit: <ProfileEdit isOwnProfile />,
  options: {label: "Profil"},
};

export default profile;
