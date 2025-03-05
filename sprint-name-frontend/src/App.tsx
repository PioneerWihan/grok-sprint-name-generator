import { useState, useEffect } from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: { primary: { main: "#1976d2" } },
});

function App() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [sprintName, setSprintName] = useState("");

  const generateSprintName = async () => {
    const response = await fetch(`http://localhost:3000/generate?date=${date}`);
    const data = await response.json();
    setSprintName(`${data.sprint_letter}: ${data.sprint_name}`);
  };

  // Auto-generate on page load
  useEffect(() => {
    generateSprintName();
  }, []); // Empty dependency array means it runs once on mount

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Sprint Name Generator
          </Typography>
          <TextField
            label="Date (YYYY-MM-DD)"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              generateSprintName(); // Auto-update on date change
            }}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={generateSprintName}>
            Generate
          </Button>
          {sprintName && (
            <Typography variant="h5" sx={{ mt: 2 }}>
              {sprintName}
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
