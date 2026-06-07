import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { NavLink } from "react-router-dom";

import styles from './commonStyles.js';
import EnhancedTableHead from './GuessTable.js';
import { ThemeContext } from "./util/config.js";
import puzzleInfo from './puzzleInfo.js';
import Tooltip from './Tooltip';

const MAX_PUZZLES = 3;

class PuzzlePage extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    let puzzleId = parseInt(props.match.params.puzzleId);
    if (puzzleId > MAX_PUZZLES) {
      this.state = {invalid: true};
      return;
    }

    this.state = {
      puzzleId: puzzleId,
      name: puzzleInfo[puzzleId].name,
      pts: puzzleInfo[puzzleId].points,
      body: puzzleInfo[puzzleId].body ? puzzleInfo[puzzleId].body : "Additional info here.",
      choices: puzzleInfo[puzzleId].choices,
      maxRank: 50,

      totalPoints: 0,
      teamGuesses: [],
      textField: "",
      errorText: "",
      lastGuess: "UNDEFINED_STATE_NO_LAST_GUESS",
      hideIncorrect: false,
      textFieldDisabled: false,
      isSolved: false,
      textFieldOpen: false,
      singleMatch: null,
    }
    let stored_progress = JSON.parse(localStorage.getItem("puzzle" + puzzleId));

    if (stored_progress) {
      this.state.teamGuesses = stored_progress;
      if (stored_progress.length > 0) {
        this.state.lastGuess = this.state.teamGuesses[stored_progress.length-1].g
      }
  
      // Find max guess
      for (let i = 0; i < this.state.teamGuesses.length; i++) {
        this.state.totalPoints += this.state.teamGuesses[i].s;
        this.state.maxRank = Math.max(this.state.teamGuesses[i].id, this.state.maxRank);
      }
    }

    // Initialize solve status if not already done
    let solves = JSON.parse(localStorage.getItem("solves"));
    if (!solves) {
      solves = new Array(MAX_PUZZLES+1).fill(0);
    }
    localStorage.setItem("solves", JSON.stringify(solves));
  }

  componentDidUpdate() {
    if (parseInt(this.props.match.params.puzzleId) !== this.state.puzzleId) {
      window.location.reload();
    }
  }

  componentDidCatch(error, errorInfo) {
    localStorage.removeItem("puzzle" + this.state.puzzleId);

    // Reset solve status for this puzzle
    let solves = JSON.parse(localStorage.getItem("solves"));
    if (!solves) {
      solves = new Array(MAX_PUZZLES+1).fill(0);
    } else {
      solves[this.state.puzzleId] = 0;
    }
    localStorage.setItem("solves", JSON.stringify(solves));

    console.log(error, errorInfo);
    alert("Malformed save data detected, wiping saved attempts for this puzzle");
    window.location.reload();
  }

  stripAndLowercase = (str) => {
    let s = str.replace("<h2>", '').replace("</h2>", '')
    s = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return s
  }

  updateState = (req, data) => {
    this.setState({
      [req]: data
    });
  }

  calculateScoreFromRank = (rank) => {
    if (rank <= 5) {
      return 4;
    } else if (rank <= 10) {
      return 3;
    } else if (rank <= 25) {
      return 2;
    } else if (rank <= 50) {
      return 1;
    } else {
      return 0;
    }
  }

  submitAnswer = (e) => {
    if (e && e.preventDefault) e.preventDefault(); 
    
    if (this.state.textField === "") {
      return;
    }
    
    let guess = this.state.textField.trim();
    const normalizedGuess = this.stripAndLowercase(guess);
    
    // 1. Use your custom stripAndLowercase method for a bulletproof duplicate check
    const isDuplicate = this.state.teamGuesses.some(
      (g) => this.stripAndLowercase(g.g) === normalizedGuess
    );
    
    if (isDuplicate) {
      this.setState({ errorText: "You have already guessed this!" });
      return;
    }

    let id = this.state.maxRank;
    let pts = "";
    let suffix = this.state.puzzleId === 3 ? "k" : "";
    let nextMaxRank = this.state.maxRank;

    // 2. Make the choice matching loop completely case and punctuation insensitive
    for (let i = 0; i < this.state.choices.length; i++) {
      const officialName = this.state.choices[i][1];
      if (this.stripAndLowercase(officialName) === normalizedGuess) {
        id = parseInt(this.state.choices[i][0]);
        pts = `${this.state.choices[i][2]}${suffix}`;
        guess = officialName; // Snap their typed text to the official name layout!
        break; 
      }
    }

    if (id === this.state.maxRank) {
      id += 1;
      nextMaxRank = id;
    }
    
    const responsePayload = {
      g: guess, 
      id: id,
      r: pts,
      s: this.calculateScoreFromRank(id)
    };

    this.setState(prevState => {
      const updatedGuesses = [...prevState.teamGuesses, responsePayload];
      localStorage.setItem("puzzle" + prevState.puzzleId, JSON.stringify(updatedGuesses));
      
      return { 
        teamGuesses: updatedGuesses, 
        maxRank: nextMaxRank, 
        textField: "", 
        lastGuess: guess, 
        singleMatch: null,
        errorText: "" ,
        totalPoints: prevState.totalPoints + responsePayload.s
      };
    });
  }

  switchToggle = (e) => {
    this.setState(prevState => {
      return { hideIncorrect: !prevState.hideIncorrect }
    });
  }

  getOptionLabel = (option) => {
    // If it's the expected array tuple, return the string name
    if (Array.isArray(option)) {
      return option[1] || "";
    }
    // If MUI passes a raw string (common during typing/freeSolo)
    if (typeof option === 'string') {
      return option;
    }
    // If it passes a number (like 0) or anything else, safely stringify it
    return option !== undefined && option !== null ? String(option) : "";
  }

  render() {
      const { classes } = this.props;
      if (this.state.invalid) {
        return (<h1>Page not found :(</h1>)
      }
      return (
        <div className="PuzzlePage">
          <Paper className={classes.paper}>
          <Grid container spacing={4} style={{ paddingLeft: "20px", paddingRight: "20px" }}>
            <Grid item xs={1} key={1}>
              <NavLink activeClassName="active" className="link" to={"/puzzles/"}>
                <Button variant="contained" color="primary" className={classes.nextButton} onClick={this.nextPage} type="submit">
                  BACK
                </Button>
              </NavLink>
            </Grid>
            <Grid item xs={1} key={2}/>
            <Grid item xs={8} key={3}>
              <h1 style={{ marginBottom: "0px" }}>{"#" + this.state.puzzleId + ": " + this.state.name}</h1>
            </Grid>
            <Grid item xs={1} key={4}>
              <NavLink activeClassName="active" className="link" to={"/puzzles/" + (this.state.puzzleId - 1)}>
                  <Button variant="contained" color="primary" className={classes.nextButton} onClick={this.nextPage} disabled={this.state.puzzleId === 1} type="submit">
                      PREV
                  </Button>
                </NavLink>  
            </Grid>
            <Grid item xs={1} key={5}>
              <NavLink activeClassName="active" className="link" to={"/puzzles/" + (this.state.puzzleId + 1)}>
                <Button variant="contained" color="primary" className={classes.nextButton} onClick={this.nextPage} disabled={this.state.puzzleId >= 12} type="submit">
                    NEXT
                </Button>
              </NavLink>
            </Grid>
            </Grid>
            
            <h2 style={{ marginTop: "5px", marginBottom: "5px" }}>{this.state.totalPoints} / 112 points</h2>
            <Divider />
            <br />
            <center>
              {this.state.body}
              <h1 style={{marginBottom: "0px",  fontSize: "40px"}}>
                </h1>
              </center>
            <br/>
            <form autoComplete="off" onSubmit={this.submitAnswer}>
              <center>
                <Autocomplete
                  autoFocus
                  options={this.state.choices}
                  freeSolo={true}
                  getOptionLabel={this.getOptionLabel}
                  inputValue={this.state.textField}
                  style={{ width: 320 }}
                  open={this.state.textFieldOpen}
                  
                  // 1. Intercept the Tab keypress
                  onKeyDown={(event) => {
                    if (event.key === 'Tab' && this.state.singleMatch && this.state.textFieldOpen) {
                      event.preventDefault(); 
                      
                      const filledValue = this.state.singleMatch[1];
                      const normalizedFilled = this.stripAndLowercase(filledValue);
                      
                      const isDuplicate = this.state.teamGuesses.some(
                        (guess) => this.stripAndLowercase(guess.g) === normalizedFilled
                      );

                      this.setState({
                        textField: filledValue,
                        textFieldOpen: false,
                        singleMatch: null,
                        errorText: isDuplicate ? "You have already guessed this!" : ""
                      });
                    }
                  }}
                  onInputChange={(event, newInputValue, reason) => {
                    const normalizedInput = this.stripAndLowercase(newInputValue);
                    
                    // 1. Calculate duplicate status instantly
                    const isDuplicate = this.state.teamGuesses.some(
                      (guess) => this.stripAndLowercase(guess.g) === normalizedInput
                    );

                    let nextErrorText = isDuplicate ? "You have already guessed this!" : "";
                    let nextTextFieldOpen = this.state.textFieldOpen;
                    let nextSingleMatch = this.state.singleMatch;

                    // 2. Handle dropdown state mechanics cleanly
                    if (reason === 'input') {
                      if (isDuplicate) {
                        nextTextFieldOpen = false;
                        nextSingleMatch = null;
                      } else {
                        const matches = this.state.choices.filter((option) =>
                          option[1].toLowerCase().startsWith(newInputValue.toLowerCase())
                        );

                        if (matches.length === 1) {
                          nextTextFieldOpen = true;
                          nextSingleMatch = matches[0];
                        } else {
                          nextTextFieldOpen = false;
                          nextSingleMatch = null;
                        }
                      }
                    }

                    if (reason === 'clear') {
                      nextTextFieldOpen = false;
                      nextSingleMatch = null;
                      nextErrorText = "";
                    }

                    // 3. Fire exactly ONCE so React locks all values down at the same millisecond
                    this.setState({
                      textField: newInputValue,
                      errorText: nextErrorText,
                      textFieldOpen: nextTextFieldOpen,
                      singleMatch: nextSingleMatch
                    });
                  }}
                  
                  onClose={() => this.setState({ textFieldOpen: false })}
                  forcePopupIcon={false}
                  clearOnBlur={false}
                  filterOptions={createFilterOptions({
                    matchFrom: 'start',
                    ignoreCase: true,
                  })}
                  renderInput={(params) => (
                    <TextField {...params} 
                      label="Guess"
                      error={this.state.errorText !== ""}
                      helperText={this.state.errorText}
                      variant="outlined" />
                  )}
                />
              </center>
            </form>
            <br />
            <Button variant="contained" color="primary" className={classes.submitButton} onClick={this.submitAnswer} disabled={this.state.errorText !== "" || this.state.isSolved} type="submit">
              SEND
            </Button>
            <br />
            <h1 style={{ marginBottom: "0px" }}>Guesses</h1>
            <h2 style={{ marginTop: "5px", marginBottom: "5px" }}>{this.state.teamGuesses.length} guesses</h2>
            <FormControlLabel
              control={
                <Switch
                  checked={this.state.switchOn}
                  onChange={this.switchToggle}
                  name="switch"
                  color="primary"
                />
              }
              label="Hide failed guesses"
            />
            <Divider />
            <EnhancedTableHead rows={this.state.teamGuesses} hideIncorrect={this.state.hideIncorrect} />
          </Paper>
        </div>
      );
    } 
}

export default withStyles(styles)(PuzzlePage);