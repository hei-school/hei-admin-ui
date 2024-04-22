import {forwardRef, useState} from "react";
import {Confirm, useNotify} from "react-admin";
import {read, utils} from "xlsx";
import {excelType} from ".";
import {useToggle} from "../../../hooks/useToggle";

const FileInput = forwardRef(function Input({setIsSubmitted, setData}, ref) {
  const notify = useNotify();

  const processFile = async (e) => {
    setIsSubmitted(true);
    const files = e.target.files;

    if (files.length > 0) {
      const file = files.item(0);
      try {
        const data = await file.arrayBuffer();
        const workbook = read(data);
        const jsonData = utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        );
        setData(jsonData);
      } catch (e) {
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
});

export const ImportInputFile = forwardRef(function ImportInput(
  {mutationRequest},
  ref
) {
  const [data, setData] = useState([]);
  const [open, setOpen] = useToggle();
  const notify = useNotify();

  const close = () => {
    setOpen(false);
  };

  const makeRequest = () => {
    mutationRequest(data).catch((error) => {
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
