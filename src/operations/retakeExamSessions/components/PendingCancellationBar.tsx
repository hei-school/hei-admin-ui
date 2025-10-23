import {RetakeExamStatus} from "@haapi-b0fc7615/typescript-client";
import {Box} from "@mui/material";
import {motion} from "framer-motion";
import {AlertCircle} from "lucide-react";
import {useGetList} from "react-admin";
import {useNavigate} from "react-router-dom";

interface PendingCancellationBarProps {
  onClick?: () => void;
}

export const PendingCancellationBar = ({
  onClick,
}: PendingCancellationBarProps) => {
  const navigate = useNavigate();

  const {data: retakeExams = []} = useGetList("retakeExams", {
    filter: {status: RetakeExamStatus.TO_CANCEL},
  });

  const count = retakeExams.length;
  if (count === 0) return null;

  return (
    <Box sx={{px: 2, mb: -3, mt: 2}}>
      <motion.div
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
        onClick={() =>
          onClick ? onClick() : navigate("/retake-exams/annulation")
        }
        style={{
          background: "linear-gradient(135deg, #ffb36bff 0%, #eeae5aff 100%)",
          color: "white",
          padding: "18px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          borderRadius: "8px 8px 0 0",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, #ffa652ff 0%, #e09c4eff 100%)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(255, 107, 107, 0.4)";
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background =
            "linear-gradient(135deg, #ffba6bff 0%, #eeae5aff 100%)";
          e.currentTarget.style.boxShadow = "none";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div style={{display: "flex", alignItems: "center", gap: "14px"}}>
          <AlertCircle
            size={24}
            style={{
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <div style={{display: "flex", flexDirection: "column", gap: "2px"}}>
            <span style={{fontSize: "15px", fontWeight: 600}}>
              Demandes d'annulation de rattrapage en attente
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 400,
                opacity: 0.9,
              }}
            >
              Cliquez pour voir la liste complète
            </span>
          </div>
        </div>

        <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.25)",
              color: "white",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: 700,
              backdropFilter: "blur(10px)",
            }}
          >
            {count}
          </div>
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </motion.div>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}
      </style>
    </Box>
  );
};
