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
  Checkbox,
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
  },
  secondary: {
    main: '#0A4',
    contrastText: '#FFF'
  }
}});

class ViewQuiz extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      isLoadingQuiz: false,
      errorLoadingQuiz: false,
      quiz: {},
      linkToOpen: ''
    };
  }

  componentDidMount () {
    this._loadQuiz();
  }

  _loadQuiz = async () => {
    try {
      this.setState({ isLoadingQuiz: true });
      await new Promise(res => setTimeout(res, 3000));
      const quiz = DEMO_QUIZZES[this.props.match.params.quizId];
      this.setState({ quiz });
    }
    catch (e) {
      this.setState({ errorLoadingQuiz: true });
      console.error(e);
    }
    finally {
      this.setState({ isLoadingQuiz: false });
    }
  }

  _errorDialogCancel = () => {
    this.setState({ errorLoadingQuiz: false });
  }

  _errorDialogRetry = () => {
    this.setState({ errorLoadingQuiz: false });
    this._loadQuiz();
  }

  _renderErrorDialog = (classes) => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.errorLoadingQuiz}
        onClose={this._errorDialogCancel}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">Loading Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A error occured while we were trying to load your quiz. Please check your Internet connection then try again.
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

  _renderViewQuiz = (classes, { name, questions }) => {
    return (
      <List style={{ marginBottom: '16px', width: '90%' }}>
        {
          questions.map(({ id, question, options, correct }, i) => (
            <ListItem key={id}>
              <Card className={classes.card}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                      <u>Q {i + 1}</u>
                    </Typography>
                    <Typography variant="body1" component="h2" style={{ fontSize: '1.05rem' }}>
                      <b>{question}</b>
                    </Typography>
                    <List>
                      {
                        options.map((option, key) => (
                          <ListItem key={key}>
                            <Checkbox color="secondary" checked={option === correct} />
                            <Typography variant="body1">{option}</Typography>
                          </ListItem>
                        ))
                      }
                    </List>
                  </CardContent>
                </CardActionArea>
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
      isLoadingQuiz, quiz, 
      errorLoadingQuiz, linkToOpen 
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
      <Box align="center" className={classes.container}>
        <Header>{quiz.title || 'Quiz'}</Header>
        { isLoadingQuiz && <CircularProgress color="secondary" /> }
        { 
          quiz.questions ? <MuiThemeProvider theme={theme}>{this._renderViewQuiz(classes, quiz)}</MuiThemeProvider> :
          (errorLoadingQuiz && !isLoadingQuiz) ? <Typography variant="body1" align="center">Error Loading Quiz. Reload the page.</Typography> :
          (!isLoadingQuiz) ? <Typography variant="body1" align="center">Quiz Not Found.</Typography> :
          ''
        }
        { this._renderErrorDialog(classes) }
      </Box>
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

export default withStyles(styles)(ViewQuiz);