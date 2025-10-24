import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
  Grid,
  makeStyles,
} from '@material-ui/core';
import {
  Info as InfoIcon,
} from '@material-ui/icons';
import NavContainer from './../../smartcomponents/navcontainer';
import OSSAdmin from '../../../containers/pages/OSSAdmin/Dashboard/DashboardPage';
import OSSNavContainer from './../../smartcomponents/ossnavcontainer';
import SnackbarNotification from './../../smartcomponents/SnackbarNotification';
import QuickLinks from './QuickLinks';
import CountriesMap from './CountriesMap';
import MarkdownText from '../../../components/utils/MarkdownText';
import UserTooltip from '../../../components/utils/UserTooltip';
import AdminPage from './AdminPage';
import OSSAdminPage from '../OSSAdmin/Dashboard/DashboardPage';

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    display: 'flex',
    flexGrow: 1,
  },
}));

function HomePage(props) {
  const { alerts } = props;

  const classes = useStyles();

  const { t } = useTranslation('translations');

  /* return (
    <React.Fragment>
      <Helmet title={t('navigation.homeTitle')} />
      <NavContainer />
      {alerts && alerts.map((alrt, index) => (
        <SnackbarNotification open alert={alrt} key={index} />
      ))}

      <div className={classes.root}>
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="flex-end"
        >
          <UserTooltip
            action="click"
            icon={<InfoIcon />}
            title={<MarkdownText text={t('tooltips:home.info', { returnObjects: true })} />}
          />
          <CountriesMap />
          <QuickLinks />
        </Grid>
      </div>
    </React.Fragment>
  ); */
  
   if (ossAdmin === true) {
    return (
      <React.Fragment>

        <OSSAdmin />

      </React.Fragment>
    );

  } else {
    return (
      <React.Fragment>

        <Helmet title={t('navigation.homeTitle')} />
        <NavContainer />
        {alerts && alerts.map((alrt, index) => (
          <SnackbarNotification open alert={alrt} key={index} />
        ))}
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="stretch"
          className={classes.root}
        >
          {ossAdmin ? <OSSAdminPage /> : <CountriesMap />}
          <QuickLinks />
        </Grid>
      </React.Fragment>
    );

  }
}

export default connect(
  state => ({
    alerts: state.alerts.pending,
    ossAdmin: state.user.profileInfo.data.is_oss_admin,
  }),
)(HomePage);
