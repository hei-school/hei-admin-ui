import { Button, DateInput, DateTimeInput, required, SelectInput, SimpleForm, TextInput, Toolbar, useEditController, useNotify, useRedirect } from "react-admin";
import { statusRenderer } from "../utils";
import { CustomEdit } from "../utils/CustomEdit";
import { Box, CircularProgress } from '@mui/material'
import { useEffect, useState } from "react";
import { Save } from '@mui/icons-material'
import { useFormContext } from 'react-hook-form'
import { useStudentRef } from "../../hooks/useStudentRef";
import { toApiIds } from "../../providers/feeProvider";
import { payingApi } from "../../providers/api";

function EditToolbar(){
  const notify = useNotify()
  const redirect = useRedirect()
  const [ pending, setPending ] = useState(false)
  const { getValues } = useFormContext()
  const record = getValues()

  const updateFee = async ()=>{
    const { feeId } = toApiIds(record.id)
    const updated_at = new Date().toISOString()
    const due_datetime = new Date(record.due_datetime).toISOString()
    // setPending(true)
    
    // return await payingApi()
    //   .updateStudentFees(record.student_id, [{...record, updated_at, id: feeId, due_datetime}])
    //   .then(() => {
    //     redirect(`/fees/${record.id}/show`)
    //   })
    //   .catch(()=>notify("Une erreur c'est produite", { type:'error' }))
    //   .finally(()=>setPending(false))
  }

  return (
    <Toolbar>
      <Button variant='contained' disabled={pending || !record.due_datetime} size='medium' onClick={updateFee} >
        { pending ? 
          <CircularProgress size={20} sx={{mt: .3, mr: 1.5}}/> 
          : <Save sx={{mr: 1, mt: .3 }} />
        }
        Enregistrés
      </Button>
    </Toolbar>
  )
}

function DisabledInfo(){
  const { record }= useEditController()
  let dateInfo = { label: 'Date de création', source: 'creation_datetime'}
  const props = { disabled: true, fullWidth: true }
  
  if(record.udpated_at){
    dateInfo = {label: 'Date et heure de dernière modification', source: 'udpated_at'} 
  }
  
  return <>
    <DateTimeInput {...dateInfo} {...props}/>
    <Box sx={{display: 'flex', width: '100%', gap: 1}} >
      <TextInput source='total_amount'  sx={{flex: 1}} disabled label='Total à payer'/>
      <TextInput source='remaining_amount' sx={{flex: 1}} disabled label='Reste à payer'/>
      <SelectInput 
        label='Statut' 
        source='status' 
        choices={[{id: record.status, name: statusRenderer(record.status)}]}
        {...props}
        sx={{flex: 1}}
      />
    </Box>
  </>
}

function FeeEdit(){
  const { studentRef, fetchRef } = useStudentRef('id')
  
  useEffect(()=> {
    fetchRef()
  },[])
  
  return (
    <CustomEdit title={`Frais de ${studentRef}`}>
      <SimpleForm toolbar={<EditToolbar />}>
        <DisabledInfo />
        <DateInput source='due_datetime' validate={required()} label='Date limite de paiement' fullWidth/>
        <TextInput multiline validate={required()} source='comment' label='Commentaire' fullWidth />
      </SimpleForm>
    </CustomEdit>
  )
}

export default FeeEdit;
