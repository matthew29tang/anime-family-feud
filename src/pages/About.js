import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import styles from './commonStyles.js';

class About extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className="About">
        <Paper className={classes.paper}>
          <h1>About</h1>
          <Divider />
          <br />
          <div className={classes.body}>
            
          Guess words that are in the article to guess the article name. A puzzle is solved if the article name is guessed.
          </div>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(About);