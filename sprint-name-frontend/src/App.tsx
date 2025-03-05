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
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: { primary: { main: "#1976d2" } },
});

function App() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today
  const [inspiration, setInspiration] = useState(""); // Inspiration prompt
  const [sprintNames, setSprintNames] = useState<string[]>([]); // Array of 5 names

  const generateSprintNames = async () => {
    const url = new URL("http://localhost:3000/generate");
    url.searchParams.append("date", date);
    if (inspiration) url.searchParams.append("inspiration", inspiration);

    const response = await fetch(url);
    const data = await response.json();
    setSprintNames(data.sprint_names);
  };

  // Auto-generate on page load
  useEffect(() => {
    generateSprintNames();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Sprint Name Generator
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
            Prompt the AI for creative sprint names!
          </Typography>

          <TextField
            label="Select Date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              generateSprintNames(); // Auto-update on date change
            }}
            fullWidth
            sx={{ mb: 2, "& input": { cursor: "pointer" } }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Inspiration (e.g., 'tech', 'nature')"
            value={inspiration}
            onChange={(e) => setInspiration(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="Type a word to inspire the AI"
          />

          <Button variant="contained" onClick={generateSprintNames}>
            Generate Names
          </Button>

          {sprintNames.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Sprint Name Options:
              </Typography>
              <List sx={{ bgcolor: "grey.100", borderRadius: 1, p: 1 }}>
                {sprintNames.map((name, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
