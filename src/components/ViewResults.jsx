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
  People,
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
import FirebaseUtils from '../lib/FirebaseUtils';
import Header from './Header';
import { Redirect } from 'react-router-dom';

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
      isLoadingResults: false,
      errorLoadingResults: false,
      results: [],
      linkToOpen: ''
    };
    BlockStackUtils.init(this);
  }

  componentDidMount () {
    this._loadResults();
  }

  _loadResults = async () => {
    try {
      this.setState({ isLoadingResults: true });
      // await new Promise(res => setTimeout(res, 3000));
      // const quizzes = DEMO_QUIZZES;
      const results = await FirebaseUtils.getQuizResults(this.props.match.params.quizId);
      results.sort((lhs, rhs) => lhs.score < rhs.score ? -1 : 1);
      this.setState({ results });
    }
    catch (e) {
      this.setState({ errorLoadingResults: true });
      console.error(e);
    }
    finally {
      this.setState({ isLoadingResults: false });
    }
  }

  _errorDialogCancel = () => {
    this.setState({ errorLoadingResults: false });
  }

  _errorDialogRetry = () => {
    this.setState({ errorLoadingResults: false });
    this._load();
  }

  _renderErrorDialog = (classes) => {
    return (
      <Dialog
        fullScreen={false}
        open={this.state.errorLoadingResults}
        onClose={this._errorDialogCancel}
        aria-labelledby="responsive-dialog-title">
        <DialogTitle id="responsive-dialog-title">Loading Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A error occured while we were trying to load your quiz results. Please check your Internet connection then try again.
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

  _renderQuizResults = (classes, results) => {
    return (
      <List style={{ marginBottom: '16px', width: '90%' }}>
        {
          results.map(({ score, email, time, id }) => (
            <ListItem key={id}>
              <Card className={classes.card}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                      Score: {Number(score).toFixed()}%
                    </Typography>
                    <Typography variant="button" color="textSecondary">
                      Email: <a href={`mailto:${email}`}>{email}</a>
                    </Typography>
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
      isLoadingResults, results, 
      errorLoadingResults, linkToOpen 
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

    return (
      <MuiThemeProvider theme={theme}>
        <Box align="center" className={classes.container}>
          <Header>Quiz Results</Header>
          { isLoadingResults && <CircularProgress /> }
          { 
            results.length ? this._renderQuizResults(classes, results) :
            (errorLoadingResults && !isLoadingResults) ? <Typography variant="body1" align="center">Error Loading Results. Reload the page.</Typography> :
            (!isLoadingResults) ? <Typography variant="body1" align="center">No Results Yet.</Typography> :
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