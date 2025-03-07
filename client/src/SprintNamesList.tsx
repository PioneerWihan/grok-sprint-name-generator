import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { FC } from "react";

interface SprintNamesListProps {
  sprintNames: string[];
}

export const SprintNamesList: FC<SprintNamesListProps> = ({ sprintNames }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "backOut" }}
    >
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#ff6f61" }}>
          Your Carnival Creations:
        </Typography>
        <List sx={{ bgcolor: "grey.100", borderRadius: 2, p: 2 }}>
          {sprintNames.map((name, index) => (
            <ListItem
              key={index}
              sx={{
                py: 1,
                animation: `popIn 0.5s ease ${index * 0.1}s both`,
                "@keyframes popIn": {
                  "0%": { transform: "scale(0)", opacity: 0 },
                  "100%": { transform: "scale(1)", opacity: 1 },
                },
              }}
            >
              <ListItemText
                primary={name}
                primaryTypographyProps={{ fontSize: "1.3rem" }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </motion.div>
  );
};
