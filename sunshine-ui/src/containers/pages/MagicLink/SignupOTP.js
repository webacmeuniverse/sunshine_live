import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import NavContainer from '../../smartcomponents/LandingPageNavContainer';
import SnackbarNotification from '../../smartcomponents/SnackbarNotification';
import AssetPublicView from '../../../components/asset/AssetPublicView/AssetPublicView';
import SignupOTPForm from './SignupOTPFrom';
import getCookie from './../../../components/utils/getCookie';

class SignupOTP extends React.Component {
  UNSAFE_componentWillMount() {
    if (getCookie()) {
      this.props.history.push('/dashboard');
    }
  }
  componentDidUpdate() {
    if (getCookie()) {
      this.props.history.push('/dashboard');
    }
  }
  
  render() {
    const {
      alerts,
    } =  this.props;;
  return (
    <React.Fragment>
      
      <NavContainer />
      <SignupOTPForm/>
    </React.Fragment>
  );

  }
}
const mapStateToProps = (state) => {
  return {
    userIsLogged: state.user.isAuthenticated,
    fetching: state.user.isFetching,
    loading: state.auth.isLoading,
    forgotPassSuccess: state.auth.forgotPassSuccess,
    forgotPassFail: state.auth.forgotPassFail,
    isLogged: state.user.isLogged,
    alerts: state.alerts.pending,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    forgotPassword: (creds) => {
      dispatch(forgotPasswordAction(creds));
    },
    forgotPassResetState: () => {
      dispatch(forgotPassResetStateAction());
    }
  };
};


export default withRouter(withTranslation('translations')(
  connect(mapStateToProps, mapDispatchToProps)((SignupOTP))));

