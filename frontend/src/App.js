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
  const [value, setValue] = useState(false);
  const valueRef = useRef("");
  const [dataDict, setDataDict] = useState({});

  const computeData = (res) => {
    var sum = 0;

    res.forEach((data) => {
      sum += data[1];
    });
    return (sum + 0.5) * 100;
  };

  const getUpdatedVal = (val) => {
    return val + 0.5 / value.split(" ").length;
  };

  const getResults = () => {
    const payload = { text: valueRef.current.value };
    axios
      .post("http://localhost:5000/predict", payload)
      .then((res) => {
        var sum = computeData(res.data);
        setDataDict(res.data);
        setValue(valueRef.current.value);
        setProgressPresent(true);
        setTimeout(() => {
          setProgress(+sum);
        }, 300);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="app">
      <header className="title">Sarcastic or Not?</header>
      <div className="content">
        <div className="desc">
          Sarcasm plays an important role in our day to day conversations. Type
          in a sentence and find out why certain sentences are more sarcastic
          than others!
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

        {progressPresent && (
          <div className="word-breakdown">
            {value.split(" ").map((word) => (
              <div className="word">
                <div> {word} </div>
                {dataDict.map((data) =>
                  data[0] === word ? (
                    <div
                      className={getUpdatedVal(data[1]) > 0 ? "green" : "red"}
                    >
                      {" "}
                      {+(getUpdatedVal(data[1]) * 100).toFixed(2)}%
                    </div>
                  ) : (
                    ""
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
