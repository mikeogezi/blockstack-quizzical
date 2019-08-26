import React from 'react';

import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  CardActionArea,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {
  Apps,
  Info,
  List as ListIcon,
  Money,
  OpenInNew,
  Share,
  PersonAdd,
  ExitToApp
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { 
  APP_NAME,
  DEMO_QUIZZES
} from '../constants/appInfo';
import { connect } from 'react-redux';
import BlockStackUtils from '../lib/BlockStackUtils';
import Header from './Header';
import { Redirect } from 'react-router-dom';

import js from '../data/js.json';
import html from '../data/html.json';
import python from '../data/python.json';
import sql from '../data/sql.json';

import { 
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';

const theme = createMuiTheme({ palette: {
  primary: {
    main: '#FF0066',
    contrastText: '#FFF'
  }
}});

class QuizCreated extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      quizId: this.props.match.params.quizId,
      linkToOpen: ''
    };
  }

  _getQuizLink = () => {
    return `/app/quizzes/take/${this.state.quizId}/`;
  }

  render () {
    const { classes } = this.props;
    const { linkToOpen } = this.state;

    if (!BlockStackUtils.isSignedInOrPending(this)) {
      return (
        <Redirect to="/sign-in/" />
      )
    }

    if (linkToOpen) {
      return (
        <Redirect to={linkToOpen} />
      )
    }

    return (
      <MuiThemeProvider theme={theme}>
        <Box align="center" className={classes.container}>
          <Header>You Successfully Created A New Quiz</Header>
          <Typography variant="h6">Share the link below so that people can take your quiz.</Typography>
          <Typography  variant="button">
            <Link to={this._getQuizLink()}>Quiz Link</Link>
          </Typography>
        </Box>
      </MuiThemeProvider>
    );
  }
};

const styles = theme => ({
  container: {
    flexGrow: 1,
    flexWrap: 'wrap'
  },
  card: {
    width: '100%',
  },
  media: {
    height: '250px',
  },
  iconInButton: {
    marginRight: theme.spacing(2),
  },
});

export default withStyles(styles)(QuizCreated);