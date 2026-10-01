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

  const addMembers = async (contactIds: string[]) => {
    if (contactIds.length === 0) return;
    setIsMutating(true);
    try {
      const results = await Promise.allSettled(
        contactIds.map((contactId) =>
          smsApi().addSmsContactGroupMember(groupId, contactId)
        )
      );
      const succeeded = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      const failed = results.length - succeeded;

      if (succeeded > 0) {
        notify(
          `${succeeded} contact(s) ajouté(s) au groupe` +
            (failed ? ` (${failed} échec(s))` : ""),
          {type: failed ? "warning" : "success"}
        );
      } else {
        notify("Erreur lors de l'ajout des contacts au groupe", {
          type: "error",
        });
      }
      onChange();
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

  return {addMembers, removeMember, isMutating};
};
