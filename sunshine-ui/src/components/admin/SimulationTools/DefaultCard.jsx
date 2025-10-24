import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Typography,
  Paper,
  makeStyles,
  Grid
} from '@material-ui/core';

import {
  Home as HomeIcon,
  
} from '@material-ui/icons';

import registerSVG from '../../../images/svgIcons/Org.svg';
import styles from './styles';

const useStyles = makeStyles(styles);

function DefaultCard(props) {
  const { onClick } = props;
  const { t } = useTranslation('translations');
  const classes = useStyles();

  return (

     <Grid container item xs={12} spacing={4} style={{ margin: '0px' }}>
        <Grid item xl={3} lg={4} sm={6} xs={12}>
         <Link to={'/simulationTools/admin/eesCalculator'}> 
            <Paper
              className={classes.registerCardRoot}
             
              style={{ backgroundImage: `url('${registerSVG}')`}}
            >
              
              <Typography variant="h6" className={classes.registerCardTitle} style={{ fontFamily: 'Open Sans, sans-serif',
                                                                                      fontStyle: 'normal',
                                                                                      fontWeight: '600',
                                                                                      letterSpacing: '0.01071em',
                                                                                      fontSize: '14px',
                                                                                      color: 'black' }}>
                {t('translations:ossMenu.RenovationCostCalculator')}
              </Typography>
            </Paper>
          </Link>
        </Grid>

        <Grid item xl={3} lg={4} sm={6} xs={12}>
          <Link to={'/simulationTools/admin/ees-checklist'}> 
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
                  {t('translations:ossMenu.EESChecklist')}
                </Typography>
              </Paper>
            </Link>
        </Grid>

        <Grid item xl={3} lg={4} sm={6} xs={12}>
         <Link to={'/simulation/admin/refinancability-Checklist'}> 
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
                  {t('translations:ossMenu.EESRefinanceabilityChecklist')}
                </Typography>
              </Paper>
            </Link>
        </Grid>
     </Grid>
  );
}

DefaultCard.propTypes = {
  onClick: PropTypes.func,
};

export default DefaultCard;
