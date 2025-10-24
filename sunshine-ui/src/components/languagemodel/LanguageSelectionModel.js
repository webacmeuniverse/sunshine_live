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
import ModelSelectLanguage from '../utils/ModelSelectLanguage';

// ICONS
import MenuIcon from '@material-ui/icons/Menu';
import MoreVertIcon from '@material-ui/icons/KeyboardArrowDown';
import defaultImage from './../../images/Profile_avatar_placeholder_large.png';
import toggleLanguage from '../../actions/language';
import toggleCountry from '../../actions/country';
// BACKEND ENDPOINTS
import ENDPOINTS from '../../constants/endpoints';

import styles from './styles';
import Notifications from '../utils/Notifications/Notifications';


class LanguageSelectionModel extends React.Component {
  state = {
    mobileOpen: false,
    anchorEl: null,
    open: false,
  };

  handleDrawerToggle = () => {
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

  handlePasswordClose = () => {
    this.setState({ open: false });
  };

  handleLogOut = () => this.props.logout(() => this.props.history.push('/login'))
  onFieldChange(fieldValue) {
   
    this.props.onFieldChange1(fieldValue);
  }
  render() {
    const { anchorEl } = this.state;
    const { classes, userdata, logged, t,
      changePassword, passwordChanged, toggleLanguage, language ,country,toggleCountry,residentsType,selectedOssAdmin,onFieldChange1} = this.props;
    // This will be shown only if the user is logged in.
   
   

    return (
        <div className={classes.loggedUserIconMenu}>
               <ModelSelectLanguage toggleLanguage={toggleLanguage}  onFieldChange={this.onFieldChange.bind(this)} toggleCountry={toggleCountry} selectedOssAdmin={selectedOssAdmin} residentsType={residentsType} country={country} lang={language} />
     
            </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.user.language,
    country: state.user.country,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLanguage: (lang) => {
      dispatch(toggleLanguage(lang));
    },
    toggleCountry: (countryName) => {
      dispatch(toggleCountry(countryName));
    }
  };
};

LanguageSelectionModel.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  logout: PropTypes.func,
  lang: PropTypes.string,
  toggleLanguage: PropTypes.func,
  toggleCountry: PropTypes.func,
  countryName: PropTypes.string,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles, { withTheme: true })(withTranslation('translations')(LanguageSelectionModel))));
