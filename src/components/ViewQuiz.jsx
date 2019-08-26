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
  TextField,
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
  ArrowForward,
  ExitToApp
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { 
  APP_NAME,
  DEMO_QUIZZES
} from '../constants/appInfo';
import { connect } from 'react-redux';
import BlockStackUtils from '../lib/BlockStackUtils';
import FirebaseUtils from '../lib/FirebaseUtils';
import ScoreUtils from '../lib/ScoreUtils';
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
      isSavingQuiz: false,
      errorSavingQuiz: false,
      isLoadingQuiz: false,
      errorLoadingQuiz: false,
      email: '',
      quiz: {},
      linkToOpen: '',
      isTake: this.props.isTake,
      isView: this.props.isView
    };
    BlockStackUtils.init(this);
  }

  componentDidMount () {
    this._loadQuiz();
  }

  _onSubmit = () => {
    console.log('Submit Clicked!');
    // const { email, quiz } = this.state;
    // console.log({ 
    //   email,
    //   score: ScoreUtils.calculateScore(quiz.questions)
    // });
    this._saveResult();
  }

  _saveResult = async () => {
    const { quiz, email } = this.state;
    try {
      this.setState({ isSavingQuiz: true });
      // await new Promise(res => setTimeout(res, 3000));
      // const quiz = DEMO_QUIZZES[this.props.match.params.quizId];
      // this.setState({ quiz });
      if (!email) {
        this.setState({ errorSavingQuiz: true });
        console.error('Email not entered');
        return;
      }
      const quizId = this.props.match.params.quizId;
      await FirebaseUtils.saveQuizResult(quizId, { 
        email,
        score: ScoreUtils.calculateScore(quiz.questions),
        time: (new Date()).toGMTString()
      });
      console.log('Successfully saved result to database');
      this.setState({ linkToOpen: `/app/quizzes/taken/${quizId}/` });
    }
    catch (e) {
      this.setState({ errorSavingQuiz: true });
      console.error(e);
    }
    finally {
      this.setState({ isSavingQuiz: false });
    }
  }

  _renderSubmitButton = (classes) => {
    return (
      <Box style={{ width: '87%' }}>
        <Button className={classes.submitButton} onClick={this._onSubmit}
          size="large" variant="contained" color="secondary" align="left">      
          Submit Quiz
          <ArrowForward className={classes.buttonIcon} style={{ marginLeft: '16px' }} />
        </Button>
      </Box>
    )
  }

  _renderEmailTextBox = (classes) => {
    return (
      <TextField
          align="left"
          style={{ backgroundColor: 'white', width: '87%' }}
          id="outlined-name"
          label="Your Email"
          fullWidth
          className={classes.textField}
          value={this.state.email}
          onChange={e => this.setState({ email: e.target.value })}
          margin="normal"
          variant="outlined"
        />
    )
  }

  _loadQuiz = async () => {
    try {
      this.setState({ isLoadingQuiz: true });
      // await new Promise(res => setTimeout(res, 3000));
      // const quiz = DEMO_QUIZZES[this.props.match.params.quizId];
      const quiz = await FirebaseUtils.getCreatedQuiz(this.props.match.params.quizId);
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
    const { errorLoadingQuiz, errorSavingQuiz } = this.state;
    errorLoadingQuiz ? 
      this.setState({ errorLoadingQuiz: false }) : 
      errorSavingQuiz && this.setState({ errorSavingQuiz: false });
  }

  _errorDialogRetry = () => {
    const { errorLoadingQuiz, errorSavingQuiz } = this.state;
    this.setState({ errorLoadingQuiz: false });
    errorLoadingQuiz ? this._loadQuiz() : (errorSavingQuiz && this._saveResult());
  }

  _renderErrorDialog = (classes) => {
    const { errorLoadingQuiz, errorSavingQuiz } = this.state;
    return (
      <Dialog
        fullScreen={false}
        open={errorLoadingQuiz || errorSavingQuiz}
        onClose={this._errorDialogCancel}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{errorLoadingQuiz ? 'Loading' : 'Saving'} Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A error occured while we were trying to {errorLoadingQuiz ? 'load' : 'save'} your quiz. Please check your Internet connection {errorLoadingQuiz ? '' : 'and check that you\'ve filled in your email'} then try again.
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

  _renderAnswerableOptions = (classes, id, options, correct, selected) => {
    // return this._renderUnanswerableOptions(classes, options, correct);
    return options.map((option, key) => (
      <ListItem key={key}>
        <Checkbox color="secondary" checked={option === selected} 
          onClick={e => this._selectOption(id, option)} />
        <Typography variant="body1">{option}</Typography>
      </ListItem>
    ));
  }

  _selectOption = (id, option) => {
    const { quiz } = this.state;
    for (let i in quiz.questions) {
      if (quiz.questions[i].id === id) {
        console.log(`Selected option ${option} in question ${id}`);
        quiz.questions[i].selected = option;
        break;
      }
    }
    this.setState({ quiz });
  }

  _renderUnanswerableOptions = (classes, options, correct) => {
    return options.map((option, key) => (
      <ListItem key={key}>
        <Checkbox color="secondary" checked={option === correct} />
        <Typography variant="body1">{option}</Typography>
      </ListItem>
    ));
  }

  _renderViewQuiz = (classes, { name, questions }) => {
    return (
      <List style={{ marginBottom: '16px', width: '90%' }}>
        {
          questions.map(({ id, question, options, correct, selected }, i) => (
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
                        this.state.isTake ?
                        this._renderAnswerableOptions(classes, id, options, correct, selected) :
                        this._renderUnanswerableOptions(classes, options, correct)
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

  _renderSavingDialog = (classes) => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.isSavingQuiz}
        aria-labelledby="loading-dialog-title">
        <DialogTitle id="loading-dialog-title">Saving Your Results</DialogTitle>
        <DialogContent align="center" style={{ padding: '32px', marginBottom: '16px' }}>
          <CircularProgress color="secondary" />
        </DialogContent>
      </Dialog>
    )
  }

  render () {
    const { classes } = this.props;
    const { 
      isLoadingQuiz, quiz, isTake, isView,
      errorLoadingQuiz, linkToOpen 
    } = this.state;

    if (!BlockStackUtils.isSignedInOrPending(this) && isView) {
      return (
        <Redirect to="/sign-in/" />
      )
    }

    if (linkToOpen) {
      return (
        <Redirect to={linkToOpen} />
      )
    }

    // If quiz is being taken then ask for email and name
    return (
      <Box align="center" className={classes.container}>
        <Header>{isView ? (quiz.title || 'Quiz') : `Good Luck In ${quiz.title || 'The Quiz'}`}</Header>
        { isLoadingQuiz && <CircularProgress color="secondary" /> }
        { !isLoadingQuiz && isTake && this._renderEmailTextBox(classes) }
        { 
          quiz.questions ? <MuiThemeProvider theme={theme}>{this._renderViewQuiz(classes, quiz)}</MuiThemeProvider> :
          (errorLoadingQuiz && !isLoadingQuiz) ? <Typography variant="body1" align="center">Error Loading Quiz. Reload the page.</Typography> :
          (!isLoadingQuiz) ? <Typography variant="body1" align="center">Quiz Not Found.</Typography> :
          ''
        }
        { !isLoadingQuiz && isTake && this._renderSubmitButton(classes) }
        { this._renderErrorDialog(classes) }
        { this._renderSavingDialog(classes) }
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
  submitButton: {
    float: 'left !important',
    paddingRight: theme.spacing(2.25),
    paddingLeft: theme.spacing(2.25),
    paddingTop: theme.spacing(1.75),
    paddingBottom: theme.spacing(1.75),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
});

export default withStyles(styles)(ViewQuiz);