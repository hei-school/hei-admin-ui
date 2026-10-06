import {ChangeEvent, forwardRef, useState} from "react";
import {Confirm, useNotify} from "react-admin";
import {read, utils} from "xlsx";
import {excelType} from ".";
import {useToggle} from "../../../hooks/useToggle";
import {ImportRow} from "./utils";

interface FileInputProps {
  setIsSubmitted: (value: boolean) => void;
  setData: (data: ImportRow[]) => void;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({setIsSubmitted, setData}, ref) => {
    const notify = useNotify();

    const processFile = async (e: ChangeEvent<HTMLInputElement>) => {
      setIsSubmitted(true);
      // a file input always exposes its FileList
      const files = e.target.files!;

      if (files.length > 0) {
        const file = files[0];
        try {
          const data = await file.arrayBuffer();
          const workbook = read(data);
          const jsonData = utils.sheet_to_json<ImportRow>(
            workbook.Sheets[workbook.SheetNames[0]]
          );
          setData(jsonData);
        } catch {
          notify("Le fichier n'a pas pu être traité", {
            type: "error",
            autoHideDuration: 1000,
          });
        }
      }
    };
    return (
      <input
        data-testid="inputFile"
        type="file"
        ref={ref}
        style={{display: "none"}}
        onChange={processFile}
        accept={excelType}
      />
    );
  }
);

interface ImportInputFileProps {
  mutationRequest: (data: ImportRow[]) => Promise<unknown>;
}

export const ImportInputFile = forwardRef<
  HTMLInputElement,
  ImportInputFileProps
>(({mutationRequest}, ref) => {
  const [data, setData] = useState<ImportRow[]>([]);
  const [open, setOpen] = useToggle();
  const notify = useNotify();

  const close = () => {
    setOpen(false);
  };

  const makeRequest = () => {
    mutationRequest(data).catch(() => {
      notify(`L'importation n'a pas pu être effectuée`, {
        type: "error",
        autoHideDuration: 3000,
      });
    });
    close();
  };

  return (
    <>
      <FileInput ref={ref} setData={setData} setIsSubmitted={setOpen} />
      <Confirm
        isOpen={open}
        title={`Importer`}
        content="Êtes-vous sûr de vouloir importer ce fichier ? Les changements seront irréversibles."
        onConfirm={makeRequest}
        onClose={close}
      />
    </>
  );
});
