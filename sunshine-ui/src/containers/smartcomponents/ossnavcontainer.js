import React from 'react';
import PropTypes from 'prop-types';

// WRAPPERS
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import SnackbarNotification from '../smartcomponents/SnackbarNotification';
// COMPONENTS
import Navigation from '../../components/ossnavigation/Navigation';

// ACTIONS
import { logoutUser } from '../../actions/authentication';
import toggleLanguageAction from '../../actions/language';
import { changePassword as changePasswordAction } from '../../actions/authentication';


class OSSNavContainer extends React.Component {
  render() {
    const {
      userIsLogged,
      logout,
      userdata,
      alerts,
      language,
      toggleLanguage,
      userIsSuperUser,
      changePassword,
      passwordChanged,
    } = this.props;

    return (
      <>
       {alerts && alerts.map((a, index) => (
                                      <SnackbarNotification open alert={a} key={index} />
                                    ))}
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

OSSNavContainer.propTypes = {
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
    alerts: state.alerts.pending,
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
)(OSSNavContainer));
