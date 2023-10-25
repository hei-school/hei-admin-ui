import { Confirm, useNotify } from 'react-admin'
import { Button, IconButton, useMediaQuery } from '@mui/material'
import { forwardRef, useRef, useState } from 'react'
import { read, utils } from 'xlsx'
import { Upload } from '@mui/icons-material'

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
  return <input data-testid='inputFile' type='file' ref={ref} style={{ display: 'none' }} onChange={handleFile} accept={excelType} />
})

const ImportListButton = ({ providerCall }) => {
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)

  const isSmall = useMediaQuery('(max-width: 625px)')
  const inputRef = useRef(null)

  const handleClick = e => {
    inputRef.current.click()
  }

  const handleConfirm = () => {
    setOpen(false)
    providerCall(data, setData)
  }

  const InputFile = () => <FileInput ref={inputRef} setData={setData} setIsSubmitted={setOpen} />
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
      <Confirm
        isOpen={open}
        title={`Importer`}
        content='Êtes-vous sûr de vouloir importer ce fichier ? Les changements seront irréversibles.'
        onConfirm={handleConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
export default ImportListButton
