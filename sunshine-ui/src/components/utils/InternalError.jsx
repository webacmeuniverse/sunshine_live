import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Button,
  Typography,
  makeStyles,
  Dialog,
  DialogContent,
  withStyles,
} from '@material-ui/core';
import {
  ErrorOutline as ErrorIcon,
  HighlightOff as DismissIcon,
} from '@material-ui/icons';

import TextWithIcon from './TextWithIcon';
import SunshineLogo from '../../images/Sunshine.png';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '60px !important',
    backgroundColor: '#eff2f6',
},
logo: {
    width: '20%',
},
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
        <Dialog fullScreen open>
            <DialogContent className={classes.container}>
                <img src={SunshineLogo} className={classes.logo} alt='Sunshine circle logo' />
                <Typography variant="h1" gutterBottom>404</Typography>
                <Typography variant="h4" gutterBottom> Not Found</Typography>
                <Button component={Link} to="/" variant="contained" color="primary" size="large">
                    Go back to home
                </Button>
            </DialogContent>
        </Dialog>
    // <div className={classes.root}>
    //   <TextWithIcon
    //     icon={<ErrorIcon />}
    //     variant="h5"
    //   >
    //     {t('utils.internalErrorTitle')}
    //   </TextWithIcon>
    //   <Typography variant="caption">
    //     {t('utils.internalErrorAction')}
    //   </Typography>
    //   <a href={`mailto:sunshinehelp@ekubirojs.lv?subject=${encodeURIComponent(`Platform error occurred at ${window.location.pathname}`)}&body=${encodeURIComponent(`error stack\n\n${errorMSG}`)}`}> {/* eslint-disable-line max-len */}
    //     sunshinehelp@ekubirojs.lv
    //   </a>
    //   <Button
    //     variant="text"
    //     startIcon={<DismissIcon color="error" />}
    //     className={classes.dismissButton}
    //     href="/"
    //   >
    //     {t('utils.dmismissAndNavigateHome')}
    //   </Button>
    // </div>
  );
}

export default InternalError;
