import React from 'react'
import { List } from '@react-admin/ra-rbac'
import { Datagrid, FunctionField, TextField, TextInput } from 'react-admin'
import { PrevNextPagination, pageSize } from '../../utils'
import ClockingActions from './ClockingActions'

const ClockingList = () => {

	return (
		<List
			title='Pointage'
			label='Pointage'
			hasCreate={false}
			hasShow={false}
			filters={[
				<TextInput sx={{ mt: 5, mb: 5 }} source='first_name' label='Filtre par prénom·s' alwaysOn />,
			]}
			perPage={pageSize}
			exporter={false}
			pagination={<PrevNextPagination />}
			resource='students'
		>
			<Datagrid bulkActionButtons={<ClockingActions />} rowClick='show'>
				<TextField source='ref' label='Référence' />
				<TextField source='first_name' label='Prénom·s' />
				<TextField source='last_name' label='Nom·s' />
				<FunctionField label='Actions' render={record => <ClockingActions selectedIds={[record.ref]}/>}/>
			</Datagrid>
		</List>
	)
}

export default ClockingList