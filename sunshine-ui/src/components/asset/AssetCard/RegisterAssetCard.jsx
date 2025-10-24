import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Paper,
  makeStyles,
} from '@material-ui/core';

import registerSVG from '../../../images/svgIcons/Asset.svg';
import styles from './styles';

const useStyles = makeStyles(styles);

function RegisterAssetCard(props) {
  const { onClick } = props;
  const { t } = useTranslation('translations');
  const classes = useStyles();

  return (
    <Paper
      className={classes.registerCardRoot}
      onClick={onClick}
      style={{ backgroundImage: `url('${registerSVG}')`}}
    >
      <Typography variant="h6" className={classes.registerCardTitle} style={{ fontFamily: 'Open Sans, sans-serif',
                                                                                      fontStyle: 'normal',
                                                                                      fontWeight: '600',
                                                                                      letterSpacing: '0.01071em',
                                                                                      fontSize: '14px',
                                                                                      color: 'black' }}>
        {t('assets.registerAsset')}
      </Typography>
    </Paper>
  );
}

RegisterAssetCard.propTypes = {
  onClick: PropTypes.func,
};

export default RegisterAssetCard;
