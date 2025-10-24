import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
    Grid,
    makeStyles,
} from '@material-ui/core';

import NavContainer from '../../../smartcomponents/EESNavcontainer';
import EESFooter from '../../../smartcomponents/EESFooter';
import SelectLanguageModel from '../../../smartcomponents/SelectLanguageModel';
import EESNavigationMenu from '../../../smartcomponents/EESNavigationMenu';
import { withTranslation } from 'react-i18next';
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


import '../../../../styles/assets/css/bootstrap.min.css';
import '../../../../styles/assets/css/stepwizard.css';
//images
import logo_footer2 from '../../../../styles/assets/images/logo-footer2.png';
import Logo_europa_White from '../../../../styles/assets/Logo_europa_White.png';
import calculaadora from '../../../../styles/assets/calculaadora.png';
import quizHomeIcon from '../../../../styles/assets/quizHomeIcon.png';
import icon_calc from '../../../../styles/assets/images/icon-calc.png';
import energy_drivers from '../../../../styles/assets/energy_drivers.png';
import economic_text from '../../../../styles/assets/economic_text.png';
import bolt_1 from '../../../../styles/assets/bolt_1.png';
import database from '../../../../styles/assets/database.png';
import Vector from '../../../../styles/assets/Vector.png';
import Group from '../../../../styles/assets/Group.png';
import noisePollution_1 from '../../../../styles/assets/noise-pollution_1.png';
import fix_window from '../../../../styles/assets/fix_window.png';
import AcImage from '../../../../styles/assets/ac.png';
import solarPanel from '../../../../styles/assets/solar-panel.png';
import Group_1 from '../../../../styles/assets/Group_1.png';
import Group3837 from '../../../../styles/assets/Group3837.png';
import image1 from '../../../../styles/assets/IMG_5322_1.png';
import ScreenShot from '../../../../styles/assets/ScreenShot.png';
import mfrkwcq1iwuz1 from '../../../../styles/assets/mfrkwcq1iwuz1.png';
import oldBlockHouses1 from '../../../../styles/assets/old-block-houses1.png';
import snowflake_1 from '../../../../styles/assets/snowflake_1.png';
import Central from '../../../../styles/assets/Central.png';
import None from '../../../../styles/assets/None.png';
import Other from '../../../../styles/assets/Other.png';
import Group38416 from '../../../../styles/assets/Group38416.png';
import Group3839 from '../../../../styles/assets/Group3839.png';
import Group3840 from '../../../../styles/assets/Group3840.png';
import energyAudits from '../../../../styles/assets/energy_audits.png';
import technicalInspection from '../../../../styles/assets/technical_inspection.png';
import projectDesign from '../../../../styles/assets/project_design.png';
import construction from '../../../../styles/assets/construction.png';
import roof1 from '../../../../styles/assets/roof1.png';
import Electric from '../../../../styles/assets/Electric.png';

import getCookie from '../../../../components/utils/getCookie';
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';

import { useSelector } from 'react-redux';
import ENDPOINTS from '../../../../constants/endpoints';
import { setCalcMenuItems } from '../../../../actions/calcmenu';

import {
    searchUsers as searchUsersAction,
    getUsersByPlatformRoles as getPRUsersAction,
} from '../../../../actions/users';
import publicIp from 'public-ip';
import Vector1 from '../../../../styles/assets/Vector1.png';
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
      this.forceUpdate()
     
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
      if(e.target.value==='' || e.target.value===null ){
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

        //let radioChecked = container.querySelectorAll("input[type=text]");
        //container.style.backgroundColor = "white";
       
        if(radioChecked.length !==0 && !radioChecked.length) {
          val = val && false;
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
       
         
      }

      
     
      //}
    }
   
    
    lastStepSubmit = (stepIndex,prvStep,activeTabeCount,filedId,filedTitle,validationId) => {

      if (this.validate(prvStep,validationId)){

      let errors = {};
      this.setState({
        fetching:true,
        
      }) 


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
     
      let  fields = this.state.basicInformation;
      let  errors = {};
      let  formIsValid = true;
  
      //Name
      if (!fields["name"]) {
        formIsValid = false;
        errors["name"] = "Name field is required";
        
      }
  
      if (!fields["surname"]) {
        formIsValid = false;
        errors["surname"] = "Surname field is required";
      }

       if (!fields["city"]) {
        formIsValid = false;
        errors["city"] = "City field is required";
      }
     
  if(this.props.residentsType === 'Housing Association'){

            if (!fields["type_of_organization"]) {
              formIsValid = false;
              errors["type_of_organization"] = "Type of Organization field is required";
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
  
  }

  if (!fields["agree_checkbox"]) {
    formIsValid = false;
    errors["agree_checkbox"] = "You must agree to terms and conditions";
  }
 
      this.setState({ errors: errors });

      return formIsValid;
         
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
  
    handleNextBasicInformation = () => {
     
   
      // $(".tab-pane").removeClass("active show");     
      //  $('#tab-3').addClass('active show');
      //  $(".nav-link").removeClass("active show");       
      //  $("#customeTab li").eq(2)

     
      if (this.handleValidation() ) {
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
      // this.registerNewUser();
  
     
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
    const { t} = this.props;
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
                                                       <div className="tab-content mb-5">
                                                       {this.state.fetching
                                                              ?
                                                                  <ProgressBar />
                                                              :
                                                              <>
                                                      
                                                                <div className="tab-pane active show" id="tabt-1">
                                                                       <div className="col-md-12">
                                                                            <div className="content-style2  mt-5">
                                                                                
                                                                                    <div className=" mb-5">
                                                                                        <h2>{t('translations:ossPreviewTitle.GoodnewsOur')} {this.props.selectedOssData.name} {t('translations:ossPreviewTitle.OSSoperatesinyourarea')} </h2>
                                                                                        <br/>
                                                                                        <div style={{fontWeight: '500',fontSize: '20px'}}>
                                                                                        {t('translations:ossPreviewTitle.title2')}
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    <div className=" mb-5" style={{border: '1px solid #6b728030',padding: '20px'}}>
                                                                                        <div style={{fontSize: '16px',fontFamily: 'Inter',fontWeight: '400',color: '#6B7280',fontFamily: "'Inter', sans-serif"}}>
                                                                                        {t('translations:ossPreviewTitle.title3')}
                                                                                        </div>
                                                                                        <br/>
                                                                                        <div style={{fontSize: '16px',fontFamily: 'Inter',fontWeight: '400',color: '#6B7280',fontFamily: "'Inter', sans-serif"}}>
                                                                                        {t('translations:ossPreviewTitle.title4')}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="d-block">
                                                                                        <button className="btn btn-primary btn-md btn-default welcomeButtone" onClick={() => this.props.handleNextStepNew()}
                                                                                            style={{ fontSize: '12px'}}>{t('translations:ossPreviewTitle.Letsstart')}!</button>
                                                                                    </div>
                                                                         
                                                                            </div>
                                                                        </div>

                                                                       </div>

                                                                       <div className="tab-pane" id="tabt-2">
                                                                       <h2 className="mb-5 mt-5">{t('translations:ossPreviewTitle.title5')}</h2>
                                                                            <div className="mb-5 mt-5" style={{ fontWeight:'500',fontSize:'14px' }}>
                                                                            {t('translations:ossPreviewTitle.title6')}
                                                                            </div>
                                                                       {(() => {

                                                                                    if(this.props.residentsType === 'Resident'){
                                                                                      return<> <div className="row mb-5 mt-5" id="getTouch">
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
                                                                                                  <input type="text" name="email" className="form-control" onChange={(e) => this.checkUserEmailExist(e)} placeholder="Email"/>
                                                                                                  {this.state.emailError === true ? <span style={{color: "red"}}>Please Enter valid value</span> : ''} 
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
                                                                                                  <label htmlFor="inputEmail4">City</label>
                                                                                                  <input type="text" name="city" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="City"/>
                                                                                                  <span style={{ color: "red" }}>{this.state.errors["city"]}</span>
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
                                                                                              
                                                                                            </div>
                                                                                        <div className="row">
                                                                                            <div className="col-md-12 mb-4">
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
                                                                                      </>
                                                                                    }else{
                                                                                      return<> <div className="row mb-5 mt-5" id="getTouch">
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
                                                                                          <input type="text" name="email" className="form-control" onChange={(e) => this.checkUserEmailExist(e)} placeholder="Email"/>
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
                                                                                          <label htmlFor="inputEmail4">City</label>
                                                                                          <input type="text" name="city" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="City"/>
                                                                                          <span style={{ color: "red" }}>{this.state.errors["city"]}</span>
                                                                                        </div>
                                                                                      </div>
                                                                                      

                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">Type of Organization</label>
                                                                                          <br></br>
                                                                                          
                                                                                          <select className="select-country" name="type_of_organization" id="location"style={{width:'100%',background: 'none',marginTop: '10px',color: '#6B7280',fontWeight: '500',fontSize: '11.602px'}} onChange={(e) => this.basicInformationChange(e)} required>
                                                                                      
                                                                                              <option value="">Select Organization</option>
                                                                                              <option value="Craftsman">Craftsman</option>
                                                                                              <option value="Financial institution">Financial institution</option>
                                                                                              <option value="Housing association">Housing association</option>
                                                                                              <option value="Natural person">Natural person</option>
                                                                                              <option value="NGO">NGO</option>
                                                                                              <option value="Operator">Operator</option>
                                                                                              <option value="OSS">OSS</option>
                                                                                              <option value="Professional">Professional</option>
                                                                                              <option value="Public Organization">Public Organization</option>
                                                                                              <option value="Residents' Community">Residents' Community</option>
                                                                                              
                                                                                            
                                                                                            </select>
                                                                                         
                                                                                          <span style={{ color: "red" }}>{this.state.errors["type_of_organization"]}</span>
                                                                                        </div>
                                                                                      </div>
                                                                                      <div className="col-md-6">
                                                                                        <div className="form-group">
                                                                                          <label htmlFor="inputEmail4">Name of Organization</label>
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
                                                                                          <label htmlFor="inputEmail4">Are you a legal representative of your Organization?</label>
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
                                                                                          <label htmlFor="inputEmail4">Website</label>
                                                                                   
                                                                                          <input type="text" name="website" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="Website"/>
                                                                                          {this.state.websiteError === true ? <span style={{color: "red"}}>Please Enter valid value</span> : ''}
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
                                                                                          <label htmlFor="inputEmail4">Address</label>
                                                                                          <input type="text" name="address" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder="Address"/>
                                                                                          <span style={{ color: "red" }}>{this.state.errors["address"]}</span>
                                                                                        </div>
                                                                                      </div>
                                                                                    
        
                                                                                     
        
        
                                                                                    </div>
                                                                                    <div className="row">
                                                                                            <div className="col-md-12 mb-4">
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
                                                                              </>
                                                                                      
                                                                                    }
  
                                                                            })()}


                                                                     
                                                                            
                                                                 </div>
                                                                
                                                               
                                                       {this.props.stepData.map((stepData, stepKey) => {
                                                         let activeTabeCount = activeTable++;
                                                           return ( <>
                                                                  
                                                                   
                                                                            {stepData.data.questions.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1:-1).map((questionData,questionsKey, arr) => {
                                                                             let pppp = nextStepcount++;
                                                                             let kkkk = prvStepcount++;
                                                                             let yyy = backnextStepcount++;
                                                                             let oooo = backprvStepcount++;
                                                                                return (<div className={stepKey === 0 ? "tab-pane" : "tab-pane"} id={'tab-' + count++} key={questionsKey}>
                                                                                     
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
                                                                                                                          return "*";
                                                                                                                      }
                                                                                                                  })()}
                                                                                                              </label>
  
                                                                                                              <input type={c.text_number} onBlur={(e) => userFieldDataSave(e, c.ID, c.name)}  className="form-control"
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
                                                                                                                  <h2 style={{ fontWeight: '500',fontSize: '15px' }}>Select all the options that apply:</h2> 
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
                                                                                                                  <h2 style={{ fontWeight: '500',fontSize: '15px' }}>Select all the options that apply:</h2> 
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
                                                                                                      className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep('tab-' + pppp,'tab-' + kkkk ,activeTabeCount,c.ID,questionData.name,pppp)}>Next</button>
                                                                                                  </li>
                                                                                                </ul>

                                                                                                 }else if(stepData.data.questions.length ===  questionsKey + 1 && this.props.stepData.length !==  stepKey + 1){
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                    
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>Back</button>
                                                                                                          </li>

                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep('tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>Next</button>
                                                                                                          </li>
                                                                                                        </ul>

                                                                                                 }else if(this.props.stepData.length ===  stepKey + 1 && questionsKey === 0 ){
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                         <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>Back</button>
                                                                                                          </li>
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub"  onClick={() => this.lastStepSubmit('tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>Submit</button>
                                                                                                          </li>

                                                                                                        </ul>

                                                                                                 }else if(this.props.stepData.length ===  stepKey + 1 && stepData.data.questions.length  === questionsKey +1 ){
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                         <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>Back</button>
                                                                                                          </li>
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub"  onClick={() => this.lastStepSubmit('tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>Submit</button>
                                                                                                          </li>

                                                                                                        </ul>

                                                                                                 }  else {
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                   
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>Back</button>
                                                                                                          </li>

                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep('tab-' +pppp,'tab-' + kkkk ,activeTabeCount,c.ID,questionData.name,pppp)}>Next</button>
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
