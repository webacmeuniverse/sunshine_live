import React from 'react';
import PropTypes from 'prop-types';

// WRAPPERS
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

// COMPONENTS
import Navigation from '../../components/EESNavigation/Navigation';
import MenuIcon from '@material-ui/icons/Menu';
// ACTIONS
import { logoutUser } from '../../actions/authentication';
import toggleLanguageAction from '../../actions/language';
import { changePassword as changePasswordAction } from '../../actions/authentication';

class EESNavigationMenu extends React.Component {
  handleNevCloseClick() {
    
    document.getElementById("myNav").style.width = "0%";
}

submenuOpen() {
   
  $('ul .serv-show').toggleClass("show1");
  $('ul .second').toggleClass("rotate");
}



  render() {
    const {
      userIsLogged,
      logout,
      userdata,
      language,
      toggleLanguage,
      userIsSuperUser,
      changePassword,
      passwordChanged
      
    } = this.props;
    const { classes,t } = this.props;
    return (
      <div id="myNav" className="overlay">
          <a  className="closebtn" onClick={this.handleNevCloseClick} style={{ cursor: 'pointer' }}>&times;</a>
          <div className="overlay-content">
              <ul>
              <li ><a href="/"> {t('landingPage:menu.RESIDENTS')}</a></li>
              <li ><a href="operators"> {t('landingPage:menu.SERVICESPROVIDER')}</a></li>
              <li ><a href="/ees_calculator">{t('landingPage:menu.EESCALCULATOR')} </a></li>
              <li ><a href="/find-my-partner">{t('landingPage:menu.MATCHMAKING')}</a></li>
              <li>
                <a href="#" className="serv-btn" onClick={this.submenuOpen} >{t('landingPage:menu.SIMULATIONTOOL')}
                  <span className="fas fa-caret-down second"></span>
                </a>
                <ul className="serv-show">
                  <li><a href="/ees-checklist">{t('landingPage:menu.EESCHECKLIST')}</a></li>
                  <li><a href="/ees-refinancability-checklist">{t('landingPage:menu.EESREFINANCEABILITYCHECKLIST')}</a></li>
                  <li><a href="/building-calculator">{t('landingPage:menu.BUILDINGCALCULATOR')}</a></li>
            </ul>
        </li>
        <li ><a href="/resources">{t('landingPage:menu.RESOURCES')}</a></li>
            </ul>                          
          </div>
      </div>
    );
  }
}

EESNavigationMenu.propTypes = {
  userIsLogged: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired,
  ]),
  logout: PropTypes.func.isRequired,
  userIsSuperUser: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
  return {
    userIsLogged: state.user.isAuthenticated,
    userIsSuperUser: state.user.isSuperUser,
    userdata: state.user.profileInfo,
    language: state.user.language,
    passwordChanged: state.auth.passwordChanged,
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

export default withTranslation('translations')(connect(
  mapStateToProps,
  mapDispatchToProps,
)(EESNavigationMenu));
