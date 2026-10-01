import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

interface SmsCheckboxSearchListProps<T> {
  items: T[];
  getId: (item: T) => string | undefined;
  getLabel: (item: T) => string;
  isSelected: (id: string) => boolean;
  onToggle: (item: T) => void;
  emptyMessage: string;
  testIdPrefix: string;
}

export function SmsCheckboxSearchList<T>({
  items,
  getId,
  getLabel,
  isSelected,
  onToggle,
  emptyMessage,
  testIdPrefix,
}: SmsCheckboxSearchListProps<T>) {
  return (
    <List
      dense
      sx={{
        mb: 1.5,
        maxHeight: 260,
        overflow: "auto",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
      }}
    >
      {items.length === 0 && (
        <ListItem>
          <ListItemText primary={emptyMessage} />
        </ListItem>
      )}
      {items.map((item) => {
        const id = getId(item);
        return (
          <ListItemButton
            key={id}
            dense
            onClick={() => onToggle(item)}
            data-testid={`${testIdPrefix}-${id}`}
          >
            <ListItemIcon sx={{minWidth: 36}}>
              <Checkbox
                edge="start"
                size="small"
                checked={!!id && isSelected(id)}
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary={getLabel(item)} />
          </ListItemButton>
        );
      })}
    </List>
  );
}
