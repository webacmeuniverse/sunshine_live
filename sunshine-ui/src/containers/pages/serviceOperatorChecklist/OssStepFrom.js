import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
    Grid,
    makeStyles,
} from '@material-ui/core';


import NavContainer from '../../smartcomponents/EESNavcontainer';
import EESFooter from '../../smartcomponents/EESFooter';
import SelectLanguageModel from '../../smartcomponents/SelectLanguageModel';
import EESNavigationMenu from '../../smartcomponents/EESNavigationMenu';

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
import snowflake_1 from '../../../styles/assets/snowflake_1.png';
class OssStepFrom extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            stepData: [],
            errors: {},
            createdUserId:'',
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
                                registration_date:''                            
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
  
      

       
    }

    questionDataChange = (e,type,field_id,field_title) => {

      const target = e.target;
      var value = target.value;
;
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
                document.querySelector('#output'+activeTabeCount).text( this.props.t('translations:onboardingValidation.please_select_answer') ) ;
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
       
  //      if(this.state.hobbies.length === 0){
  
  // errors["nextRequired"] = "please select one value";
  // this.setState({ errors: errors });
  
  //      }else{
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
            "lang": this.props.language,
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

      
     
      //}
    }

    lastStepSubmit = (type,stepIndex,prvStep,activeTabeCount,filedId,filedTitle,validationId) => {

      if (this.validate(type,prvStep,validationId)){

      let errors = {};
      
//      if(this.state.hobbies.length === 0){

// errors["nextRequired"] = "please select one value";
// this.setState({ errors: errors });

//      }else{
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
          "lang": this.props.language,
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
      if (!fields["email"]) {
        formIsValid = false;
        errors["email"] = "Email field is required";
      }
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
      if (!fields["phoneNumber"] ) {
        formIsValid = false;
        errors["phoneNumber"] = "Phone Number field is required";
      }
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

      if (this.handleValidation()) {
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
            "country":  this.props.country,
            "post_code":this.state.basicInformation.postCode,
            "menu_type": this.props.residentsType,
            "lang": this.props.language,
            "oss_admin_id":this.props.selectedOssAdmin,
            
            "user_id": (Math.random() + 1).toString(36).substring(2),
            "org_type": this.state.basicInformation.type_of_organization,
            "org_name": this.state.basicInformation.organization_name,
            "reg_number": this.state.basicInformation.registration_number,
            "vat_number": this.state.basicInformation.vat_number,
            "reg_date":this.state.basicInformation.registration_date,
            //"website": this.state.basicInformation.website,
            "address": this.state.basicInformation.address,
            "legal_rep_org":this.state.basicInformation.legal_rep_org,
          })
        }

    
         fetch(ENDPOINTS.SERVER + '/onboarding/user/data', config)
            .then(status => status.json().then(data => ({ data, status })))
            .then(({ data, status }) => {

             this.setState({
               createdUserDetails: data,
               
             })   
             this.props.onUpdateMode(data.data.ID);
             $(".tab-pane").removeClass("active show");
             //$('#'+prvStep).removeClass('active show');
              $('#tab-3').addClass('active show');
       
              $(".nav-link").removeClass("active show");
              
              //$('#customeTab > .nav-item > .active').next('li').find('a').trigger('click');
              $("#customeTab li").eq(2)
              //$("#customeTab > li:has(a[href='#tab-2']):first()").find('a').addClass("active show")
             //$('#customeTab > .nav-item > .active').parent().next('li').find('a').trigger('click');
              // alert({
              //   text: 'Add New Field Successfully',
              //   type: 'success',
              //   delay: 800,
              //   closer: true
              // });
            
             
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

     

    componentDidMount(){       
        this.getOssStep();
        
    
      }
    getOssStep =()=>{
        const config = {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
              "oss_admin_id":this.props.selectedOssAdmin,
              "lang":this.props.language,     
              "menu_type":this.props.residentsType                 
            })
          };          
          fetch(ENDPOINTS.SERVER + '/onboarding/residents/step', config)
              .then(res => res.json())
             // .then((result) => result.length ? JSON.parse(text) : {})
              .then(
                  (result) => {   
                      
                    if (result != null) {
                         this.setState({
                            stepData: result,
                            
                          }) 
                          this.state.createdUserId ='pppp'

        this.forceUpdate()

                                                                    
                        }
                  },
                  
              ).catch(error => {
                //setTabStep([]);                
            });
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

    let activeTable =0;
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
                                                                              <h2>Join our partner network!</h2>                                                                            
                                                                                <br/>
                                                                                <div style={{fontWeight:'500',fontSize:'20px' }} >
                                                                                  Find out how.
                                                                                </div>
                                                                            </div>
                                                                              <div className=" mb-5" style={{border:'1px solid #6b728030',padding:'20px' }}>
                                                                                <div style={{fontSize:'16px',fontFamily:'Inter',fontWeight:'400',color:'#6B7280',fontFamily:"'Inter', sans-serif" }} >
                                                                                  <p style={{ textAlign: 'left' }}>Let's start with a short questionnaire to learn about your services and all the tool that we can provide you.</p>
                                                                                  <p style={{ textAlign: 'left' }}>Fill in the questionnaire and one of our team members will contact you to Set up your EUROPA Platform demo.</p>
                                                                                </div>
                                                                                <br/>
                                                                                <div style={{fontSize:'16px',fontFamily:'Inter',fontWeight:'400',color:'#6B7280',fontFamily:"'Inter', sans-serif" }}>
                                                                                  It should only take you <b>8 minutes </b>to complete.
                                                                                </div>
                                                                              </div>
                                                                            <div className="d-block">
                                                                              <button type="button" name="submit"  onClick={() => this.props.handleNextStepNew()}
                                                                                className="btn btn-primary btn-md btn-default welcomeButtone">Let's
                                                                                start</button>
                                                                            </div>								
                                                                          </div>
                                                                        </div>
                                                                    </div>

                                                                
                                                               
                                                       {this.state.stepData.map((stepData, stepKey) => {
                                                         let activeTabeCount = activeTable++;
                                                           return ( <>
                                                                  
                                                                   
                                                                            {stepData.data.questions.map((questionData,questionsKey, arr) => {
                                                                             let pppp = nextStepcount++;
                                                                             let kkkk = prvStepcount++;
                                                                             let yyy = backnextStepcount++;
                                                                             let oooo = backprvStepcount++;
                                                                                return (<div className={stepKey === 0 ? "tab-pane" : "tab-pane"} id={'tab-' + count++} key={questionsKey}>
                                                                                     
                                                                                     <h2 className="mb-3 mt-3">{questionData.name}</h2>
                                                                                     <span id={'output'+pppp}  style={{ color:'red',fontSize: '14px',float: 'left' }}></span>
                                                                                     <br></br>
                                                                                     <span style={{ color: "red" }}>{this.state.errors["nextRequired"]}</span>
                                                                                       {questionData.step_fields.sort((a, b) => a.index > b.index ? 1 : -1).map((c, i) => (

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
  
                                                                                                    if (c.input_type === 'Dropdown') {                                                                                                   
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
                                                                                                                                              <img src={Vector1} alt="" style={{marginTop: '30px'}} />
                                                                                                                                              <img src={snowflake_1} alt="" style={{marginTop: '37px',marginLeft:'-19px',position: 'absolute'}} />
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
                                                                                                          
                                                                                                                {c.options.map((optionValue, optionKey) => (     
                                                                                                                  <div className="col-md-3" id="step3chk" style={{height: '200px',marginBottom:'10PX' }}>                                                                                                                                                                                                                          
                                                                                                                              <input type="radio" id={optionValue.ID} onChange={(e) => this.questionDataChange(e,c.input_type,c.ID,questionData.name)} name={c.ID}value={optionValue.option_value}/>
                                                                                                                                    <label htmlFor={optionValue.ID}>
                                                                                                                                      <div className="serBox">
                                                                                                                                        <div className="row  row-eq-height" style={{height:'100px',marginRight: '0px', marginLeft: '0px'}}>
                                                                                                                                          <div className="col-md-12">
                                                                                                                                          <center>                                                                                                                                           
                                                                                                                                              <img src={Vector1} alt="" style={{marginTop: '30px'}} />
                                                                                                                                              <img src={snowflake_1} alt="" style={{marginTop: '33px',marginLeft:'-19px',position: 'absolute'}} />
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

                                                                                                 }else if(stepData.data.questions.length ===  questionsKey + 1 && this.state.stepData.length !==  stepKey + 1){
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                    
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>Back</button>
                                                                                                          </li>

                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep(c.input_type,'tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>Next</button>
                                                                                                          </li>
                                                                                                        </ul>

                                                                                                 }else if(this.state.stepData.length ===  stepKey + 1 && questionsKey === 0 ){
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                         <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>Back</button>
                                                                                                          </li>
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub"  onClick={() => this.lastStepSubmit(c.input_type,'tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>Submit</button>
                                                                                                          </li>

                                                                                                        </ul>

                                                                                                 }else if(this.state.stepData.length ===  stepKey + 1 && stepData.data.questions.length  === questionsKey +1 ){
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                         <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>Back</button>
                                                                                                          </li>
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub"  onClick={() => this.lastStepSubmit(c.input_type,'tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>Submit</button>
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
