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

class QuizList extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoadingQuizzes: false,
      errorLoadingQuizzes: false,
      quizzes: [],
      templates: [ js, html, python, sql ],
      linkToOpen: ''
    };
  }

  componentDidMount () {
    this._loadQuizzes();
  }

  _loadQuizzes = async () => {
    try {
      this.setState({ isLoadingQuizzes: true });
      await new Promise(res => setTimeout(res, 3000));
      const quizzes = DEMO_QUIZZES;
      this.setState({ quizzes });
    }
    catch (e) {
      this.setState({ errorLoadingQuizzes: true });
      console.error(e);
    }
    finally {
      this.setState({ isLoadingQuizzes: false });
    }
  }

  _errorDialogCancel = () => {
    this.setState({ errorLoadingQuizzes: false });
  }

  _errorDialogRetry = () => {
    this.setState({ errorLoadingQuizzes: false });
    this._load();
  }

  _renderErrorDialog = (classes) => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.errorLoadingQuizzes}
        onClose={this._errorDialogCancel}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">Loading Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A error occured while we were trying to load your quizzes. Please check your Internet connection then try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={this._errorDialogCancel} color="secondary">
            Cancel
          </Button>
          <Button variant="contained" onClick={this._errorDialogRetry} color="primary" autoFocus>
            Try Again
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  _renderQuizList = (classes, quizzes) => {
    return (
      <List style={{ marginBottom: '16px', width: '90%' }}>
        {
          quizzes.map(({ title, questions, id }) => (
            <ListItem key={id}>
              <Card className={classes.card}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {questions.length} Questions
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Link style={{ textDecoration: 'none' }} to={`/app/quizzes/view/${id}/`}>
                    <Button size="large" variant="contained" color="primary">
                      <ListIcon className={classes.iconInButton} />
                      View Quiz
                    </Button>
                  </Link>
                </CardActions>
              </Card>
            </ListItem>
          ))
        }
      </List>
    )
  }

  render () {
    const { classes } = this.props;
    const { 
      isLoadingQuizzes, quizzes, 
      errorLoadingQuizzes, linkToOpen 
    } = this.state;

    if (BlockStackUtils.isSignedInOrPending(this)) {
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
          <Header>Your Quizzes</Header>
          { isLoadingQuizzes && <CircularProgress /> }
          { 
            quizzes.length ? this._renderQuizList(classes, quizzes) :
            (errorLoadingQuizzes && !isLoadingQuizzes) ? <Typography variant="body1" align="center">Error Loading Quizzes. Reload the page.</Typography> :
            (!isLoadingQuizzes) ? <Typography variant="body1" align="center">No Quiz Found.</Typography> :
            ''
          }
          { this._renderErrorDialog(classes) }
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

export default withStyles(styles)(QuizList);