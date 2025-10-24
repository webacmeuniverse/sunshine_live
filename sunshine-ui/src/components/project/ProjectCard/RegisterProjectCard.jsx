import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Paper,
  makeStyles,
} from '@material-ui/core';

import UserTooltip from '../../utils/UserTooltip';
import MarkdownText from '../../utils/MarkdownText';

import styles from './styles';

const useStyles = makeStyles(styles);

function RegisterProjectCard(props) {
  const { onClick, label, tooltip, imgSrc } = props;
  const { t } = useTranslation('translations');
  const classes = useStyles();

  return (
    <div className={classes.registerCardContainer}>
      <UserTooltip
        html
        title={<MarkdownText text={t(tooltip, { returnObjects: true })} />}
        placement="right-start"
      >
        <Paper
          className={classes.registerCardRoot}
          onClick={onClick}
          style={{ backgroundImage: `url('${imgSrc}')` }}
        >
          <Typography variant="h6" className={classes.registerCardTitle} style={{ fontFamily: 'Open Sans, sans-serif',
                                                                                      fontStyle: 'normal',
                                                                                      fontWeight: '600',
                                                                                      letterSpacing: '0.01071em',
                                                                                      fontSize: '14px',
                                                                                      color: 'black' }}>
            {t(label)}
          </Typography>
        </Paper>
      </UserTooltip>
    </div>
  );
}

RegisterProjectCard.propTypes = {
  onClick: PropTypes.func,
};

export default RegisterProjectCard;
