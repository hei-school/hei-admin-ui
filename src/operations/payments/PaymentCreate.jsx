// import {paymentTypes} from "@/conf";
// import {useToggle} from "@/hooks/useToggle";
// import {studentIdFromRaId} from "@/providers/feeProvider";
// import {
//   MobileMoneyType,
//   PaymentTypeEnum,
// } from "@haapi-b0fc7615/typescript-client";
// import {Box} from "@mui/material";
// import {Home, Wallet} from "lucide-react";
// import {useEffect, useState} from "react";
// import {
//   BooleanInput,
//   Create,
//   DateInput,
//   minValue,
//   number,
//   RadioButtonGroupInput,
//   required,
//   SelectInput,
//   SimpleForm,
//   TextInput,
//   useDataProvider,
//   useNotify,
// } from "react-admin";
// import {Link as RouterLink, useParams} from "react-router-dom";
// import {pspIdValidationContraints} from "../utils";
// import CustomBreadcrumbs from "../utils/CustomBreadcrumbs";

// const PaymentCreate = (props) => {
//   const params = useParams();
//   const notify = useNotify();
//   const dataProvider = useDataProvider();
//   const [studentRef, setStudentRef] = useState("...");
//   const [paymentChoice, setPaymentChoice] = useState(
//     PaymentTypeEnum.BANK_TRANSFER
//   );
//   const [notSpecifiedDate, setSpecifyDate] = useToggle(true);

//   const feeId = params.feeId;
//   const studentId = studentIdFromRaId(feeId);
//   const isMobileMoney = paymentChoice === PaymentTypeEnum.MOBILE_MONEY;
//   const isCommentNecessary =
//     isMobileMoney || paymentChoice === PaymentTypeEnum.BANK_TRANSFER;

//   useEffect(() => {
//     const doEffect = async () => {
//       const student = await dataProvider.getOne("students", {id: studentId});
//       setStudentRef(student.data.ref);
//     };
//     doEffect();
//   }, [studentId, dataProvider]);

//   const breadcrumbItems = [
//     {
//       label: "Étudiant",
//       component: RouterLink,
//       to: `/students/${studentId}/show`,
//       icon: <Home size={16} />,
//     },
//     {
//       label: "Frais",
//       component: RouterLink,
//       to: `/fees/${feeId}/show`,
//       icon: <Wallet size={16} />,
//     },
//     {
//       label: "Créer un paiement",
//     },
//   ];

//   const notifyError = (error) => {
//     let message = "Une erreur s`'est produite";
//     if (error.response && error.response.status === 400) {
//       if (error.response.message.startsWith("Payment amount"))
//         message = "Le paiement dépasse le montant restant du frais";
//       else message = "Paiement pour date future non autorisé";
//     }
//     notify(message, {type: "error", autoHideDuration: 2500});
//   };
//   const paymentConfToPaymentApi = ({
//     ref,
//     type,
//     amount,
//     comment,
//     creation_datetime,
//     psp_id,
//     psp_type,
//     status
//   }) => {
//     const getDatetimeValue = () => {
//       if (notSpecifiedDate) {
//         const currentDate = new Date();
//         currentDate.setSeconds(0);
//         return currentDate.toISOString();
//       }
//       return new Date(creation_datetime).toISOString();
//     };
//     return [
//       {
//         feeId,
//         type,
//         amount,
//         comment,
//         ref,
//         psp_id,
//         psp_type,
//         creation_datetime: getDatetimeValue(),
//       },
//     ];
//   };

//   return (
//     <Box m={2}>
//       <CustomBreadcrumbs items={breadcrumbItems} />
//       <Create
//         mutationOptions={{onError: notifyError}}
//         title={`Paiement de ${studentRef}`}
//         resource="payments"
//         redirect={(_basePath, _id, _data) => `fees/${feeId}/show`}
//         transform={paymentConfToPaymentApi}
//         {...props}
//       >
//         <SimpleForm>
//           <RadioButtonGroupInput
//             {...props}
//             source="type"
//             label="Type"
//             validate={required()}
//             choices={paymentTypes}
//             defaultValue={PaymentTypeEnum.BANK_TRANSFER}
//             onChange={(event) => setPaymentChoice(event.target.value)}
//           />
//           {paymentChoice === PaymentTypeEnum.BANK_TRANSFER && (
//             <TextInput
//               source="ref"
//               label="Réference"
//               fullWidth
//               validate={required()}
//             />
//           )}
//           {isMobileMoney && (
//             <TextInput
//               source="psp_id"
//               label="Réference de la transaction"
//               fullWidth
//               validate={pspIdValidationContraints}
//             />
//           )}
//           {isMobileMoney && (
//             <SelectInput
//               source="psp_type"
//               label="Type de transaction"
//               defaultValue={MobileMoneyType.ORANGE_MONEY}
//               choices={[{id: MobileMoneyType.ORANGE_MONEY, name: "Orange"}]}
//               validate={required()}
//               fullWidth
//             />
//           )}
//           <TextInput
//             source="amount"
//             label="Montant du paiement"
//             fullWidth
//             validate={[required(), number(), minValue(1)]}
//           />
//           <TextInput
//             source="comment"
//             label="Commentaire"
//             fullWidth
//             validate={isCommentNecessary && required()}
//           />
//           <BooleanInput
//             source="specify-date"
//             label={"Date de paiement aujourd'hui"}
//             name="create"
//             defaultValue={notSpecifiedDate}
//             onChange={({target: {checked}}) => setSpecifyDate(checked)}
//           />
//           {!notSpecifiedDate && (
//             <DateInput
//               source="creation_datetime"
//               label="Date de paiement"
//               validate={required()}
//             />
//           )}
//         </SimpleForm>
//       </Create>
//     </Box>
//   );
// };

// export default PaymentCreate;
import {paymentTypes} from "@/conf";
import {useToggle} from "@/hooks/useToggle";
import {studentIdFromRaId} from "@/providers/feeProvider";
import {useRole} from "@/security/hooks";
import {
  MobileMoneyType,
  PaymentStatus,
  PaymentTypeEnum,
} from "@haapi-b0fc7615/typescript-client";
import {Box} from "@mui/material";
import {Home, Wallet} from "lucide-react";
import {useEffect, useState} from "react";
import {
  BooleanInput,
  Create,
  DateInput,
  minValue,
  number,
  RadioButtonGroupInput,
  required,
  SelectInput,
  SimpleForm,
  TextInput,
  useDataProvider,
  useNotify,
} from "react-admin";
import {Link as RouterLink, useParams} from "react-router-dom";
import {pspIdValidationContraints} from "../utils";
import CustomBreadcrumbs from "../utils/CustomBreadcrumbs";

const MINIMUM_CREDIT = 200000;

const PaymentCreate = (props) => {
  const params = useParams();
  const notify = useNotify();
  const dataProvider = useDataProvider();
  const role = useRole();
  const [credit, setCredit] = useState(null);

  const [studentRef, setStudentRef] = useState("...");
  const [paymentChoice, setPaymentChoice] = useState(
    PaymentTypeEnum.BANK_TRANSFER
  );

  const validateCreditPayment = (amount) => {
    if (!credit) return undefined; 

    if (credit.amount < MINIMUM_CREDIT) {
      return `Votre crédit est inférieur à ${MINIMUM_CREDIT}Ar.`;
    }
    if (Number(amount) > credit.amount) {
      return "Le montant saisi est supérieur à votre crédit actuel.";
    }
    return undefined; 
  };

  const [notSpecifiedDate, setSpecifyDate] = useToggle(true);

  const feeId = params.feeId;
  const studentId = studentIdFromRaId(feeId);

  const isMobileMoney = paymentChoice === PaymentTypeEnum.MOBILE_MONEY;

  const isCommentNecessary =
    isMobileMoney || paymentChoice === PaymentTypeEnum.BANK_TRANSFER;
  
  const isCreditPayment = paymentChoice === PaymentTypeEnum.CREDIT;

  useEffect(() => {
    const doEffect = async () => {
      const credit = await dataProvider.getOne("credits", {id: studentId});
      setCredit(credit.data);
    };

    doEffect();
  }, [studentId, dataProvider]);

  const breadcrumbItems = [
    {
      label: "Étudiant",
      component: RouterLink,
      to: `/students/${studentId}/show`,
      icon: <Home size={16} />,
    },
    {
      label: "Frais",
      component: RouterLink,
      to: `/fees/${feeId}/show`,
      icon: <Wallet size={16} />,
    },
    {
      label: "Créer un paiement",
    },
  ];

  const notifyError = (error) => {
    let message = "Une erreur s'est produite";

    if (error.response && error.response.status === 400) {
      if (error.response.message.startsWith("Payment amount")) {
        message = "Le paiement dépasse le montant restant du frais";
      } else {
        message = "Paiement pour date future non autorisé";
      }
    }    

    notify(message, {
      type: "error",
      autoHideDuration: 2500,
    });
  };

  const paymentConfToPaymentApi = ({
    ref,
    type,
    amount,
    comment,
    creation_datetime,
    psp_id,
    psp_type,
  }) => {
    const getDatetimeValue = () => {
      if (notSpecifiedDate) {
        const currentDate = new Date();
        currentDate.setSeconds(0);

        return currentDate.toISOString();
      }

      return new Date(creation_datetime).toISOString();
    };


    const status =
      role.isManager() || role.isAdmin()
        ? PaymentStatus.VALIDATE
        : PaymentStatus.CREATED;

    return [
      {
        feeId,
        type,
        amount,
        comment,
        ref,
        psp_id,
        psp_type,
        status,
        creation_datetime: getDatetimeValue(),
      },
    ];
  };

  return (
    <Box m={2}>
      <CustomBreadcrumbs items={breadcrumbItems} />

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

          {isMobileMoney && (
            <TextInput
              source="psp_id"
              label="Réference de la transaction"
              fullWidth
              validate={pspIdValidationContraints}
            />
          )}

          {isMobileMoney && (
            <SelectInput
              source="psp_type"
              label="Type de transaction"
              defaultValue={MobileMoneyType.ORANGE_MONEY}
              choices={[
                {
                  id: MobileMoneyType.ORANGE_MONEY,
                  name: "Orange",
                },
              ]}
              validate={required()}
              fullWidth
            />
          )}

          <TextInput
            source="amount"
            label="Montant du paiement"
            fullWidth
            validate={[
              required(),
              number(),
              minValue(1),
              (value) => {
                if (!isCreditPayment) {
                  return undefined;
                }
                return validateCreditPayment(value);
              },
            ]}
          />

          <TextInput
            source="comment"
            label="Commentaire"
            fullWidth
            validate={isCommentNecessary && required()}
          />

          <BooleanInput
            source="specify-date"
            label="Date de paiement aujourd'hui"
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
    </Box>
  );
};

export default PaymentCreate;
