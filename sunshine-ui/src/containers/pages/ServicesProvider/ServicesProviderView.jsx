import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import NavContainer from '../../smartcomponents/LandingPageNavContainer';
import SnackbarNotification from '../../smartcomponents/SnackbarNotification';
import AssetPublicView from '../../../components/asset/AssetPublicView/AssetPublicView';
import ServicesProvider from './ServicesProvider';

function ServicesProviderView(props) {
  const {
    alerts,
  } = props;
  
  const { t } = useTranslation('operatorsPage');
  return (
    <React.Fragment>
      
      <NavContainer />
     <ServicesProvider/>
    </React.Fragment>
  );
}

export default connect(state => ({
  alerts: state.alerts.pending,
}))(ServicesProviderView);
