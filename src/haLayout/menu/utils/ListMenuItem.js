import { SingleMenu } from './SingleMenu'

export const ListMenuItem = ({label, icon, to}) => <SingleMenu {...{label,to, icon, menu: false}}/>
