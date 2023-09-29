import React from 'react'
import { Box, Select, MenuItem } from '@mui/material'
import { QrCodeScanner } from '@mui/icons-material'
import { getQrConfig, setQrConfig } from './utils'
import { Link } from 'react-admin'
import { AVAILABLE_PLACE } from '../../conf'

function ListToolBar() {
	return (
		<Box component='div' sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
			<Link to='/attendance/scan'>
				<QrCodeScanner sx={{ fontSize: '2em' }} />
			</Link>
			<Select
				id='place'
				name='place'
				defaultValue={getQrConfig().place}
				variant='outlined'
				autoWidth
				size='small'
				onChange={event => setQrConfig({ ...getQrConfig(), place: event.target.value })}
			>
				{AVAILABLE_PLACE.map((place, id) => <MenuItem key={id} value={place}> {place} </MenuItem>)}
			</Select>
		</Box>
	)
}

export default ListToolBar