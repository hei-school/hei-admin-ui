import React from 'react'
import { List } from '@react-admin/ra-rbac'
import { Datagrid, FunctionField, Link, TextField, TextInput } from 'react-admin'
import { PrevNextPagination, pageSize } from '../utils'
import AttendanceActions from './AttendanceActions'

const AttendaceList = () => {

	return (
		<List
			title='Pointage'
			label='Pointage'
			hasCreate={false}
			actions={<Link to='/attendance/qr'>QRMode</Link>}
			hasShow={false}
			filters={[
				<TextInput sx={{ mt: 5, mb: 5 }} source='first_name' label='Filtre par prénom·s' alwaysOn />,
			]}
			perPage={pageSize}
			exporter={false}
			pagination={<PrevNextPagination />}
			resource='students'
		>
			<Datagrid bulkActionButtons={<AttendanceActions />} rowClick='show'>
				<TextField source='ref' label='Référence' />
				<TextField source='first_name' label='Prénom·s' />
				<TextField source='last_name' label='Nom·s' />
				<FunctionField label='Actions' render={record => <AttendanceActions selectedIds={[record.ref]}/>}/>
			</Datagrid>
		</List>
	)
}

export default AttendaceList