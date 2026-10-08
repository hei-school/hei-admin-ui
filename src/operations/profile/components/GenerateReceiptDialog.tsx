import {useNotify} from "@/hooks";
import {DateTimeField} from "@/operations/common/components/fields";
import {Dialog} from "@/ui/components";
import {useEffect} from "react";
import {SaveButton, SimpleForm, Toolbar, useCreate} from "react-admin";
import {v4 as uuid} from "uuid";

interface GenerateReceiptDialogProps {
  onClose: () => void;
  open: boolean;
}

interface ReceiptFormValues {
  from?: string;
  to?: string;
  destinationEmail?: string;
}

export const GenerateReceiptDialog = ({
  onClose,
  open,
}: Readonly<GenerateReceiptDialogProps>) => {
  const [create, {isLoading, isSuccess, data}] = useCreate();
  const notify = useNotify();
  useEffect(() => {
    if (!isSuccess) return;
    notify(`Nombre de reçu traiter: ${data?.processedFileCount}`, {
      type: "success",
    });
    onClose();
  }, [isSuccess]);

  const handleSubmit = ({from, to, destinationEmail}: ReceiptFormValues) => {
    void create("receipts", {data: {id: uuid(), from, to, destinationEmail}});
  };

  return (
    <Dialog
      title="Veuillez remplir le formulaire ci-après pour générer le reçu"
      onClose={onClose}
      open={open}
    >
      <SimpleForm
        onSubmit={handleSubmit}
        toolbar={
          <Toolbar>
            <SaveButton disabled={isLoading} />
          </Toolbar>
        }
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="1.5vh"
      >
        <DateTimeField source="from" label="Depuis " />
        <DateTimeField source="to" label="Jusqu'à" />
      </SimpleForm>
    </Dialog>
  );
};
