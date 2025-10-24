import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Hidden,
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Home as HomeIcon,
  BusinessCenter as OrganizationIcon,
  Business as AssetIcon,
  Equalizer as ProjectIcon,
  Security as AdminIcon,
  TableChart as TableChartIcon,
} from '@material-ui/icons';
import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@material-ui/lab';

import { getMyOrganizations as getMyOrganizationsAction } from '../../actions/organizations';
import { getMyProjects as getMyProjectsAction } from '../../actions/projects';
import { isResidentsCommunity } from '../../constants/legalStatusTypes';
import PrivacyPolicyDialog from '../utils/PrivacyPolicyDialog';
import GDPRDialog from '../utils/GDPR/GDPRDialog';
import CountryRolesDialog from '../utils/CountryRolesDialog/CountryRolesDialog';
import PopUp from '../utils/PopUp';
import Input from '../utils/Input';
import { access as hasAccess } from '../../utils/can';
import logoIMG from '../../images/Sunshine-Logo-Platform.png';
import logoBannerIMG from '../../images/Sunshine-Logo-FB1200x627.png';
import finEERGoDomIMG from '../../images/Logo-FinEERGoDom-H-300x54.png';
import europe from '../../images/flags/europe.svg';
import MeetingRegister from '../organization/OrganizationMeetings/OrganizationMeetingsRegister/MeetingRegister';

import { LV, EN, BG, SK, AT, RO, PL, GER, IT, PT, FR } from '../../components/utils/SVGflags';
import Logo_europa_main from '../../images/1SUNShiNE_Main_footer.png';
import language_icon from '../../styles/assets/images/language-icon.png';
import { withStyles } from '@material-ui/core/styles';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const menuItems = [
  {
    url: '/',
    exact: true,
    titleKey: 'landingPage:menu.RESIDENTS',
    icon: <HomeIcon />,
  },
  {
    url: '/operators',

    titleKey: 'landingPage:menu.SERVICESPROVIDER',
    icon: <OrganizationIcon />,
  },
  // {
  //   url: '/ees_calculator',
  //   matchеsRegExp: new RegExp('^/ees_calculator'),
  //   titleKey: 'landingPage:menu.EESCALCULATOR',
  //   icon: <OrganizationIcon />,
  //   authCheck: 'loggedin',
  // },


  {
    url: '/find-my-partner',
    matchеsRegExp: new RegExp('^/find-my-partner'),
    titleKey: 'landingPage:menu.FindMyPartner',
    icon: <OrganizationIcon />,
  },
  {
    url: '#',
    matchеsRegExp: new RegExp('^/ees-checklist'),
    titleKey: 'landingPage:menu.SIMULATIONTOOL',
    icon: <OrganizationIcon />,
  },
  {
    url: '/resources',

    titleKey: 'landingPage:menu.RESOURCES',
    icon: <OrganizationIcon />,
  },

];


function NavigationDrawer(props) {
  const {
    user,
    organization,
    project,
    getMyOrganizations,
    getMyProjects,
    mobileOpen,
    onMobileClose,
    language,
    loggedMenu,
    country

  } = props;

  const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
  
  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });
  
  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);
  
  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(1),
    },
  }))(MuiDialogActions);
 


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  let menu_path = window.location.pathname.split('/')[1];
  const { t } = useTranslation('landingPage');

  const langNode = () => {
    if (language.includes('en'))
      return (<EN width={21} height={21} padding={0} />)
    else if (language.includes('lv'))
      return (<LV width={21} height={21} padding={0} />);
    else if (language.includes('bg'))
      return (<BG width={21} height={21} padding={0} />);
    else if (language.includes('sk'))
      return (<SK width={21} height={21} padding={0} />);
    else if (language.includes('at'))
      return (<AT width={21} height={21} padding={0} />);
    else if (language.includes('ro'))
      return (<RO width={21} height={21} padding={0} />);
    else if (language.includes('pl'))
      return (<PL width={21} height={21} padding={0} />);
    else if (language.includes('it'))
      return (<IT width={21} height={21} padding={0} />);
    else if (language.includes('de'))
      return (<GER width={21} height={21} padding={0} />);
    else if (language.includes('pt'))
      return (<PT width={21} height={21} padding={0} />);
    else if (language.includes('fr'))
      return (<FR width={21} height={21} padding={0} />);
    else
      return (<img src={language_icon} alt="" style={{ maxWidth: 'unset' }} />);
  }

  const countryNode = () => {
    if (country.includes('Italy'))
      return ("Italy");
    else if (country.includes('Germany'))
      return ("Germany");
    else if (country.includes('Portugal'))
      return ("Portugal");
    else if (country.includes('France'))
      return ("France");
    else if (country.includes('Latvia'))
      return ("Latvia");
    else if (country.includes('Poland'))
      return ("Poland");
    else if (country.includes('Spain'))
      return ("Spain");
    else if (country.includes('Lithuania'))
      return ("Lithuania");
    else if (country.includes('Austrian'))
      return ("Austrian");
    else
      return '';
  }
  return (

    <React.Fragment>

      <nav className="navbar navbar-expand-md">
        <div className="container" >
          <a className="navbar-brand" href="#">
            <Link to={`/`} ><img src={Logo_europa_main} alt="EUROPA" style={{ maxWidth: 'unset', height: '65px' }} /></Link>
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
            aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list"
              viewBox="0 0 16 16">
              <path fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
            </svg>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExampleDefault">
            <MenuList open disablePadding component="ul" className="navbar-nav mr-auto" >
              {menuItems.map((mi, i) => {
                if (!hasAccess(user, mi.authCheck)) {
                  return null;
                }
                if (mi.divider) {
                  return <Divider variant="middle" key={i} />;
                }
                const { url, exact, icon, titleKey, matchеsRegExp } = mi;
                return (
                  <li className="nav-item" key={i}  >
                    <MenuItem key={url} component={NavLink} to={url} exact={Boolean(exact)}>
                      {(() => {
                        if (t(titleKey) === 'SIMULATION TOOLS' || t(titleKey) === 'OUTIL DE SIMULATION' || t(titleKey) === 'NARZĘDZIA SYMULACYJNE'  || t(titleKey) === 'SIMULĀCIJAS RĪKS' || t(titleKey) === 'Strumento di simulazione' || t(titleKey) === 'SIMULATION' || t(titleKey) === 'FERRAMENTA DE SIMULAÇÃO') {
                          return <ListItemText style={{ textTransform: 'uppercase' }}>{t(titleKey)}  &#9662;</ListItemText>
                        } else {
                          return <ListItemText style={{ textTransform: 'uppercase' }}>{t(titleKey)} </ListItemText>
                        }
                      })()}
                    </MenuItem>
                    {(() => {
                      if (t(titleKey) === 'SIMULATION TOOLS' || t(titleKey) === 'OUTIL DE SIMULATION' || t(titleKey) === 'NARZĘDZIA SYMULACYJNE' || t(titleKey) === 'SIMULĀCIJAS RĪKS' || t(titleKey) === 'Strumento di simulazione' || t(titleKey) === 'SIMULATION' || t(titleKey) === 'FERRAMENTA DE SIMULAÇÃO') {
                        if (!hasAccess(user, 'loggedin')) {
                          return <ul className="dropdown">
                            {/* <li style={{ padding: '1px 9px' }}>
                              <Link to="/building-calculator" style={{ textTransform: 'uppercase', width: '100%' }} >{t('landingPage:menu.BUILDINGCALCULATOR')}</Link>
                            </li> */}
                            <li style={{ padding: '1px 9px', textTransform: 'uppercase', width: '100%' }}><Link to="#" onClick={handleClickOpen} style={{ lineHeight: '20px' }}>{t('translations:ossMenu.OTHERTOOLS')} <span style={{float: 'right'}}>&#9662; </span></Link></li>
                            {/* <li style={{ padding: '1px 9px',textTransform: 'uppercase',width: '100%'  }}><Link to="/ees-checklist" style={{ lineHeight:'20px' }}>{t('landingPage:menu.EESCHECKLIST')}</Link></li>
                                  <li style={{ padding: '1px 9px',textTransform: 'uppercase' ,width: '100%'  }}><Link to="/ees-refinancability-checklist" style={{ lineHeight:'20px' }}>{t('landingPage:menu.EESREFINANCEABILITYCHECKLIST')}</Link></li>
                                  <li style={{ padding: '1px 9px',textTransform: 'uppercase',width: '100%'   }}><Link to="/building-calculator" style={{ lineHeight:'20px' }}>{t('landingPage:menu.BUILDINGCALCULATOR')}</Link></li>
                                   <li style={{ padding: '1px 9px',textTransform: 'uppercase',width: '100%'   }}><Link to="#" data-toggle="modal" data-target="#otherTools" style={{ lineHeight:'20px' }}>{t('landingPage:menu.OTHERTOOLS')}</Link></li> 
                                   <li style={{ padding: '1px 9px',textTransform: 'uppercase',width: '100%'   }}><Link to="/building-calculator" style={{ lineHeight:'20px' }}>{t('landingPage:menu.BUILDINGCALCULATOR')}</Link></li>
                                                    */}
                          </ul>
                        } else {
                          return <ul className="dropdown">
                            <li style={{ padding: '1px 9px', textTransform: 'uppercase', width: '100%' }}><Link to="/ees-checklist" style={{ lineHeight: '20px' }}>{t('landingPage:menu.EESCHECKLIST')}</Link></li>
                            <li style={{ padding: '1px 9px', textTransform: 'uppercase', width: '100%' }}><Link to="/ees-refinancability-checklist" style={{ lineHeight: '20px' }}>{t('landingPage:menu.EESREFINANCEABILITYCHECKLIST')}</Link></li>
                            {/* <li style={{ padding: '1px 9px',textTransform: 'uppercase',width: '100%'   }}><Link to="/building-calculator" style={{ lineHeight:'20px' }}>{t('landingPage:menu.BUILDINGCALCULATOR')}</Link></li> */}
                            <li style={{ padding: '1px 9px', textTransform: 'uppercase', width: '100%' }}><Link to="/ees_calculator" style={{ lineHeight: '20px' }}>{t('landingPage:menu.EESCALCULATOR')}</Link></li>
                            <li style={{ padding: '1px 9px', textTransform: 'uppercase', width: '100%' }}><Link to="#" onClick={handleClickOpen} style={{ lineHeight: '20px' }}>{t('translations:ossMenu.OTHERTOOLS')} <span style={{float:'right'}}>&#9662; </span></Link></li>
                          </ul>
                        }
                      }
                    })()}
                  </li>
                );
              })}



              <li className="nav-item  ml-1 pull-right">

              {user.isAuthenticated != '' ? (
                  <MenuItem

                    key={'/projects'}
                    component={NavLink}
                    to={'/projects'}

                  >
                    {(() => {
                      if (menu_path !== 'operators') {
                        return <ListItemText className="btn btn-primary btn-default btn-sm" style={{ textTransform: 'uppercase', color: '#fff !important', borderColor: 'transparent', fontSize: '0.72em !important', fontWeight: '700 !important', lineHeight: '1.5 !important', boxShadow: 'none' }}>{t('landingPage:menu.Assisttomyproject')}</ListItemText>

                      }
                    })()}


                  </MenuItem>
                ) : (
                  <MenuItem

                    key={'/go-to-my-project'}
                    component={NavLink}
                    to={'/go-to-my-project'}

                  >
                    {(() => {
                      if (menu_path !== 'operators') {
                        return <ListItemText className="btn btn-primary btn-default btn-sm" style={{ textTransform: 'uppercase', color: '#fff', borderColor: 'transparent', fontSize: '0.72em', fontWeight: '700', lineHeight: '1.5', boxShadow: 'none' }}>{t('landingPage:menu.Assisttomyproject')}</ListItemText>
                      }
                    })()}
                  </MenuItem>
                )}


              </li>

              <li className="nav-item  ml-1 pull-right">
                {user.isAuthenticated != '' ? (
                  <MenuItem key={'/dashboard'} component={NavLink} to={'/dashboard'}  >

                    <ListItemText className="btn btn-primary btn-default btn-sm" style={{ textTransform: 'uppercase', color: '#fff !important', borderColor: 'transparent', fontSize: '0.72em !important', fontWeight: '700 !important', lineHeight: '1.5 !important', boxShadow: 'none' }}>
                      {t('landingPage:menu.MyDashboard')}
                      </ListItemText>
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={'/login'}
                    component={NavLink}
                    to={'/login'}
                  >
                    <ListItemText className="btn btn-primary btn-default btn-sm" style={{ textTransform: 'uppercase', color: '#fff', borderColor: 'transparent', fontSize: '0.72em', fontWeight: '700', lineHeight: '1.5', boxShadow: 'none' }}>{t('landingPage:menu.Login')}</ListItemText>
                  </MenuItem>
                )}
              </li>
              <li className="nav-item  ml-1 pull-right" style={{ width: '100px', textAlign: 'center' }}>
                <span style={{ textTransform: 'uppercase', display: 'inline-block', lineHeight: '64px', fontFamily: "'Open Sans', sans-serif", fontStyle: 'normal', fontWeight: '600', fontSize: '11.50833px', color: 'rgba(35, 31, 32, 0.5)' }}>
                  {language} - {countryNode()}
                </span>
              </li>
              <li className="nav-item  ml-1 pull-right" style={{ width: '100px', textAlign: 'center' }}>
                <a className="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="modal" data-target="#exampleModalCenter">
                  {langNode()}
                </a>
              </li>
            </MenuList>
          </div>

          {/* <div className="float-right drop-hLang" style={{ width: '100%'}}>
            <div className="nav-item dropdown hLangSwitch">          
              <a className="nav-link dropdown-toggle" href="#" id="dropdown01" style={{ width: '100px'}} data-toggle="modal" data-target="#exampleModalCenter">
              { langNode()}                   
              </a>              
            </div>
          </div> */}




        </div>
      </nav>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" style={{ background: '#FCCB00' }} onClose={handleClose}>
        <h3 class='col-12 modal-title text-center' style={{ color: '#fff',fontSize: '1em',fontWeight: '600',fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',fontStyle: 'normal', }}>
                {t('translations:ossMenu.OTHERTOOLS')}
                
              </h3>
        </DialogTitle>
        <DialogContent dividers>
        <Typography gutterBottom>
        <p className="mb-3" style={{ fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '500', fontSize: '16.0073px', lineHeight: '32px', textAlign: 'center', color: '#4B4B4A' }}>{t('translations:ossMenu.otherToolsTitle')}</p>
        </Typography>
          <Typography gutterBottom>
          <div className="row mt-5" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <div className="col-md-12 mb-4 ">
                   <Link to="/building-calculator" type="button" style={{ background: '#EAEBED', fontWeight: '600' }} id="otherToolsButton" className="button  w-100 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-2" >{t('translations:ossMenu.BuildingCalculator')}</Link>
                </div>
                <div className="col-md-12 mb-4 ">
                  <Link to="/financial-calculator" type="button" style={{ background: '#EAEBED', fontWeight: '600' }} id="otherToolsButton" className="button  w-100 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-2" >{t('translations:ossMenu.CostEstimationCalculator')}</Link>
                </div>
                <div className="col-md-12 mb-4 ">
                  <Link to="/national-benchmarking" type="button" style={{ background: '#EAEBED', fontWeight: '600' }} id="otherToolsButton" className="button  w-100 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-2" >{t('translations:ossMenu.NationalBenchmarking')}</Link>
                </div>
              </div>
          </Typography>
         
        
        </DialogContent>
        
      </Dialog>
      {/* <div className="modal fade" id="otherTools" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content" style={{ width: '516px', height: '400px' }}>
            <div className="modal-header" style={{ background: '#FCCB00' }}>
              <h3 class='col-12 modal-title text-center' style={{ textTransform: 'uppercase', fontFamily: 'Poppins', fontStyle: 'normal', fontWeight: 'bold', fontSize: '19.1691px', color: '#FFFFFF' }}>
                {t('translations:ossMenu.OTHERTOOLS')}
                <button type='button' class='close' data-dismiss='modal' aria-label='Close' style={{ padding: '0px', margin: '0px' }}>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </h3>


            </div>
            <div className="modal-body">
              <p className="mb-3" style={{ fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '500', fontSize: '16.0073px', lineHeight: '32px', textAlign: 'center', color: '#4B4B4A' }}>{t('translations:ossMenu.otherToolsTitle')}</p>
              <div className="row mt-5" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <div className="col-md-12 mb-4 ">
                <Link to={`/building-calculator`} ><button id="otherToolsButton"  className="button w-100 mr-1 mb-3 bg-theme-12 text-white"style={{ background: '#EAEBED', fontWeight: '600' }} >{t('translations:ossMenu.BuildingCalculator')}</button></Link>
                  <Link to="/building-calculator" type="button" style={{ background: '#EAEBED', fontWeight: '600' }} id="otherToolsButton" className="button  w-100 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-2" >{t('translations:ossMenu.BuildingCalculator')}</Link>
                </div>
                <div className="col-md-12 mb-4 ">
                  <Link to="/financial-calculator" type="button" style={{ background: '#EAEBED', fontWeight: '600' }} id="otherToolsButton" className="button  w-100 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-2" >{t('translations:ossMenu.CostEstimationCalculator')}</Link>
                </div>
                <div className="col-md-12 mb-4 ">
                  <Link to="/national-benchmarking" type="button" style={{ background: '#EAEBED', fontWeight: '600' }} id="otherToolsButton" className="button  w-100 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-2" >{t('translations:ossMenu.NationalBenchmarking')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </React.Fragment>
  );
}


NavigationDrawer.propTypes = {
  mobileOpen: PropTypes.bool.isRequired,
  onMobileClose: PropTypes.func,
};



export default connect(
  state => ({
    user: state.user,
    organization: state.organization,
    project: state.project,
  }),
  dispatch => ({
    getMyOrganizations: (userID, isMine, offset = 0, limit = null) => dispatch(getMyOrganizationsAction(userID, isMine, { offset, limit })),
    getMyProjects: (userID, isMine, offset = 0, limit = null) => dispatch(getMyProjectsAction(userID, isMine, { offset, limit })),
  })
)(NavigationDrawer);