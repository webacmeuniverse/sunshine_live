import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
    Grid,
    makeStyles,
} from '@material-ui/core';
import { countries,countriesMobileCode } from '../../../constants/countries';
import ProgressBar from '../../../components/utils/ProgressBar';
import NavContainer from '../../smartcomponents/EESNavcontainer';
import EESFooter from '../../smartcomponents/EESFooter';

import EESNavigationMenu from '../../smartcomponents/EESNavigationMenu';
import { Link } from 'react-router-dom';
import {
    Home as HomeIcon,
    BusinessCenter as OrganizationIcon,
    Business as AssetIcon,
    Equalizer as ProjectIcon,
    Security as AdminIcon,
    TableChart as TableChartIcon,
    Delete as DeleteIcon,
    CalendarTodaySharp as PlusIcon,
} from '@material-ui/icons';


import '../../../styles/assets/css/bootstrap.min.css';
import '../../../styles/assets/css/stepwizard.css';
//images
import logo_footer2 from '../../../styles/assets/images/logo-footer2.png';
import Logo_europa_White from '../../../styles/assets/Logo_europa_White.png';
import calculaadora from '../../../styles/assets/calculaadora.png';
import quizHomeIcon from '../../../styles/assets/quizHomeIcon.png';

import icon_calc from '../../../styles/assets/images/icon-calc.png';
import energy_drivers from '../../../styles/assets/energy_drivers.png';
import economic_text from '../../../styles/assets/economic_text.png';
import bolt_1 from '../../../styles/assets/bolt_1.png';
import database from '../../../styles/assets/database.png';



import Vector from '../../../styles/assets/Vector.png';
import Group from '../../../styles/assets/Group.png';
import noisePollution_1 from '../../../styles/assets/noise-pollution_1.png';
import fix_window from '../../../styles/assets/fix_window.png';
import AcImage from '../../../styles/assets/ac.png';
import solarPanel from '../../../styles/assets/solar-panel.png';
import Group_1 from '../../../styles/assets/Group_1.png';
import Group3837 from '../../../styles/assets/Group3837.png';
import image1 from '../../../styles/assets/IMG_5322_1.png';
import ScreenShot from '../../../styles/assets/ScreenShot.png';
import mfrkwcq1iwuz1 from '../../../styles/assets/mfrkwcq1iwuz1.png';
import oldBlockHouses1 from '../../../styles/assets/old-block-houses1.png';
import snowflake_1 from '../../../styles/assets/snowflake_1.png';
import Central from '../../../styles/assets/Central.png';

import None from '../../../styles/assets/None.png';
import Other from '../../../styles/assets/Other.png';
import Group38416 from '../../../styles/assets/Group38416.png';
import Group3839 from '../../../styles/assets/Group3839.png';
import Group3840 from '../../../styles/assets/Group3840.png';
import energyAudits from '../../../styles/assets/energy_audits.png';
import technicalInspection from '../../../styles/assets/technical_inspection.png';
import projectDesign from '../../../styles/assets/project_design.png';
import construction from '../../../styles/assets/construction.png';
import roof1 from '../../../styles/assets/roof1.png';
import Electric from '../../../styles/assets/Electric.png';

import getCookie from '../../../components/utils/getCookie';
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';

import { useSelector } from 'react-redux';
import ENDPOINTS from '../../../constants/endpoints';
import { setCalcMenuItems } from '../../../actions/calcmenu';

import {
    searchUsers as searchUsersAction,
    getUsersByPlatformRoles as getPRUsersAction,
} from '../../../actions/users';
import publicIp from 'public-ip';

import Vector1 from '../../../styles/assets/Vector1.png';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class OssStepFrom extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            
            errors: {},
            createdUserId:'',
            fetching: false,
            passwordConfirm:false,
            basicInformation: {
                                country:this.props.selectedCountry,
                                type:this.props.residentsType,
                                postCode:this.props.postCode,
                                name:'',
                                surname:'',
                                email:'',
                                type_of_organization:'',
                                organization_name:'',
                                registration_number:'',
                                vat_number:'',
                                legal_rep_org:'',
                                website:'',
                                phoneNumber:'',
                                address:'',
                                country:'',
                                city:'',
                                agree_checkbox:'',      
                                password:'',                        
                              },
                        questionData: {                         
                            field_id:'',
                            field_value:[],
                            field_title:'',                                                              
                               }, 
                               hobbies:[],                                   
            createdUserDetails: [],                 
            countLi:0,

        }
       // this.countryChange = this.countryChange.bind(this);
       // this.residentsTypeChange = this.residentsTypeChange.bind(this);
        //this.onDelete =this.onDelete.bind(this);

        this.questionDataChange = this.questionDataChange.bind(this);
        this.passwordConfirmation = this.passwordConfirmation.bind(this);
    }
    passwordConfirmation = (value) => {

      this.state.passwordConfirm =value

      if(value === true){

        this.setState({
          confirmPasswordError:false,     
          confirmPasswordMsg:''
         
        })
      }

      this.forceUpdate()
     
    }
    ossLngChange = () => {
           
       
      // this.state.selectedOssData = resultData;
       $(".tab-pane").removeClass("active show");
      //$('#'+prvStep).removeClass('active show');
       $('#tabt-1').addClass('active show');
    


   }

   countryChange = e => {

    let nameType  = e.target.name;
      let value = e.target.value;
      //this.setState({
      //  basicInformation: [ ...this.state.nameType, e.target.value],
     // })



     this.setState({
      basicInformation:{
        ...this.state.basicInformation,
        [nameType]: value
      }
    });
    if(e.target.name==='country'){
      if(e.target.value==='' || e.target.value===null  ){
        this.setState({
          countryError:true,
          countryMsg:this.props.t('translations:onboardingValidation.country')
        })
      }
      
      else {
        this.setState({
          countryError:false,     
          countryMsg:''
         
        })
      }
    }

        
}




   confirmPasswordChange = e => {

    let nameType  = e.target.name;
      let value = e.target.value;
      //this.setState({
      //  basicInformation: [ ...this.state.nameType, e.target.value],
     // })



     this.setState({
      basicInformation:{
        ...this.state.basicInformation,
        [nameType]: value
      }
    });
    if(e.target.name==='confirm_password'){
      if(e.target.value==='' || e.target.value===null  ){
        this.setState({
          confirmPasswordError:true,
          confirmPasswordMsg:this.props.t('translations:onboardingValidation.confirm_password')
        })
      } else if(e.target.value.length < 6){
        this.setState({
          confirmPasswordError:true,
          confirmPasswordMsg:this.props.t('translations:onboardingValidation.confirm_password_digits')
        })

      }else if(e.target.value !== this.state.basicInformation.password){
          this.setState({
            confirmPasswordError:true,
            confirmPasswordMsg:this.props.t('translations:onboardingValidation.confirm_password_match')
          })

      }
      
      else {
        this.setState({
          confirmPasswordError:false,     
          confirmPasswordMsg:''
         
        })
      }
    }

        
}



    basicInformationChange = e => {

      let nameType  = e.target.name;
      let value = e.target.value;
      //this.setState({
      //  basicInformation: [ ...this.state.nameType, e.target.value],
     // })



     this.setState({
      basicInformation:{
        ...this.state.basicInformation,
        [nameType]: value
      }
    });
    
    

    if(e.target.name==='website'){
      if(e.target.value==='' || e.target.value===null || !e.target.value.match('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?') ){
        this.setState({
          websiteError:true
        })
      } 
      
      else {
        this.setState({
          websiteError:false,     
         
        })
      }
    }

    
    if(e.target.name==='password'){
      if(e.target.value==='' || e.target.value===null  ){
        this.setState({
          passwordError:true,
          passwordMsg:this.props.t('translations:onboardingValidation.password_field')
        })
      } else if(e.target.value.length < 6){
        this.setState({
          passwordError:true,
          passwordMsg:this.props.t('translations:onboardingValidation.confirm_password_digits')
        })

      }
      
      else {
        this.setState({
          passwordError:false,     
          passwordMsg:''
        
        })
      }
    }


    if(e.target.name==='phoneNumber'){
      if(e.target.value==='' || e.target.value===null ){
        this.setState({
          phoneNumberError:true,
          phoneNumberMsg:this.props.t('translations:onboardingValidation.phone')
        })
      }else if(!e.target.value.match(/^[0-9\b]+$/)){

        this.setState({
          phoneNumberError:true,
          phoneNumberMsg:this.props.t('translations:onboardingValidation.phone1')
        })
      } else if(e.target.value.length < 10){

        this.setState({
          phoneNumberError:true,
          phoneNumberMsg:this.props.t('translations:onboardingValidation.phone2')
        })
      } 
      
      else {
        this.setState({
          phoneNumberError:false,     
          phoneNumberMsg:''
         
        })
      }
    }

       
    }
   
    ossLngChange = () => {
           
       
       // this.state.selectedOssData = resultData;
       $(".tab-pane").removeClass("active show");
       //$('#'+prvStep).removeClass('active show');
        $('#tabt-1').addClass('active show');
       
       
      


    }
    questionDataChange = (e,type,field_id,field_title) => {

      const target = e.target;
      var value = target.value;

      if(type === 'Checkbox Type Box' || type === 'Checkbox Type Button'){
        if(target.checked){
          this.state.hobbies[value]= value;   
          }else{
            this.state.hobbies.splice(value, 1);
            //const newArray = this.state.hobbies.filter((item) => item.nameValue ===value);
         
          
          }

      }else{

        if(target.checked){
          this.state.hobbies= [value];   
          }else{
            this.state.hobbies.splice(value, 1);
            //const newArray = this.state.hobbies.filter((item) => item.nameValue ===value);
         
          
          }
      }
      
       
    }
    validate=(currentTab,activeTabeCount) => {
      let val = true;
     
      let select = document.getElementById(currentTab);
      
      select.querySelectorAll('#radio-container'+activeTabeCount).forEach(function(container) 
      {
 
        let radioChecked = container.querySelectorAll("input:checked");
        //container.style.backgroundColor = "white";
    
        
       if (!radioChecked.length) {
          val = val && false;
          //document.querySelector('#output'+activeTabeCount).text(this.props.t('translations:onboardingValidation.please_select_answer')) ;
         
          document.querySelector('#output'+activeTabeCount).innerText = "Please select answer";
          // container.append(" <b>Appended text</b>.");;
        }
      });
      return val;
    }
     handleNextStep = (stepIndex,prvStep,activeTabeCount,filedId,filedTitle,validationId) => {
     
      if (this.validate(prvStep,validationId)){
        let errors = {};
        this.setState({
          fetching:true,
          
        }) 
      //  if(this.state.hobbies.length === 0){
  
      //         errors["nextRequired"] = "please select one value";
      //         this.setState({ errors: errors,  fetching:false, });
           
              
                
  
      //  }else{
        const str = Object.values(this.state.hobbies).join(',');
       
              let config = {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify({
                  "session":localStorage.getItem('userBasicSession'),
                  "field_id":filedId,
                  "field_value": str,
                  "field_title":filedTitle,
                  "lang": this.props.language?this.props.language :'en',
                  "user_id": this.state.createdUserDetails.data.ID,
                  //"user_id": '39d1f738-71f5-43a6-bdfe-f107e3b95a48',
                  "oss_admin_id": this.props.selectedOssAdmin,
                  "country":  this.props.country,
                  "menu_type": this.props.residentsType
                })
              }
 
         fetch(ENDPOINTS.SERVER + '/user/input/data', config)
            .then(status => status.json().then(data => ({ data, status })))
            .then(({ data, status }) => {
              //this.stepDataGet();
              // alert({
              //   text: 'Add New Field Successfully',
              //   type: 'success',
              //   delay: 800,
              //   closer: true
              // });
              let ttt = activeTabeCount- 1;
              this.setState({
                fetching:false,
                
              }) 

              
         
              $(".tab-pane").removeClass("active show");
               $('#'+stepIndex).addClass('active show');
               $(".nav-link").removeClass("active show");
               $('li[id=tabStep-' + activeTabeCount + ']').find('a').addClass("active show")
               $("#customeTab > li:has(a[href='#tab-" +activeTabeCount+ "']):first()").find('a').addClass("active show")
               this.state.hobbies = []; 
               errors["nextRequired"] = "";
               this.setState({ errors: errors });
               this.forceUpdate()
               $("#output"+validationId).text('');
               
            })
            .catch(error => {
              alert({
                text: 'There was an error!',
                type: 'error',
                delay: 800,
                closer: true
              });
          });
      }

      
     
     // }
    }
   
    
    lastStepSubmit = (stepIndex,prvStep,activeTabeCount,filedId,filedTitle,validationId) => {

      if (this.validate(prvStep,validationId)){

      let errors = {};
      this.setState({
        fetching:true,
        
      }) 
    //  if(this.state.hobbies.length === 0){

    //       errors["nextRequired"] = "please select one value";
    //       this.setState({ errors: errors,fetching:false });

    //  }else{
      const str = Object.values(this.state.hobbies).join(',');
  
      let config = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          "session":localStorage.getItem('userBasicSession'),
          "field_id":filedId,
          "field_value": str,
          "field_title":filedTitle,
          "lang": this.props.language?this.props.language :'en',
          "user_id": this.state.createdUserDetails.data.ID,
          //"user_id": '39d1f738-71f5-43a6-bdfe-f107e3b95a48',
          "oss_admin_id": this.props.selectedOssAdmin,
          "country":  this.props.country,
          "menu_type": this.props.residentsType
        })
      }

  
       fetch(ENDPOINTS.SERVER + '/user/input/data', config)
          .then(status => status.json().then(data => ({ data, status })))
          .then(({ data, status }) => {
            
             this.state.hobbies = []; 
             errors["nextRequired"] = "";
             this.setState({ errors: errors });
             this.forceUpdate()
             this.props.lastStepSubmit();
             this.setState({
              fetching:false,
              
            }) 
          })
          .catch(error => {
            alert({
              text: 'There was an error!',
              type: 'error',
              delay: 800,
              closer: true
            });
        });
      }
      //}
    }


    handlePrevStep = (stepIndex,prvStep,activeTabeCount) => {
      let activeTbale = activeTabeCount;
      let kkk = prvStep - 1;
      
        //$("#customeTab > li").eq(stepKey + 2 ).css( "background-color", "red" );
       // $("#customeTab > li").eq(tttt - 1 ).css( "background-color", "black" );
 
       // $("#customeTab > li").eq(hhh ).find('a').addClass('active show');
       // $("#customeTab > ul li").eq(tttt - 1 ).removeClass('active show');
      //  $("#customeTab > li").eq(hhh - 1 ).find('a').removeClass('active show');
        
       // $('#'+tttt).removeClass('active show');
       //$('#'+stepIndex).removeClass('active show');
        //$('#'+prvStep).addClass('active show');
        $(".tab-pane").removeClass("active show");
       // $('#'+stepIndex).removeClass('active show');
        $('#tab-'+kkk).addClass('active show');

        $(".nav-link").removeClass("active show");

        $('li[id=tabStep-' + activeTbale + ']').find('a').addClass("active show");

        //$("#customeTab > li:has(a[href='#tab-" +activeTbale+ "']):first()").find('a').addClass("active show")
       // $("#customeTab > li:has(a[href='#tab-" +removeactiveTbale+ "']):first()").find('a').removeClass("active show")
       // $( "#mytabs > ul li:nth-child(2)" ).find('a').trigger('click')
        //$('#customeTab > .nav-item > .active').next('li').eq( 2 ).find('a').trigger('click');
    }
  
    handleValidation() {
     
      let  fields = this.state.basicInformation;
      let  errors = {};
      let  formIsValid = true;
     
      //Name
      if (!fields["name"]) {
        formIsValid = false;
        errors["name"] = this.props.t('translations:onboardingValidation.name');
        
      }
  
      if (!fields["surname"]) {
        formIsValid = false;
        errors["surname"] = this.props.t('translations:onboardingValidation.surname');
      }

       if (!fields["city"]) {
        formIsValid = false;
        errors["city"] = this.props.t('translations:onboardingValidation.city');
      }

      if (!fields["email"]) {
        formIsValid = false;

        this.state. emailError= true;
        //this.state.ConfirmEmailError = true;
        //this.state.ConfirmEmailErrorMsg = this.props.t('translations:onboardingValidation.enter_valid_value');
        

              this.forceUpdate()
      }

      if (!fields["confirm_email_data"]) {
        formIsValid = false;

       // this.state. emailError= true;
        this.state.ConfirmEmailError = true;
        this.state.ConfirmEmailErrorMsg = this.props.t('translations:onboardingValidation.enter_valid_value');
        

              this.forceUpdate()
      }
     
  if(this.props.residentsType === 'Housing Association'){
    
            if (!fields["type_of_organization"]) {
              formIsValid = false;
              errors["type_of_organization"] = this.props.t('translations:onboardingValidation.type_of_organization');
            }
            if (!fields["organization_name"]) {
              formIsValid = false;
              errors["organization_name"] = this.props.t('translations:onboardingValidation.organization_name');
            }

            if (!fields["registration_number"]) {
              formIsValid = false;
              errors["registration_number"] = this.props.t('translations:onboardingValidation.registration_number');
            }

            if (!fields["vat_number"]) {
              formIsValid = false;
              errors["vat_number"] = this.props.t('translations:onboardingValidation.vat_number');
            }

            if (!fields["address"]) {
              formIsValid = false;
              errors["address"] = this.props.t('translations:onboardingValidation.address');
            }

            if (!fields["legal_rep_org"]) {
              formIsValid = false;
              errors["legal_rep_org"] = this.props.t('translations:onboardingValidation.legal_rep_org');
            }
  
  }

  if (!fields["agree_checkbox"]) {
    formIsValid = false;
    errors["agree_checkbox"] = this.props.t('translations:onboardingValidation.agree_checkbox');
  }
 
      this.setState({ errors: errors });

      return formIsValid;
         
        }

        checkUserConfirmEmailExist = e => {


          let nameType  = e.target.name;
          let value = e.target.value;
         
      
         this.setState({
          basicInformation:{
            ...this.state.basicInformation,
            [nameType]: value
          }
        });
      
          if(e.target.name==='confirm_email_data'){
            if(e.target.value ==='' || e.target.value===null || !e.target.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) ){
              this.setState({
                ConfirmEmailError:true,
                ConfirmEmailErrorMsg:this.props.t('translations:onboardingValidation.enter_valid_value'),
              })
             
//   this.state. emailError= true;
      //   //this.state.ConfirmEmailError = true;
      //   //this.state.ConfirmEmailErrorMsg = this.props.t('translations:onboardingValidation.enter_valid_value');
        

      //         

            }else if(e.target.value !== this.state.basicInformation.email){
              this.setState({
                ConfirmEmailError:true,
                ConfirmEmailErrorMsg:this.props.t('translations:onboardingValidation.confirmation_email'),
                
              })
              
            } 
            
            else {
              this.setState({
                ConfirmEmailError:false,
                ConfirmEmailErrorMsg:"",     
               
              })

            }
          }
       
                  
          
            
          }

      checkUserEmailExist = e => {

        let nameType  = e.target.name;
        let value = e.target.value;
       
  
       this.setState({
        basicInformation:{
          ...this.state.basicInformation,
          [nameType]: value
        }
      });

      

      if(e.target.name==='email'){
        if(e.target.value==='' || e.target.value===null || !e.target.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) ){
          this.setState({
            emailError:true
          })
          this.forceUpdate()
        } 
        else {
          this.setState({
            emailError:false,     
           
          })
          this.forceUpdate()
        }
      }


          let config = {
            method: 'get',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain' },
           
          }
       
           fetch(ENDPOINTS.SERVER + '/onboarding/user/check?email='+value, config)
              .then(status => status.json().then(data => ({ data, status })))
              .then(({ data, status }) => {

                if(data.ID ){
                  confirmAlert({
                    title: this.props.t('translations:onboardingValidation.account_already_exists'),
                    message: this.props.t('translations:onboardingValidation.make_a_new_password'),
                    buttons: [
                      {
                        label: this.props.t('translations:navigation.yes'),
                        onClick: () => this.passwordConfirmation(false)
                      },
                      {
                        label: this.props.t('translations:navigation.no'),
                        onClick: () => this.passwordConfirmation(true)
                      }
                    ]
                  });
                  
                }else{

                  
                }
                
               
               
              })
              .catch(error => {
                alert({
                  text: 'We are Sorry.Something went wrong!',
                  type: 'error',
                  delay: 800,
                  closer: true
                });
            });
          
        }
  
    handleNextBasicInformation = () => {
     
   
      // $(".tab-pane").removeClass("active show");     
      //  $('#tab-3').addClass('active show');
      //  $(".nav-link").removeClass("active show");       
      //  $("#customeTab li").eq(2)

     
      if (this.handleValidation()  && this.state.ConfirmEmailError === false && this.state.confirmPasswordError === false && this.state.countryError === false) {
        // this.setState({
        //   fetching:true,
          
        // }) 
        $(".tab-pane").removeClass("active show");
        //$('#'+prvStep).removeClass('active show');
         $('#tab-3').addClass('active show');
  
         $(".nav-link").removeClass("active show");
         
         //$('#customeTab > .nav-item > .active').next('li').find('a').trigger('click');
         $("#customeTab li").eq(2)
let newPassword = '';

        if(this.state.passwordConfirm === false){

          newPassword = this.state.basicInformation.password;
        }else{

          newPassword = '';
        }
        
        let config = {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            "name":this.state.basicInformation.name,
            "surname":this.state.basicInformation.surname,
            "email":this.state.basicInformation.email,
            "phone_number":this.state.basicInformation.phoneNumber,
            "city": this.state.basicInformation.city,
            "country":  this.state.basicInformation.country,
            "post_code":this.state.basicInformation.postCode,
            "menu_type": this.props.residentsType,
            "lang": this.props.language?this.props.language :'en',
            "oss_admin_id":this.props.selectedOssAdmin,
            "password":newPassword,            
            "user_id": (Math.random() + 1).toString(36).substring(2),
            "org_type": this.state.basicInformation.type_of_organization,
            "org_name": this.state.basicInformation.organization_name,
            "reg_number": this.state.basicInformation.registration_number,
            "vat_number": this.state.basicInformation.vat_number,
            "reg_date":"2022-05-25T00:00:00Z",
            "website": this.state.basicInformation.website,
            "address": this.state.basicInformation.address,
            "legal_rep_org":this.state.basicInformation.legal_rep_org,
          })
        }

    
         fetch(ENDPOINTS.SERVER + '/onboarding/user/data', config)
            .then(status => status.json().then(data => ({ data, status })))
            .then(({ data, status }) => {
         
               this.setState({
                 createdUserDetails: data,
                 fetching:false,
                
               })
            // this.registerNewUser();
             this.props.onUpdateMode(data.data.ID);
           
             $(".tab-pane").removeClass("active show");
             //$('#'+prvStep).removeClass('active show');
              $('#tab-3').addClass('active show');
       
              $(".nav-link").removeClass("active show");
              
              //$('#customeTab > .nav-item > .active').next('li').find('a').trigger('click');
              $("#customeTab li").eq(2)

             
              //$("#customeTab > li:has(a[href='#tab-2']):first()").find('a').addClass("active show")
             //$('#customeTab > .nav-item > .active').parent().next('li').find('a').trigger('click');
             
            
             
            })
            .catch(error => {
              // this.setState({
               
              //   fetching:false,
                
              // })
              alert({
                text: this.props.t('translations:onboardingValidation.registration_number_already_exists'),
                type: 'error',
                delay: 800,
                closer: true
              });
          });
      }else{

       
      }

         
      
   }
     handleNextStepSub = () => {
      // $('#customeTab > .nav-item > .active').parent()
      //   if (!$("input[name='radioFruit']:checked").val()) {
      //     alert('Nothing is checked!');
      //     return false;
      // }
      // else {
      //   alert('One of the radio buttons is checked!');
      // }
        $('#mytabs  > .nav-item > .active').parent().next('li').find('a').trigger('click');
     }

     handlePrevStepSub = () => {
      
        $('#mytabs  > .nav-item > .active').parent().prev('li').find('a').trigger('click');
     }

     

    // componentDidMount(){       
    //     this.getOssStep();
        
    
    //   }

     
    
    
    // formFiledDataSave = (filedId,filedTitle) => {

      
    
    //   //const fieldName = e.target.name;
    //   //const key = e.target.key;
    //   //let value     = e.target.value;
     
    //     let config = {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'text/plain' },
    //       body: JSON.stringify({
    //         "session":localStorage.getItem('userBasicSession'),
    //         "field_id":filedId,
    //         "field_value": value,
    //         "field_title":filedTitle,
    //         "lang": this.props.language,
    //         "user_id": this.state.createdUserDetails.data.ID,
    //         "oss_admin_id": this.props.selectedOssAdmin,
    //         "country":  this.props.country,
    //         "menu_type": this.props.residentsType
    //       })
    //     }

    
    //      fetch(ENDPOINTS.SERVER + '/user/input/data', config)
    //         .then(status => status.json().then(data => ({ data, status })))
    //         .then(({ data, status }) => {
    //           //this.stepDataGet();
    //           // alert({
    //           //   text: 'Add New Field Successfully',
    //           //   type: 'success',
    //           //   delay: 800,
    //           //   closer: true
    //           // });
            
             
    //         })
    //         .catch(error => {
    //           alert({
    //             text: 'There was an error!',
    //             type: 'error',
    //             delay: 800,
    //             closer: true
    //           });
    //       });
    // };    

    
render() { 
    let count = 3;
    let count1 = 0;
    let basicSubCount = 0;
    let radioButtonCount =0;
    let nextStepcount = 4;
    let prvStepcount = 3;

    let backnextStepcount = 4;
    let backprvStepcount = 3;

    let activeTable =0;

    const langNode = (selectedValue) => {
  
      if (selectedValue === 'Vector.png')
        return (<img src={Vector} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""  />)
      else if (selectedValue === 'Group.png')
      return (<img src={Group} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      
      else if (selectedValue === 'snowflake_1.png')
      return (<img src={snowflake_1} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      
      else if (selectedValue === 'noise-pollution_1.png')
      return (<img src={noisePollution_1} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'fix_window.png')
      return (<img src={fix_window} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />) 
      else if (selectedValue === 'ac.png')
      return (<img src={AcImage} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'fix_window.png')
      return (<img src={fix_window} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'solar-panel.png')
      return (<img src={solarPanel} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'Group_1.png')
      return (<img src={Group_1} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'Group3837.png')
      return (<img src={Group3837} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      
      // else if (selectedValue === 'Central.png')
      // return (<img src={Central} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      
      
      
      else if (selectedValue === 'IMG_5322_1.png')
      return (<img src={image1} className="dropdown-toggle" type="button"  style={{marginTop:'10px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'ScreenShot.png')
      return (<img src={ScreenShot} className="dropdown-toggle" type="button"  style={{marginTop:'10px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'mfrkwcq1iwuz1.png')
      return (<img src={mfrkwcq1iwuz1} className="dropdown-toggle" type="button"  style={{marginTop:'10px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'old-block-houses1.png')
      return (<img src={oldBlockHouses1} className="dropdown-toggle" type="button"  style={{marginTop:'10px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      
     
    }
    
    const langNode1 = (selectedValue) => {
      
      if (selectedValue === 'Central.png')
      return (<img src={Central} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'None.png')
      return (<img src={None} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'Other.png')
      return (<img src={Other} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'Group38416.png')
      return (<img src={Group38416} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'Group3839.png')
      return (<img src={Group3839} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'Group3840.png')
      return (<img src={Group3840} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'energy_audits.png')
      return (<img src={energyAudits} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'technical_inspection.png')
      return (<img src={technicalInspection} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'project_design.png')
      return (<img src={projectDesign} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'construction.png')
      return (<img src={construction} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'roof1.png')
      return (<img src={roof1} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
      else if (selectedValue === 'Electric.png')
  return (<img src={Electric} className="dropdown-toggle" type="button"  style={{marginTop:'30px',cursor: 'pointer',height: '60px',border: '1px solid #fdc133',padding: '5px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)
  
      
     else
     return (<img src={Vector1} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""  />)
    
    }

    return (
        <React.Fragment>
            <div className="row row-eq-height align-middle my-auto animate__animated animate__fadeInRight"  >

                                <div className="col-md-12">
                               

                               <section className="signup-step-container" style={{ marginTop:'10px',marginBottom:'0px' }}>
                                   <div className="container">
                                       <div className="row d-flex ">
                                           <div className="col-md-12">
                                               <div className="wizard">
                                                       <div className="tab-content">
                                                     
                                                      
                                                                <div className="tab-pane active show" id="tabt-1">
                                                                       <div className="col-md-12">
                                                                            <div className="content-style2  mt-5">
                                                                                
                                                                                    <div className=" mb-5">
                                                                                   
                                                                                    <h2> {this.props.t('translations:ossOnboardingTitle.title2', { entity: this.props.selectedOssData.name })}</h2>
                                                                                        {/* <h2>Good news! Our {this.props.selectedOssData.name} OSS operates in your area. </h2> */}
                                                                                        <br/>
                                                                                        <div style={{fontWeight: '500',fontSize: '20px'}}>
                                                                                        {this.props.t('translations:ossOnboardingTitle.title3')}
                                                                                           
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    <div className=" mb-5" style={{border: '1px solid #6b728030',padding: '20px'}}>
                                                                                        <div style={{fontSize: '16px',fontFamily: 'Inter',fontWeight: '400',color: '#6B7280',fontFamily: "'Inter', sans-serif"}}>
                                                                                        {this.props.t('translations:ossOnboardingTitle.title4')}
                                                                                        </div>
                                                                                        <br/>
                                                                                        <div style={{fontSize: '16px',fontFamily: 'Inter',fontWeight: '400',color: '#6B7280',fontFamily: "'Inter', sans-serif"}}>
                                                                                        {this.props.t('translations:ossOnboardingTitle.title5')}
                                                                                        </div>
                                                                                    </div>
                                                                                  
                                                                                    <div className="d-block">
                                                                                        <button className="btn btn-primary btn-md btn-default welcomeButtone" onClick={() => this.props.handleNextStepNew()}
                                                                                            style={{ fontSize: '12px'}}>{this.props.t('translations:ossPreviewTitle.Letsstart')} !</button>
                                                                                    </div>
                                                                            
                                                                            </div>
                                                                        </div>

                                                                       </div>

                                                                       <div className="tab-pane" id="tabt-2">
                                                                       <h2 className="mb-3 mt-3">{this.props.t('translations:ossPreviewTitle.title5')}</h2>
                                                                            <div className="mb-3 mt-3" style={{ fontWeight:'500',fontSize:'14px' }}>
                                                                            {this.props.t('translations:ossPreviewTitle.title6')}
                                                                            </div>
                                                                       {(() => {

                                                                                    if(this.props.residentsType === 'Resident'){
                                                                                      return<> <div className="row mb-3 mt-3" id="getTouch">
                                                                                              <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                  <label htmlFor="inputEmail4">{this.props.t('translations:documents.name')} <span style={{ color:'red' }}>*</span></label>
                                                                                                  <input type="text" name="name" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:documents.name')}/>
                                                                                                  <span style={{ color: "red" }}>{this.state.errors["name"]}</span>
                                                                                                </div>
                                                                                              </div>
                                                                                              <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                  <label htmlFor="inputEmail4">{this.props.t('translations:recordsTitle.Surname')} <span style={{ color:'red' }}>*</span></label>
                                                                                                  <input type="text" name="surname" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:recordsTitle.Surname')}/>
                                                                                                  <span style={{ color: "red" }}>{this.state.errors["surname"]}</span>
                                                                                                </div>
                                                                                              </div>
                                                                                              <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                  <label htmlFor="inputEmail4">{this.props.t('translations:auth.email')} <span style={{ color:'red' }}>*</span></label>
                                                                                                  <input type="text" name="email" className="form-control" onChange={(e) => this.checkUserEmailExist(e)} placeholder={this.props.t('translations:auth.email')} autocomplete="off"/>
                                                                                                  {this.state.emailError === true ? <span style={{color: "red"}}>{this.props.t('translations:onboardingValidation.enter_valid_value')}</span> : ''} 
                                                                                                </div>
                                                                                              </div>

                                                                                              <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                  <label htmlFor="inputEmail4">{this.props.t('translations:auth.confirmEmail')} <span style={{ color:'red' }}>*</span></label>
                                                                                                  <input type="text" name="confirm_email_data" className="form-control" onChange={(e) => this.checkUserConfirmEmailExist(e)} placeholder={this.props.t('translations:auth.confirmEmail')} autocomplete="off"/>
                                                                                                  {this.state.ConfirmEmailError === true ? <span style={{color: "red"}}>{this.state.ConfirmEmailErrorMsg}</span> : ''} 
                                                                                                </div>
                                                                                              </div>
                
                                                                                              <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                  <label htmlFor="inputEmail4">{this.props.t('translations:organizations.phone')} <span style={{ color:'red' }}>*</span></label>
                                                                                                  <input type="text" name="phoneNumber" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:organizations.phone')}/>
                                                                                                  {this.state.phoneNumberError === true ? <span style={{color: "red"}}>{this.state.phoneNumberMsg}</span> : ''}
                                                                                                </div>
                                                                                              </div>
                                                                                              <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                <label htmlFor="inputEmail4">{this.props.t('translations:auth.country')} <span style={{ color:'red' }}>*</span></label>
                                                                                                    <br></br>
                                                                                                    <select className="select-country" name="country" id="location"style={{width:'100%',background: 'none',marginTop: '10px',color: '#6B7280',fontWeight: '500',fontSize: '11.602px'}} onChange={(e) => this.countryChange(e)} required>
                                                                                                    <option value="">{this.props.t('translations:auth.selectCountry')}</option>
                                                                                                    {countries.map((stepData, stepKey) => {
                                                                                                          
                                                                                                            return (<>
                                                                                                                      <option value={stepData.label}>{stepData.label}</option>
                                                                                                                   </>)
                                                                                                          
                                                                                                    })}
                                                                                                        </select>
                                                                                                        {this.state.countryError === true ? <span style={{color: "red"}}>{this.state.countryMsg}</span> : ''}
                                                                                                  </div>
                                                                                                </div>
                
                                                                                              <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                  <label htmlFor="inputEmail4">{this.props.t('translations:assets.city')} <span style={{ color:'red' }}>*</span></label>
                                                                                                  <input type="text" name="city" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:assets.city')}/>
                                                                                                  <span style={{ color: "red" }}>{this.state.errors["city"]}</span>
                                                                                                </div>
                                                                                              </div>
                                                                                              {(() => {

                                                                                                    if(this.state.passwordConfirm === false){
                                                                                                      return<>
                                                                                                            <div className="col-md-6">
                                                                                                              <div className="form-group">
                                                                                                                <label htmlFor="inputEmail4">{this.props.t('translations:auth.password')} <span style={{ color:'red' }}>*</span></label>
                                                                                                                <input type="password" name="password" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:auth.password')} autocomplete="off"/>
                                                                                                                {this.state.passwordError === true ? <span style={{color: "red"}}>{this.state.passwordMsg}</span> : ''}
                                                                                                              </div>
                                                                                                            </div>

                                                                                                            <div className="col-md-6">
                                                                                                              <div className="form-group">
                                                                                                                <label htmlFor="inputEmail4">{this.props.t('translations:auth.confirmPassword')} <span style={{ color:'red' }}>*</span></label>
                                                                                                                <input type="password" name="confirm_password" className="form-control" onChange={(e) => this.confirmPasswordChange(e)} placeholder={this.props.t('translations:auth.confirmPassword')} autocomplete="off"/>
                                                                                                                {this.state.confirmPasswordError === true ? <span style={{color: "red"}}>{this.state.confirmPasswordMsg}</span> : ''}
                                                                                                              </div>
                                                                                                            </div>
                                                                                                            </>
                                                                                                    
                                                                                                  }
  
                                                                                           })()}
                                                                                              
                                                                                            </div>
                                                                                        <div className="row">
                                                                                            <div className="col-md-12 mb-4">
                                                                                              <div className="form-group">
                                                                                                <input type="checkbox" name="agree_checkbox" onChange={(e) => this.basicInformationChange(e)}/>
                                                                                                    <label style={{fontFamily:'Inter',fontStyle:'normal',fontWeight:'500',fontSize:'12px',color:'#556775',marginLeft:'20px'}} >
                                                                                                    <span style={{ color:'red' }}>*</span>
                                                                                                    {this.props.t('translations:ossOnboardingTitle.title10')}
                                                                                                    
                                                                                                    </label>
                                                                                                    
                                                                                                </div>
                                                                                                <span style={{ color: "red" }}>{this.state.errors["agree_checkbox"]}</span>                                                                              
                                                                                            </div>                                                                        
                                                                                      </div>
                                                                                      <ul className="list-inline pull-left">                                                                        
                                                                                        <li> <button type="button"
                                                                                            className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextBasicInformation()}>{this.props.t('translations:navigation.next')} </button>
                                                                                        </li>
                                                                                      </ul>
                                                                                      </>
                                                                                    }else{
                                                                                      return<> <div className="row mb-3 mt-3" id="getTouch">
                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">{this.props.t('translations:documents.name')} <span style={{ color:'red' }}>*</span></label>
                                                                                          <input type="text" name="name" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:documents.name')}/>
                                                                                          <span style={{ color: "red" }}>{this.state.errors["name"]}</span>
                                                                                        </div>
                                                                                      </div>
                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">{this.props.t('translations:recordsTitle.Surname')} <span style={{ color:'red' }}>*</span></label>
                                                                                          <input type="text" name="surname" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:recordsTitle.Surname')}/>
                                                                                          <span style={{ color: "red" }}>{this.state.errors["surname"]}</span>
                                                                                        </div>
                                                                                      </div>

                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">{this.props.t('translations:auth.email')} <span style={{ color:'red' }}>*</span></label>
                                                                                          <input type="text" name="email" className="form-control" onChange={(e) => this.checkUserEmailExist(e)} placeholder={this.props.t('translations:auth.email')} autocomplete="off"/>
                                                                                          {this.state.emailError === true ? <span style={{color: "red"}}>{this.props.t('translations:onboardingValidation.enter_valid_value')}</span> : ''} 
                                                                                        </div>
                                                                                      </div>

                                                                                      <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                  <label htmlFor="inputEmail4">{this.props.t('translations:auth.confirmEmail')} <span style={{ color:'red' }}>*</span></label>
                                                                                                  <input type="text" name="confirm_email_data" className="form-control" onChange={(e) => this.checkUserConfirmEmailExist(e)} placeholder={this.props.t('translations:auth.confirmEmail')} autocomplete="off"/>
                                                                                                  {this.state.ConfirmEmailError === true ? <span style={{color: "red"}}>{this.state.ConfirmEmailErrorMsg}</span> : ''} 
                                                                                                </div>
                                                                                              </div>

                                                                                      {(() => {

                                                                                        if(this.state.passwordConfirm === false){
                                                                                          return<>
                                                                                                <div className="col-md-6">
                                                                                                  <div className="form-group">
                                                                                                    <label htmlFor="inputEmail4">{this.props.t('translations:auth.password')} <span style={{ color:'red' }}>*</span></label>
                                                                                                    <input type="password" name="password" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:auth.password')} autocomplete="off"/>
                                                                                                    {this.state.passwordError === true ? <span style={{color: "red"}}>{this.state.passwordMsg}</span> : ''}
                                                                                                  </div>
                                                                                                </div>
                                                                                                <div className="col-md-6">
                                                                                                              <div className="form-group">
                                                                                                                <label htmlFor="inputEmail4">{this.props.t('translations:auth.confirmPassword')} <span style={{ color:'red' }}>*</span></label>
                                                                                                                <input type="password" name="confirm_password" className="form-control" onChange={(e) => this.confirmPasswordChange(e)} placeholder={this.props.t('translations:auth.confirmPassword')} autocomplete="off"/>
                                                                                                                {this.state.confirmPasswordError === true ? <span style={{color: "red"}}>{this.state.confirmPasswordMsg}</span> : ''}
                                                                                                              </div>
                                                                                                            </div>
                                                                                                </>

                                                                                        }

                                                                                        })()}
                                                                                         <div className="col-md-6">
                                                                                                <div className="form-group">
                                                                                                <label htmlFor="inputEmail4">{this.props.t('translations:auth.country')} <span style={{ color:'red' }}>*</span></label>
                                                                                                    <br></br>
                                                                                                    <select className="select-country" name="country" id="location"style={{width:'100%',background: 'none',marginTop: '10px',color: '#6B7280',fontWeight: '500',fontSize: '11.602px'}} onChange={(e) => this.countryChange(e)} required>
                                                                                                    <option value="">{this.props.t('translations:auth.selectCountry')}</option>
                                                                                                    {countries.map((stepData, stepKey) => {
                                                                                                          
                                                                                                            return (<>
                                                                                                                      <option value={stepData.label}>{stepData.label}</option>
                                                                                                                   </>)
                                                                                                          
                                                                                                    })}
                                                                                                        </select>
                                                                                                        {this.state.countryError === true ? <span style={{color: "red"}}>{this.state.countryMsg}</span> : ''}
                                                                                                  </div>
                                                                                                </div>
                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">{this.props.t('translations:assets.city')} <span style={{ color:'red' }}>*</span></label>
                                                                                          <input type="text" name="city" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:assets.city')}/>
                                                                                          <span style={{ color: "red" }}>{this.state.errors["city"]}</span>
                                                                                        </div>
                                                                                      </div>
                                                                                      

                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">{this.props.t('translations:organizations.legalForm')} <span style={{ color:'red' }}>*</span></label>
                                                                                          <br></br>
                                                                                          
                                                                                          <select className="select-country" name="type_of_organization" id="location"style={{width:'100%',background: 'none',marginTop: '10px',color: '#6B7280',fontWeight: '500',fontSize: '11.602px'}} onChange={(e) => this.basicInformationChange(e)} required>
                                                                                      
                                                                                              <option value="">{this.props.t('translations:organizations.selectLegalForm')}</option>
                                                                                              <option value="10">Craftsman</option>
                                                                                              <option value="1">Financial institution</option>
                                                                                              <option value="8">Housing association</option>
                                                                                              {/* <option value="Natural person">Natural person</option> */}
                                                                                              <option value="5">NGO</option>
                                                                                              <option value="11">Operator</option>
                                                                                              <option value="12">OSS</option>
                                                                                              <option value="9">Professional</option>
                                                                                              <option value="3">Public Organization</option>
                                                                                              <option value="4">Residents' Community</option>
                                                                                              
                                                                                            
                                                                                            </select>
                                                                                         
                                                                                          <span style={{ color: "red" }}>{this.state.errors["type_of_organization"]}</span>
                                                                                        </div>
                                                                                      </div>
                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">{this.props.t('translations:organizations.legalNamePlaceholder')} <span style={{ color:'red' }}>*</span></label>
                                                                                          <input type="text" name="organization_name" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:organizations.legalNamePlaceholder')}/>
                                                                                          <span style={{ color: "red" }}>{this.state.errors["organization_name"]}</span>
                                                                                        </div>
                                                                                      </div>
                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">{this.props.t('translations:organizations.registrationNumber')} <span style={{ color:'red' }}>*</span></label>
                                                                                          <input type="text" name="registration_number" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:organizations.registrationNumber')}/>
                                                                                          <span style={{ color: "red" }}>{this.state.errors["registration_number"]}</span>
                                                                                        </div>
                                                                                      </div>
                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">{this.props.t('translations:organizations.vatNumber')} <span style={{ color:'red' }}>*</span></label>
                                                                                          <input type="text" name="vat_number" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:organizations.vatNumber')}/>
                                                                                          <span style={{ color: "red" }}>{this.state.errors["vat_number"]}</span>
                                                                                        </div>
                                                                                      </div>
                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4"> {this.props.t('translations:ossOnboardingTitle.Areyoualegal')} <span style={{ color:'red' }}>*</span></label>
                                                                                          <br></br>
                                                                                          <select className="select-country" name="legal_rep_org" id="location"style={{width:'100%',background: 'none',marginTop: '10px',color: '#6B7280',fontWeight: '500',fontSize: '11.602px'}} onChange={(e) => this.basicInformationChange(e)} required>
                                                                                          <option value="">{this.props.t('translations:ossOnboardingTitle.SelectValue')}</option>
                                                                                              <option value="Yes">{this.props.t('translations:navigation.yes')}</option>
                                                                                              <option value="No">{this.props.t('translations:navigation.no')}</option>
                                                                                            
                                                                                            </select>
                                                                                         
                                                                                          <span style={{ color: "red" }}>{this.state.errors["legal_rep_org"]}</span>
                                                                                        </div>
                                                                                      </div>
                                                                                      
                                                                                     

                                                                                

                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">{this.props.t('translations:profile.website')} <span style={{ color:'red' }}>*</span></label>
                                                                                   
                                                                                          <input type="text" name="website" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:profile.website')}/>
                                                                                          {this.state.websiteError === true ? <span style={{color: "red"}}>{this.props.t('translations:onboardingValidation.enter_valid_value')}</span> : ''}
                                                                                        </div>
                                                                                      </div>

                                                                                      
                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">{this.props.t('translations:organizations.phone')} <span style={{ color:'red' }}>*</span></label>
                                                                                          <input type="text" name="phoneNumber" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:organizations.phone')}/>
                                                                                          {this.state.phoneNumberError === true ? <span style={{color: "red"}}>{this.state.phoneNumberMsg}</span> : ''}
                                                                                        </div>
                                                                                      </div>
                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">{this.props.t('translations:profile.address')} <span style={{ color:'red' }}>*</span></label>
                                                                                          <input type="text" name="address" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:profile.address')}/>
                                                                                          <span style={{ color: "red" }}>{this.state.errors["address"]}</span>
                                                                                        </div>
                                                                                      </div>
                                                                                    
        
                                                                                     
        
        
                                                                                    </div>
                                                                                    <div className="row">
                                                                                            <div className="col-md-12 mb-4">
                                                                                              <div className="form-group">
                                                                                                <input type="checkbox" name="agree_checkbox" onChange={(e) => this.basicInformationChange(e)}/>
                                                                                                    <label style={{fontFamily:'Inter',fontStyle:'normal',fontWeight:'500',fontSize:'12px',color:'#556775',marginLeft:'20px'}} >
                                                                                                    <span style={{ color:'red' }}>*</span> {this.props.t('translations:essCalculaterResultTableTitle.IAgreetomypersonaldata')}
                                                                                                  
                                                                                                   </label>
                                                                                                    
                                                                                                </div>
                                                                                                <span style={{ color: "red" }}>{this.state.errors["agree_checkbox"]}</span>                                                                              
                                                                                            </div>                                                                        
                                                                                      </div>
                                                                              <ul className="list-inline pull-left">                                                                        
                                                                                <li> <button type="button"
                                                                                    className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextBasicInformation()}>{this.props.t('translations:navigation.next')}</button>
                                                                                </li>
                                                                              </ul>
                                                                              </>
                                                                                      
                                                                                    }
  
                                                                            })()}


                                                                     
                                                                            
                                                                 </div>
                                                                 
                                                                 {(() => {
                                                                          if(this.props.stepData.length === 0){ 
                                                                                 return (<>
                                                                                 <div class="tab-pane" id="tab-3">
                                                                                 
                                                                                 <div className="col-md-12">            
                                                                                 <section className="signup-step-container" style={{ marginTop: '10px', marginBottom: '0px' }}>
                                                                                   <div className="container">
                                                                                     <div className="row d-flex ">
                                                                                       <div className="col-md-12">
                                                                                         <div className="content-style2">
                                                                                           <div className=" mb-5">
                                                                                            
                                                                                             {(() => {
                                                                                                  if(this.props.residentsType === 'Housing Association'){
                                                                                                   return(<> 
                                                                     
                                                                                                              
                                                                                                     <div className="mt-5 mb-5">
                                                                                                
                                                                                                 <div style={{fontWeight: '500',fontSize: '20px'}}>
                                                                                                 <br></br>
                                                                                                  <br></br>                                                 
                                                                                                 {this.props.t('translations:ossOnboardingTitle.title10')}
                                                                                                  
                                                                                                    </div>
                                                                                               </div>
                                                                                               
                                                                                               <div className="d-block mt-5 mb-5">
                                                                                               <Link to={`/`} className="btn btn-primary btn-md btn-default welcomeButtone" style={{ lineHeight: '50px' }}>{this.props.t('translations:ossOnboardingTitle.Backtohomepage')}</Link>
                                                                                                  
                                                                                               </div>
                                                                                                 </>);
                                                                                                 }else{
                                                                                                   return(<> <div className="mt-5 mb-5">
                                                                                                    <h2 style={{ fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '800', fontSize: '21.2266px', color: '#4B4B4A' }}> {this.props.t('translations:ossOnboardingTitle.title11')}</h2>
                                                                                                    <br />
                                                                                                    <div style={{ fontWeight: '500', fontSize: '20px' }}>
                                                                                                    {this.props.t('translations:ossPreviewTitle.title9')}
                                                                                                           
                                                                                                             <br></br>
                                                                                                             <br></br>
                                                                                                             {this.props.t('translations:ossOnboardingTitle.title10')}
                                                                                                           </div>
                                                                                                           </div>
                                                                                                           <div className="d-block">
                                                                                                               <Link to={`/`} className="btn btn-primary btn-md btn-default welcomeButtone" style={{ lineHeight: '50px' }}>{this.props.t('translations:ossOnboardingTitle.Backtohomepage')}</Link>
                                                                                                              
                                                                                                             </div>
                                                                                                           </>);
                                                                                                 }
                                                                                               })()} 
                                                                                             
                                                                                           </div>
                                                                                           
                                                                                         </div>
                                                                                       </div>
                                                                                     </div>
                                                                                   </div>
                                                                     
                                                                                 </section>
                                                                               </div>
                                                                               </div>
                                                                               </>);
                                                                                 }else{

                                                                                  return (<>
                                                                                  
                                                                                  {this.props.stepData.map((stepData, stepKey) => {
                                                                                    let activeTabeCount = activeTable++;
                                                                                      return (<>
                                                                                             
                                                                                              
                                                                                                       {stepData.data.questions.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).map((questionData,questionsKey, arr) => {
                                                                                                        let pppp = nextStepcount++;
                                                                                                        let kkkk = prvStepcount++;
                                                                                                        let yyy = backnextStepcount++;
                                                                                                        let oooo = backprvStepcount++;
                                                                                                           return (<div className={stepKey === 0 ? "tab-pane" : "tab-pane"} id={'tab-' + count++} key={questionsKey}>
                                                                                                                  
                                                                                                                    {this.state.fetching
                                                                                                                          ?
                                                                                                                              <ProgressBar />
                                                                                                                          :
                                                                                                                          <>

                                                                                                                        
                                                                                                                <h2 className="mb-3 mt-3">{questionData.name}</h2>
                                                                                                                <span id={'output'+pppp}  style={{ color:'red',fontSize: '14px',float: 'left' }}></span>
                                                                                                                <br></br>
                                                                                                                <span style={{ color: "red" }}>{this.state.errors["nextRequired"]}</span>
                                                                                                                  {questionData.step_fields.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1 : -1).map((c, i) => (
                           
                                                                                                                           <>
                                                                                                                         <div  id={'radio-container'+pppp}>
                                                                                                                           {(() => {
                                                                                                                             
                                                                                                                             if(c.input_type === 'Text' || c.input_type === 'Number'){ 
                                                                                                                               return<div className="col-md-6 mb-2 " key={i}>
                                                                                                                                         <label htmlFor="inputEmail4">{c.name}
                                                                                                                                             {(() => {
                                                                                                                                                 if (c.require == true) {
                                                                                                                                                  return <> <span style={{ color:'red' }}>* </span> </>;
                                                                                                                                                 }
                                                                                                                                             })()}
                                                                                                                                         </label>
                             
                                                                                                                                         <input type={c.text_number} onBlur={(e) => this.questionDataChange(e,c.input_type,c.ID,questionData.name)}   className="form-control"
                                                                                                                                             placeholder={c.placeholder} />
                             
                                                                                                                                     </div>
                                                                                                                               }
                             
                                                                                                                               if (c.input_type === 'Dropdown') {                                                                                                   
                                                                                                                                 return<div className="col-md-6 mb-2 " key={i}>                                                                                                       
                                                                                                                                    <div className="form-group">
                                                                                                                                         <label htmlFor="inputEmail4">{c.name}</label>
                                                                                                                                         <select className="form-control" name=""
                                                                                                                                           style={{background: 'none',color:'#6B7280',fontWeight: '500',fontSize: '11.602px'}}>
                                                                                                                                               {c.options.sort((a, b) => a.CreatedAt < b.CreatedAt ? 1:-1).map((optionValue, optionKey) => {
                                                                                                                                       
                                                                                                                                                                     return ( 
                                                                                                                                                                       <option value={optionValue.option_value}>{optionValue.option_value}</option>
                                                                                                                                                                     );
                                                                                                                                                           })                                                                                                                                      
                                                                                                                                                           }                                                                                                               
                                                                                                                                         </select>
                                                                                                                                       </div>                                                                                                                                                                                                                                                                                                       
                                                                                                                                 </div>                                                                                                                                                                                                       
                                                                                                                               }
                                                                                                                                 if (c.input_type === 'Radio Type Button') {      
                           
                                                                                                                                   return <div className="row mb-2 mt-2"  key={i}><div className="col-md-12 mb-2 mt-2"> 
                                                                                                                                       <div className="row mb-2">
                                                                                                                                           {c.options.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).map((optionValue, optionKey) => (    
                                                                                                                                                                                                                                                                                                                                                                       
                                                                                                                                                           <div className="col-md-3" id="step5chk">                                                    
                                                                                                                                                             <input type="radio" id={optionValue.ID}  onChange={(e) => this.questionDataChange(e,c.input_type,c.ID,questionData.name)} name={c.ID} value={optionValue.option_value}/>
                                                                                                                                                             <label htmlFor={optionValue.ID}>{optionValue.option_value}</label>
                                                                                                                                                           </div>
                                                                                                                                                           ))
                                                                                                                                         }       
                                                                                                                                         </div>                                                                                                                                                                                                                                                                                           
                                                                                                                                   </div>   
                                                                                                                                   </div>                                                                                                                                                                                                    
                                                                                                                                 }    
                                                                                                                                 
                                                                                                                                 if (c.input_type === 'Checkbox Type Button') {     
                                                                                                                                                                                                                           
                                                                                                                                   return<div className="row mb-2 mt-2"  key={i}><div className="col-md-12 mb-2 mt-2" key={i}> 
                                                                                                                                   <div className="col-md-12" >
                                                                                                                                             <h2 style={{ fontWeight: '500',fontSize: '15px' }}>{this.props.t('translations:ossOnboardingTitle.title12')}:</h2> 
                                                                                                                                           </div>
                                                                                                                                         <br></br>
                                                                                                                                         <br></br>
                                                                                                                                   <div className="row mb-2">
                                                                                                                                           {c.options.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).map((optionValue, optionKey) => (                                                                                                                                                                                                                               
                                                                                                                                                           <div className="col-md-3" id="step5chk">
                                                                                                                                                             <input type="checkbox" id={optionValue.ID} onChange={(e) => this.questionDataChange(e,c.input_type,c.ID,questionData.name)} name={c.ID} value={optionValue.option_value}/>
                                                                                                                                                             <label htmlFor={optionValue.ID}>{optionValue.option_value}</label>
                                                                                                                                                           </div>
                                                                                                                                                           ))
                                                                                                                                         }       
                                                                                                                                         </div>                                                                                                                                                                                                                                                                                           
                                                                                                                                   </div>  
                                                                                                                                   </div>                                                                                                                                                                                                     
                                                                                                                                 }
                           
                                                                                                                                 if (c.input_type === 'Checkbox Type Box') {   
                                                                                                                                                                                                                                   
                                                                                                                                   return <div className="row mb-2 mt-2" key={i}> 
                                                                                                                                           <div className="col-md-12" >
                                                                                                                                             <h2 style={{ fontWeight: '500',fontSize: '15px' }}>{this.props.t('translations:ossOnboardingTitle.title12')}:</h2> 
                                                                                                                                           </div>
                                                                                                                                         <br></br>
                                                                                                                                         <br></br>
                                                                                                                                           {c.options.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).map((optionValue, optionKey) => (     
                                                                                                                                             <div className="col-md-3" id="step3chk" style={{height: '200px',marginBottom:'10PX' }}>                                                                                                                                                                                                                          
                                                                                                                                                         <input type="checkbox" id={optionValue.ID} onChange={(e) => this.questionDataChange(e,c.input_type,c.ID,questionData.name)}   name="hobbies" value={optionValue.option_value}/>
                                                                                                                                                               <label htmlFor={optionValue.ID}>
                                                                                                                                                                 <div className="serBox">
                                                                                                                                                                   <div className="row  row-eq-height" style={{height:'100px',marginRight: '0px', marginLeft: '0px'}}>
                                                                                                                                                                     <div className="col-md-12">
                                                                                                                                                                     <center>                                                                                                                                           
                                                                                                                                                                     {langNode(optionValue.image) ||langNode1(optionValue.image) }
                                                                                                                                                                       </center>
                                                                                                                                                                     </div>
                                                                                                                                                                   </div>
                                                                                                                                                                   <div className="row  row-eq-height" style={{height:'100px',marginRight: '0px', marginLeft: '0px'}}
                                                                                                                                                                     id="test">
                                                                                                                                                                     <div className="col-md-12">
                                                                                                                                                                       <p> {optionValue.option_value}</p>
                                                                                                                                                                     </div>
                                                                                                                                                                   </div>
                                                                                                                                                                 </div>
                                                                                                                                                               </label>
                                                                                                                                                           </div>
                                                                                                                                                           ))
                                                                                                                                         }       
                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                   </div>                                                                                                                                                                                                       
                                                                                                                                 }
                           
                                                                                                                                 if (c.input_type === 'Radio Type Box') {                                                                                                   
                                                                                                                                   return<div className="row mb-5 mt-5" key={i}> 
                                                                                                                                     
                                                                                                                                           {c.options.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).map((optionValue, optionKey) => (     
                                                                                                                                             <div className="col-md-3" id="step3chk" style={{height: '200px',marginBottom:'10PX' }}>                                                                                                                                                                                                                          
                                                                                                                                                         <input type="radio" id={optionValue.ID} onChange={(e) => this.questionDataChange(e,c.input_type,c.ID,questionData.name)} name={c.ID}value={optionValue.option_value}/>
                                                                                                                                                               <label htmlFor={optionValue.ID}>
                                                                                                                                                                 <div className="serBox">
                                                                                                                                                                   <div className="row  row-eq-height" style={{height:'100px',marginRight: '0px', marginLeft: '0px'}}>
                                                                                                                                                                     <div className="col-md-12">
                                                                                                                                                                     <center>                                                                                                                                           
                                                                                                                                                                     {langNode(optionValue.image) ||langNode1(optionValue.image) }
                                                                                                                                                                       </center>
                                                                                                                                                                     </div>
                                                                                                                                                                   </div>
                                                                                                                                                                   <div className="row  row-eq-height" style={{height:'100px',marginRight: '0px', marginLeft: '0px'}}
                                                                                                                                                                     id="test">
                                                                                                                                                                     <div className="col-md-12">
                                                                                                                                                                       <p> {optionValue.option_value}</p>
                                                                                                                                                                     </div>
                                                                                                                                                                   </div>
                                                                                                                                                                 </div>
                                                                                                                                                               </label>
                                                                                                                                                           </div>
                                                                                                                                                           ))
                                                                                                                                         }       
                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                   </div>                                                                                                                                                                                                       
                                                                                                                                 }
                                                                                                                           })()}
                                                                                                                   </div>
                                                                                                                           <br></br>
                                                                                                                           <br></br>
                                                                                                                           <br></br>
                                                                                                                           {(() => {
                                                                                                                            
                                                                                                                            if (questionsKey === 0  && stepKey === 0) {
                                                                                                                             return <ul className="list-inline pull-left">
                                                                                                                             
                           
                                                                                                                             <li> <button type="button"
                                                                                                                                 className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep('tab-' + pppp,'tab-' + kkkk ,activeTabeCount,c.ID,questionData.name,pppp)}>{this.props.t('translations:navigation.next')}</button>
                                                                                                                             </li>
                                                                                                                           </ul>
                           
                                                                                                                            }else if(stepData.data.questions.length ===  questionsKey + 1 && this.props.stepData.length !==  stepKey + 1){
                                                                                                                             return <ul className="list-inline pull-left">
                                                                                                                               
                                                                                                                                     <li> <button type="button"
                                                                                                                                         className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>{this.props.t('translations:navigation.back')}</button>
                                                                                                                                     </li>
                           
                                                                                                                                     <li> <button type="button"
                                                                                                                                         className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep('tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>{this.props.t('translations:navigation.next')}</button>
                                                                                                                                     </li>
                                                                                                                                   </ul>
                           
                                                                                                                       }else if(this.props.stepData.length ===  stepKey + 1 && stepData.data.questions.length === 1){
                                                                                                                             return <ul className="list-inline pull-left">
                                                                                                                                    <li> <button type="button"
                                                                                                                                         className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>{this.props.t('translations:navigation.back')}</button>
                                                                                                                                     </li>
                                                                                                                                     <li> <button type="button"
                                                                                                                                         className="btn btn-primary btn-md btn-default next-step-sub"  onClick={() => this.lastStepSubmit('tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>{this.props.t('translations:milestones.submit')}</button>
                                                                                                                                     </li>
                           
                                                                                                                                   </ul>
                           
                                                                                                                            }else if(this.props.stepData.length ===  stepKey + 1 && stepData.data.questions.length  === questionsKey +1 ){
                                                                                                                             return <ul className="list-inline pull-left">
                                                                                                                                    <li> <button type="button"
                                                                                                                                         className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>{this.props.t('translations:navigation.back')}</button>
                                                                                                                                     </li>
                                                                                                                                     <li> <button type="button"
                                                                                                                                         className="btn btn-primary btn-md btn-default next-step-sub"  onClick={() => this.lastStepSubmit('tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>{this.props.t('translations:milestones.submit')}</button>
                                                                                                                                     </li>
                           
                                                                                                                                   </ul>
                           
                                                                                                                            }  else {
                                                                                                                             return <ul className="list-inline pull-left">
                                                                                                                              
                                                                                                                                     <li> <button type="button"
                                                                                                                                         className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>{this.props.t('translations:navigation.back')}</button>
                                                                                                                                     </li>
                           
                                                                                                                                     <li> <button type="button"
                                                                                                                                         className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep('tab-' +pppp,'tab-' + kkkk ,activeTabeCount,c.ID,questionData.name,pppp)}>{this.props.t('translations:navigation.next')}</button>
                                                                                                                                     </li>
                                                                                                                                   </ul>
                                                                                                                            }
                                                                                                                             })()} 
                                                                                                                           </>
                                                                                                                           
                                                                                                                         ))}
                                                                                                                        
                                                                                                                        </>
                                                                                                                      }   
                                                                                                                 </div>);
                                                                                                                 
                                                                                                                  }
                                                                                                          )
                                          
                                                                                                          }
                                                                                                       
                                                                                                      
                                                                                                       </>
                                                                                      );
                                                                                                         }
                                                                                           )
                                                                                          
                                                                                           } </>);
                                                                                 }
                                                                         })()}
                                                               
                                                       

                                                            
                                                           
                                                       </div>

                                                       {/* <p id="output" style={{ color:'red',fontSize: '14px',float: 'left' }}></p> */}

                                               </div>
                                           </div>

                                       </div>
                                   </div>

                               </section>
                           </div>
                    </div>
        </React.Fragment>
    );
}
}

export default connect(
    state => ({
        alerts: state.alerts.pending,
        menus: state.oss_menus,
        userdata: state.user.profileInfo.data,
        country: state.user.country,
        language: state.user.language,
        createdUserId: state.createdUserId,
    }),
    dispatch => ({

        getPRUsers: () => dispatch(getPRUsersAction()),

    })
)(OssStepFrom);