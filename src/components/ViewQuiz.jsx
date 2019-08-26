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
    console.log('Submit clicked!');
  }

  _saveResult = async () => {
    const { quiz, email } = this.state;
    try {
      this.setState({ isSavingQuiz: true });
      // await new Promise(res => setTimeout(res, 3000));
      // const quiz = DEMO_QUIZZES[this.props.match.params.quizId];
      // this.setState({ quiz });
      await FirebaseUtils.saveQuizResult(this.props.match.params.quizId, { 
        email,
        score: ScoreUtils.calculateScore(quiz.questions)
      });
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
      <Button className={classes.submitButton} onClick={this._onSubmit}
        size="large" variant="contained" color="secondary" align="left">      
        Create Quiz
        <ArrowForward className={classes.buttonIcon} />
      </Button>
    )
  }

  _renderEmailTextBox = (classes) => {
    return (
      <TextField
          align="left"
          style={{ backgroundColor: 'white' }}
          id="outlined-name"
          label="Email"
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

  _renderAnswerableOptions = (classes, options, correct) => {
    return this._renderAnswerableOptions(classes, options, correct);
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
                        this.state.isTake ?
                        this._renderAnswerableOptions(classes, options, correct) :
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

  render () {
    const { classes } = this.props;
    const { 
      isLoadingQuiz, quiz, isTake, isView,
      errorLoadingQuiz, linkToOpen 
    } = this.state;

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

    // If quiz is being taken then ask for email and name
    return (
      <Box align="center" className={classes.container}>
        <Header>{isView ? (quiz.title || 'Quiz') : `Good Luck In ${quiz.title || 'The Quiz'}`}</Header>
        { isLoadingQuiz && <CircularProgress color="secondary" /> }
        { isTake && this._renderEmailTextBox(classes) }
        { 
          quiz.questions ? <MuiThemeProvider theme={theme}>{this._renderViewQuiz(classes, quiz)}</MuiThemeProvider> :
          (errorLoadingQuiz && !isLoadingQuiz) ? <Typography variant="body1" align="center">Error Loading Quiz. Reload the page.</Typography> :
          (!isLoadingQuiz) ? <Typography variant="body1" align="center">Quiz Not Found.</Typography> :
          ''
        }
        { isTake && this._renderSubmitButton(classes) }
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