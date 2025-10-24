import React from 'react';
import PropTypes from 'prop-types';

// WRAPPERS
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

// COMPONENTS
import LandingNavigation from '../../components/landingnavigation/LandingNavigation';

// ACTIONS
import { logoutUser } from '../../actions/authentication';
import toggleLanguageAction from '../../actions/language';
import toggleCountryAction from '../../actions/country';
import { changePassword as changePasswordAction } from '../../actions/authentication';

class LandingPageNavContainer extends React.Component {
  render() {
    const {
      userIsLogged,
      logout,
      userdata,
      language,
      country,
      toggleLanguage,
      toggleCountry,
      userIsSuperUser,
      changePassword,
      passwordChanged,
    } = this.props;

   
    return (
      <div>
        <LandingNavigation
          passwordChanged={passwordChanged}
          changePassword={changePassword}
          userIsSuperUser={userIsSuperUser}
          logged={userIsLogged}
          logout={logout}
          userdata={userdata}
          lang={language}
          country={country}
          toggleLanguage={toggleLanguage}
        />
      </div>
    );
  }
}

LandingPageNavContainer.propTypes = {
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
    country: state.user.country,
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
    toggleCountry: (countryName) => {
      if (ownProps.formName) {
        dispatch(toggleCountryAction(countryName, ownProps.formName));
      } else {
        dispatch(toggleCountryAction(countryName));
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
)(LandingPageNavContainer));
