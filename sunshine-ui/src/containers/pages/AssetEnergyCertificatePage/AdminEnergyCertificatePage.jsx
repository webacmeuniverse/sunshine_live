import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import NavContainer from '../../smartcomponents/ossnavcontainer';
import MobileNavContainer from '../../smartcomponents/ossMobileNavContainer';
import TopBar from '../../../components/ossnavigation/TopBar';
//import NavContainer from '../../smartcomponents/navcontainer';
import SnackbarNotification from '../../smartcomponents/SnackbarNotification';
import AdminAssetPublicView from '../../../components/asset/AssetPublicView/AdminPublicEnergyCertificateInfo';
import {withTranslation, useTranslation } from 'react-i18next';

function AdminEnergyCertificatePage(props) {
  const {
    alerts,
  } = props;
  const { t } = useTranslation('translations');
  return (
    <React.Fragment>
     
      <Helmet title='Energy Service Companies | SUNShINE' >
        <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style> </Helmet>
          <MobileNavContainer/>
            <div className="flex">
                    <NavContainer formName='profileUpdate' />
                    <div className="content oss-admin">
                      <TopBar pageTitleAction="/assets" subTitleAction=""  pageTitle={t('translations:ossMenu.Assets')} subTitle='EnergyCertificate'/>
                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12">
                        <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                            <div className="container oss-admin h-auto">
                                  {alerts && alerts.map((a, index) => (
                                      <SnackbarNotification open alert={a} key={index} />
                                    ))}
                                    <AdminAssetPublicView  />
                              </div>
                            </section>
                          </div>
                        </div>
                  </div>
              </div>
    </React.Fragment>
  );
}

export default connect(state => ({
  alerts: state.alerts.pending,
}))(withTranslation('translations')(AdminEnergyCertificatePage) );
