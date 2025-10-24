import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import NavContainer from '../../smartcomponents/LandingPageNavContainer';
import SnackbarNotification from '../../smartcomponents/SnackbarNotification';
import AssetPublicView from '../../../components/asset/AssetPublicView/AssetPublicView';
import Matchmaking from './Matchmaking';

function MatchmakingView(props) {
  const {
    alerts,
  } = props;

  return (
    <React.Fragment>
      
      <NavContainer />
     <Matchmaking/>
    </React.Fragment>
  );
}

export default connect(state => ({
  alerts: state.alerts.pending,
}))(MatchmakingView);
