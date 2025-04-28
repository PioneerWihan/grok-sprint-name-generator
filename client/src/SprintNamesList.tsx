import { Box, Button, ListItem, ListItemText } from "@mui/material";
import { motion } from "framer-motion";
import { FC } from "react";

interface SprintNamesListProps {
  sprintNames: string[];
  votes: Record<string, number>;
  onVote: (name: string) => void;
  canVote: boolean; // New prop to control voting availability
}

export const SprintNamesList: FC<SprintNamesListProps> = ({
  sprintNames,
  votes,
  onVote,
  canVote,
}) => {
  return (
    <>
      {sprintNames.map((name, index) => (
        <ListItem
          key={index}
          sx={{ py: 1, display: "flex", alignItems: "center" }}
        >
          <ListItemText
            primary={name}
            primaryTypographyProps={{ fontSize: "1.3rem" }}
          />
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            {[...Array(votes[name] || 0)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                ✨
              </motion.div>
            ))}
            <Button
              onClick={() => onVote(name)}
              sx={{ ml: 2 }}
              disabled={!canVote}
            >
              👍
            </Button>
          </Box>
        </ListItem>
      ))}
    </>
  );
};

export default SprintNamesList;
