import { manualFeeTypes, predefinedFeeTypes, predefinedFirstDueDates } from '../../conf'
import { commentRenderer } from '../utils'
import { useRef, useState } from 'react'
import Papa from 'papaparse'
import studentProvider from '../../providers/studentProvider'
import { Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery } from '@mui/material'
import { Upload} from '@mui/icons-material'

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
const ConfirmDialog = ({ open, handleClose, data, setOpen }) => {
  const addStudents = async () => {
    setOpen(false)
    await studentProvider.saveOrUpdate(data)
  }
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Importer ce fichier?
        </DialogTitle>
        <DialogContent>
          Si vous importer ce fichier, les actions seront irréversibles.
        </DialogContent>
        <DialogActions>
          <Button onClick={addStudents}>oui</Button>
          <Button onClick={() => setOpen(false)}>non</Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
  export const ImportButton = () => {
  const [data, setData] = useState([])
    const isSmall = useMediaQuery("(max-width: 625px)");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const hiddenFileInput = useRef(null);
    const handleClick = event => {
      hiddenFileInput.current.click();
    };
    const handleClose = () => {
      setIsSubmitted(false);
    };
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

    return (
      <>
        <Button size='small' onClick={handleClick}>
          <Upload fontSize='small'/>
          <input type="file" ref={hiddenFileInput} style={{ display: 'none' }} onChange={handleChange} />
          {!isSmall && <span>Importer</span>}
        </Button>
        <ConfirmDialog open={isSubmitted} onClose={handleClose}  setOpen={setIsSubmitted} data={data}/>
      </>
    )
  }