import { useState } from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: { primary: { main: "#1976d2" } },
});

function App() {
  const [date, setDate] = useState("");
  const [sprintName, setSprintName] = useState("");

  const generateSprintName = async () => {
    const response = await fetch(
      `http://localhost:3000/generate?date=${
        date || new Date().toISOString().split("T")[0]
      }`
    );
    const data = await response.json();
    setSprintName(`${data.sprint_letter}: ${data.sprint_name}`);
  };

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
            onChange={(e) => setDate(e.target.value)}
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
