import React from 'react';
import PropTypes from 'prop-types';

// WRAPPERS
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

// COMPONENTS
import Navigation from '../../components/ossnavigation/MobileNavigation';

// ACTIONS
import { logoutUser } from '../../actions/authentication';
import toggleLanguageAction from '../../actions/language';
import { changePassword as changePasswordAction } from '../../actions/authentication';


class OSSMobileNavContainer extends React.Component {
  render() {
    const {
      userIsLogged,
      logout,
      userdata,
      language,
      toggleLanguage,
      userIsSuperUser,
      changePassword,
      passwordChanged,
    } = this.props;

    return (
      <>
        <Navigation
          passwordChanged={passwordChanged}
          changePassword={changePassword}
          userIsSuperUser={userIsSuperUser}
          logged={userIsLogged}
          logout={logout}
          userdata={userdata}
          lang={language}
          toggleLanguage={toggleLanguage}
        />
      </>
    );
  }
}

OSSMobileNavContainer.propTypes = {
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
)(OSSMobileNavContainer));
