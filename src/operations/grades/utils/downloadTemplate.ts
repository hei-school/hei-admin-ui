import {NOOP_ID} from "@/utils/constants";
import {Dispatch, SetStateAction} from "react";
import {DataProvider} from "react-admin";

interface DownloadExamTemplateParams {
  dataProvider: DataProvider;
  examId: string | number;
  setIsFetching: Dispatch<SetStateAction<boolean>>;
}

export const downloadTemplate = async ({
  dataProvider,
  examId,
  setIsFetching,
}: DownloadExamTemplateParams): Promise<void> => {
  setIsFetching(true);

  try {
    const response = await dataProvider.getOne("import-grades", {
      id: NOOP_ID,
      meta: {examId},
    });

    if (!response?.data) {
      console.warn("Aucune donnée à télécharger");
      return;
    }

    const blob = new Blob([response.data as BlobPart], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link: HTMLAnchorElement = document.createElement("a");
    link.href = url;
    link.download = `modele-examen-${examId}.xlsx`;
    link.click();
  } catch (error: unknown) {
    console.error("Erreur lors du téléchargement :", error);
  } finally {
    setIsFetching(false);
  }
};
