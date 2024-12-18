import {FC, ReactElement, ReactNode, useState} from "react";
import {
  Box,
  Typography,
  Avatar,
  useMediaQuery,
  Tooltip,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {Info as InfoIcon} from "@mui/icons-material";
import {PALETTE_COLORS} from "@/haTheme";

export interface StatDetail {
  icon: ReactElement;
  total: number | string;
  title: string;
}

export interface CardContent {
  title: string;
  total: number | string;
  icon: ReactElement;
  statDetails?: Array<StatDetail>;
}

interface ListHeaderProps {
  title: string | ReactNode;
  action?: ReactNode;
  cardContents: Array<CardContent>;
}

interface CardInfosProps {
  cardDetails: StatDetail[];
}

const CardInfos: FC<CardInfosProps> = ({cardDetails = []}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Tooltip title="Infos">
        <Avatar
          sx={{
            height: "30px",
            width: "30px",
            bgcolor: "#263B63",
            borderRadius: "7px",
          }}
          variant="square"
        >
          <IconButton aria-describedby={id} onClick={handleClick}>
            <InfoIcon
              width="5px"
              height="5px"
              sx={{color: PALETTE_COLORS.yellow}}
            />
          </IconButton>
        </Avatar>
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List dense>
          {cardDetails.map(({icon, total, title}) => (
            <ListItem>
              <ListItemIcon sx={{minWidth: "30px"}}>{icon}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography fontSize="0.75rem" fontWeight="bold">
                    {title} : {total}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  );
};
export const ListHeader: FC<ListHeaderProps> = ({
  title,
  action,
  cardContents,
}) => {
  const isSmall = useMediaQuery("(max-width:1200px)");

  return (
    <Box
      width="calc(100% - 20px)"
      mx="auto"
      marginTop={3}
      display="flex"
      flexDirection="column"
    >
      <Box
        bgcolor={PALETTE_COLORS.yellow}
        display="flex"
        justifyContent="space-between"
        px={5}
        paddingTop={5}
        borderRadius="20px 20px 0px 0px"
        paddingBottom={15}
      >
        <Box width="100%">
          <Typography variant="h5" fontWeight="bolder">
            {title}
          </Typography>
        </Box>
        <Box>{action}</Box>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={`repeat(${isSmall ? "auto-fill" : cardContents.length}, minmax(11.25rem, 1fr))`}
        gridTemplateRows="auto"
        width="90%"
        m="auto"
        rowGap="100px"
      >
        {cardContents.map((card) => (
          <Box
            key={card.title}
            sx={{
              backgroundColor: PALETTE_COLORS.primary,
              color: PALETTE_COLORS.white,
              maxWidth: "225px",
              height: "150px",
              m: "-80px 5px 5px 5px",
              borderRadius: "10px",
            }}
          >
            <Box
              display="flex"
              paddingTop={2}
              px={2}
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight="bolder">
                {card.title ?? ""}
              </Typography>
              <Avatar
                sx={{
                  height: "35px",
                  width: "35px",
                  color: PALETTE_COLORS.yellow,
                  bgcolor: "#263B63",
                  borderRadius: "7px",
                }}
                variant="square"
              >
                {card.icon}
              </Avatar>
            </Box>
            <Box display="flex" flexDirection="column" px={3}>
              <Typography variant="h4" fontWeight="bolder">
                {card.total}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Au total</Typography>
                {card.statDetails && (
                  <CardInfos cardDetails={card?.statDetails!} />
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
