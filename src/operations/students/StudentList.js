import { CreateButton, Datagrid, EditButton, ExportButton, FilterButton, List, ShowButton, TextField, TopToolbar, useNotify } from 'react-admin'
import authProvider from '../../providers/authProvider'
import studentProvider from '../../providers/studentProvider'

import { EnableStatus, WhoamiRoleEnum } from '../../gen/haClient'

import { profileFilters } from '../profile'
import { exporter, exportHeaders, importHeaders, pageSize, PrevNextPagination, validateData } from '../utils'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useMediaQuery } from '@mui/material'
import { forwardRef, useRef, useState } from 'react'
import { Upload, UploadFile } from '@mui/icons-material'
import { read, utils } from 'xlsx'

const ConfirmDialog = ({ open, handleClose, data, setData, setOpen }) => {
  const notify = useNotify()

  const addStudents = async () => {
    setOpen(false)

    const importValidate = validateData(data)

    if (importValidate.isValid) {
      const modifiedData = data.map(element => {
        element.entrance_datetime = new Date(element.entrance_datetime).toISOString()
        element['status'] = EnableStatus.Enabled
      })

      setData(modifiedData)

      await studentProvider
        .saveOrUpdate(data)
        .then(() => notify(`Importation effectuée avec succès`, { type: 'success', autoHideDuration: 1000 }))
        .catch(() => notify(`L'importation n'a pas pu être effectuée`, { type: 'error', autoHideDuration: 1000 }))
    } else {
      notify(importValidate.message, { type: 'error', autoHideDuration: 1000 })
    }
  }
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Importer ce fichier?</DialogTitle>
      <DialogContent>Si vous importer ce fichier, les actions seront irréversibles.</DialogContent>
      <DialogActions>
        <Button onClick={addStudents}>Oui</Button>
        <Button onClick={() => setOpen(false)}>Non</Button>
      </DialogActions>
    </Dialog>
  )
}

const FileInput = forwardRef(function Input({ setIsSubmitted, setData }, ref) {
  const notify = useNotify()

  const excelType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'

  const handleFile = async e => {
    setIsSubmitted(true)

    const files = e.target.files

    if (files.length > 0) {
      const file = files.item(0)

      try {
        const data = await file.arrayBuffer()

        const workbook = read(data)

        const jsonData = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])

        setData(jsonData)
      } catch (e) {
        console.error(e)

        notify("Le fichier n'a pas pu être traité", { type: 'error', autoHideDuration: 1000 })
      }
    }
  }
  return <input data-testid='inputFile' type='file' ref={ref} style={{ display: 'none' }} onChange={handleFileAsync} accept={excelType} />
})

const ImportButton = () => {
  const [data, setData] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  const isSmall = useMediaQuery('(max-width: 625px)')
  const inputRef = useRef(null)

  const handleClick = e => {
    inputRef.current.click()
  }

  const handleClose = () => {
    setIsSubmitted(false)
  }

  const InputFile = () => <FileInput ref={inputRef} setData={setData} setIsSubmitted={setIsSubmitted} />
  return (
    <>
      {isSmall ? (
        <IconButton onClick={handleClick} color='primary'>
          <Upload />
          <InputFile />
        </IconButton>
      ) : (
        <Button size='small' onClick={handleClick} startIcon={<Upload />} sx={{ padding: 0.3 }}>
          <InputFile />
          <span>Importer</span>
        </Button>
      )}
      <ConfirmDialog open={isSubmitted} onClose={handleClose} setOpen={setIsSubmitted} data={data} setData={setData} />
    </>
  )
}

const ListActions = () => {
  const role = authProvider.getCachedRole()

  const isManager = role === WhoamiRoleEnum.Manager

  return (
    <TopToolbar>
      <FilterButton />
      <CreateButton />
      <ExportButton />
      {isManager && (
        <>
          <ImportButton />
          <ExportButton exporter={() => exporter([], importHeaders, 'template_students')} label='TEMPLATE' startIcon={<UploadFile />} />
        </>
      )}
    </TopToolbar>
  )
}

const StudentList = () => {
  const role = authProvider.getCachedRole()

  const isManager = role === WhoamiRoleEnum.Manager

  return (
    <List
      label='Étudiants'
      hasCreate={isManager}
      actions={<ListActions />}
      filters={profileFilters}
      exporter={list => exporter(list, exportHeaders, 'students')}
      perPage={pageSize}
      pagination={<PrevNextPagination />}
    >
      <Datagrid bulkActionButtons={false} rowClick='show'>
        <TextField source='ref' label='Référence' />
        <TextField source='first_name' label='Prénom·s' />
        <TextField source='last_name' label='Nom·s' />
        {isManager ? <EditButton /> : <ShowButton />}
      </Datagrid>
    </List>
  )
}

export default StudentList
