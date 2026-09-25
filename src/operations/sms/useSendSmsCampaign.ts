import {useNotify} from "@/hooks";
import {smsApi} from "@/providers/api";
import {
  SmsFileRowsRejectedAlert,
  SmsInsufficientBalanceAlert,
} from "@haapi-b0fc7615/typescript-client";
import axios from "axios";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export type SendSmsCampaignInput =
  | {source: "groups"; message: string; contactGroupIds: string[]}
  | {source: "contacts"; message: string; contactIds: string[]}
  | {source: "manual"; message: string; manualPhoneNumbers: string[]}
  | {source: "file"; message?: string; file: File};

const launchCampaign = (input: SendSmsCampaignInput) => {
  switch (input.source) {
    case "groups":
      return smsApi().createSmsCampaignByGroups({
        message: input.message,
        contactGroupIds: input.contactGroupIds,
      });
    case "contacts":
      return smsApi().createSmsCampaignByContacts({
        message: input.message,
        contactIds: input.contactIds,
      });
    case "manual":
      return smsApi().createSmsCampaignByManualNumbers({
        message: input.message,
        manualPhoneNumbers: input.manualPhoneNumbers,
      });
    case "file":
      return smsApi().createSmsCampaignByFile(input.file, input.message);
  }
};

const isFileRowsRejectedAlert = (
  alert: SmsInsufficientBalanceAlert | SmsFileRowsRejectedAlert
): alert is SmsFileRowsRejectedAlert =>
  Array.isArray((alert as SmsFileRowsRejectedAlert).rejectedRows);

export const useSendSmsCampaign = () => {
  const [isLoading, setIsLoading] = useState(false);
  const notify = useNotify();
  const navigate = useNavigate();

  const send = async (input: SendSmsCampaignInput) => {
    setIsLoading(true);
    try {
      const {data} = await launchCampaign(input);

      let successMessage = `Campagne envoyée à ${data.recipientCount ?? 0} destinataire(s)`;
      if (data.recipientsRejectedForBalance) {
        successMessage += ` (${data.recipientsRejectedForBalance} non envoyés, solde insuffisant)`;
      }
      notify(successMessage, {type: "success"});
      navigate("/sms-campaigns");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const alert = error.response.data as
          | SmsInsufficientBalanceAlert
          | SmsFileRowsRejectedAlert;

        if (isFileRowsRejectedAlert(alert)) {
          const rows = alert.rejectedRows ?? [];
          const detail = rows
            .slice(0, 3)
            .map((row) => `ligne ${row.row} (${row.value}) : ${row.reason}`)
            .join(" ; ");
          notify(
            `Fichier rejeté, aucune SMS envoyé — ${rows.length} ligne(s) invalide(s)${detail ? ` : ${detail}` : ""}`,
            {type: "error", autoHideDuration: 10000}
          );
        } else {
          notify(
            alert.message ??
              `Solde SMS insuffisant (${alert.availableBalance ?? 0} disponible(s))`,
            {type: "error"}
          );
        }
      } else {
        notify("Erreur lors de l'envoi de la campagne SMS", {type: "error"});
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {send, isLoading};
};
