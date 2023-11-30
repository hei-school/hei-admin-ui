import { useState } from 'react'
import { defaultIsPredefinedType } from '../operations/fees/utils';

export function usePredefinedType(defaultValue){
  const [ predefinedConf, setPredefinedConf ] = useState({
    isPredefinedType: defaultValue || defaultIsPredefinedType,
    isPredefinedDueDate: true 
  });
  const changeConfig = (source, value) => setPredefinedConf(conf => ({...conf, [source]: value}))
  
  return {
    ...predefinedConf, 
    setIsPredefinedDueDate: (value)=>changeConfig('isPredefinedDueDate', value),
    setIsPredefinedType: (value)=>changeConfig('isPredefinedType', value)
  }
}
