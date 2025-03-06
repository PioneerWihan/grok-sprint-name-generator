import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const theme = createTheme({
  palette: { primary: { main: "#ff6f61" } }, // Carnival-inspired color
});

function App() {
  const [letter, setLetter] = useState("A");
  const [inspiration, setInspiration] = useState("");
  const [sprintNames, setSprintNames] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement for dynamic background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const generateSprintNames = async () => {
    const url = new URL("http://localhost:3000/generate");
    url.searchParams.append("letter", letter);
    if (inspiration) url.searchParams.append("inspiration", inspiration);

    const response = await fetch(url);
    const data = await response.json();
    setSprintNames(data.sprint_names);
    setShowConfetti(true); // Trigger confetti
    setTimeout(() => setShowConfetti(false), 3000); // Stop after 3 seconds
  };

  // Auto-generate on load
  useEffect(() => {
    generateSprintNames();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, #ff9a9e 0%, #fad0c4 100%)`,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {showConfetti && <Confetti />}
        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: 3,
            padding: 4,
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            maxWidth: 600,
            width: "100%",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#ff6f61" }}
            >
              Sprint Name Carnival
            </Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              sx={{ mb: 3 }}
            >
              Step right up and generate some fun!
            </Typography>
          </motion.div>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="letter-select-label">Pick Your Letter!</InputLabel>
            <Select
              labelId="letter-select-label"
              value={letter}
              label="Pick Your Letter!"
              onChange={(e) => {
                setLetter(e.target.value as string);
              }}
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
              {Array.from({ length: 26 }, (_, i) =>
                String.fromCharCode(65 + i)
              ).map((l) => (
                <MenuItem key={l} value={l} sx={{ fontSize: "1.2rem" }}>
                  {l}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Inspiration (e.g., 'tech', 'nature')"
            value={inspiration}
            onChange={(e) => setInspiration(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
            placeholder="Add some carnival magic!"
          />

          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="contained"
              onClick={generateSprintNames}
              sx={{ fontSize: "1.2rem", padding: "10px 20px" }}
            >
              Spin the Wheel!
            </Button>
          </motion.div>

          {sprintNames.length > 0 && (
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
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
