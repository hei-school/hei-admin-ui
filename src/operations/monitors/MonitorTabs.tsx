import {GroupOutlined, PersonOffOutlined} from "@mui/icons-material";
import {Box, Card, Tab, Tabs, useTheme} from "@mui/material";
import {AnimatePresence, motion} from "framer-motion";
import {useState} from "react";
import {MonitorListContent} from "./MonitorListContent";
import {UnlinkedStudentsList} from "./UnlinkedStudentsList";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const {children, value, index, ...other} = props;
  return (
    <AnimatePresence mode="wait">
      {value === index && (
        <motion.div
          key={index}
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          exit={{opacity: 0, y: -20}}
          transition={{duration: 0.35, ease: "easeInOut"}}
          role="tabpanel"
          id={`monitor-tabpanel-${index}`}
          aria-labelledby={`monitor-tab-${index}`}
          {...other}
        >
          <Box>{children}</Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MonitorTabs = () => {
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{width: "100%", mt: 2}}>
      <Card
        sx={{
          background:
            "linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(103, 58, 183, 0.15) 100%)",
          border: `1.5px solid rgba(13, 71, 161, 0.15)`,
          borderBottom: "none",
          borderRadius: "20px 20px 0 0",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          padding: "0 !important",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="monitor navigation tabs"
          variant="fullWidth"
          sx={{
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "4px 4px 0 0",
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
              transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: `0 0 16px ${theme.palette.primary.main}40`,
            },
            "& .MuiTabs-flexContainer": {
              gap: 1,
            },
            "& .MuiTabScrollButton-root": {
              display: "none",
            },
          }}
        >
          <Tab
            label="Moniteurs"
            icon={<GroupOutlined sx={{fontSize: 24}} />}
            iconPosition="start"
            id="monitor-tab-0"
            sx={{
              "flex": 1,
              "textTransform": "none",
              "fontSize": "1.05rem",
              "fontWeight": 600,
              "minHeight": 80,
              "color":
                value === 0
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              "transition": "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "position": "relative",
              "overflow": "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, transparent 100%)`,
                opacity: value === 0 ? 1 : 0,
                transition: "opacity 0.3s ease",
                zIndex: -1,
              },
              "&:hover": {
                "color": theme.palette.primary.main,
                "transform": "translateY(-2px)",
                "& .MuiTab-iconWrapper": {
                  animation: "float 2s ease-in-out infinite",
                },
              },
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            }}
          />
          <Tab
            label="Étudiants non liés"
            icon={<PersonOffOutlined sx={{fontSize: 24}} />}
            iconPosition="start"
            id="monitor-tab-1"
            sx={{
              "flex": 1,
              "textTransform": "none",
              "fontSize": "1.05rem",
              "fontWeight": 600,
              "minHeight": 80,
              "color":
                value === 1
                  ? theme.palette.primary.main
                  : theme.palette.text.secondary,
              "transition": "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "position": "relative",
              "overflow": "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, transparent 100%)`,
                opacity: value === 1 ? 1 : 0,
                transition: "opacity 0.3s ease",
                zIndex: -1,
              },
              "&:hover": {
                "color": theme.palette.primary.main,
                "transform": "translateY(-2px)",
                "& .MuiTab-iconWrapper": {
                  animation: "float 2s ease-in-out infinite",
                },
              },
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            }}
          />
        </Tabs>
      </Card>

      <Card
        sx={{
          borderRadius: "0 0 20px 20px",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          border: `1.5px solid rgba(13, 71, 161, 0.15)`,
          borderTop: "none",
          overflow: "hidden",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
        }}
      >
        <TabPanel value={value} index={0}>
          <MonitorListContent />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UnlinkedStudentsList />
        </TabPanel>
      </Card>
    </Box>
  );
};
