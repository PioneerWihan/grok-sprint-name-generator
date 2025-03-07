import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { FC } from "react";

interface GenerateButtonProps {
  onClick: () => void;
}

export const GenerateButton: FC<GenerateButtonProps> = ({ onClick }) => {
  return (
    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
      <Button
        variant="contained"
        onClick={onClick}
        sx={{ fontSize: "1.2rem", padding: "10px 20px" }}
      >
        Spin the Wheel!
      </Button>
    </motion.div>
  );
};
