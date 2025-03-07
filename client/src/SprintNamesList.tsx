import { Box, Button, ListItem, ListItemText } from "@mui/material";
import { motion } from "framer-motion";

interface SprintNamesListProps {
  sprintNames: string[];
  votes: Record<string, number>;
  onVote: (name: string) => void;
}

function SprintNamesList({ sprintNames, votes, onVote }: SprintNamesListProps) {
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
                🎳
              </motion.div>
            ))}
            <Button onClick={() => onVote(name)} sx={{ ml: 2 }}>
              Vote
            </Button>
          </Box>
        </ListItem>
      ))}
    </>
  );
}

export default SprintNamesList;
