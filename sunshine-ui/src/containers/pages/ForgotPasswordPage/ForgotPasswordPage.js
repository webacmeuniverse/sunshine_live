import React from 'react';
import PropTypes from 'prop-types';

// WRAPPERS
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Footer from '../LandingPage/Footer';
import LoginForm from './../../../components/authentication/LoginForm/LoginForm';
// COMPONENTS
import { Helmet } from 'react-helmet';
import NavContainer from './../../smartcomponents/navcontainer';
import ProgressBar from './../../../components/utils/ProgressBar';
import RestorePassword from './../../../components/authentication/RestorePassword/RestorePassword.jsx';
import SnackbarNotification from '../../smartcomponents/SnackbarNotification';
import NavMenu from './../../smartcomponents/LandingPageNavContainer';
// ACTIONS
import { tokenVerification } from './../../../actions/authentication';
import ForgotPassword from './../../../components/authentication/ForgotPassword/ForgotPassword.jsx';
import { forgotPassword as forgotPasswordAction } from './../../../actions/authentication';

class ForgotPasswordPage extends React.Component {
  componentDidMount() {
    const { tokenVerify, match } = this.props;
    const token = match.params.token;
    tokenVerify(token);
  }

  componentDidUpdate() {
    if (!this.props.tokenVerified) {
      this.props.history.push('/login');
    }
  }

  render() {
    const { fetching, alerts,forgotPassword, loading,forgotPassSuccess,
      forgotPassFail,
      forgotPassResetState,classes,
      t, } = this.props;

    const progressBarStyle = {
      marginTop: '120px',
      marginRight: '140px'
    };

    if (fetching) {
      return <ProgressBar addStyle={progressBarStyle} />;
    }

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
                        <h2 className="sectionTitle" style={{fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 600, fontSize: '26px', lineHeight: '39px', textAlign: 'center', color: '#556775'}}>{t('translations:auth.loginTitle')}
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
                  <RestorePassword />
           
            </div>
          </div>
          </main>
           )}
            <Footer />
      
      </React.Fragment>
    );
  }
}

ForgotPasswordPage.propTypes = {
  tokenVerify: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    fetching: state.auth.isFetching,
    tokenVerified: state.auth.tokenVerified,
    alerts: state.alerts.pending
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    tokenVerify: (creds) => {
      dispatch(tokenVerification(creds));
    }
  };
};

export default withRouter(withTranslation('translations')(connect(
    mapStateToProps,
    mapDispatchToProps
  )(ForgotPasswordPage)));
