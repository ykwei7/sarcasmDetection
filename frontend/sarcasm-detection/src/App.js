import "./app.scss";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 90 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}% Sarcastic`}</Typography>
      </Box>
    </Box>
  );
}

function App() {
  const [progress, setProgress] = useState(0);
  const [progressPresent, setProgressPresent] = useState(false);
  const getResults = () => {
    setProgressPresent(true);
    setTimeout(() => {
      setProgress(90);
    }, 300);
  };

  return (
    <div className="app">
      <header className="title">Sarcastic or Not?</header>
      <body>
        <div className="desc">
          Sarcasm, a sharp and ironic utterance designed to cut or to cause
          pain, is often used to express strong emotions, such as contempt,
          mockery or bitterness. Sarcasm detection is of great importance in
          understanding people's true sentiments and opinions.
        </div>
        <TextField
          id="filled-textarea"
          label="Text"
          placeholder="Key in your sentence.."
          multiline
          rows={7}
          variant="filled"
          style={{ width: "100%" }}
        />
        <div className="submit-btn-container">
          <div className="placeholder"></div>
          <Button
            onClick={getResults}
            className="submit-btn"
            variant="contained"
          >
            Submit
          </Button>
        </div>

        {progressPresent && (
          <div className="results">
            <LinearProgressWithLabel value={progress} />
          </div>
        )}
      </body>
    </div>
  );
}

export default App;
