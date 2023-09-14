import React from 'react'
import { List } from '@react-admin/ra-rbac'
import { Datagrid, FunctionField, Link, TextField, TextInput } from 'react-admin'
import { PrevNextPagination, pageSize } from '../utils'
import AttendanceActions from './AttendanceActions'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'

const AttendaceList = () => {
	return (
		<List
			title='Pointage'
			label='Pointage'
			actions={<Link to='/attendance/scan'><QrCodeScannerIcon sx={{ m: 1, fontSize: '2.5em' }} /></Link>}
			hasShow={false}
			filters={[
				<TextInput sx={{ m: 2 }} source='first_name' label='Filtre par prénom·s' alwaysOn />,
			]}
			perPage={pageSize}
			exporter={false}
			pagination={<PrevNextPagination />}
			resource='students'
		>
			<Datagrid bulkActionButtons={<AttendanceActions sx={{ gap: 2 }} />}>
				<TextField source='ref' label='Référence' />
				<TextField source='first_name' label='Prénom·s' />
				<TextField source='last_name' label='Nom·s' />
				<FunctionField
					label='Actions'
					render={record => <AttendanceActions sx={{ gap: 5 }} selectedIds={[record.ref]} />}
				/>
			</Datagrid>
		</List>
	)
}

export default AttendaceList