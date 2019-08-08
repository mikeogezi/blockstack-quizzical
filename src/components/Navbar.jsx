import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  SwipeableDrawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import {
  Apps,
  Info,
  Money,
  OpenInNew,
  NewReleases,
  Phonelink,
  BusinessCenter,
  AccountBalance,
  Favorite,
  Movie,
  DirectionsRun,
  PersonAdd,
  ExitToApp,
  Home
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { 
  APP_NAME, 
  CATEGORIES 
} from '../constants/appInfo';
import { connect } from 'react-redux';
import { UserSession } from 'blockstack';
import BlockStackUtils from '../lib/BlockStackUtils';
import { 
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/styles';

const categories = CATEGORIES;

class Navbar extends React.Component {
  constructor (props) {
    super(props);

    this.state = { isDrawerOpen: false };
    BlockStackUtils.init(this);
  }

  _getMenu (classes) {
    return [
      { title: 'Log Out', icon: <ExitToApp className={classes.iconInButton} />, link: '/log-out/', div: true },
      { title: 'Sign In', icon: <OpenInNew className={classes.iconInButton} />, link: '/sign-in/', div: true },
      { title: 'Home', icon: <Home className={classes.iconInButton} />, link: '/app/', div: true },
      // { title: 'Breaking News', icon: <NewReleases className={classes.iconInButton} />, link: '/app/categories/breaking/', min: true },
      // { title: 'Technology', icon: <Phonelink className={classes.iconInButton} />, link: '/app/categories/technology/', min: true },
      // { title: 'Politics', icon: <Info className={classes.iconInButton} />, link: '/app/categories/politics/', min: true },
      // { title: 'Business', icon: <BusinessCenter className={classes.iconInButton} />, link: '/app/categories/business/', min: true },
      // { title: 'Science', icon: <AccountBalance className={classes.iconInButton} />, link: '/app/categories/science/', min: true },
      // { title: 'Energy', icon: <Info className={classes.iconInButton} />, link: '/app/categories/energy/', min: true },
      // { title: 'Health', icon: <Favorite className={classes.iconInButton} />, link: '/app/categories/health/', min: true },
      // { title: 'Entertainment', icon: <Movie className={classes.iconInButton} />, link: '/app/categories/entertainment/', min: true },
      // { title: 'Education', icon: <Info className={classes.iconInButton} />, link: '/app/categories/education/', min: true },
      // { title: 'Sports', icon: <DirectionsRun className={classes.iconInButton} />, link: '/app/categories/sports/', min: true, div: true },
    ];
  }

  _shouldShow = (title) => {
    if ((title === 'Log Out' || title === 'Add Friend') 
        && BlockStackUtils.isSignedInOrPending(this)) {
      return 'block';
    }
    else if (title === 'Sign In' && !BlockStackUtils.isSignedInOrPending(this)) {
      return 'block';
    }
    else if (title === 'Home' || categories.includes(title)) {
      return 'block'
    }
    else {
      return 'none';
    }
  }

  _closeDrawer = () => this.setState({ isDrawerOpen: false });

  _openDrawer = () => this.setState({ isDrawerOpen: true });

  _renderSiwpeableDrawer = (classes) => {
    return (
      <SwipeableDrawer
        open={this.state.isDrawerOpen} onOpen={this._openDrawer} onClose={this._closeDrawer}>
        <Box onClick={this._closeDrawer} onKeyDown={this._closeDrawer}> 
          <List>
            {
              this._getMenu(classes).map(({ title, icon, link, div, min }) => (
                <Box key={title} display={this._shouldShow(title)}>
                  <ListItem button color="inherit" style={{ marginRight: '16px' }}>
                    <Link to={link}><ListItemIcon>{icon}</ListItemIcon></Link>
                    <Link
                      style={{ textDecoration: 'none', color: 'inherit' }}
                      to={link}>
                      <ListItemText primary={title} />
                    </Link>
                  </ListItem>
                  { div && <Divider /> && <Divider /> }
                </Box>
              ))
            }
          </List>
        </Box>
      </SwipeableDrawer>
    )
  }

  _renderToolbarMenu = (classes) => {
    const getDisplay = (title) => 
      this._shouldShow(title) === 'block' ? { xs: 'none', sm: 'block', md: 'block' } : 'none';

    return this._getMenu(classes).map(({ title, icon, link, min, div }) => (
      <Box display={min ? 'none' : getDisplay(title)} key={title}>
        <Button color="inherit">
          <Link className={classes.iconLink} to={link}>
            {icon}
          </Link>
          <Link className={classes.link} to={link}>
            {title}
          </Link>
        </Button>
      </Box>
    ))
  }

  render () {
    const { classes } = this.props;

    return (
      <Box className={classes.root}>
        <AppBar position="static" color="secondary" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton onClick={this._openDrawer} edge="start" className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              <b><Link className={classes.link} to="/">{APP_NAME}</Link></b>
            </Typography>
            { this._renderToolbarMenu(classes) }
          </Toolbar>
        </AppBar>
        { this._renderSiwpeableDrawer(classes) }
      </Box>
    );
  }
};

const styles = (theme => ({
  root: {
    flexGrow: 1
  },
  toolbar: {
    color: '#FF0066'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: '#FFF'
  },
  iconInButton: {
    marginRight: theme.spacing(1),
  },
  link: {
    textDecoration: 'none',
    color: '#FF0066'
  },
  iconLink: {
    marginBottom: theme.spacing(-0.5),
    textDecoration: 'none',
    color: '#FF0066'
  }
}));

const mapStateToProps = state => {
  return { signedIn: state.signedIn };
};

export default connect(mapStateToProps)(withStyles(styles)(Navbar));