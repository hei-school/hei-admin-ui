import { Confirm, useNotify } from 'react-admin'
import { forwardRef, useRef, useState } from 'react'
import { read, utils } from 'xlsx'
import { useToggle } from '../../hooks/useToggle'
import {Upload} from '@mui/icons-material'
import { MenuItem, Popover } from '@mui/material'
import { EnableStatus } from '../../gen/haClient'
import { validateData } from '../../operations/utils'
import studentProvider from '../../providers/studentProvider'
import { ImportNewTemplate } from './ImportNewTemplate'
import { ButtonBase } from '../../ui/haToolbar'

const excelType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'

const FileInput = forwardRef(function Input({ setIsSubmitted, setData }, ref) {
  const notify = useNotify()

  const processFile = async e => {
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
  return <input data-testid='inputFile' type='file' ref={ref} style={{ display: 'none' }} onChange={processFile} accept={excelType} />
})

const ImportInputFile = forwardRef(function ImportInput({ mutationRequest, ...props }, ref) {
  const [data, setData] = useState([])
  const [open, setOpen ] = useToggle()
  const notify = useNotify()

  const makeRequest = () => {
    setOpen(false)
    mutationRequest(data, setData).catch(() => notify(`L'importation n'a pas pu être effectuée`, { type: 'error', autoHideDuration: 1000 }))
  }

  return (
    <>
      <FileInput ref={ref} setData={setData} setIsSubmitted={setOpen} />
      <Confirm
        isOpen={open}
        title={`Importer`}
        content='Êtes-vous sûr de vouloir importer ce fichier ? Les changements seront irréversibles.'
        onConfirm={makeRequest}
        onClose={() => setOpen(false)}
      />
    </>
  )
})
export default ImportInputFile

export function ImportButton(){
  const notify = useNotify()
  const [isOpen, ,toggle] = useToggle()
  const [isShown, ,toggleMenu] = useToggle()
  const [anchorEl, setAnchorEl] = useState(null)
  const buttonRef = useRef(null)

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
        return element;
      })

      setData(modifiedData)

      await studentProvider.saveOrUpdate(data).then(() => notify(`Importation effectuée avec succès`, { type: 'success', autoHideDuration: 1000 }))
    } else {
      notify(importValidate.message, { type: 'error', autoHideDuration: 1000 })
    }
  }

  return (
    <>
      <ButtonBase label='Importer' closeAction={false} id='import-button' icon={<Upload />} onClick={openMenu}/>
      <Popover
        open={isShown}
        onClose={closeMenu}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
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
  )
}