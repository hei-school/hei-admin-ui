import { useRef, useState } from 'react'
import { CreateButton, Datagrid, EditButton, ExportButton, FilterButton, List, ShowButton, TextField, TopToolbar, useNotify } from 'react-admin'
import { EnableStatus, WhoamiRoleEnum } from '../../gen/haClient'
import { profileFilters } from '../profile'
import { exporter, exportHeaders, pageSize, PrevNextPagination, validateData } from '../utils'
import { Upload } from '@mui/icons-material'
import { Button, MenuItem, Popover } from '@mui/material'
import { ImportNewTemplate } from './ImportNewTemplate'
import { useToggle } from '../../hooks/useToggle'
import ImportInputFile from '../utils/ImportInputFile'
import studentProvider from '../../providers/studentProvider'
import authProvider from '../../providers/authProvider'

const ListActions = () => {
  const notify = useNotify()
  const [isOpen, _setIsOpen, toggle] = useToggle()
  const [isShown, _setIsShown, toggleMenu] = useToggle()
  const [anchorEl, setAnchorEl] = useState(null)
  const buttonRef = useRef(null)

  const role = authProvider.getCachedRole()
  const isManager = role === WhoamiRoleEnum.Manager

  const openMenu = e => {
    toggleMenu()
    setAnchorEl(e.currentTarget)
  }
  const closeMenu = e => {
    toggleMenu()
    setAnchorEl(null)
  }
  const addStudents = async (data, setData) => {
    const importValidate = validateData(data)

    if (importValidate.isValid) {
      const modifiedData = data.map(element => {
        element.entrance_datetime = new Date(element.entrance_datetime).toISOString()
        element['status'] = EnableStatus.Enabled
      })

      setData(modifiedData)

      await studentProvider.saveOrUpdate(data).then(() => notify(`Importation effectuée avec succès`, { type: 'success', autoHideDuration: 1000 }))
    } else {
      notify(importValidate.message, { type: 'error', autoHideDuration: 1000 })
    }
  }
  return (
    <TopToolbar>
      <FilterButton />
      <CreateButton />
      <ExportButton />
      {isManager && (
        <>
          <Button id='import-button' startIcon={<Upload />} onMouseMove={openMenu} size='small'>
            Importer
          </Button>
          <Popover
            open={isShown}
            onClose={closeMenu}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            <MenuItem
              data-testid='existantTemplate'
              onClick={() => {
                buttonRef.current.click()
              }}
            >
              A partir d'un template existant <ImportInputFile mutationRequest={addStudents} ref={buttonRef} />
            </MenuItem>
            <MenuItem onClick={toggle}>A partir d'un nouveau template</MenuItem>
          </Popover>
          <ImportNewTemplate toggle={toggle} isOpen={isOpen} />
        </>
      )}
    </TopToolbar>
  )
}

const StudentList = () => {
  const role = authProvider.getCachedRole()
  const isManager = role === WhoamiRoleEnum.Manager

  return (
    <>
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
      <ImportNewTemplate />
    </>
  )
}

export default StudentList
