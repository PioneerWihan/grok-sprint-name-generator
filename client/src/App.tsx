import { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import { LetterSelector } from "./LetterSelector";
import { InspirationInput } from "./InspirationInput";
import { GenerateButton } from "./GenerateButton";
import { SprintNamesList } from "./SprintNamesList";
import { ConfettiEffect } from "./ConfettiEffect";
import theme from "./theme";

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
    setShowConfetti(true);
  };

  // Auto-generate on load
  useEffect(() => {
    generateSprintNames();
  }, []);

  // Get window dimensions for centered confetti
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        {showConfetti && (
          <ConfettiEffect
            show={showConfetti}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
          />
        )}
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

          <LetterSelector letter={letter} setLetter={setLetter} />
          <InspirationInput
            inspiration={inspiration}
            setInspiration={setInspiration}
          />
          <GenerateButton onClick={generateSprintNames} />
          {sprintNames.length > 0 && (
            <SprintNamesList sprintNames={sprintNames} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
