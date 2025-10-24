import React from 'react';
import PropTypes from 'prop-types';

/// WRAPPERS
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

/// COMPONENTS
import RegisterForm from './../../../components/authentication/RegisterForm/RegisterForm';
import { Helmet } from "react-helmet";
import NavContainer from './../../smartcomponents/navcontainer';
import SnackbarNotification from './../../smartcomponents/SnackbarNotification';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ProgressBar from './../../../components/utils/ProgressBar';
import Sunshine from './../../../images/Sunshine.png';
import Footer from '../LandingPage/Footer';
import SelectLanguageModel from '../../smartcomponents/SelectLanguageModel';
/// ACTIONS
import { registerUser } from '../../../actions/authentication';

import styles from './styles';
import NavMenu from './../../smartcomponents/LandingPageNavContainer';

class RegisterView extends React.Component {
  render(){
    let { register, t, fetching, alerts, classes } = this.props;
    
    return (
      <div>
          <NavMenu  />
          <div className="row row-eq-height" style={{marginTop: '10px'}} >
         {alerts && alerts.map((a, index) => (
                    <SnackbarNotification open alert={a} key={index} />
                  ))}
            <div className="col-md-6 text-center" style={{background: '#FFFFFF', marginLeft: 'auto', paddingRight: '0px', paddingLeft: '0px', marginRight: 'auto'}}>
            
                  <div className="row mt-2">
                    <div className="col-md-10" style={{marginLeft: 'auto', marginRight: 'auto'}}>
                      <div>
                        <h2 className="sectionTitle" style={{fontFamily: 'Inter', fontStyle: 'normal', fontWeight: 600, fontSize: '26px', lineHeight: '39px', textAlign: 'center', color: '#556775'}}>{t('translations:auth.registerTitle')}
                        </h2>
                      </div>
                    </div>
                  </div>
                
                  <div className="row " id="magicTextBox">
                  <RegisterForm handleFormSubmit={register} />
                  </div>
                
           
            </div>
          </div>
          <Footer />
				<SelectLanguageModel />
      </div>
    )
  }
}


RegisterView.propTypes = {
  // userIsLogged: PropTypes.string.isRequired,
  fetching: PropTypes.bool,
  register: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    userIsLogged: state.user.isAuthenticated,
    fetching: state.user.isFetching,
    didRegister: state.user.didRegister,
    alerts: state.alerts.pending,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const redirect = () => ownProps.history.push("/login");
  
  return {
    register: (creds) => {
      dispatch(registerUser(creds, redirect));
    }
  };
};

export default withRouter(withTranslation('translations')
(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RegisterView))));
