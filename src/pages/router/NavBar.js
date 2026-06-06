import React from 'react';
import {
  HashRouter as Router,
  NavLink
} from "react-router-dom";
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { BrowserView } from 'react-device-detect';

import Routing from './Routing.js';
import styles from './navBarStyles.js'

import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';
import { ThemeContext, DEBUG_MODE } from "../util/config.js";

const MAX_PUZZLES = 3;

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      firstName: "",
      email: "",
      tokenId: ""
    }
  }


  resetProgress = () => {
    let ans = window.confirm("Are you sure you want to reset and remove attempts for all puzzles?");
    if (!ans) {
      return;
    }
    for (var i = 1; i <= MAX_PUZZLES; i++) {
      localStorage.removeItem("puzzle" + i);
    }
    // Reset solve status
    let solves = new Array(MAX_PUZZLES+1).fill(0);
    localStorage.setItem("solves", JSON.stringify(solves));

    console.log("Progress reset");
    window.location.reload();
  }

  render() {
    const { classes } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <ThemeContext.Provider value={{
          loggedIn: this.state.loggedIn,
          firstName: this.state.firstName,
          fullName: this.state.fullName,
          email: this.state.email,
          tokenId: this.state.tokenId,
          debug: false,
        }}>
          <div className={classes.root}>
            <CssBaseline />
            <AppBar
              position="absolute"
              className={classNames(classes.appBar)}
            >
              <Toolbar disableGutters={true} className={classes.toolbar}>
                <Grid container spacing={0}>
                  <Grid item xs={4} key={1}>
                    <BrowserView>
                      <Typography
                        component="h4"
                        variant="h6"
                        color="inherit"
                        noWrap

                      >
                        <div style={{ textAlign: 'left', paddingTop: "7px", paddingLeft: "10px", fontSize: "16px" }}>
                          <div>{this.state.loggedIn ? "Welcome back, " + this.state.firstName : ""}</div>
                        </div>
                      </Typography>
                    </BrowserView>
                  </Grid>
                  <Grid item xs={4} key={2}>
                    <BrowserView>
                      <div style={{ textAlign: 'center', textAlignVertical: 'center', paddingTop: "3px" }}>
                        <Typography
                          component="h1"
                          variant="h6"
                          color="inherit"
                          noWrap
                          className={classes.title}
                        >
                          <Router>
                            <NavLink activeClassName="active" className="link" to={"/"} type="menu">
                              <div style={{ marginLeft: '20px', textAlign: 'center' }}>
                                Anime Family Feud
                              </div>
                            </NavLink>
                          </Router>
                        </Typography>
                      </div>
                    </BrowserView>
                  </Grid>
                  <Grid item xs={4} key={3} >
                    <div style={{ textAlign: 'right', paddingTop: "2px", display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                      <Router>
                      <NavLink activeClassName="active" className="link" to={"/"} type="menu" style={{ marginRight: '20px' }}>
                          <Button color="inherit">Home</Button>
                        </NavLink>
                        <NavLink activeClassName="active" className="link" to={"/puzzles/"} type="menu" style={{ marginRight: '20px' }}>
                          <Button color="inherit">Games</Button>
                        </NavLink>
                        <BrowserView>
                          <NavLink activeClassName="active" className="link" type="menu" style={{ marginRight: '20px' }}>
                          <Button color="inherit" onClick={this.resetProgress}>Reset</Button>
                        </NavLink>
                        </BrowserView>
                      </Router>
                    </div>
                  </Grid>
                </Grid>

              </Toolbar>
            </AppBar>
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />
              <Routing />
            </main>
          </div>
        </ThemeContext.Provider></ThemeProvider>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavBar);
