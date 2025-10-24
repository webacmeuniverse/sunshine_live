import React from 'react';
import PropTypes from 'prop-types';

// WRAPPERS
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

// COMPONENTS
import Navigation from '../../components/EESNavigation/Navigation';

// ACTIONS
import { logoutUser } from '../../actions/authentication';
import toggleLanguageAction from '../../actions/language';
import { changePassword as changePasswordAction } from '../../actions/authentication';

class NavContainer extends React.Component {
 
  constructor(props) {

    super(props);  
    }

  onFieldChange1(fieldValue) {
    
    this.props.ossAdminChange(fieldValue);
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
      passwordChanged,
    
      country,
      selectedOssValue,
      ossAdminData
    } = this.props;

    return (
     
        <Navigation
          passwordChanged={passwordChanged}
          changePassword={changePassword}
          userIsSuperUser={userIsSuperUser}
          logged={userIsLogged}
          onFieldChange1={this.onFieldChange1.bind(this)}
          logout={logout}
          userdata={userdata}
          lang={language}
          country={country}
         
          toggleLanguage={toggleLanguage}
          selectedOssValue={selectedOssValue}
          ossAdminData={ossAdminData}
        />
      
    );
  }
}

NavContainer.propTypes = {
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
    changePassword: (creds) => {
      dispatch(changePasswordAction(creds));
    },
  };
};

export default withTranslation('translations')(connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavContainer));
