import "./app.scss";
import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import axios from "axios";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 90 }}>
        <Typography variant="body2" color="black">{`${Math.round(
          props.value
        )}% Sarcastic`}</Typography>
      </Box>
    </Box>
  );
}

function App() {
  const [progress, setProgress] = useState(0);
  const [progressPresent, setProgressPresent] = useState(false);
  const valueRef = useRef("");

  const getResults = () => {
    const payload = { text: valueRef.current.value };
    axios
      .post("http://localhost:5000/predict", payload)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setProgressPresent(true);
    setTimeout(() => {
      setProgress(90);
    }, 300);
  };

  return (
    <div className="app">
      <header className="title">Sarcastic or Not?</header>
      <div className="content">
        <div className="desc">
          Sarcasm, a sharp and ironic utterance designed to cut or to cause
          pain, is often used to express strong emotions, such as contempt,
          mockery or bitterness. Sarcasm detection is of great importance in
          understanding people's true sentiments and opinions.
        </div>
        <TextField
          id="filled-textarea"
          label="Sarcastic Text"
          placeholder="Find out how sarcastic your sentence is .."
          multiline
          rows={7}
          variant="filled"
          style={{ width: "100%" }}
          inputRef={valueRef}
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
      </div>
    </div>
  );
}

export default App;
