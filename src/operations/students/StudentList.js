import { CreateButton, Datagrid, EditButton, ExportButton, FilterButton, List, ShowButton, TextField, TopToolbar, useNotify } from 'react-admin'

import authProvider from '../../providers/authProvider'
import { WhoamiRoleEnum } from '../../gen/haClient'

import { profileFilters } from '../profile'
import { pageSize, PrevNextPagination } from '../utils'
import { ImportButton } from './utils'
import studentProvider from '../../providers/studentProvider'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useMediaQuery } from '@mui/material'
import { useRef, useState } from 'react'
import Papa from 'papaparse'
import { Upload } from '@mui/icons-material'

const ConfirmDialog = ({ open, handleClose, data, setOpen }) => {
  const notify = useNotify()
  const addStudents = async () => {
    setOpen(false)
    await studentProvider
      .saveOrUpdate(data)
      .then(() => notify(`Importation effectuée avec succès`, { type: 'success' }))
      .catch(() => notify(`L'importation n'a pas pu être effectuée`, { type: 'error' }))
  }
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Importer ce fichier?</DialogTitle>
        <DialogContent>Si vous importer ce fichier, les actions seront irréversibles.</DialogContent>
        <DialogActions>
          <Button onClick={addStudents}>oui</Button>
          <Button onClick={() => setOpen(false)}>non</Button>
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
  const handleChange = e => {
    const files = e.target.files
    setIsSubmitted(true)
    if (files) {
      Papa.parse(files[0], {
        header: true,
        complete: results => {
          setData(results.data)
        }
      })
    }
  }
  const Input = () => <input type='file' ref={hiddenFileInput} style={{ display: 'none' }} onChange={handleChange} />

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
      <ConfirmDialog open={isSubmitted} onClose={handleClose} setOpen={setIsSubmitted} data={data} />
    </>
  )
}

const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
    <ImportButton />
  </TopToolbar>
)
const StudentList = () => {
  const role = authProvider.getCachedRole()
  return (
    <List
      label='Étudiants'
      hasCreate={role === WhoamiRoleEnum.Manager}
      actions={<ListActions />}
      filters={profileFilters}
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
