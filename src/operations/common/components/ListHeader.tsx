import CardBackground from "@/assets/shape-square.svg";
import {Info as InfoIcon} from "@mui/icons-material";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  SvgIconProps,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, {FC, ReactElement, ReactNode, useState} from "react";

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
    <div
      style={{
        display: "fit-content",
        width: "fit-content",
      }}
    >
      <Tooltip title="Infos">
        <IconButton
          sx={{width: "fit-content", background: "rgba(167,167,167, 0.54)"}}
          aria-describedby={id}
          onClick={handleClick}
        >
          <InfoIcon width="5px" height="5px" sx={{color: "#f1c16b"}} />
        </IconButton>
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

interface IconWithShadowProps {
  icon: React.ReactElement<SvgIconProps>;
}

export const IconWithShadow: React.FC<IconWithShadowProps> = ({icon}) => {
  return (
    <Box sx={{position: "relative", display: "inline-block"}}>
      {React.cloneElement(icon, {
        style: {
          position: "absolute",
          top: -7,
          left: -8,
          scale: " 0.9",
          color: "rgba(235, 233, 226, 0.5)",
          zIndex: 1,
          fontSize: "2.7rem",
        },
      })}
      {React.cloneElement(icon, {
        style: {
          position: "relative",
          zIndex: 2,
          fontSize: "2.7rem",
        },
      })}
    </Box>
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
        bgcolor="#f7d090"
        display="flex"
        justifyContent="space-between"
        px={5}
        paddingTop={5}
        borderRadius="0px 0px 30px 30px "
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
              color: "white",
              maxWidth: "300px",
              height: "170px",
              m: "-80px 5px 5px 5px",
              borderRadius: "10px",
              background: ` url(${CardBackground}),linear-gradient(120deg, #001948 0%, #001B4E 12%, #003CAE 86%)`,
              backgroundSize: "110%",
              backgroundPosition: "left",
              textAlign: "right",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <Box display="flex" px={2} justifyContent="space-between" gap={4}>
              <IconWithShadow icon={card.icon} />
              <Typography variant="h6" fontWeight="bolder">
                {card.title ?? ""}
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" px={3}>
              <Typography variant="h4" fontWeight="bolder">
                {card.total}
              </Typography>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                textAlign="right"
                position="relative"
              >
                {card.statDetails && (
                  <CardInfos cardDetails={card?.statDetails!} />
                )}
                <Typography variant="h6" right="0" flex={1}>
                  Au total
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
