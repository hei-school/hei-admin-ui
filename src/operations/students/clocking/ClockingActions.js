import React from 'react'
import { Box, Button } from '@mui/material'

function ClockingActions({ selectedIds }) {

	const submitActions = (type) => {
		const clockingData = {
			type,
			students: selectedIds,
			time: new Date().toISOString()
		}

		const clockingStore = JSON.parse(localStorage.getItem('clocking-data') || "[]")
		clockingStore.push(clockingData)
		localStorage.setItem('clocking-data', clockingStore)
	}

	return (
		<Box component='div' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
			<Button variant='contained' color='primary' onClick={() => submitActions('arriver')}>Arriver</Button>
			<Button variant='contained' color='warning' onClick={testGet}>Sortie</Button>
		</Box>
	)
}

export default ClockingActions