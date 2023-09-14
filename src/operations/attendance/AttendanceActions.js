import React from 'react'
import { Box, Button } from '@mui/material'
import { tryToSendAttendance } from './utils'

function AttendanceActions({ selectedIds, sx={}, disable = false }) {
	const submitActions = (type) => {
		const attendanceData = {
			type,
			students: selectedIds,
			time: new Date().toISOString()
		}
		tryToSendAttendance(attendanceData);
	}

	return (
		<Box component='div' sx={{ display: 'flex', alignItems: 'center', gap: 1, ...sx }}>
			<Button disabled={disable} variant='contained' color='primary' onClick={() => submitActions('arriver')}>Arriver</Button>
			<Button disabled={disable} variant='contained' color='warning' onClick={() => submitActions('sortie')}>Sortie</Button>
		</Box>
	)
}

export default AttendanceActions