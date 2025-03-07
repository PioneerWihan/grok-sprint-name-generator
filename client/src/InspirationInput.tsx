import { TextField } from "@mui/material";
import { FC } from "react";

interface InspirationInputProps {
  inspiration: string;
  setInspiration: (inspiration: string) => void;
}

export const InspirationInput: FC<InspirationInputProps> = ({
  inspiration,
  setInspiration,
}) => {
  return (
    <TextField
      label="Inspiration (e.g., 'Fun at the Carnival', 'Tourist Cities')"
      value={inspiration}
      onChange={(e) => setInspiration(e.target.value)}
      fullWidth
      sx={{ mb: 3 }}
      placeholder="Add some carnival magic!"
    />
  );
};
