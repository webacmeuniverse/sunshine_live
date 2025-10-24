import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  ErrorOutline as ErrorIcon,
  HighlightOff as DismissIcon,
} from '@material-ui/icons';

import TextWithIcon from './TextWithIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: theme.spacing(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
  },
}));

function InternalError(props) {
  const {
    error,
  } = props;

  const { t } = useTranslation('translations');
  const classes = useStyles();

  const errorMSG = JSON.stringify({ message: error?.message, stack: error?.stack });

  return (
    <div className={classes.root}>
      <TextWithIcon
        icon={<ErrorIcon />}
        variant="h5"
      >
        {t('utils.internalErrorTitle')}
      </TextWithIcon>
      <Typography variant="caption">
        {t('utils.internalErrorAction')}
      </Typography>
      <a href={`mailto:sunshinehelp@ekubirojs.lv?subject=${encodeURIComponent(`Platform error occurred at ${window.location.pathname}`)}&body=${encodeURIComponent(`error stack\n\n${errorMSG}`)}`}> {/* eslint-disable-line max-len */}
        sunshinehelp@ekubirojs.lv
      </a>
      <Button
        variant="text"
        startIcon={<DismissIcon color="error" />}
        className={classes.dismissButton}
        href="/"
      >
        {t('utils.dmismissAndNavigateHome')}
      </Button>
    </div>
  );
}

export default InternalError;
