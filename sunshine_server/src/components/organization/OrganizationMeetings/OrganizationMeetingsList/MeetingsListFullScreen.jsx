import React, { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  Button,
  Dialog,
  ListItem,
  List,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';

import {
  Close as CloseIcon,
  DeleteForever,
  Fullscreen
} from '@material-ui/icons';

import styles from './styles';

const useStyles = makeStyles(styles);

function MeetingsListFullScreen(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { meetings, viewOnly, handleOpenCloseDelete } = props;
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        className={classes.exportCSV}
        onClick={handleClickOpen}
      >
        <Fullscreen />
      </Button>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={handleClose}
      >
        <AppBar>
          <Toolbar style={{ position: 'relative' }}>
            <Typography>
              {t('translations:meetings.meetings')}
            </Typography>
            <IconButton
              onClick={handleClose}
              className={classes.closeButton}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List style={{ marginTop: 55 }}>
          <ListItem className={`row ${classes.subHeader}`}>
            <div className="col-xs-4">
              {t('translations:meetings.purpose')}
            </div>
            <div className="col-xs-4">
              {t('translations:meetings.location')}
            </div>
            <div className="col-xs-2">
              {t('translations:meetings.date')}
            </div>
          </ListItem>
          {meetings.map((meeting, index) => {
            return (
              <div
                className={classes.listItem}
                key={meeting.ID}
              >
                <ListItem
                  key={index}
                  to={`/meeting/${meeting.ID}`}
                  className={classes.width100}
                  style={{ textDecoration: 'none' }}
                  component={viewOnly ? 'div' : Link}
                >
                  <div className={`col-xs-4 ${classes.listItemCol}`}>
                    {meeting.name}
                  </div>
                  <div className={`col-xs-4 ${classes.listItemCol}`}>
                    {meeting.location}
                  </div>
                  <div className={`col-xs-2 ${classes.listItemCol}`}>
                    {new Date(meeting.date).toLocaleDateString('de-DE')}
                  </div>
                </ListItem>
                <IconButton
                  disabled={viewOnly}
                  className={classes.iconButton}
                  onClick={() => handleOpenCloseDelete(meeting.ID)}
                >
                  <DeleteForever />
                </IconButton>
              </div>
            );
          })}
        </List>
      </Dialog>
    </Fragment>
  );
}

export default MeetingsListFullScreen;