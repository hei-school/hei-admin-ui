import { SingleMenu } from './SingleMenu'

export const ListMenuItem = ({ label, icon, to, ...rest }) => <SingleMenu {...{ label, to, icon, menu: false, ...rest }} />
