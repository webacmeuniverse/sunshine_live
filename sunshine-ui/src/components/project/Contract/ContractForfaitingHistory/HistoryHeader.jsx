import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Grid,
  makeStyles,
} from '@material-ui/core';

import UploadFile from '../../../../containers/smartcomponents/UploadFile/UploadFile';
import {
  refetchSingleProject,
  createOrUpdateProject
} from '../../../../actions/projects';

import {
  canEditProject,
  canSignProject
} from '../../../../utils/can';

const useStyles = makeStyles(theme => ({
  buttons: {
    '& .UserTooltip-grow': {
      marginLeft: theme.spacing(1),
    },
  },
  viewButton: {
    marginRight: theme.spacing(1),
  },
}));

function HistoryHeader(props) {
  const {
    onViewChange,
    view,
    project,
    user,
    updateProjectAction,
    refetch,
    disableSign
  } = props;
  const { t } = useTranslation('translations');
  const classes = useStyles();

  const handleViewChange = (v) => {
    window.history.pushState(null, null, `#${v}`);
    onViewChange(v);
  };

  return (
    <Grid container justify="space-between">
      <Grid item className={classes.buttons}>
        <Button
          variant="outlined"
          className={classes.viewButton}
          color={view === 'epc' ? 'primary' : 'default'}
          onClick={() => handleViewChange('epc')}
        >
          {t('projects.epcContracts')}
        </Button>
        <Button
          variant="outlined"
          className={classes.viewButton}
          color={view === 'fa' ? 'primary' : 'default'}
          onClick={() => handleViewChange('fa')}
        >
          {t('projects.signedForfaiting')}
        </Button>
      </Grid>
      <Grid item>
        {canEditProject(project, user) &&
          <div className={classes.uploadContainer}>
            {canSignProject(user, project) && view === 'fa' &&
              <Button
                variant="contained"
                color="primary"
                disabled={project.data.fa_signed || disableSign}
                className={classes.viewButton}
                onClick={() => updateProjectAction({ ID: project._id, fa_signed: true })}
              >
                {t('projects.faHasBeenSigned')}
              </Button>
            }
            <UploadFile
              entity={{
                id: project._id,
                type: 'project',
                uploadType: view === 'epc' ? 'epc contracts' : 'fa contracts'
              }}
              buttonOnly
              canUpload
              onSuccess={() => refetch(project._id)}
            />
          </div>
        }
      </Grid>
    </Grid>
  );
}

export default connect(
  state => ({
    project: state.project.refetchProject,
    user: state.user
  }),
  dispatch => ({
    refetch: (projectID) => dispatch(refetchSingleProject(projectID)),
    updateProjectAction: (data) => dispatch(createOrUpdateProject(data))
  })
)(HistoryHeader);
