import React from 'react';
import PropTypes from 'prop-types';

// WRAPPERS
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

// COMPONENTS
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import { Helmet } from 'react-helmet';
import LoginForm from './../../../components/authentication/LoginForm/LoginForm';
import ForgotPassword from './../../../components/authentication/ForgotPassword/ForgotPassword.jsx';
import NavContainer from './../../smartcomponents/navcontainer';
import SnackbarNotification from './../../smartcomponents/SnackbarNotification';
import ProgressBar from './../../../components/utils/ProgressBar';
import Sunshine from './../../../images/Sunshine.png';

// ACTIONS
import { forgotPassword as forgotPasswordAction } from './../../../actions/authentication';
import { forgotPassResetState as forgotPassResetStateAction } from './../../../actions/authentication';
import getCookie from './../../../components/utils/getCookie';

import styles from './styles';
import Logo_europa_main from '../../../styles/assets/images/Logo_europa_main.png';
import Footer from '../LandingPage/Footer';
import SelectLanguageModel from '../../smartcomponents/SelectLanguageModel';
import Logoeuropa_White1 from '../../../styles/assets/6Logo europa_White1.png';
import NavMenu from './../../smartcomponents/LandingPageNavContainer';

class LoginView extends React.Component {
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
      fetching,
      forgotPassword,
      loading,
      forgotPassSuccess,
      forgotPassFail,
      forgotPassResetState,
      alerts,
     
    } = this.props;

    const { classes,t } = this.props;

    return (
      <React.Fragment>
         <NavMenu  />
         {fetching ? <ProgressBar /> : (
           <main role="main">
         <div className="row row-eq-height mb-5" style={{marginTop: '20px'}} >
         {alerts && alerts.map((a, index) => (
                    <SnackbarNotification open alert={a} key={index} />
                  ))}
            <div className="col-md-6 text-center" style={{background: '#FFFFFF', marginLeft: 'auto', paddingRight: '0px', paddingLeft: '0px', marginRight: 'auto'}}>
            
                  <div className="row mt-5">
                    <div className="col-md-10" style={{marginLeft: 'auto', marginRight: 'auto'}}>
                      <div>
                        <h2 className="sectionTitle" style={{fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 600, fontSize: '26px', lineHeight: '39px', textAlign: 'center', color: '#556775'}}> {t('translations:auth.loginTitle')}
                        </h2>
                      </div>
                    </div>
                  </div>
                
                  <div className="row " id="magicTextBox">
                  <LoginForm />
                  </div>
                  <div className="row mt-5">
                    <div className="col-md-10" style={{marginLeft: 'auto', marginRight: 'auto'}}>
                   
                      <div>
                    
                      {this.props.registerAction && (
                          <div  style={{ fontFamily: 'Inter',fontStyle:'normal',fontWeight:'600',fontSize:'16px',lineHeight:'39px',textAlign:'center',color:'#556775' }}>
                            <Link to='/register' className="sectionTitle">
                              {t('translations:auth.registerMessage')}
                            </Link>
                          </div>
                        )}

                        <ForgotPassword style={{ fontFamily: 'Inter',fontStyle:'normal',fontWeight:'600',fontSize:'16px',lineHeight:'39px',textAlign:'center',color:'#556775' }}
                              handleFormSubmit={forgotPassword}
                              loading={loading}
                              forgotPassSuccess={forgotPassSuccess}
                              forgotPassFail={forgotPassFail}
                              forgotPassResetState={forgotPassResetState}
                            />
                           <br/>
                      </div>
                    </div>
                  </div>
              
           
            </div>
          </div>
          </main>
           )}
            <Footer />
          <SelectLanguageModel />
      </React.Fragment>
    );
  }
}

LoginView.propTypes = {
  fetching: PropTypes.bool,
  loading: PropTypes.bool,
  forgotPassSuccess: PropTypes.bool,
  forgotPassFail: PropTypes.bool,
  t: PropTypes.func.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  forgotPassResetState: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    userIsLogged: state.user.isAuthenticated,
    fetching: state.user.isFetching,
    loading: state.auth.isLoading,
    forgotPassSuccess: state.auth.forgotPassSuccess,
    forgotPassFail: state.auth.forgotPassFail,
    isLogged: state.user.isLogged,
    alerts: state.alerts.pending,
    language: state.user.language,
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
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(LoginView))));
