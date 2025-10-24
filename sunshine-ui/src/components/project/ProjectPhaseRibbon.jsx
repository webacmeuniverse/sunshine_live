import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  makeStyles,
} from '@material-ui/core';

import { getProjectPhase } from '../../constants/milestones';

const useStyles = makeStyles({
  root: {
    top: -35,
    right: -10,
    position: 'relative',
  },
  labelWrapper: {
    borderRadius: 4,
    padding: '4px 8px',
    fontSize: 14,
    color: '#ffffff',
  },
  pending: {
    backgroundColor: '#F7981C',
  },
  valid: {
    backgroundColor: '#45B854',
  },
  declined: {
    backgroundColor: '#ff0000',
  },
  registered: {
    backgroundColor: '#3366ff',
  },
});

function ProjectPhaseRibbon(props) {
  const { project } = props;

  const classes = useStyles();

  const { t } = useTranslation('translations');

  if (project.milestone === 'zero') {
    return (
      <div className={classes.root}>
        <span className={clsx(classes.labelWrapper, classes.registered)}>
          {t('translations:projects.ZERO')}
        </span>
      </div>
    );
  }

  const phase = getProjectPhase(project, t);
  let className;
  switch (phase.phase) {
    case 'zero':
      className = classes.registered;
      break;
    case 'aquisition':
      className = classes.valid;
      break;
    case 'work':
      className = classes.valid;
      break;
    case 'monitoring':
      className = classes.valid;
      break;
    case 'closed':
      className = classes.declined;
      break;
    default:
      break;
  }

  return (
    <div className={classes.root}>
      <span className={clsx(classes.labelWrapper, className)}>
        {phase.label}
      </span>
    </div>
  );
}

export default ProjectPhaseRibbon;
