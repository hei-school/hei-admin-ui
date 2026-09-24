import {getAxiosInstance} from "@/config/axios";
import {useNotify} from "@/hooks";
import {smsApi} from "@/providers/api";
import authProvider from "@/providers/authProvider";
import {
  SmsCampaignLaunched,
  SmsInsufficientBalanceAlert,
} from "@haapi-b0fc7615/typescript-client";
import axios from "axios";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

// Le endpoint /sms-campaigns/by-file attend message et sendAt en query params
// et uniquement le fichier dans le corps multipart — contrairement au reste du
// client généré qui met tout dans le FormData. On contourne donc le client ici.
const API_BASE_PATH = (process.env.REACT_APP_API_URL || "").replace(/\/+$/, "");

const createSmsCampaignByFile = (
  file: File,
  message?: string,
  sendAt?: Date
) => {
  const query = new URLSearchParams();
  if (message) query.set("message", message);
  if (sendAt) query.set("sendAt", sendAt.toISOString());

  const formData = new FormData();
  formData.append("file", file);

  return getAxiosInstance().post<SmsCampaignLaunched>(
    `${API_BASE_PATH}/sms-campaigns/by-file?${query.toString()}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${authProvider.getCachedAuthConf().accessToken}`,
      },
    }
  );
};

export type SendSmsCampaignInput =
  | {
      source: "groups";
      message: string;
      contactGroupIds: string[];
      sendAt?: Date;
    }
  | {source: "contacts"; message: string; contactIds: string[]; sendAt?: Date}
  | {
      source: "manual";
      message: string;
      manualPhoneNumbers: string[];
      sendAt?: Date;
    }
  | {source: "file"; message?: string; file: File; sendAt?: Date};

const launchCampaign = (input: SendSmsCampaignInput) => {
  switch (input.source) {
    case "groups":
      return smsApi().createSmsCampaignByGroups({
        message: input.message,
        contactGroupIds: input.contactGroupIds,
        sendAt: input.sendAt,
      });
    case "contacts":
      return smsApi().createSmsCampaignByContacts({
        message: input.message,
        contactIds: input.contactIds,
        sendAt: input.sendAt,
      });
    case "manual":
      return smsApi().createSmsCampaignByManualNumbers({
        message: input.message,
        manualPhoneNumbers: input.manualPhoneNumbers,
        sendAt: input.sendAt,
      });
    case "file":
      return createSmsCampaignByFile(input.file, input.message, input.sendAt);
  }
};

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
        const alert = error.response.data as SmsInsufficientBalanceAlert;
        notify(
          alert.message ??
            `Solde SMS insuffisant (${alert.availableBalance ?? 0} disponible(s))`,
          {type: "error"}
        );
      } else {
        notify("Erreur lors de l'envoi de la campagne SMS", {type: "error"});
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {send, isLoading};
};
