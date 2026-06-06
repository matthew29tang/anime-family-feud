import React from 'react';
import { NavLink } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import styles from './commonStyles.js';
import puzzleInfo from './puzzleInfo.js';
import { ThemeContext } from "./util/config.js";

const MAX_PUZZLES = 3;

class Puzzles extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);

    // Temporary initial perms
    let permsArray = Array(28); // 0th idx is undefined
    permsArray.fill(-1);
    permsArray[0] = -1337;
    permsArray[1] = -1;
    this.state = {
      perms: permsArray,
      receivedToken: false,
      noTeam: false,
      score: -1
    }
    this.puzzlesList = [...Array(MAX_PUZZLES).keys()].map(x => x + 1)

    // Initialize solve status if not already done
    let solves = JSON.parse(localStorage.getItem("solves"));
    if (!solves) {
      solves = new Array(MAX_PUZZLES+1).fill(0);
    }
    localStorage.setItem("solves", JSON.stringify(solves));
    this.state.perms = solves
  }

  componentDidMount() {
    this.makeRequests();
  }

  componentDidUpdate() {
    this.makeRequests();
  }

  makeRequests = () => {
    return;
  }

  sumPerms = (start, end) => {
    let ans = 0;
    for (let i = start; i <= end; i++) {
      ans += this.state.perms[i];
    }
    return ans;
  }

  numAttempts = () => {
    let attempts = new Array(MAX_PUZZLES + 1).fill(0);
    for (var h = 1; h <= MAX_PUZZLES; h++) {
      let stored_progress = JSON.parse(localStorage.getItem("puzzle" + h));
      attempts[h] = stored_progress ? stored_progress.length : 0;
    }
    attempts.shift();
    return attempts.reduce((x,y)=>x+y) + " guesses (" + attempts + ")"
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="Puzzles">
        <Paper className={classes.paper}>
          <h1>Games</h1>
          <h3>{this.numAttempts()}</h3>
          <h3></h3>
          <Divider />
            <div className="Act1">
              <br />
              <Grid container spacing={4} style={{ paddingLeft: "20px", paddingRight: "20px" }}>
                {this.puzzlesList.map((puzzleId) => {
                    return (
                      <Grid item xs={12} sm={6} md={3} key={puzzleId}>
                        <NavLink activeClassName="active" className="link" to={"/puzzles/" + puzzleId}>
                        <button className={this.state.perms[puzzleId] === 1 ? "ctfbutton ctfbuttonsolved" : "ctfbutton ctfbuttonunsolved"}>
                          #{puzzleId}: {puzzleInfo[puzzleId].name}
                          <br /><br />
                          {puzzleInfo[puzzleId].points}
                        </button>
                        </NavLink>
                      </Grid>
                    )
              })}
              </Grid>
              <br />
            </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Puzzles);