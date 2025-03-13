import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FC } from "react";

interface LetterSelectorProps {
  letter: string;
  setLetter: (letter: string) => void;
}

export const LetterSelector: FC<LetterSelectorProps> = ({
  letter,
  setLetter,
}) => {
  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel id="letter-select-label">Pick Your Letter!</InputLabel>
      <Select
        labelId="letter-select-label"
        value={letter}
        label="Pick Your Letter!"
        onChange={(e) => setLetter(e.target.value as string)}
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#ff6f61",
          animation: "rollercoaster 2s infinite",
          "@keyframes rollercoaster": {
            "0%": { transform: "translateY(0) rotate(0deg)" },
            "25%": { transform: "translateY(-10px) rotate(5deg)" },
            "50%": { transform: "translateY(0) rotate(0deg)" },
            "75%": { transform: "translateY(10px) rotate(-5deg)" },
            "100%": { transform: "translateY(0) rotate(0deg)" },
          },
        }}
      >
        {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(
          (l) => (
            <MenuItem key={l} value={l} sx={{ fontSize: "1.2rem" }}>
              {l}
            </MenuItem>
          )
        )}
      </Select>
    </FormControl>
  );
};
