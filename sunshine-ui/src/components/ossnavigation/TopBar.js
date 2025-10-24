import React, { Component } from "react";
import PropTypes from 'prop-types';

// WRAPPERS
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';


// COMPONENTS
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ChangePassword from '../user/ChangePassword/ChangePassword';

import defaultImage from './../../images/Profile_avatar_placeholder_large.png';
import profile14 from '../../styles/ossAdmin/dist/images/profile-14.jpg';
// ACTIONS
import { logoutUser } from '../../actions/authentication';
import toggleLanguageAction from '../../actions/language';
import { changePassword as changePasswordAction } from '../../actions/authentication';
import {
  Home as HomeIcon,
  BusinessCenter as OrganizationIcon,
  Business as AssetIcon,
  Equalizer as ProjectIcon,
  Security as AdminIcon,
  TableChart as TableChartIcon,
  Delete as DeleteIcon,
  Add as PlusIcon,
  ArrowForwardIos as ArrowForwardIosIcon
} from '@material-ui/icons';
// BACKEND ENDPOINTS
import ENDPOINTS from '../../constants/endpoints';
import styles from './styles';
import Notifications from '../utils/Notifications/Notifications';
import NavigationDrawer from './NavigationDrawer';
import SelectLanguage from '../utils/SelectLanguage';
import MoreVertIcon from '@material-ui/icons/KeyboardArrowDown';

class ToBar extends React.Component {
  state = {
    mobileOpen: false,
    anchorEl: null,
    open: false,
    profileSubMenu: false,
  };

  constructor() {
    super();
    this.state = {
      profileSubMenu: false,
    }
    this.showMenu = this.showMenu.bind(this);
   
  }
  
  
  showMenu(event) {
    if (this.state.profileSubMenu == false) {
      this.setState({
        profileSubMenu: true,
      });
    } else {
      this.setState({
        profileSubMenu: false,
      });
    }
  }


  handleDrawerToggle = () => {
    this.setState({
      showMenu: true,
    });
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handlePasswordOpen = () => {

    this.setState({ open: true });
  };
  componentDidMount() {
             
  }
  handlePasswordClose = () => {

    this.setState({ open: false });
  };

  handleLogOut = () => this.props.logout(() => this.props.history.push('/login'))
  render() {
    const { anchorEl } = this.state;
    const { classes, logged, t, logout,userdata,
      changePassword, passwordChanged, toggleLanguage, language, pageTitle, subTitle, myUserData, pageTitleAction, country, subTitleAction } = this.props;
    
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
      <div className="top-bar">
        <div className="-intro-x breadcrumb mr-auto hidden sm:flex" style={{ backgroundColor: '#ffffff00', width: '100%' }}><Link to="/dashboard">
          <HomeIcon></HomeIcon></Link>  &nbsp;<ArrowForwardIosIcon /> &nbsp;
          <Link to={pageTitleAction} className="breadcrumb--active" style={{ color: 'black' }}> {t(pageTitle)} </Link>&nbsp;
          {subTitle === 'EnergyCertificate'
            ?
            <ArrowForwardIosIcon />
            :''
          }
          
          {subTitle === 'EnergyCertificate'
            ?
           <Link to={'#'} className="breadcrumb--active" style={{ color: 'black',cursor: 'context-menu' }}>  {t('translations:assetEnergyCertificate.EnergyCertificate')} </Link>
            :''
          }
         
        </div>
        <div className="intro-x dropdown mr-auto sm:mr-6 w-8" style={{ width: '100%', textTransform: 'uppercase', fontWeight: '500' }}>
          <a className="breadcrumb--active" style={{ float: 'right' }}>  {language} - {countryNode()}</a>
        </div>
        <SelectLanguage toggleLanguage={toggleLanguage} lang={language} country={country} />
        <div className="intro-x dropdown mr-auto sm:mr-6">
          <Notifications />
        </div>
        {myUserData.data.avatar !== ''
            ? <div className="intro-x dropdown ml-3 mr-2 w-8 h-8"><div className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in">

           
              <img alt="sunshine" onClick={this.handleClick} src={ENDPOINTS.SERVER + myUserData.data.avatar} />
              </div>
          </div>
            : <div className="intro-x dropdown ml-3 mr-2 w-8 h-8"><div className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in">

           
            <img alt="sunshine" onClick={this.handleClick} src={defaultImage} />
            </div>
        </div>
          }
          
       
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          style={{ top: '55px',left: '-30px' }}
        >
          <div className="p-3 border-b border-theme-40 dark:border-dark-3" style={{ borderColor: '#fdcf00' }} >
                      <div className="font-medium">{myUserData.data.name}</div>
                    </div>
          <Link to='/profile' className={classes.textDecorationNone}>
            <MenuItem onClick={this.handleClose}>{t('translations:profile.profile')}</MenuItem>
          </Link>
          <MenuItem onClick={() => {
           this.handlePasswordOpen();
           this.handleClose();
          }}>
            <div className={classes.changePasswordLabel}>
              {t('translations:profile.changePassword')}
            </div>
          </MenuItem>
          <MenuItem onClick={this.handleLogOut} style={{ paddingLeft: '20px' }}>{t('translations:profile.signOut')}</MenuItem>
        </Menu>
        <ChangePassword handleFormSubmit={changePassword} passwordChanged={passwordChanged} t={t} open={this.state.open} handlePasswordClose={this.handlePasswordClose} />
        {/* <div className="intro-x dropdown ml-3 mr-2 w-8 h-8">
          <div className="dropdown-toggle w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in">

            {myUserData.data.avatar !== ''
              ?
              <img alt="sunshine" onClick={this.showMenu} src={ENDPOINTS.SERVER + myUserData.data.avatar} />
              :
              <img alt="sunshine" onClick={this.showMenu} src={defaultImage} />
            }
          </div>

          {
            this.state.profileSubMenu
              ? (
                <div className="dropdown-box w-56 show"  >
                  <div className="dropdown-box__content box bg-theme-38 dark:bg-dark-6 text-white">
                    <div className="p-4 border-b border-theme-40 dark:border-dark-3">
                      <div className="font-medium">{myUserData.data.name}</div>
                    </div>
                    <div className="p-2">
                      <a href="/profile" className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md"> <i data-feather="user" className="w-4 h-4 mr-2"></i> {t('translations:profile.profile')} </a>
                      <a onClick={() => {
                        this.handlePasswordOpen();
                        this.handleClose();
                      }} className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md"> <i data-feather="lock" className="w-4 h-4 mr-2"></i> {t('translations:profile.changePassword')} </a>
                      <ChangePassword handleFormSubmit={changePassword} passwordChanged={passwordChanged} t={t} open={this.state.open} handlePasswordClose={this.handlePasswordClose} />
                    </div>
                    <div className="p-2 border-t border-theme-40 dark:border-dark-3">
                      <a href="#" onClick={this.handleLogOut} className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-theme-1 dark:hover:bg-dark-3 rounded-md"> <i data-feather="toggle-right" className="w-4 h-4 mr-2"></i> {t('translations:profile.signOut')} </a>
                    </div>
                  </div>
                </div>
              )
              : (
                null
              )
          }
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.user.language,
    country: state.user.country,
    myUserData: state.user.profileInfo,
    userdata: state.user.profileInfo,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logout: (redirect) => {
      dispatch(logoutUser(redirect));
    },

    toggleLanguage: (lng) => {
      if (ownProps.formName) {
        dispatch(toggleLanguageAction(lng, ownProps.formName));
      } else {
        dispatch(toggleLanguageAction(lng));
      }
    },
    changePassword: (creds) => {
      dispatch(changePasswordAction(creds));
    },
  };
};

ToBar.propTypes = {

  logout: PropTypes.func.isRequired,
  lang: PropTypes.string,
  toggleLanguage: PropTypes.func,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)
  (withStyles(styles, { withTheme: true })
    (withTranslation('translations')(ToBar)
    )
  )
);
