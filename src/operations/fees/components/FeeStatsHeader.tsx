import {PALETTE_COLORS} from "@/haTheme";
import {
  AccountBalance,
  AssuredWorkload,
  CurrencyExchange,
  MobileFriendly,
  RequestQuote,
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
import {FC, ReactElement, ReactNode, useState} from "react";

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
    label: string;
    bgcolor: string;
  } & BoxProps
> = ({bgcolor, label, title, value, sx: boxSxProps = {}, ...boxProps}) => {
  return (
    <Box
      sx={{
        mx: "auto",
        width: "4rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "5px",
        ...boxSxProps,
      }}
      {...boxProps}
    >
      <Tooltip title={title} arrow placement="bottom">
        <Typography
          sx={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            fontWeight: "900",
            fontSize: "1.2rem",
            textAlign: "center",
            bgcolor,
          }}
        >
          {label}
        </Typography>
      </Tooltip>
      <Typography>{value}</Typography>
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
        marginTop="-1rem"
      >
        {cardContents.map((card) => (
          <Box
            key={card.title}
            sx={{
              backgroundColor: PALETTE_COLORS.primary,
              borderRadius: "1rem",
              m: "-80px 5px 5px 5px",
              color: PALETTE_COLORS.white,
              boxShadow: "1px 1px 5px grey ",
            }}
          >
            <Box
              sx={{
                background: PALETTE_COLORS.white,
                padding: "1rem 2rem",
                color: PALETTE_COLORS.primary,
                borderRadius: "1rem 1rem 0 0 ",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {card.icon}
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: "900",
                }}
              >
                {card.title}
              </Typography>
            </Box>
            <Box>
              <Box
                padding="0.8rem 1rem"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "1rem",
                }}
              >
                <Box display="flex" width="100%" gap="auto">
                  <BoxItem
                    bgcolor="#00ff3e"
                    value={card.L1}
                    label="L1"
                    title="Frais L1"
                  />
                  <BoxItem
                    bgcolor="#ff00e8"
                    value={card.L2}
                    label="L2"
                    title="Frais L2"
                  />
                  <BoxItem
                    bgcolor="#ff0000"
                    value={card.L3}
                    label="L3"
                    title="Frais L3"
                  />
                </Box>
                <Box display="flex" width="100%" justifyContent="start">
                  <BoxItem
                    bgcolor="#614efb"
                    value={card.A}
                    label="A"
                    title="Frais d'Alternance"
                  />
                  <BoxItem
                    bgcolor="#f9d100"
                    value={card.R}
                    label="R"
                    title="Frais de rattrapage"
                  />
                  <BoxItem
                    sx={{opacity: 0}}
                    bgcolor=""
                    value=""
                    label=""
                    title=""
                  />
                </Box>
              </Box>
              <Box
                borderTop="0.5px solid white"
                padding="0.5rem 1rem"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "5px",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      fontSize: "2rem",
                    }}
                  >
                    <CurrencyExchange
                      sx={{
                        color: PALETTE_COLORS.yellow,
                      }}
                    />
                    <Typography>Mensuel : {card.mensual}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <RequestQuote
                      sx={{
                        color: PALETTE_COLORS.yellow,
                      }}
                    />
                    <Typography>Annuel : {card.annual}</Typography>
                  </Box>
                </Box>
                {card.bank_fees !== undefined &&
                  card.mobile_money !== undefined && (
                    <CardInfos
                      bank_fees={Number(card.bank_fees)}
                      mobile_money={Number(card.mobile_money)}
                    />
                  )}
              </Box>
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
            sx={{color: PALETTE_COLORS.yellow}}
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
