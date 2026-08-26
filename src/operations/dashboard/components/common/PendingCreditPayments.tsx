import {useRole} from "@/security/hooks";
import {PaymentStatus} from "@haapi-3d601c85/typescript-client";
import {Wallet} from "lucide-react";
import {useGetList} from "react-admin";
import {PendingCountWidget} from "./PendingCountWidget";

const ACCENT_COLOR = "#10B981";

export const PendingCreditPayments = ({animate}: {animate: boolean}) => {
  const role = useRole();
  const {data: pendingPayments} = useGetList(
    "credit-payments",
    {
      filter: {status: PaymentStatus.CREATED},
      pagination: {page: 1, perPage: 500},
    },
    {
      enabled: role.isManager() || role.isAdmin(),
    }
  );
  const pendingCount = pendingPayments?.length ?? 0;

  return (
    <PendingCountWidget
      animate={animate}
      icon={Wallet}
      accentColor={ACCENT_COLOR}
      title="Paiements par crédit à valider"
      count={pendingCount}
      to="/credit-payments"
      linkLabel="Voir tous les paiements"
      transitionDelay="0.7s"
    />
  );
};
