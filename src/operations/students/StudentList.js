import { CreateButton, Datagrid, EditButton, ExportButton, FilterButton, List, ShowButton, TextField, TopToolbar, useNotify } from 'react-admin'
import authProvider from '../../providers/authProvider'
import { EnableStatus, WhoamiRoleEnum } from '../../gen/haClient'

import { profileFilters } from '../profile'
import { exporter, exportHeaders, importHeaders, importValidator, pageSize, PrevNextPagination } from '../utils'
import studentProvider from '../../providers/studentProvider'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useMediaQuery } from '@mui/material'
import { useRef, useState } from 'react'
import { Upload, UploadFile } from '@mui/icons-material'
import { read, utils } from 'xlsx'

const ConfirmDialog = ({ open, handleClose, data, setData, setOpen }) => {
  const notify = useNotify()
  const addStudents = async () => {
    setOpen(false)
    if (importValidator(data).isValidate) {
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
      notify(importValidator(data).message, { type: 'error', autoHideDuration: 1000 })
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Importer ce fichier?</DialogTitle>
        <DialogContent>Si vous importer ce fichier, les actions seront irréversibles.</DialogContent>
        <DialogActions>
          <Button onClick={addStudents}>Oui</Button>
          <Button onClick={() => setOpen(false)}>Non</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
const ImportButton = () => {
  const [data, setData] = useState([])
  const isSmall = useMediaQuery('(max-width: 625px)')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const hiddenFileInput = useRef(null)
  const handleClick = e => {
    hiddenFileInput.current.click()
  }
  const handleClose = () => {
    setIsSubmitted(false)
  }

  const Input = () => {
    const handleFileAsync = async e => {
      setIsSubmitted(true)
      const file = e.target.files[0]

      if (file) {
        try {
          const data = await file.arrayBuffer()
          const workbook = read(data)
          const jsonData = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
          setData(jsonData)
        } catch (e) {
          console.error(e)
        }
      }
    }
    return (
      <input
        data-testid='inputFile'
        type='file'
        ref={hiddenFileInput}
        style={{ display: 'none' }}
        onChange={handleFileAsync}
        accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
      />
    )
  }
  return (
    <>
      {isSmall ? (
        <IconButton onClick={handleClick} color='primary'>
          <Upload />
          <Input />
        </IconButton>
      ) : (
        <Button size='small' onClick={handleClick} startIcon={<Upload />} sx={{ padding: 0.3 }}>
          <Input />
          {!isSmall && <span>Importer</span>}
        </Button>
      )}
      <ConfirmDialog open={isSubmitted} onClose={handleClose} setOpen={setIsSubmitted} data={data} setData={setData} />
    </>
  )
}

const ListActions = () => {
  const role = authProvider.getCachedRole()
  return (
    <TopToolbar>
      <FilterButton />
      <CreateButton />
      <ExportButton />
      {role === WhoamiRoleEnum.Manager && (
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
  return (
    <List
      label='Étudiants'
      hasCreate={role === WhoamiRoleEnum.Manager}
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
        {role === WhoamiRoleEnum.Manager ? <EditButton /> : <ShowButton />}
      </Datagrid>
    </List>
  )
}

export default StudentList
