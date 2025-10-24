import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Field, reduxForm } from 'redux-form';
import Chip from '@material-ui/core/Chip';

/// WRAPPERS
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

/// COMPONENTS
import NavMenu from '../../smartcomponents/LandingPageNavContainer';
import ProgressBar from '../../../components/utils/ProgressBar';
import Footer from '../LandingPage/Footer';
import SelectLanguageModel from '../../smartcomponents/SelectLanguageModel';
import SnackbarNotification from './../../smartcomponents/SnackbarNotification';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
/// ACTIONS
import { registerUser } from '../../../actions/authentication';
import ENDPOINTS from '../../../constants/endpoints';

import Group610 from '../../../styles/assets/Group610.png';
import mapserchbox from '../../../styles/assets/mapserchbox.png';
import mapzom from '../../../styles/assets/mapzom.png';
import Group3790 from '../../../styles/assets/Group3790.png';
import marketingmaps from '../../../styles/assets/marketingmaps.png';
import { LEGAL_FORMS, isResidentsCommunity } from '../../../constants/legalStatusTypes';
import testlogo from '../../../images/1SUNShiNE_Main_footer.png';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Group3814 from '../../../styles/assets/Group3814.png';
import Union from '../../../styles/assets/Union.png';
import user from '../../../styles/assets/user.png';
import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
    LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
    CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE,
    FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILURE,
    FORGOT_PASS_RESET_STATE, RESTORE_PASSWORD_REQUEST, RESTORE_PASSWORD_SUCCESS,
    RESTORE_PASSWORD_FAILURE, TOKEN_VERIFICATION_REQUEST, TOKEN_VERIFICATION_SUCCESS,
    TOKEN_VERIFICATION_FAILURE, CONFIRM_USER, CLEAR_MY_ASSETS, CLEAR_MY_ORGANIZATIONS
  } from './../../../constants/actionTypes';
  import { addAlert } from './../../../actions/alerts';
  import { getRoleCountries } from '../../../utils/userRoles';

  import { otpLoginUser } from './../../../actions/authentication';
  import getCookie from './../../../components/utils/getCookie';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },

});
// function loginSuccess(user, roleCountries) {
//     return {
//       type: LOGIN_SUCCESS,
//       isFetching: false,
//       isAuthenticated: user._id,
//       data: user,
//       countryAdminCountries: roleCountries
//     };
//   }
class SignupOTPFrom extends React.Component {
 
    constructor(props) {
        super(props);
        this.state = {     
          step1: true, 
          userEmail:'', 
          userOTP:'',   
          
        }
       
      }
      otpSendInformationChange= e => {
        let nameType  = e.target.name;
        let value = e.target.value;
      
            if(e.target.name==='email'){
                if(e.target.value==='' || e.target.value===null || !e.target.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) ){
                this.setState({
                    emailError:true,
                    emailMsg:this.props.t('translations:validation.validEmail'),
                    userEmail:value
                })
                } 
                
                else {
                this.setState({
                    emailError:false,  
                    emailMsg:'',
                    userEmail:value
                
                })
                }
            }



      }

      otpSendInformationChange1= e => {
        let nameType  = e.target.name;
        let value = e.target.value;
    
           


            if(e.target.name==='otp'){
                if(e.target.value==='' || e.target.value===null ){
                this.setState({
                    otpError:true,
                    otpMsg:this.props.t('translations:validation.validEmail'),
                    userOTP:value
                })
                } 
                
                else {
                this.setState({
                    otpError:false,  
                    otpMsg:'',
                    userOTP:value
                
                })
                }
            }

      }
    otpSend(){

        if(this.state.userEmail !== '' && this.state.emailError === false){

            const config = {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                  "email":this.state.userEmail,
                             
                })
              };          
             
            
              fetch(ENDPOINTS.SERVER + '/user/otp', config)
              .then(status => {
             
                if (status.ok) {
                    status.json().then(data => {
                    
                                      
                        this.setState({
                                          step1: false
                                      })
                    })
                  } else if (status.status === 404) {

                    this.setState({
                        emailError:true,
                        emailMsg:this.props.t('translations:validation.validEmail1'),
                       
                    })
                   
                    
                  } 
            })
            .catch(err => {
             
              
            });

               

        }else{
            this.setState({
                emailError:true,
                emailMsg:this.props.t('translations:validation.validEmail'),
                
            })

        }
        
    }

    backStep(){

        this.setState({
            step1: true
        })

    }

    

    // otpVerification(){
       
    //     if(this.state.userOTP !== '' && this.state.otpError === false){
            
    //         const config = {
    //             method: 'get',
    //             credentials: 'include',
    //             headers: { 'Content-Type': 'text/plain' },
                
    //           };          
    
            
    //           return fetch(ENDPOINTS.SERVER + `/user/otp?email=${this.state.userEmail}&otp=${this.state.userOTP}`, config)
    //               .then(res => res.json())
    //              // .then((result) => result.length ? JSON.parse(text) : {})
    //               .then(
    //                   (result) => {   
    

    //                       const roleCountries = getRoleCountries(result, 'portfolio_director');
    //                     dispatch(loginSuccess(result, roleCountries));
    //                     dispatch(addAlert({ text: 'Successfully logged in!', level: 'success' }));
                         
    //                   },
                      
    //               ).catch(error => {
                                    
    //             });

    //     }else{
    //         this.setState({
    //             emailError:true,
    //             emailMsg:'enter valid otp',
                
    //         })

    //     }

    // }
    render() {

        const { fetching,loading,classes,handleFormSubmit,handleSubmit ,alerts,t} = this.props;

   

        return (
            <div>
                <main role="main">
                    <div className="row row-eq-height">
                    {alerts && alerts.map((a, index) => (
                    <SnackbarNotification open alert={a} key={index} />
                  ))}
                        <div className="col-md-6 text-center"
                            style={{ background: '#FFFFFF', marginLeft: 'auto', paddingRight: '0px', paddingLeft: '0px', marginRight: 'auto' }}>
 <form onSubmit={handleSubmit(handleFormSubmit.bind(this))} style={{width: '100%'}} >

{(() => {
 
 if (this.state.step1 === true) {
    return  <section id="step1">   

    <div className="row mt-5 mb-3" id="magicTextBox">
         <div className="col-md-10" style={{marginLeft: 'auto',marginRight:'auto'}}>
             <div>
                 <h2 className="sectionTitle" style={{ fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '600', fontSize: '26px', lineHeight: '39px', textAlign: 'center', color: '#556775' }}>{t('landingPage:MyProjectStatus.Welcome')} 
                 </h2>
             </div>
             <p>{t('landingPage:MyProjectStatus.title1')} </p>
         </div>
     </div>    

     <div className="row mt-5 mb-5" id="magicTextBox">
            
                 <div className="col-md-6" style={{marginLeft: 'auto',marginRight: 'auto'}}>
                    
                     <Field name='email' type='email' className="form-control mb-1" component='input' defaultValue={this.state.userEmail}   onChange={(e) => this.otpSendInformationChange(e)} placeholder={t('translations:organizations.email')}/> 
                     {this.state.emailError === true ? <span  style={{color: "red",float: 'left'}}>{this.state.emailMsg}</span> : ''}
                     <br></br>
                     <br></br>
                    
                       
                     <button type="button" className="btn btn-primary btn-md btn-default next-step"
                         style={{width: '40%',background: '#F18419',borderRadius: '30px',float: 'left'}} onClick={() => this.otpSend()}>{t('landingPage:MyProjectStatus.Submit')}</button>
                   
                   <Link to="/go-to-my-project"  className="btn btn-primary btn-md btn-default next-step" style={{lineHeight: '43px',width: '40%',background: '#F18419',borderRadius: '30px',float: 'right'}}>
                      {t('landingPage:MyProjectStatus.Back')}
                         </Link>
                 </div>

         </div>   

 </section>

 }else{
    return <section id="step2" >   

    <div className="row mt-5 mb-3" id="magicTextBox">
         <div className="col-md-10" style={{marginLeft: 'auto',marginRight:'auto'}}>
             <div>
                 <h2 className="sectionTitle" style={{ fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '600', fontSize: '26px', lineHeight: '39px', textAlign: 'center', color: '#556775' }}>{t('landingPage:MyProjectStatus.CodeValidation')} 
                 </h2>
             </div>
             <p>{t('landingPage:MyProjectStatus.title2')}  </p>
         </div>
     </div>    

     <div className="row mt-5 mb-5" id="magicTextBox">
    
                 <div className="col-md-6" style={{marginLeft: 'auto',marginRight: 'auto'}}>
                
                 <Field  name='otp' type='text' className="form-control mb-3" component='input' placeholder={t('translations:dpfText.Verification_code')}/>   
                  
                     {this.state.otpError === true ? <span  style={{color: "red",float: 'left'}}>{this.state.otpMsg}</span> : ''}
                     <br></br>
                     <br></br>
                     <button type="button" className="btn btn-primary btn-md btn-default next-step"
                         style={{width: '40%',background: '#F18419',borderRadius: '30px',float: 'left'}} onClick={() => this.backStep()}>{t('landingPage:MyProjectStatus.Back')}</button>
                       
                     <button type="submit" className="btn btn-primary btn-md btn-default next-step"
                         style={{width: '40%',background: '#F18419',borderRadius: '30px',float: 'right'}}>{t('landingPage:MyProjectStatus.Seeyourprojectstatus')} </button>

                 </div>
                 
         </div>   

 </section>

 }

})()} 
                            

                            </form>
                            

                        </div>


                    </div>


                </main>
                <Footer />
                <SelectLanguageModel />
            </div>
        )
    }
}

SignupOTPFrom.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleFormSubmit: PropTypes.func.isRequired,
    registerAction: PropTypes.bool.isRequired,
  };
  
  SignupOTPFrom.defaultProps = {
    registerAction: true,
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
    };
  };
const mapDispatchToProps = dispatch => ({
    handleFormSubmit: (creds) => {
      dispatch(otpLoginUser(creds));
    },
    
  });



export default( reduxForm({form: 'signupOTPFrom'})(withStyles(styles)(withRouter(withTranslation('translations')
    (connect(mapStateToProps,  mapDispatchToProps)(SignupOTPFrom) )))));


