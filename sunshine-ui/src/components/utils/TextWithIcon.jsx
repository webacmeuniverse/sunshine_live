import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'inline-flex',
    alignItems: 'center',

    '& > :first-child': {
      marginRight: theme.spacing(1),
    },
  },
}));

function TextWithIcon(props) {
  const {
    icon,
    children,
    className,
    ...typographyProps
  } = props;

  const classes = useStyles();

  return (
    <Typography
      {...typographyProps}
      className={clsx(classes.root, className)}
    >
      {icon} {children}
    </Typography>
  );
}

TextWithIcon.propTypes = {
  icon: PropTypes.node.isRequired,
};

export default TextWithIcon;
