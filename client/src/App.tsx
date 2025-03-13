import { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { motion } from "framer-motion";
import { LetterSelector } from "./LetterSelector";
import { InspirationInput } from "./InspirationInput";
import { GenerateButton } from "./GenerateButton";
import SprintNamesList from "./SprintNamesList"; // Default import
import { ConfettiEffect } from "./ConfettiEffect";
import { createConsumer } from "@rails/actioncable";
import { v4 as uuidv4 } from "uuid";
import theme from "./theme";

function App() {
  const [clientId] = useState(uuidv4());
  const [letter, setLetter] = useState("A");
  const [sprintNames, setSprintNames] = useState<string[]>([]);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [clientVoteCount, setClientVoteCount] = useState(0); // Track local votes
  const [inspiration, setInspiration] = useState("fun"); // Track local votes

  const cable = createConsumer("ws://localhost:3000/cable");

  useEffect(() => {
    cable.subscriptions.create("SprintChannel", {
      received: (data: {
        reset: boolean;
        letter: string;
        sprint_names: string[];
        votes: Record<string, number>;
      }) => {
        setLetter(data.letter);
        setSprintNames(data.sprint_names);
        setVotes(data.votes);
        if (data.reset) {
          setClientVoteCount(0);
        }
      },
    });
  }, []);

  const generateNames = async () => {
    const response = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ letter, inspiration: inspiration }),
    });
    const data = await response.json();
    setLetter(data.letter);
    setSprintNames(data.sprint_names);
    setVotes(data.votes);
    setClientVoteCount(0); // Reset vote count when generating new names
    setShowConfetti(true);
  };

  const voteForName = async (name: string) => {
    if (clientVoteCount < 3) {
      await fetch("http://localhost:3000/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, client_id: clientId }),
      });
      setClientVoteCount((prev) => prev + 1);
    }
  };

  // Mouse position and window size logic remains unchanged
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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
        <ConfettiEffect
          show={showConfetti}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
          onComplete={() => setShowConfetti(false)}
        />
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
              Step right up and generate some fun! Votes left:{" "}
              {3 - clientVoteCount}
            </Typography>
          </motion.div>
          <LetterSelector letter={letter} setLetter={setLetter} />
          <InspirationInput
            inspiration={inspiration}
            setInspiration={setInspiration}
          />{" "}
          {/* Placeholder */}
          <GenerateButton onClick={generateNames} />
          {sprintNames.length > 0 && (
            <SprintNamesList
              sprintNames={sprintNames}
              votes={votes}
              onVote={voteForName}
              canVote={clientVoteCount < 3}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
