import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core';
import {
  Subject as SubjectIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
} from '@material-ui/icons';

import TopBar from '../../components/ossnavigation/TopBar';
import SnackbarNotification from '../smartcomponents/SnackbarNotification';
import MobileNavContainer from '../smartcomponents/ossMobileNavContainer';
import NavContainer from '../smartcomponents/ossnavcontainer';
import Tabbable from '../smartcomponents/Tabbable/Tabbable';
import NotificationsList from '../../components/utils/Notifications/NotificationsList';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    marginTop: 10,
    padding: 20,
    width: '100%',
    '& .MuiListItem-root': {
      borderBottom: `1px solid ${theme.palette.divider}`,
      '&:last-child': {
        borderBottom: 0,
      },
      '&:hover': {
        backgroundColor: theme.palette.background.default,
      },
    },
  },
}));

function ProfileNotificationsPage(props) {
  const { alerts } = props;
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState(window.location.hash === '#seen' ? 1 : 0);
  const { t } = useTranslation('translations');
const {  userdata } = props;
  return (
    <React.Fragment>
      <div className={classes.root}>
       <Helmet title="Energy Savings Calculator | SUNShINE">
    <style>{
    'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
    }</style>
</Helmet>
<MobileNavContainer/>
   <div className="flex">
        <NavContainer formName='profileUpdate' />
        {alerts && alerts.map((a, index) => (
        <SnackbarNotification open alert={a} key={index} />
      ))}
        <div className="content oss-admin">
            <TopBar  userdata={userdata} pageTitle='Notifications' subTitle=""/>
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                   <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                      <div className="container oss-admin h-auto">

                      <Tabbable
          defaultTab={currentTab}
          onChange={idx => {
            window.history.pushState(
              '',
              window.document.title,
              window.location.pathname + (idx === 0 ? '' : '#seen'),
            );

            setCurrentTab(idx);
          }}
          tabs={[
            { label: t('notifications.titleUnread'), icon: <SubjectIcon /> },
            { label: t('notifications.titleRead'), icon: <PlaylistAddCheckIcon /> },
          ]}
        >
          <NotificationsList useWindowScroll seen={currentTab === 1} />
        </Tabbable>
         
          </div>
                       </section>

                     </div>
                   </div>

               
          </div>
          
        </div>
    
      
    </div>
   
     
    
    </React.Fragment>
  );
}

export default connect(
  state => ({
    alerts: state.alerts.pending,
    userdata: state.user.profileInfo.data,
  }),
)(ProfileNotificationsPage);
