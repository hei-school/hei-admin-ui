import {useNotify} from "@/hooks";
import {smsApi} from "@/providers/api";
import axios from "axios";
import {useState} from "react";

const errorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const detail = (error.response?.data as {message?: string} | undefined)
      ?.message;
    return detail ? `${fallback} : ${detail}` : fallback;
  }
  return fallback;
};

export const useSmsContactGroupMembers = (
  groupId: string,
  onChange: () => void
) => {
  const notify = useNotify();
  const [isMutating, setIsMutating] = useState(false);

  const addMember = async (contactId: string) => {
    setIsMutating(true);
    try {
      await smsApi().addSmsContactGroupMember(groupId, contactId);
      notify("Contact ajouté au groupe", {type: "success"});
      onChange();
    } catch (error) {
      notify(
        errorMessage(error, "Erreur lors de l'ajout du contact au groupe"),
        {
          type: "error",
        }
      );
    } finally {
      setIsMutating(false);
    }
  };

  const removeMember = async (contactId: string) => {
    setIsMutating(true);
    try {
      await smsApi().removeSmsContactGroupMember(groupId, contactId);
      notify("Contact retiré du groupe", {type: "success"});
      onChange();
    } catch (error) {
      notify(errorMessage(error, "Erreur lors du retrait du contact"), {
        type: "error",
      });
    } finally {
      setIsMutating(false);
    }
  };

  return {addMember, removeMember, isMutating};
};
