import {useEffect, useState} from "react";

import {PaymentTypeEnum} from "@haapi/typescript-client";
import {
  BooleanInput,
  Create,
  DateInput,
  minValue,
  number,
  RadioButtonGroupInput,
  required,
  SimpleForm,
  TextInput,
  useDataProvider,
  useNotify,
} from "react-admin";
import {useParams} from "react-router-dom";
import {paymentTypes} from "../../conf";
import {useToggle} from "../../hooks/useToggle";
import {studentIdFromRaId} from "../../providers/feeProvider";

const PaymentCreate = (props) => {
  const params = useParams();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const [studentRef, setStudentRef] = useState("...");
  const [paymentChoice, setPaymentChoice] = useState(
    PaymentTypeEnum.BANK_TRANSFER
  );
  const [notSpecifiedDate, setSpecifyDate] = useToggle(true);

  const feeId = params.feeId;
  const studentId = studentIdFromRaId(feeId);
  const isCommentNecessary =
    paymentChoice === PaymentTypeEnum.MOBILE_MONEY ||
    paymentChoice === PaymentTypeEnum.BANK_TRANSFER;

  useEffect(() => {
    const doEffect = async () => {
      const student = await dataProvider.getOne("students", {id: studentId});
      setStudentRef(student.data.ref);
    };
    doEffect();
  });

  const notifyError = (error) => {
    let message = "Une erreur s`'est produite";
    if (error.response && error.response.status === 400) {
      if (error.response.message.startsWith("Payment amount"))
        message = "Le paiement dépasse le montant restant du frais";
      else message = "Paiement pour date future non autorisé";
    }
    notify(message, {type: "error", autoHideDuration: 2500});
  };
  const paymentConfToPaymentApi = ({
    ref,
    type,
    amount,
    comment,
    creation_datetime,
  }) => {
    const getDatetimeValue = () => {
      if (notSpecifiedDate) {
        const currentDate = new Date();
        currentDate.setSeconds(0);
        return currentDate.toISOString();
      }
      return new Date(creation_datetime).toISOString();
    };
    return [
      {
        feeId,
        type,
        amount,
        comment,
        ref,
        creation_datetime: getDatetimeValue(),
      },
    ];
  };

  return (
    <Create
      mutationOptions={{onError: notifyError}}
      title={`Paiement de ${studentRef}`}
      resource="payments"
      redirect={(_basePath, _id, _data) => `fees/${feeId}/show`}
      transform={paymentConfToPaymentApi}
      {...props}
    >
      <SimpleForm>
        <RadioButtonGroupInput
          {...props}
          source="type"
          label="Type"
          validate={required()}
          choices={paymentTypes}
          defaultValue={PaymentTypeEnum.BANK_TRANSFER}
          onChange={(event) => setPaymentChoice(event.target.value)}
        />
        {paymentChoice === PaymentTypeEnum.BANK_TRANSFER && (
          <TextInput
            source="ref"
            label="Réference"
            fullWidth
            validate={required()}
          />
        )}
        <TextInput
          source="amount"
          label="Montant du paiement"
          fullWidth
          validate={[required(), number(), minValue(1)]}
        />
        <TextInput
          source="comment"
          label="Commentaire"
          fullWidth
          validate={isCommentNecessary && required()}
        />
        <BooleanInput
          source="specify-date"
          label={"Date de paiement aujourd'hui"}
          name="create"
          defaultValue={notSpecifiedDate}
          onChange={({target: {checked}}) => setSpecifyDate(checked)}
        />
        {!notSpecifiedDate && (
          <DateInput
            source="creation_datetime"
            label="Date de paiement"
            validate={required()}
          />
        )}
      </SimpleForm>
    </Create>
  );
};

export default PaymentCreate;
