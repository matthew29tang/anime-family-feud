import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { NavLink } from "react-router-dom";
import styles from './commonStyles.js';
import { ThemeContext } from "./util/config.js";

class Home extends React.Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.images = [];
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="Home">
        <Paper className={classes.paper}>
          <h2>Anime Family Feud</h2>
          <Divider />
          <h3 style={{ marginBottom: "0px" }}>Guess the top 50 results for a category!</h3>
          <div> <br/>
          <h3>Scoring:</h3>
          Rank 26-50: 1pt
          <br/>
          Rank 16-25: 2pts

          <br/>
          Rank 11-15: 3pts
 
          <br/>
          Rank 4-10: 4pts

          <br/>
          Rank 1-3: 5pts

          <br /> <br/>
          </div>
          <div><NavLink activeClassName="active" className="link" to={"/puzzles"} type="menu">
            <Button variant="contained" color="primary" className={classes.button}>
              Games
            </Button>
          </NavLink><br /> <br /></div>
        </Paper>
      </div>
    );
  }
}


export default withStyles(styles)(Home);