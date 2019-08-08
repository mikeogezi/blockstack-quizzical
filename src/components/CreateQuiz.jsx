import React from 'react';

import uuid from 'uuid';
import _ from 'lodash';
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
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  List,
  ListItem,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  TextField
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {
  ExpandMore,
  ArrowForward,
  Close
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
      isSavingQuiz: false,
      errorSavingQuiz: false,
      invalidInputError: false,
      isQuestionsDialogOpen: false,
      title: '',
      focusTitle: '',
      focusQuestions: [],
      quiz: {},
      linkToOpen: '',
      selectedIds: [],
      selectedCounts: []
    };
  }

  _errorDialogCancel = () => {
    this.setState({ errorSavingQuiz: false, invalidInputError: false });
  }

  _errorDialogRetry = () => {
    if (this.state.errorSavingQuiz) {
      this._saveQuiz();
    }
    this.setState({ errorSavingQuiz: false, invalidInputError: false });
  }

  _renderLoadingDialog = (classes) => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.isSavingQuiz}
        aria-labelledby="loading-dialog-title">
        <DialogTitle id="loading-dialog-title">Saving Your Quiz</DialogTitle>
        <DialogContent align="center" style={{ padding: '32px', marginBottom: '16px' }}>
          <CircularProgress color="secondary" />
        </DialogContent>
      </Dialog>
    )
  }

  _renderErrorDialog = (classes) => {
    const { errorSavingQuiz, invalidInputError } = this.state;

    return (
      <Dialog
        fullScreen={false}
        open={errorSavingQuiz || invalidInputError}
        onClose={this._errorDialogCancel}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{ errorSavingQuiz ? 'Saving' : 'Input' } Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            { 
              errorSavingQuiz ? 
              'A error occured while we were save your quiz. Please check your Internet connection then try again.' :
              invalidInputError ?
              'One or more of the inputs have not been supplied properly. Please check your entries then try again.' :
              ''
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {
            errorSavingQuiz &&
            <Button variant="outlined" onClick={this._errorDialogCancel} color="secondary">
              Cancel
            </Button>
          }
          <Button variant="contained" onClick={this._errorDialogRetry} color="primary" autoFocus>
            { errorSavingQuiz ? 'Try Again' : 'Ok' }
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  _renderQuestionsDialog = (classes) => {
    const  { 
      focusTitle: title, focusQuestions: questions, 
      isQuestionsDialogOpen 
    } = this.state;

    return (
      <Dialog
        fullScreen={true}
        style={{ backgroundColor: '#DDD' }}
        open={isQuestionsDialogOpen}
        onClose={e => this.setState({ isQuestionsDialogOpen: false })}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
        <DialogContent style={{ backgroundColor: '#DDD' }}>
          <DialogContentText>
            {isQuestionsDialogOpen && this._renderQuizQuestions(classes, { title, questions })}
          </DialogContentText>
        </DialogContent>
        <DialogActions align="left">
          <Button size="large" variant="contained" color="secondary" onClick={e => this.setState({ isQuestionsDialogOpen: false })} color="primary" autoFocus>
            <Close style={{ marginRight: '16px' }} />
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  _renderExpansionPanel = (classes, title, content) => {
    return (
      <ExpansionPanel
        TransitionProps={{ unmountOnExit: true }} key={title}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls={`panel1a-header-${title}`}
          id={`panel1a-header-${title}`}>
          <Typography className={classes.heading} variant="h6">
            {title}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {content}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }

  _renderTitleInput = (classes) => {
    return (
      <MuiThemeProvider theme={theme}>
        <TextField
          align="left"
          style={{ backgroundColor: 'white' }}
          id="outlined-name"
          label="Title"
          fullWidth
          className={classes.textField}
          value={this.state.title}
          onChange={e => this.setState({ title: e.target.value })}
          margin="normal"
          variant="outlined"
        />
      </MuiThemeProvider>
    )
  }

  _renderQuizSelection = (classes) => {
    return (
      <Card className={classes.card} align="left">
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="button">
              Quiz Templates
            </Typography>
            <br />
            <hr />
            { 
              DEMO_QUIZZES.map(({ title, questions }) => (
                <Button key={title} className={classes.button} align="left"
                  variant="outlined" color="secondary" size="large"
                  onClick={e => {
                    this.setState({
                      isQuestionsDialogOpen: true,
                      focusTitle: title,
                      focusQuestions: questions
                    })
                  }}>
                  {title}
                </Button>
              ))
            }
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }

  _renderSelectionStats = (classes) => {
    const { selectedCounts, selectedIds } = this.state;

    return (
      <Card style={{ marginTop: '8px' }} className={classes.card} align="left">
        <CardActionArea>
          <CardContent>
          <Typography gutterBottom variant="button">
              Selection Info
            </Typography>
            <Typography gutterBottom variant="body2" style={{ marginBottom: '12px' }}>
              <b>{selectedIds.length}</b> Questions Selected
            </Typography>
            <hr />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Quiz Templates</TableCell>
                  <TableCell>Selected</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { 
                  DEMO_QUIZZES.map(({ title, questions }) => (
                    <TableRow key={title}>
                      <TableCell>{title}</TableCell>
                      <TableCell>{selectedCounts[title] || 0}</TableCell>
                      <TableCell>{questions.length || 0}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </CardContent>
        </CardActionArea>
      </Card>
    )
  }

  _renderQuizQuestions = (classes, { title, questions }) => {
    const { selectedIds, selectedCounts } = this.state;
    return (
      <List style={{ marginBottom: '8px' }}>
        {
          questions.map(({ id, question, options, correct }, i) => (
            <ListItem key={id}>
              <Card className={classes.card}>
                <CardActionArea>
                  <CardContent>
                    { 
                      this.state.selectedIds.includes(id) ?
                      <Button 
                        className={classes.selected} variant="contained" color="secondary"
                        onClick={e => 
                          this.setState({ 
                            selectedIds: selectedIds.filter(sId => sId !== id),
                            selectedCounts: { ...selectedCounts, [title]: selectedCounts[title] - 1 }
                          }) 
                        }>
                        Selected
                      </Button> :
                      <Button
                        className={classes.selected} variant="outlined" color="secondary"
                        onClick={e => 
                          this.setState({ 
                            selectedIds: selectedIds.concat(id),
                            selectedCounts: { ...selectedCounts, [title]: (selectedCounts[title] || 0) + 1 }
                          })
                        }>
                        Not Selected
                      </Button>
                    }
                    <hr />
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

  _renderSubmitButton = (classes) => {
    return (
      <Button className={classes.submitButton} onClick={this._onSubmit}
        size="large" variant="contained" color="secondary" align="left">      
        Create Quiz
        <ArrowForward className={classes.buttonIcon} />
      </Button>
    )
  }

  _onSubmit = () => {
    const { selectedIds, title } = this.state;
    if (!selectedIds.length || !title) {
      this.setState({ invalidInputError: true });
      return;
    }
    
    this._saveQuiz(this._getDocument());
  }

  getDocument () {
    const { selectedIds, title } = this.state;
    return {
      id: uuid.v4(),
      title,
      questions: _.flatten(DEMO_QUIZZES
                    .map(({ questions }) => questions))
                    .filter((({ id }) => selectedIds.includes(id)))
    };
  }

  _saveQuiz = async () => {
    try {
      this.setState({ isSavingQuiz: true });
      await new Promise(res => setTimeout(res, 3000));
      this.setState({ linkToOpen: '/app/quizzes/list/' });
    }
    catch (e) {
      this.setState({ errorSavingQuiz: true });
      console.error(e);
    }
    finally {
      this.setState({ isSavingQuiz: false });
    }
  }


  render () {
    const { classes } = this.props;
    const { 
      isSavingQuiz, quiz, 
      errorSavingQuiz, linkToOpen 
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
        <Header>Create Quiz</Header>
        { this._renderTitleInput(classes) }
        { this._renderQuizSelection(classes) }
        { this._renderSelectionStats(classes) }
        { this._renderSubmitButton(classes) }
        { this._renderQuestionsDialog(classes) }
        { this._renderErrorDialog(classes) }
        { this._renderLoadingDialog(classes) }
      </Box>
    );
  }
};

const styles = theme => ({
  container: {
    flexGrow: 1,
    flexWrap: 'wrap'
  },
  submitButton: {
    float: 'left !important',
    paddingRight: theme.spacing(2.25),
    paddingLeft: theme.spacing(2.25),
    paddingTop: theme.spacing(1.75),
    paddingBottom: theme.spacing(1.75),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  button: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  card: {
    width: '100%',
  },
  media: {
    height: '250px',
  },
  buttonIcon: {
    marginLeft: theme.spacing(2)
  },
  iconInButton: {
    marginRight: theme.spacing(2),
  },
  ctaButton: {
    margin: theme.spacing(1)
  },
  buttonIcon: {
    marginLeft: theme.spacing(2)
  },
  iconLink: {
    marginBottom: theme.spacing(0),
    textDecoration: 'none',
    color: 'white'
  },
  selected: {
    marginBottom: theme.spacing(0.5),
    marginLeft: theme.spacing(0)
  }
});

export default withStyles(styles)(ViewQuiz);