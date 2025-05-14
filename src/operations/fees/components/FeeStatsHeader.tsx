import {PALETTE_COLORS} from "@/haTheme";
import {
  AccountBalance,
  AssuredWorkload,
  MobileFriendly,
} from "@mui/icons-material";
import {
  Box,
  BoxProps,
  IconButton,
  Popover,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  BadgeDollarSign,
  CalendarRange,
  ChartColumn,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import {FC, ReactElement, ReactNode, useState} from "react";
import cardBackground from "../../../assets/shape-square.svg";

export interface CardFeesContent {
  title: string;
  icon: ReactElement;
  L1?: number | string;
  L2?: number | string;
  L3?: number | string;
  R?: number | string;
  A?: number | string;
  mensual?: number | string;
  annual?: number | string;
  mobile_money?: number | string;
  bank_fees?: number | string;
}

interface ListHeaderProps {
  title: string | ReactNode;
  action?: ReactNode;
  cardContents: Array<CardFeesContent>;
}

const BoxItem: FC<
  {
    value?: number | string;
    title: string;
    icon: ReactElement;
  } & BoxProps
> = ({icon, title, value, sx: boxSxProps = {}, ...boxProps}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "10px ",
        boxShadow: "1px 1px 3px rgba(167,167,167, 0.54)",
        border: "1px solid rgba(167,167,167, 0.2)",
        borderRadius: "5px",
        padding: "2px 7px",
        ...boxSxProps,
      }}
      {...boxProps}
    >
      <Box
        sx={{
          height: 40,
          width: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: PALETTE_COLORS.yellow,
          borderRadius: "50%",
          background: "rgba(167,167,167, 0.54)",
        }}
      >
        {icon}
      </Box>
      <Box
        sx={{
          color: "white",
        }}
      >
        <Typography variant="body2" fontSize="1rem">
          {title}
        </Typography>
        <Typography variant="subtitle2" fontWeight="800" fontSize="1rem">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export const FeesStatsHeader: FC<ListHeaderProps> = ({
  cardContents,
  title,
  action,
}) => {
  const isSmall = useMediaQuery("(max-width:1200px)");

  return (
    <Box
      width="calc(100% - 20px)"
      mx="auto"
      marginTop={3}
      display="flex"
      flexDirection="column"
      position="relative"
      sx={{
        backgroundColor: "transparent ",
      }}
    >
      <Box
        bgcolor="#f1C16B"
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
        width="98%"
        m="auto"
        marginTop="-1rem"
      >
        {cardContents.map((card) => (
          <Box
            key={card.title}
            sx={{
              background: `url(${cardBackground}), linear-gradient(120deg, #001948 0%, #001B4E 12%, #003CAE 86%)`,
              m: "-80px 5px 5px 5px",
              backgroundSize: "cover",
              backgroundPosition: "right",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "1vh",
              paddingBlock: "10px",
              minWidth: "300px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "5px 0.5vw",
                gap: "1rem",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  height: 40,
                  width: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  borderRadius: "50%",
                  background: "rgba(167,167,167, 0.54)",
                }}
              >
                {card.icon}
              </Box>
              <Typography
                variant="h5"
                color="white"
                fontSize="1.4rem"
                fontWeight="700"
              >
                {card.title}
              </Typography>
              {card.bank_fees !== undefined &&
                card.mobile_money !== undefined && (
                  <Box
                    position="absolute"
                    sx={{
                      right: "10px",
                      height: 40,
                      width: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      borderRadius: "50%",
                      background: "rgba(167,167,167, 0.54)",
                    }}
                  >
                    <CardInfos
                      bank_fees={Number(card.bank_fees)}
                      mobile_money={Number(card.mobile_money)}
                    />
                  </Box>
                )}
            </Box>
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr 1fr "
              gap="10px"
              paddingInline="15px"
            >
              <BoxItem value={card.L1} title="L1" icon={<GraduationCap />} />
              <BoxItem value={card.L2} title=" L2" icon={<GraduationCap />} />
              <BoxItem value={card.L3} title=" L3" icon={<GraduationCap />} />
            </Box>
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              gap="10px"
              paddingInline="15px"
            >
              <BoxItem
                value={card.A}
                title="Alternants"
                icon={<BadgeDollarSign />}
              />
              <BoxItem
                value={card.R}
                title=" Rattrapages"
                icon={<RefreshCw />}
              />
            </Box>
            <Box
              display="grid"
              gridTemplateColumns="1fr 1fr"
              sx={{
                marginInline: "10px",
                gap: "10px",
                borderTop: "1px solid rgba(167,167,167, 0.4)",
                paddingTop: "5px",
              }}
            >
              <BoxItem
                title="Mensuel"
                sx={{
                  borderRadius: "40px",
                  color: "white !important",
                  background: "rgba(114, 113, 113, 0.64)",
                  fontWeight: "900",
                }}
                icon={<ChartColumn color="white" />}
                value={card.mensual}
              />
              <BoxItem
                sx={{
                  borderRadius: "40px",
                  color: "white !important",
                  background: "rgba(114, 113, 113, 0.64)",
                  fontWeight: "900",
                }}
                title="Annuel"
                icon={<CalendarRange color="white" />}
                value={card.annual}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const CardInfos: FC<{mobile_money: number; bank_fees: number}> = ({
  bank_fees,
  mobile_money,
}) => {
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
      <Tooltip title="Transactions">
        <IconButton aria-describedby={id} onClick={handleClick}>
          <AccountBalance
            width="5px"
            height="5px"
            sx={{color: PALETTE_COLORS.white}}
          />
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
        <Box
          sx={{
            display: "flex",
            margin: "1rem 0.5rem",
            gap: "10px",
            alignItems: "center",
            color: PALETTE_COLORS.primary,
          }}
        >
          <AssuredWorkload
            sx={{
              fontSize: "2rem",
            }}
          />
          <Typography variant="h5" fontSize="1.1rem">
            BMOI
            <span
              style={{
                display: "block",
              }}
            >
              {bank_fees}
            </span>
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            margin: "1rem 0.5rem",
            gap: "10px",
            alignItems: "center",
            color: PALETTE_COLORS.primary,
          }}
        >
          <MobileFriendly
            sx={{
              fontSize: "2rem",
            }}
          />
          <Typography variant="h5" fontSize="1.1rem">
            Mobile Money
            <span
              style={{
                display: "block",
              }}
            >
              {mobile_money}
            </span>
          </Typography>
        </Box>
      </Popover>
    </div>
  );
};
