import {SaveButton, Toolbar, ToolbarProps} from "react-admin";

interface EditToolBarProps extends ToolbarProps {
  pristine?: boolean;
}

export const EditToolBar = (props: Readonly<EditToolBarProps>) => (
  <Toolbar {...props}>
    <SaveButton disabled={props.pristine} />
  </Toolbar>
);
