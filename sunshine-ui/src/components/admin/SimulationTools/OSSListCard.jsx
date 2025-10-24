import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  makeStyles,
  
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { legalForms, isResidentsCommunity } from '../../../constants/legalStatusTypes';
import StatusBadge from '../../utils/StatusBadge';
import ApplyToOrganization from '../../organization/ApplyToOrganization/ApplyToOrganization';
import OrganizationLogo from '../../organization/OrganizationLogo';

import styles from './styles';

const useStyles = makeStyles(styles);

function OSSListCard(props) {
    
  const {
    data,
    withApplyButton,
    withStatusBadge,
  } = props;
  
  const classes = useStyles();
  const { t } = useTranslation('translations');

  return (
    <Card className={classes.root}>
      <Link
        to={'organization/' + data.organization_id}
        className={classes.content}
      >
        <CardHeader
          avatar={
            <div className={classes.logoContainer}>
              <OrganizationLogo organization={data} className={classes.logo} />
            </div>
          }
        
          title={data.name}
          subheader={data.email}
        />
        
        <CardContent>
          <Grid container alignItems="center">
                              
           
            <Grid item xs={12}>
            <Link to={'/preview/renovation-cost-calculator/' + data.user_id}> <Button variant="contained" color="primary" style={{ fontSize: '11px',padding: '4px 8px', borderRadius: '0px' }}>{t('translations:ossMenu.RenovationCostCalculator')}</Button></Link>           
            </Grid>
            

            <Grid item xs={12} style={{ padding: '5px'}}>
            </Grid>
            <Grid item xs={12}>
            <Link to={'/preview/refinancability-Checklist/' + data.user_id}> <Button variant="contained" color="primary" style={{ fontSize: '11px',padding: '4px 8px', borderRadius: '0px' }}>{t('translations:ossMenu.EESRefinanceabilityChecklist')}</Button></Link>
            </Grid>

            <Grid item xs={12} style={{ padding: '5px'}}>
            </Grid>
            <Grid item xs={12}>           
            <Link to={'/preview/ees-checklist/' + data.user_id}> <Button variant="contained" color="primary" style={{ fontSize: '11px',padding: '4px 8px', borderRadius: '0px' }}>{t('translations:ossMenu.EESChecklist')}</Button></Link>        
            </Grid>
          </Grid>
        </CardContent>
      </Link>
      {withApplyButton && (
        <CardActions>
          <ApplyToOrganization organization={data} />
        </CardActions>
      )}
    </Card>
  );
}

OSSListCard.propTypes = {
  withApplyButton: PropTypes.bool,
  withStatusBadge: PropTypes.bool,
  data: PropTypes.object.isRequired
};

OSSListCard.defaultProps = {
  withApplyButton: false,
  withStatusBadge: true,
};

export default OSSListCard;
