import React from 'react';
import { 
  Redirect,
  Link 
} from 'react-router-dom';
import { 
  NoteAdd as Add,
  List as ListIcon
} from '@material-ui/icons';
import {
  Box,
  Button
} from '@material-ui/core';
import { 
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';
import Header from './Header';

const blueTheme = createMuiTheme({ palette: {
  primary: {
    main: '#FF0066',
    contrastText: '#FFF'
  }
}});

function AppHome (props) {
  const { classes } = props;

  return (
    <Box align="center" className={classes.container}>
      <Header>Home</Header>
      <MuiThemeProvider theme={blueTheme}>
        <Button size="large" variant="contained" color="primary" align="center" className={classes.ctaButton}>
            <Link className={classes.iconLink} to="/app/quizzes/create/">
              <Add className={classes.buttonIcon} />
            </Link>
            <Link className={classes.iconLink} to="/app/quizzes/create/">
              Create Quiz
            </Link>
        </Button>
        <Button size="large" variant="contained" color="primary" align="center" className={classes.ctaButton}>
            <Link className={classes.iconLink} to="/app/quizzes/list/">
              <ListIcon className={classes.buttonIcon} />
            </Link>
            <Link className={classes.iconLink} to="/app/quizzes/list/">
              View Created Quizzes
            </Link>
        </Button>
      </MuiThemeProvider>
    </Box>
  );
};

const styles = theme => ({
  container: {
    flexGrow: 1
  },
  ctaButton: {
    margin: theme.spacing(1)
  },
  buttonIcon: {
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(0.75)
  },
  iconLink: {
    marginBottom: theme.spacing(0),
    textDecoration: 'none',
    color: 'white'
  }
});

export default withStyles(styles)(AppHome);