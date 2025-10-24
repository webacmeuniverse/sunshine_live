import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core';
import {
  Domain as AssetIcon,
  BusinessCenter as OrganizationIcon,
  Equalizer as ProjectIcon,
  Person as UserIcon,
  Notifications as NotificationsIcon,
} from '@material-ui/icons';



import { access as hasAccess } from '../../utils/can';
import SnackbarNotification from '../smartcomponents/SnackbarNotification';
import NavContainer from '../smartcomponents/ossnavcontainer';
import MobileNavContainer from '../smartcomponents/ossMobileNavContainer';
import TopBar from '../../components/ossnavigation/TopBar';
//import NavContainer from '../smartcomponents/navcontainer';
import Tabbable from '../smartcomponents/Tabbable/Tabbable';
import MarkdownText from '../../components/utils/MarkdownText';
import {
  AssetsReport,
  OrganizationsReport,
  ProjectsReport,
  UsersReport,
  SubscribeReport,
} from '../../components/reports';

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

const tabs = [
  {
    hash: '#assets',
    icon: <AssetIcon />,
    labelKey: 'navigation.assets',
    component: AssetsReport,
  },
  {
    hash: '#organizations',
    icon: <OrganizationIcon />,
    labelKey: 'navigation.organizations',
    component: OrganizationsReport,
  },
  {
    hash: '#projects',
    icon: <ProjectIcon />,
    labelKey: 'navigation.projects',
    component: ProjectsReport,
  },
  {
    hash: '#users',
    icon: <UserIcon />,
    labelKey: 'navigation.users',
    component: UsersReport,
    authCheck: 'loggedin',
  },
  { 
    hash: '#subscribe',
    icon: <NotificationsIcon />,
    labelKey: 'navigation.subscribe',
    component: SubscribeReport,
    authCheck:{ admin: true, ossAdmin:false },
  },
];

function ReportsPage(props) {
  const {
    alerts,
    user,
  } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  let tabIndex = 0;
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].hash === window.location.hash) {
      tabIndex = i;
      break;
    }
  }

  const [currentTab, setCurrentTab] = useState(tabIndex);
  const Content = tabs[currentTab].component;

  return (
    <React.Fragment>
       <Helmet title='User Profile | SUNShINE' >
        <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size:14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style> </Helmet>
     <MobileNavContainer/>
     <div className="flex">
              <NavContainer formName='profileUpdate' />
              <div className="content oss-admin">
                <TopBar  pageTitle='translations:ossMenu.Report' />
                <div className="grid grid-cols-12 gap-6">
                   <div className="col-span-12">
                   <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                      <div className="container oss-admin h-auto">
  
                            {alerts && alerts.map((a, index) => (
                              <SnackbarNotification open alert={a} key={index} />
                            ))}

                            <div className={classes.root}>
                              <Tabbable
                                defaultTab={currentTab}
                                onChange={idx => {
                                  window.history.pushState(
                                    '',
                                    window.document.title,
                                    window.location.pathname + tabs[idx].hash,
                                  );

                                  setCurrentTab(idx);
                                }}
                                tabs={tabs.filter(t => !t.authCheck || hasAccess(user, t.authCheck))}
                                tooltip={<MarkdownText text={t('tooltips:reports.info', { returnObjects: true })} />}
                              >
                                <Content />
                              </Tabbable>
                            </div>

                            </div>
                       </section>

                     </div>
                   </div>

                </div>
            </div>
    </React.Fragment>
  );
}

export default connect(
  state => ({
    user: state.user,
    alerts: state.alerts.pending,
  }),
)(ReportsPage);
