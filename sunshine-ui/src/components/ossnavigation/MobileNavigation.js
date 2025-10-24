import React from 'react';
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
import SelectLanguage from '../utils/SelectLanguage';

// ICONS
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/KeyboardArrowDown';
import defaultImage from './../../images/Profile_avatar_placeholder_large.png';
import toggleLanguage from '../../actions/language';


import profile14 from '../../styles/ossAdmin/dist/images/profile-14.jpg';


// BACKEND ENDPOINTS
import ENDPOINTS from '../../constants/endpoints';


import Notifications from '../utils/Notifications/Notifications';
import NavigationDrawer from './MobileNavigationDrawer';
import TopBar from './TopBar';

class MobileNavigation extends React.Component {


  render() {

    const { userdata, logged, t, logout,
      changePassword, passwordChanged, toggleLanguage, language } = this.props;
    // This will be shown only if the user is logged in.


    return (
      <React.Fragment>
        <>
        <NavigationDrawer />

        </>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.user.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLanguage: (lang) => {
      dispatch(toggleLanguage(lang));
    }
  };
};

MobileNavigation.propTypes = {

  logout: PropTypes.func,
  lang: PropTypes.string,
  toggleLanguage: PropTypes.func,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation('translations')(MobileNavigation)));
