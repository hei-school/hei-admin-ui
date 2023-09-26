import { manualFeeTypes, predefinedFeeTypes, predefinedFirstDueDates } from '../../conf'
import { commentRenderer } from '../utils'
import { useState } from 'react'
import Papa from 'papaparse'
import studentProvider from '../../providers/studentProvider'
import { Box, Button, IconButton, Modal, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery } from '@mui/material'
import { Upload, UploadFile } from '@mui/icons-material'
import { styled } from '@mui/styles'

const toDate = str => {
  const parts = str.split('-')
  return new Date(parts[0], parts[1] - 1 /* note(js-months) */, parts[2])
}

export const createFees = (fees, feesConf, payload, isPredefinedType) => {
  const firstDueDate = payload.is_predefined_first_dueDate
    ? predefinedFirstDueDates[payload.predefined_first_dueDate].value
    : toDate(payload.manual_first_duedate)

  let feeType = isPredefinedType ? predefinedFeeTypes[payload.predefined_type][0].type : manualFeeTypes[payload.manual_type]?.type
  if (feesConf.length <= 1) {
    for (let i = 0; i < payload.months_number; i++) {
      let dueDate = new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + i, firstDueDate.getDate()).toISOString()
      fees.push({
        total_amount: payload.monthly_amount,
        type: feeType,
        due_datetime: dueDate,
        comment: commentRenderer(payload.comment, payload.months_number, i)
      })
    }
  } else {
    for (let j = 0; j < feesConf.length; j++) {
      let totalMonthsNumber = feesConf.reduce((acc, currentValue) => acc + currentValue.monthsNumber, 0)
      let start = j === 0 ? 0 : totalMonthsNumber - (totalMonthsNumber - feesConf[j - 1].monthsNumber)
      let end = start + feesConf[j].monthsNumber

      for (let i = start; i < end; i++) {
        let dueDate = new Date(firstDueDate.getFullYear(), firstDueDate.getMonth() + i, firstDueDate.getDate()).toISOString()
        fees.push({
          total_amount: feesConf[j].monthlyAmount,
          type: feeType,
          due_datetime: dueDate,
          comment: commentRenderer(payload.comment, totalMonthsNumber, i)
        })
      }
    }
  }
}
export const InsertFileModal = ({ open, onClose }) => {
  const [data, setData] = useState([])
  const handleChange = e => {
    const files = e.target.files
    if (files) {
      Papa.parse(files[0], {
        header: true,
        complete: results => {
          setData(results.data)
        }
      })
    }
  }
  const addStudents = async () => {
    await studentProvider.saveOrUpdate(data)
  }
  const ConfirmDialog = (open, setOpen) => {
    return (
      <>
        <Dialog open={open} onClose={setOpen(false)}>
          <DialogTitle>
            Importer ce fichier?
          </DialogTitle>
          <DialogContent>
            Si vous importer ce fichier, les actions seront irréverssibles.
          </DialogContent>
          <Button onClick={addStudents}>IMPORTER</Button>
        </Dialog>
        <DialogActions>
          <Button>oui</Button>
          <Button>non</Button>
        </DialogActions>
      </>
    );
  }
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  const [isSubmitted, setIsSubmitted] = useState(false)
  return (
    <Modal open={open} onClose={onClose}>
      <Box>
        <Button startIcon={<UploadFile />}>
          Insérer un fichier
          <VisuallyHiddenInput type="file" onChange={handleChange} accept='.csv,.xlsx,.xls' onSubmit={() => setIsSubmitted(true)}/>
        </Button>
        <ConfirmDialog open={isSubmitted} setOpen={setIsSubmitted()}/>
      </Box>
    </Modal>
  )
}

export const ImportButton = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const isSmall = useMediaQuery("(max-width: 625px)");
  return (
    <>
      <Button onClick={handleOpen}>
        <IconButton color='primary'>
          <Upload/>
        </IconButton>
        {!isSmall && <span>Importer</span>}
      </Button>
      <InsertFileModal open={open} onClose={handleClose} />
    </>
  )
}
