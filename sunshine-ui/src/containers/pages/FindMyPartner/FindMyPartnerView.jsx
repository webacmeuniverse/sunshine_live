import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import NavContainer from '../../smartcomponents/LandingPageNavContainer';
import SnackbarNotification from '../../smartcomponents/SnackbarNotification';
import AssetPublicView from '../../../components/asset/AssetPublicView/AssetPublicView';
import FindMyPartner from './FindMyPartner';

function FindMyPartnerView(props) {
  const { alerts } = props;

  const { toggleLanguage } = props;
  
  
  const {
   
    language,country
   
  } = props;
 
  return (
    <React.Fragment>
      
      <NavContainer />
     <FindMyPartner/>
    </React.Fragment>
  );
}

export default connect(state => ({
  alerts: state.alerts.pending,
}))(FindMyPartnerView);
