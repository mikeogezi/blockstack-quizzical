import React from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  header: {
    marginBottom: theme.spacing(3)
  }
});

const Header = ({ title, children, classes, ...props }) => {
  return (
    <Typography {...props} className={classes.header} variant="h4" align="center">
      { title || children }
    </Typography>
  );
};

export default withStyles(styles)(Header);