import {useState} from "react";
import {defaultIsPredefinedType} from "../operations/fees/utils";

export function useCreateFees(defaultValue) {
  const [predefinedConf, setPredefinedConf] = useState({
    isPredefinedType: defaultValue || defaultIsPredefinedType,
    isPredefinedDueDate: true,
    firstDate: {year: new Date().getFullYear(), month: new Date().getMonth()},
  });
  const changeConfig = (source, value) =>
    setPredefinedConf((conf) => ({...conf, [source]: value}));

  return {
    ...predefinedConf,
    setIsPredefinedDueDate: (value) =>
      changeConfig("isPredefinedDueDate", value),
    setIsPredefinedType: (value) => changeConfig("isPredefinedType", value),
    setFirstDate: (value) => changeConfig("firstDate", value),
  };
}
