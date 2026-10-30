import {Complaint, ComplaintStatus} from "@haapi-3d601c85/typescript-client";
import {useNotify, useRefresh, useUpdate} from "react-admin";

export const useComplaintStatusActions = (complaint: Complaint | null) => {
  const [update, {isLoading}] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  const changeStatus = (
    status: ComplaintStatus,
    successMessage: string,
    comment?: string
  ) => {
    if (!complaint?.id) return;
    void update(
      "complaints",
      {
        id: complaint.id,
        data: {id: complaint.id, status, comment},
        meta: {method: "STATUS"},
      },
      {
        onSuccess: () => {
          notify(successMessage, {type: "success"});
          refresh();
        },
        onError: () => {
          notify("Une erreur est survenue. Merci de réessayer.", {
            type: "error",
          });
        },
      }
    );
  };

  const addAssignees = (userIds: string[]) => {
    if (!complaint?.id) return;
    void update(
      "complaints",
      {
        id: complaint.id,
        data: {id: complaint.id, user_ids: userIds},
        meta: {method: "ASSIGNEES"},
      },
      {
        onSuccess: () => {
          notify("Réclamation assignée avec succès.", {type: "success"});
          refresh();
        },
        onError: () => {
          notify("Une erreur est survenue. Merci de réessayer.", {
            type: "error",
          });
        },
      }
    );
  };

  return {
    isLoading,
    startTreating: () =>
      changeStatus(ComplaintStatus.IN_PROGRESS, "Réclamation prise en charge."),
    resolve: () =>
      changeStatus(ComplaintStatus.RESOLVED, "Réclamation résolue."),
    reject: (comment: string) =>
      changeStatus(ComplaintStatus.REJECTED, "Réclamation rejetée.", comment),
    addAssignees,
  };
};
