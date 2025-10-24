import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
    Grid,
    makeStyles,
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import ProgressBar from '../../../../../components/utils/ProgressBar';
import NavContainer from '../../../../smartcomponents/EESNavcontainer';
import EESFooter from '../../../../smartcomponents/EESFooter';
import SelectLanguageModel from '../../../../smartcomponents/SelectLanguageModel';
import EESNavigationMenu from '../../../../smartcomponents/EESNavigationMenu';

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


import '../../../../../styles/assets/css/bootstrap.min.css';
import '../../../../../styles/assets/css/stepwizard.css';
//images
import logo_footer2 from '../../../../../styles/assets/images/logo-footer2.png';
import Logo_europa_White from '../../../../../images/3SUNShiNE_Black.svg';
import calculaadora from '../../../../../styles/assets/calculaadora.png';
import quizHomeIcon from '../../../../../styles/assets/quizHomeIcon.png';

import icon_calc from '../../../../../styles/assets/images/icon-calc.png';
import energy_drivers from '../../../../../styles/assets/energy_drivers.png';
import economic_text from '../../../../../styles/assets/economic_text.png';
import bolt_1 from '../../../../../styles/assets/bolt_1.png';
import database from '../../../../../styles/assets/database.png';


import Vector from '../../../../../styles/assets/Vector.png';
import Group from '../../../../../styles/assets/Group.png';
import noisePollution_1 from '../../../../../styles/assets/noise-pollution_1.png';
import fix_window from '../../../../../styles/assets/fix_window.png';
import AcImage from '../../../../../styles/assets/ac.png';
import solarPanel from '../../../../../styles/assets/solar-panel.png';
import Group_1 from '../../../../../styles/assets/Group_1.png';
import Group3837 from '../../../../../styles/assets/Group3837.png';
import image1 from '../../../../../styles/assets/IMG_5322_1.png';
import ScreenShot from '../../../../../styles/assets/ScreenShot.png';
import mfrkwcq1iwuz1 from '../../../../../styles/assets/mfrkwcq1iwuz1.png';
import oldBlockHouses1 from '../../../../../styles/assets/old-block-houses1.png';
import snowflake_1 from '../../../../../styles/assets/snowflake_1.png';
import Central from '../../../../../styles/assets/Central.png';


import getCookie from '../../../../../components/utils/getCookie';
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';

import { useSelector } from 'react-redux';
import ENDPOINTS from '../../../../../constants/endpoints';
import { setCalcMenuItems } from '../../../../../actions/calcmenu';

import {
    searchUsers as searchUsersAction,
    getUsersByPlatformRoles as getPRUsersAction,
} from '../../../../../actions/users';
import publicIp from 'public-ip';

import Vector1 from '../../../../../styles/assets/Vector1.png';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


class OssStepFrom extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            stepData: [],
            errors: {},
            createdUserId:'',
            fetching: false,
            skipQuestion: false,
            passwordConfirm:false,
            basicInformation: {
                                country:this.props.selectedCountry,
                                type:'Service Operator',
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
                                city:'',
                                agree_checkbox:'',    
                                registration_date:'',
                                legal_form:'',
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
      this.forceUpdate()
     
    }
    validateWebsiteUrl = websiteUrl => {
      const urlRegEx =
        '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
      return urlRegEx.match(websiteUrl);
    };
    basicInformationChange = e => {

      const nameType  = e.target.name;
      const value = e.target.value;
      const target = e.target;
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
          passwordMsg:'password field is required'
        })
      } else if(e.target.value.length < 6){
        this.setState({
          passwordError:true,
          passwordMsg:'password requirements minimum 6 characters or digits'
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
      if(e.target.value==='' || e.target.value===null  ){
        this.setState({
          phoneNumberError:true,
          phoneNumberMsg:'phone field is required'
        })
      }else if(!e.target.value.match(/^[0-9\b]+$/)){

        this.setState({
          phoneNumberError:true,
          phoneNumberMsg:'this entry can only consider numbers'
        })
      } else if(e.target.value.length < 10){

        this.setState({
          phoneNumberError:true,
          phoneNumberMsg:'Phone number should be not less than ten characters'
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
      } 
      
      else {
        this.setState({
          emailError:false,     
         
        })
      }
    }
              
      
     
        
      }
    questionDataChange = (e,type,field_id,field_title) => {

      const target = e.target;
      var value = target.value;

      if(field_title === 'Organisation type' || field_title === 'Organization type' || field_title === 'Organisation Type' || field_title === 'Organization Type'){
        
        this.props.organizationTypeUpdate(value);
      }
      if(type === 'Checkbox Type Box' || type === 'Checkbox Type Button'){
        if(target.checked){
          this.state.hobbies[value]= value;   
          }else{
            this.state.hobbies.splice(value, 1);
            //const newArray = this.state.hobbies.filter((item) => item.nameValue ===value);
       
          
          }

      }else{

        //if(target.checked){
          this.state.hobbies= [value];   
         // }else{
           // this.state.hobbies.splice(value, 1);
            //const newArray = this.state.hobbies.filter((item) => item.nameValue ===value);
         
          
         // }
      }
      
      
       
    }
    validate=(type,currentTab,activeTabeCount) => {
      let val = true;
     
      let select = document.getElementById(currentTab);
      
      select.querySelectorAll('#radio-container'+activeTabeCount).forEach(function(container) 
      {
      

         if(type ==='Dropdown'){

             let radioChecked1 = container.querySelector(".quantityDropdown");
          //container.style.backgroundColor = "white";
         
            if(radioChecked1.value === '') {
                val = val && false;
                document.querySelector('#output'+activeTabeCount).innerText = "Please select option";
              // container.append(" <b>Appended text</b>.");;
              }
         }else  if(type ==='Text' || type === 'Number'){

          let radioChecked2 = container.querySelector(".quantityDropdown");
       //container.style.backgroundColor = "white";
     
         if(radioChecked2.value === '') {
             val = val && false;
             document.querySelector('#output'+activeTabeCount).innerText = "Please enter a value";
           // container.append(" <b>Appended text</b>.");;
           }
      }else{

            
              let radioChecked = container.querySelectorAll("input:checked");
              //container.style.backgroundColor = "white";
            
              if(!radioChecked.length) {
                val = val && false;
                document.querySelector('#output'+activeTabeCount).innerText = "Please select answer";
              // container.append(" <b>Appended text</b>.");;
              }
         }
       


        // if(!radioChecked.length) {
        //   val = val && false;
        //   document.querySelector('#output'+activeTabeCount).innerText = "Please select answer";
        //  // container.append(" <b>Appended text</b>.");;
        // }
      });
      return val;
    }
     handleNextStep = (type,stepIndex,prvStep,activeTabeCount,filedId,filedTitle,validationId) => {
     
      if (this.validate(type,prvStep,validationId)){
        let errors = {};
        this.setState({
          fetching:true,
          
        }) 
  //      if(this.state.hobbies.length === 0){
  
  // errors["nextRequired"] = "please select one value";
  // this.setState({ errors: errors });
  
  //      }else{

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


      }

      
     
      //}
    }

    lastStepSubmit = (type,stepIndex,prvStep,activeTabeCount,filedId,filedTitle,validationId) => {

      if (this.validate(type,prvStep,validationId)){

      let errors = {};
      this.setState({
        fetching:true,
        
      }) 
//      if(this.state.hobbies.length === 0){

// errors["nextRequired"] = "please select one value";
// this.setState({ errors: errors });

//      }else{

  $(".nav-link").removeClass("active show");
  $('li[id=tabStep-3]').find('a').addClass("active show")
  $("#customeTab > li:has(a[href='#tab-3']):first()").find('a').addClass("active show")
   this.state.hobbies = []; 
   errors["nextRequired"] = "";
   this.setState({ errors: errors });
   this.forceUpdate()
   this.props.lastStepSubmit();
   this.setState({
    fetching:false,
    
  }) 

     
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
      let fields = this.state.basicInformation;
      let errors = {};
      let formIsValid = true;
  
      //Name
      if (!fields["name"]) {
        formIsValid = false;
        errors["name"] = "Name field is required";
      }
  
      // if (typeof fields["name"] !== "undefined") {
      //   if (!fields["name"].match(/^[a-zA-Z]+$/)) {
      //     formIsValid = false;
      //     errors["name"] = "Only letters";
      //   }
      // }

      //surname
      if (!fields["surname"]) {
        formIsValid = false;
        errors["surname"] = "Surname field is required";
      }

      // if (typeof fields["surname"] !== "undefined") {
      //   if (!fields["surname"].match(/^[a-zA-Z]+$/)) {
      //     formIsValid = false;
      //     errors["surname"] = "Only letters";
      //   }
      // }
      //Email
      // if (!fields["email"]) {
      //   formIsValid = false;
      //   errors["email"] = "Email field is required";
      // }
      // if (typeof fields["email"] !== "undefined") {
      //   let lastAtPos = fields["email"].lastIndexOf("@");
      //   let lastDotPos = fields["email"].lastIndexOf(".");
      //   if (
      //     !(
      //       lastAtPos < lastDotPos &&
      //       lastAtPos > 0 &&
      //       fields["email"].indexOf("@@") == -1 &&
      //       lastDotPos > 2 &&
      //       fields["email"].length - lastDotPos > 2
      //     )
      //   ) {
      //     formIsValid = false;
      //     errors["email"] = "Email is not valid";
      //   }
      // }
       //city
       if (!fields["city"]) {
        formIsValid = false;
        errors["city"] = "City field is required";
      }
      if (!fields["registration_date"]) {
        formIsValid = false;
        errors["registration_date"] = "Registration date field is required";
      }
      
      //phoneNumber
      // if (!fields["phoneNumber"] ) {
      //   formIsValid = false;
      //   errors["phoneNumber"] = "Phone Number field is required";
      // }
      // let pattern = new RegExp(/^[0-9\b]+$/);

      // if (!pattern.test(fields["phoneNumber"])) {

      //   formIsValid = false;

      //   errors["phoneNumber"] = "Please enter only number.";

      // }
  // else if(input["phone"].length != 10){

  //   isValid = false;

  //   errors["phone"] = "Please enter valid phone number.";

  // }
  //phoneNumber
  
  // if (!fields["password"] && this.state.passwordConfirm === false) {
  //   formIsValid = false;
  //   errors["password"] = "password field is required";
  // }


  if (!fields["website"]) {
    formIsValid = false;
    errors["website"] = "website field is required";
  }
           
            if (!fields["organization_name"]) {
              formIsValid = false;
              errors["organization_name"] = "Organization Name field is required";
            }

            if (!fields["registration_number"]) {
              formIsValid = false;
              errors["registration_number"] = "Registration Number field is required";
            }

            if (!fields["vat_number"]) {
              formIsValid = false;
              errors["vat_number"] = "VAT Number field is required";
            }

            if (!fields["address"]) {
              formIsValid = false;
              errors["address"] = "Address Name field is required";
            }

          
            if (!fields["legal_rep_org"]) {
              formIsValid = false;
              errors["legal_rep_org"] = "legal representative field is required";
            }
  
  

  if (!fields["agree_checkbox"]) {
    formIsValid = false;
    errors["agree_checkbox"] = "You must agree to terms and conditions";
  }
 
      this.setState({ errors: errors });

    
          return formIsValid;
        }
  
    handleNextBasicInformation = () => {

   
      // $(".tab-pane").removeClass("active show");     
      //  $('#tab-3').addClass('active show');
      //  $(".nav-link").removeClass("active show");       
      //  $("#customeTab li").eq(2)

      if (this.handleValidation() && this.state.websiteError !== true && this.state.phoneNumberError !== true && this.state.emailError !== true  && this.state.passwordError!== true) {
        this.setState({
          fetching:true,
          
        }) 


        let newPassword = '';

        if(this.state.passwordConfirm === false){

          newPassword = this.state.basicInformation.password;
        }else{

          newPassword = '';
        }

        this.setState({
          createdUserDetails: '',
          fetching:false,
          
        }) 
       
       $(".tab-pane").removeClass("active show");
       //$('#'+prvStep).removeClass('active show');
        $('#tab-3').addClass('active show');
 
        $(".nav-link").removeClass("active show");
        
        //$('#customeTab > .nav-item > .active').next('li').find('a').trigger('click');
        $("#customeTab li").eq(2)


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
    const { t} = this.props;
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
                                                       <div className="tab-content mb-5">
                                                       <div className="tab-pane active show" id="tabt-1">
                                                                      <div className="col-md-12 mb-5">
                                                                          <div className="content-style2">                          
                                                                            <div className=" mb-5">
                                                                              <h2> {t('translations:ossPreviewTitle.title13')}</h2>                                                                            
                                                                                <br/>
                                                                                <div style={{fontWeight:'500',fontSize:'20px' }} >
                                                                                {t('translations:ossPreviewTitle.Findouthow')}
                                                                                </div>
                                                                            </div>
                                                                              <div className=" mb-5" style={{border:'1px solid #6b728030',padding:'20px' }}>
                                                                                <div style={{fontSize:'16px',fontFamily:'Inter',fontWeight:'400',color:'#6B7280',fontFamily:"'Inter', sans-serif" }} >
                                                                                  <p style={{ textAlign: 'left' }}>{t('translations:ossPreviewTitle.title14')}</p>
                                                                                  <p style={{ textAlign: 'left' }}>{t('translations:ossPreviewTitle.title15')}</p>
                                                                                </div>
                                                                                <br/>
                                                                                <div style={{fontSize:'16px',fontFamily:'Inter',fontWeight:'400',color:'#6B7280',fontFamily:"'Inter', sans-serif" }}>
                                                                                {t('translations:ossPreviewTitle.title4')} 
                                                                                </div>
                                                                              </div>
                                                                            <div className="d-block">
                                                                              <button type="button" name="submit"  onClick={() => this.props.handleNextStepNew()}
                                                                                className="btn btn-primary btn-md btn-default welcomeButtone"> {t('translations:ossPreviewTitle.Letsstart')} </button>
                                                                            </div>								
                                                                          </div>
                                                                        </div>
                                                                    </div>
                                                       {this.state.fetching
                                                              ?
                                                                  <ProgressBar />
                                                              :
                                                              <>
                                                      
                                                                

                                                                       <div className="tab-pane" id="tabt-2">
                                                                       <h2 className="mb-5 mt-2"> {t('translations:ossPreviewTitle.title5')} </h2>
                                                                            <div className="mb-2 mt-2" style={{ fontWeight:'500',fontSize:'14px' }}>
                                                                            {t('translations:ossPreviewTitle.title6')}  
                                                                            </div>
                                                                            <div className="row mb-2 mt-2" id="getTouch">
                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                    <label htmlFor="inputEmail4">Name</label>
                                                                                    <input type="text" name="name" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="Name"/>
                                                                                    <span style={{ color: "red" }}>{this.state.errors["name"]}</span>
                                                                                    
                                                                                  </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                    <label htmlFor="inputEmail4">Surname</label>
                                                                                    <input type="text" name="surname" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="Surname"/>
                                                                                    <span style={{ color: "red" }}>{this.state.errors["surname"]}</span>
                                                                                  </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                    <label htmlFor="inputEmail4">Email</label>
                                                                                    <input type="text" name="email" className="form-control"  onChange={(e) => this.checkUserEmailExist(e)} placeholder="Email"/>
                                                                                    {this.state.emailError === true ? <span style={{color: "red"}}>Please Enter valid value</span> : ''} 
                                                                                  </div>
                                                                                </div>
                                                                                {(() => {

                                                                                if(this.state.passwordConfirm === false){
                                                                                  return<>
                                                                                        <div className="col-md-6">
                                                                                          <div className="form-group">
                                                                                            <label htmlFor="inputEmail4">Password</label>
                                                                                            <input type="text" name="password" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="Password"/>
                                                                                            {this.state.passwordError === true ? <span style={{color: "red"}}>{this.state.passwordMsg}</span> : ''}
                                                                                          </div>
                                                                                        </div>
                                                                                        </>

                                                                                }

                                                                                })()}

                                                                                <div className="col-md-6">
                                                                                          <div className="form-group">
                                                                                            <label htmlFor="inputEmail4">Are you a legal representative of this Organization?</label>
                                                                                            <br></br>
                                                                                            <select className="select-country" name="legal_rep_org" id="location"style={{width:'100%',background: 'none',marginTop: '10px',color: '#6B7280',fontWeight: '500',fontSize: '11.602px'}} onChange={(e) => this.basicInformationChange(e)} required>
                                                                                            <option value="">Select Value</option>
                                                                                                <option value="Yes">Yes</option>
                                                                                                <option value="No">No</option>
                                                                                              
                                                                                              </select>
                                                                                            
                                                                                            <span style={{ color: "red" }}>{this.state.errors["legal_rep_org"]}</span>
                                                                                          </div>
                                                                                        </div>
                                                                                        <div className="col-md-6">
                                                                                          <div className="form-group">
                                                                                            <label htmlFor="inputEmail4">Organization name</label>
                                                                                            <input type="text" name="organization_name" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="Name of Organization"/>
                                                                                            <span style={{ color: "red" }}>{this.state.errors["organization_name"]}</span>
                                                                                          </div>
                                                                                        </div>
                                                                                        <div className="col-md-6">
                                                                                          <div className="form-group">
                                                                                            <label htmlFor="inputEmail4">Registration Number</label>
                                                                                            <input type="text" name="registration_number" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="Registration Number"/>
                                                                                            <span style={{ color: "red" }}>{this.state.errors["registration_number"]}</span>
                                                                                          </div>
                                                                                        </div>
                                                                                        <div className="col-md-6">
                                                                                          <div className="form-group">
                                                                                            <label htmlFor="inputEmail4">VAT number</label>
                                                                                            <input type="text" name="vat_number" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="VAT number"/>
                                                                                            <span style={{ color: "red" }}>{this.state.errors["vat_number"]}</span>
                                                                                          </div>
                                                                                        </div>
                                                                                        <div className="col-md-6">
                                                                                          <div className="form-group">
                                                                                            <label htmlFor="inputEmail4">Registration date</label>
                                                                                            <input type="date" name="registration_date" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="VAT number"/>
                                                                                            <span style={{ color: "red" }}>{this.state.errors["registration_date"]}</span>
                                                                                          </div>
                                                                                        </div>
                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                    <label htmlFor="inputEmail4">Phone</label>
                                                                                    <input type="text" name="phoneNumber" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="Phone"/>
                                                                                    {this.state.phoneNumberError === true ? <span style={{color: "red"}}>{this.state.phoneNumberMsg}</span> : ''}
                                                                                  </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                    <label htmlFor="inputEmail4">Website</label>
                                                                                    <input type="text" name="website" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="www.exmplae.org"/>
                                                                                    {this.state.websiteError === true ? <span style={{color: "red"}}>Please Enter valid value</span> : ''}
                                                                                    
                                                                                    
                                                                                  </div>
                                                                                </div>
                                                                              
                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                    <label htmlFor="inputEmail4">City</label>
                                                                                    <input type="text" name="city" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="City"/>
                                                                                    <span style={{ color: "red" }}>{this.state.errors["city"]}</span>
                                                                                  </div>
                                                                                </div>
                                                                               

                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                    <label htmlFor="inputEmail4">Address</label>
                                                                                    <input type="text" name="address" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="Address"/>
                                                                                    <span style={{ color: "red" }}>{this.state.errors["address"]}</span>
                                                                                  </div>
                                                                                </div>

                                                                                {/* <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                    <label htmlFor="inputEmail4">Organisation type</label>
                                                                                    <select className="select-country" name="legal_form" onChange={(e) => this.basicInformationChange(e)} id="location"style={{width:'100%',background: 'none',marginTop: '10px',color: '#6B7280',fontWeight: '500',fontSize: '11.602px'}} onChange={(e) => this.basicInformationChange(e)} required>
                                                                                            <option value="">Select type</option>
                                                                                                <option value="9">Professional</option>
                                                                                                <option value="10">Craftsman</option>
                                                                                                <option value="11">Market Operator</option>
                                                                                                
                                                                                              </select>
                                                                                    
                                                                                  </div>
                                                                                </div>

                                                                             
                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                    <label htmlFor="inputEmail4">Types of services</label>
                                                                                    <select className="select-country" name="legal_rep_org" id="location"style={{width:'100%',background: 'none',marginTop: '10px',color: '#6B7280',fontWeight: '500',fontSize: '11.602px'}} onChange={(e) => this.basicInformationChange(e)} required>
                                                                                            <option value="">Select type</option>
                                                                                                <option value="Energy Audits">Energy Audits</option>
                                                                                                <option value="Technical Inspections">Technical Inspections</option>
                                                                                                <option value="Project Design">Project Design</option>
                                                                                                <option value="Construction">Construction</option>
                                                                                                <option value="Other">Other</option>
                                                                                                
                                                                                              </select>
                                                                                    
                                                                                  </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                    <label htmlFor="inputEmail4">Certifications</label>
                                                                                    <select className="select-country" name="legal_rep_org" id="location"style={{width:'100%',background: 'none',marginTop: '10px',color: '#6B7280',fontWeight: '500',fontSize: '11.602px'}} onChange={(e) => this.basicInformationChange(e)} required>
                                                                                            <option value="">Select type</option>
                                                                                                <option value="LEED">LEED</option>
                                                                                                <option value="BREAM">BREAM</option>
                                                                                                <option value="Ventilation Certification">Ventilation Certification</option>
                                                                                                <option value="EU Standart">EU Standart</option>
                                                                                                <option value="Other">Other</option>
                                                                                                   
                                                                                              </select>
                                                                                    
                                                                                  </div>
                                                                                </div>

                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                    <label htmlFor="inputEmail4">Years of experience</label>
                                                                                    <input type="text" name="city" className="form-control" placeholder="Years of experience"/>
                                                                                   
                                                                                  </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                  <label htmlFor="inputEmail4">Is the Organisation an OSS?</label>
                                                                                    <br></br>
                                                                                  <div className="form-check form-check-inline">
                                                                                  
                                                                                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"/>
                                                                                          <label className="form-check-label" for="inlineRadio1">Yes</label>
                                                                                        </div>
                                                                                        <div className="form-check form-check-inline">
                                                                                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"/>
                                                                                          <label className="form-check-label" for="inlineRadio2">No</label>
                                                                                        </div>
                                                                                   
                                                                                    
                                                                                  </div>
                                                                                </div>
                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                  <label htmlFor="inputEmail4">Are you currently working on renovation projects?</label>
                                                                                    <br></br>
                                                                                  <div className="form-check form-check-inline">
                                                                                  
                                                                                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"/>
                                                                                          <label className="form-check-label" for="inlineRadio1">Yes</label>
                                                                                        </div>
                                                                                        <div className="form-check form-check-inline">
                                                                                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"/>
                                                                                          <label className="form-check-label" for="inlineRadio2">No</label>
                                                                                        </div>
                                                                                   
                                                                                    
                                                                                  </div>
                                                                                </div>

                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                  <label htmlFor="inputEmail4">Would you like to use the SUNShINE platform?</label>
                                                                                    <br></br>
                                                                                  <div className="form-check form-check-inline">
                                                                                  
                                                                                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"/>
                                                                                          <label className="form-check-label" for="inlineRadio1">Yes</label>
                                                                                        </div>
                                                                                        <div className="form-check form-check-inline">
                                                                                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"/>
                                                                                          <label className="form-check-label" for="inlineRadio2">No</label>
                                                                                        </div>
                                                                                   
                                                                                    
                                                                                  </div>
                                                                                </div>

                                                                                
                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                  <label htmlFor="inputEmail4">Would you like the information to be displayed in the Networking module?</label>
                                                                                    <br></br>
                                                                                  <div className="form-check form-check-inline">
                                                                                  
                                                                                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"/>
                                                                                          <label className="form-check-label" for="inlineRadio1">Yes</label>
                                                                                        </div>
                                                                                        <div className="form-check form-check-inline">
                                                                                          <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"/>
                                                                                          <label className="form-check-label" for="inlineRadio2">No</label>
                                                                                        </div>
                                                                                   
                                                                                    
                                                                                  </div>
                                                                                </div>

                                                                                <div className="col-md-6">
                                                                                  <div className="form-group">
                                                                                    <label htmlFor="inputEmail4">Additional information</label>
                                                                                    <input type="text" name="city" className="form-control" placeholder="Additional information"/>
                                                                                  
                                                                                  </div>
                                                                                </div> */}

                                                                              </div>
                                                                          <div className="row">
                                                                              <div className="col-md-12 mb-2">
                                                                                <div className="form-group">
                                                                                  <input type="checkbox" name="agree_checkbox" onChange={(e) => this.basicInformationChange(e)}/>
                                                                                      <label style={{fontFamily:'Inter',fontStyle:'normal',fontWeight:'500',fontSize:'12px',color:'#556775',marginLeft:'20px'}} >
                                                                                      
                                                                                      I Agree to my personal data (name, email) being sent to recipient named of EUROPA Project. No other information will be sent to the Recipient.
                                                                                      
                                                                                      </label>
                                                                                      
                                                                                  </div>
                                                                                  <span style={{ color: "red" }}>{this.state.errors["agree_checkbox"]}</span>                                                                              
                                                                              </div>                                                                        
                                                                          </div>
                                                                          <ul className="list-inline pull-left">                                                                        
                                                                          <li> <button type="button"
                                                                              className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextBasicInformation()}>Next</button>
                                                                          </li>
                                                                          </ul>


                                                                     
                                                                            
                                                                 </div>
                                                                
                                                               
                                                       {this.props.stepData.map((stepData, stepKey) => {
                                                         let activeTabeCount = activeTable++;
                                                           return ( <>
                                                                  
                                                                   
                                                                            {stepData.data.questions.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).map((questionData,questionsKey) => {
                                                                             let pppp = nextStepcount++;
                                                                             let kkkk = prvStepcount++;
                                                                             let yyy = backnextStepcount++;
                                                                             let oooo = backprvStepcount++;
                                                                                return (<div className={stepKey === 0 ? "tab-pane" : "tab-pane"} id={'tab-' + count++} key={questionsKey}>
                                                                                     
                                                                                     <h2 className="mb-3 mt-3">{questionData.name}</h2>
                                                                                     <span id={'output'+pppp}  style={{ color:'red',fontSize: '14px',float: 'left' }}></span>
                                                                                     <br></br>
                                                                                     <span style={{ color: "red" }}>{this.state.errors["nextRequired"]}</span>
                                                                                       {questionData.step_fields.map((c, i) => (

                                                                                                <>
                                                                                              <div  id={'radio-container'+pppp}>
                                                                                                {(() => {
                                                                                                  
                                                                                                  if(c.input_type === 'Text' || c.input_type === 'Number'){ 
                                                                                                    return<div className="col-md-6 mb-2 " key={i}>
                                                                                                              <label htmlFor="inputEmail4">{c.name}
                                                                                                                  {(() => {
                                                                                                                      if (c.require == true) {
                                                                                                                          return "*";
                                                                                                                      }
                                                                                                                  })()}
                                                                                                              </label>
  
                                                                                                              <input type={c.text_number} onBlur={(e) => this.questionDataChange(e,c.input_type,c.ID,questionData.name)}  className="form-control quantityDropdown"
                                                                                                                  placeholder={c.placeholder} />
  
                                                                                                          </div>
                                                                                                    }
                                                                                                    if (c.input_type === 'Radio Type Box' &&    questionData.name === 'Organisation type') {                                                                                                   
                                                                                                      return<div className="row mb-5 mt-5" key={i}> 
                                                                                                          
                                                                                                      {c.options.map((optionValue, optionKey) => (     
                                                                                                        <div className="col-md-4" id="step3chk" style={{height: '200px',marginBottom:'10PX' }}>                                                                                                                                                                                                                          
                                                                                                                    <input type="radio" id={optionValue.ID} onChange={(e) => this.questionDataChange(e,c.input_type,c.ID,questionData.name)} name={c.ID}value={optionValue.option_value}/>
                                                                                                                          <label htmlFor={optionValue.ID}>
                                                                                                                            <div className="serBox">
                                                                                                                              <div className="row  row-eq-height" style={{height:'100px',marginRight: '0px', marginLeft: '0px'}}>
                                                                                                                                <div className="col-md-12">
                                                                                                                                <center>                                                                                                                                           
                                                                                                                                {langNode(optionValue.image)}
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
                                                                                                    if (c.input_type === 'Dropdown' ) {                                                                                                   
                                                                                                      return<div className="col-md-6 mb-2 " key={i}>                                                                                                       
                                                                                                         <div className="form-group">
                                                                                                              <label htmlFor="inputEmail4">{c.name}</label>
                                                                                                              <select className="form-control quantityDropdown" name="" onChange={(e) => this.questionDataChange(e,c.input_type,c.ID,questionData.name)}
                                                                                                                style={{background: 'none',color:'#6B7280',fontWeight: '500',fontSize: '11.602px'}}>
                                                                                                                  <option value="">Select {c.name}</option>
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
                                                                                                                {c.options.map((optionValue, optionKey) => (    
                                                                                                                                                                                                                                                                                                                                            
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
                                                                                                                  <h2 style={{ fontWeight: '500',fontSize: '15px' }}>Select all the options that apply:</h2> 
                                                                                                                </div>
                                                                                                              <br></br>
                                                                                                              <br></br>
                                                                                                        <div className="row mb-2">
                                                                                                                {c.options.map((optionValue, optionKey) => (                                                                                                                                                                                                                               
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
                                                                                                                  <h2 style={{ fontWeight: '500',fontSize: '15px' }}>Select all the options that apply:</h2> 
                                                                                                                </div>
                                                                                                              <br></br>
                                                                                                              <br></br>
                                                                                                                {c.options.map((optionValue, optionKey) => (     
                                                                                                                  <div className="col-md-3" id="step3chk" style={{height: '200px',marginBottom:'10PX' }}>                                                                                                                                                                                                                          
                                                                                                                              <input type="checkbox" id={optionValue.ID} onChange={(e) => this.questionDataChange(e,c.input_type,c.ID,questionData.name)}   name="hobbies" value={optionValue.option_value}/>
                                                                                                                                    <label htmlFor={optionValue.ID}>
                                                                                                                                      <div className="serBox">
                                                                                                                                        <div className="row  row-eq-height" style={{height:'100px',marginRight: '0px', marginLeft: '0px'}}>
                                                                                                                                          <div className="col-md-12">
                                                                                                                                          <center>                                                                                                                                           
                                                                                                                                          {langNode(optionValue.image)}
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

                                                                                                      if (c.input_type === 'Radio Type Box' && questionData.name !== 'Organisation type') {                                                                                                   
                                                                                                        return<div className="row mb-5 mt-5" key={i}> 
                                                                                                          
                                                                                                                {c.options.map((optionValue, optionKey) => (     
                                                                                                                  <div className="col-md-3" id="step3chk" style={{height: '200px',marginBottom:'10PX' }}>                                                                                                                                                                                                                          
                                                                                                                              <input type="radio" id={optionValue.ID} onChange={(e) => this.questionDataChange(e,c.input_type,c.ID,questionData.name)} name={c.ID}value={optionValue.option_value}/>
                                                                                                                                    <label htmlFor={optionValue.ID}>
                                                                                                                                      <div className="serBox">
                                                                                                                                        <div className="row  row-eq-height" style={{height:'100px',marginRight: '0px', marginLeft: '0px'}}>
                                                                                                                                          <div className="col-md-12">
                                                                                                                                          <center>                                                                                                                                           
                                                                                                                                          {langNode(optionValue.image)}
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
                                                                                                      className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep(c.input_type,'tab-' + pppp,'tab-' + kkkk ,activeTabeCount,c.ID,questionData.name,pppp)}>Next</button>
                                                                                                  </li>
                                                                                                </ul>

                                                                                                 }else if(stepData.data.questions.length ===  questionsKey + 1 && this.props.stepData.length !==  stepKey + 1){
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                    
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>Back</button>
                                                                                                          </li>

                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep(c.input_type,'tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>Next</button>
                                                                                                          </li>
                                                                                                        </ul>

                                                                                                 }else if(this.props.stepData.length ===  stepKey + 1 && questionsKey === 0 ){
                                                                                                  
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                         <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>Back</button>
                                                                                                          </li>
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub"  onClick={() => this.lastStepSubmit(c.input_type,'tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>Next</button>
                                                                                                          </li>

                                                                                                        </ul>

                                                                                                 }else if(this.props.stepData.length ===  stepKey + 1 && stepData.data.questions.length  === questionsKey +1 ){
                                                                                                  
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                         <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>Back</button>
                                                                                                          </li>
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub"  onClick={() => this.lastStepSubmit(c.input_type,'tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>Next</button>
                                                                                                          </li>

                                                                                                        </ul>

                                                                                                 }  else {
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                   
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>Back</button>
                                                                                                          </li>

                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep(c.input_type,'tab-' +pppp,'tab-' + kkkk ,activeTabeCount,c.ID,questionData.name,pppp)}>Next</button>
                                                                                                          </li>
                                                                                                        </ul>
                                                                                                 }
                                                                                                  })()} 
                                                                                                </>
                                                                                                
                                                                                              ))}
                                                                                             
                                                                                                   
                                                                                      </div>);
                                                                                      
                                                                                       }
                                                                               )
               
                                                                               }
                                                                            
                                                                           
                                                                            </>
                                                           );
                                                                              }
                                                                )
                                                               
                                                                }
                                                      </>
                                                            }
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
)(withTranslation('translations')(OssStepFrom));
