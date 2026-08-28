import {useRole} from "@/security/hooks";
import {ArchiveStatusEnum, Fee} from "@haapi-3d601c85/typescript-client";
import {Archive} from "lucide-react";
import {useGetList} from "react-admin";
import {PendingCountWidget} from "./PendingCountWidget";

const ACCENT_COLOR = "#0891B2";

export const PendingFeeArchives = ({animate}: {animate: boolean}) => {
  const role = useRole();
  const {data: fees} = useGetList(
    "fees",
    {
      pagination: {page: 1, perPage: 500},
    },
    {
      enabled: role.isManager() || role.isAdmin(),
    }
  );
  const pendingCount =
    fees?.filter(
      (fee: Fee) => fee.archive_status === ArchiveStatusEnum.TO_ARCHIVE
    ).length ?? 0;

  return (
    <PendingCountWidget
      animate={animate}
      icon={Archive}
      accentColor={ACCENT_COLOR}
      title="Archivages de frais à valider"
      count={pendingCount}
      to="/fees-archive-validations"
      linkLabel="Voir les archivages à valider"
      transitionDelay="0.75s"
    />
  );
};
