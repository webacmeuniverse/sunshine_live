import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
  Grid,
  makeStyles,
} from '@material-ui/core';
import { countries, countriesMobileCode } from '../../../constants/countries';
import ProgressBar from '../../../components/utils/ProgressBar';
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
import Logo_europa_White from '../../../images/3SUNShiNE_Black.svg';
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


import getCookie from '../../../components/utils/getCookie';
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ENDPOINTS from '../../../constants/endpoints';
import { setCalcMenuItems } from '../../../actions/calcmenu';

import {
  searchUsers as searchUsersAction,
  getUsersByPlatformRoles as getPRUsersAction,
} from '../../../actions/users';
import publicIp from 'public-ip';
import sunshunelogo from '../../../styles/assets/images/sunshune-logo.png';
import Vector1 from '../../../styles/assets/Vector1.png';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import moment from 'moment'

class OssStepFrom extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      stepData: [],
      errors: {},
      createdUserId: '',
      fetching: false,
      skipQuestion: false,
      passwordConfirm: false,
      basicInformation: {
        country: this.props.selectedCountry,
        type: 'Service Operator',
        postCode: this.props.postCode,
        name: '',
        surname: '',
        email: '',
        type_of_organization: '',
        organization_name: '',
        registration_number: '',
        vat_number: '',
        legal_rep_org: '',
        website: '',
        phoneNumber: '',
        address: '',
        country: '',
        city: '',
        agree_checkbox: '',
        registration_date: '',
        legal_form: '',
        password: '',
      },
      questionData: {
        field_id: '',
        field_value: [],
        field_title: '',

      },
      hobbies: [],
      createdUserDetails: [],
      countLi: 0,

    }
    // this.countryChange = this.countryChange.bind(this);
    // this.residentsTypeChange = this.residentsTypeChange.bind(this);
    //this.onDelete =this.onDelete.bind(this);

    this.questionDataChange = this.questionDataChange.bind(this);
    this.passwordConfirmation = this.passwordConfirmation.bind(this);
  }
  passwordConfirmation = (value) => {

    this.state.passwordConfirm = value

    if (value === true) {

      this.setState({
        confirmPasswordError: false,
        confirmPasswordMsg: ''

      })
    }

    this.forceUpdate()

  }
  validateWebsiteUrl = websiteUrl => {
    const urlRegEx =
      '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    return urlRegEx.match(websiteUrl);
  };


  countryChange = e => {

    let nameType = e.target.name;
    let value = e.target.value;
    //this.setState({
    //  basicInformation: [ ...this.state.nameType, e.target.value],
    // })



    this.setState({
      basicInformation: {
        ...this.state.basicInformation,
        [nameType]: value
      }
    });
    if (e.target.name === 'country') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({
          countryError: true,
          countryMsg: this.props.t('translations:onboardingValidation.country')
        })
      }

      else {
        this.setState({
          countryError: false,
          countryMsg: ''

        })
      }
    }


  }


  basicInformationChange = e => {

    const nameType = e.target.name;
    const value = e.target.value;
    const target = e.target;
    //this.setState({
    //  basicInformation: [ ...this.state.nameType, e.target.value],
    // })


    this.setState({
      basicInformation: {
        ...this.state.basicInformation,
        [nameType]: value
      }
    });


    if (e.target.name === 'website') {
      if (e.target.value === '' || e.target.value === null || !e.target.value.match('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')) {
        this.setState({
          websiteError: true
        })
      }

      else {
        this.setState({
          websiteError: false,

        })
      }
    }

    if (e.target.name === 'password') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({
          passwordError: true,
          passwordMsg: this.props.t('translations:onboardingValidation.password_field')
        })
      } else if (e.target.value.length < 6) {
        this.setState({
          passwordError: true,
          passwordMsg: this.props.t('translations:onboardingValidation.confirm_password_digits')
        })

      }

      else {
        this.setState({
          passwordError: false,
          passwordMsg: ''

        })
      }
    }

    if (e.target.name === 'phoneNumber') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({
          phoneNumberError: true,
          phoneNumberMsg: this.props.t('translations:onboardingValidation.phone')
        })

      } else if (!e.target.value.match(/^[0-9\s-+()]*$/)) {

        this.setState({
          phoneNumberError: true,
          phoneNumberMsg: this.props.t('translations:onboardingValidation.phone1')
        })
        // } else if (e.target.value.length < 10) {

        //   this.setState({
        //     phoneNumberError: true,
        //     phoneNumberMsg: this.props.t('translations:onboardingValidation.phone2')
        //   })
        // }
      }
      else {
        this.setState({
          phoneNumberError: false,
          phoneNumberMsg: ''

        })
      }
    }

  }


  confirmPasswordChange = e => {

    let nameType = e.target.name;
    let value = e.target.value;
    //this.setState({
    //  basicInformation: [ ...this.state.nameType, e.target.value],
    // })



    this.setState({
      basicInformation: {
        ...this.state.basicInformation,
        [nameType]: value
      }
    });
    if (e.target.name === 'confirm_password') {
      if (e.target.value === '' || e.target.value === null) {
        this.setState({
          confirmPasswordError: true,
          confirmPasswordMsg: this.props.t('translations:onboardingValidation.confirm_password')
        })
      } else if (e.target.value.length < 6) {
        this.setState({
          confirmPasswordError: true,
          confirmPasswordMsg: this.props.t('translations:onboardingValidation.confirm_password_digits')
        })

      } else if (e.target.value !== this.state.basicInformation.password) {
        this.setState({
          confirmPasswordError: true,
          confirmPasswordMsg: this.props.t('translations:onboardingValidation.confirm_password_match')
        })

      }

      else {
        this.setState({
          confirmPasswordError: false,
          confirmPasswordMsg: ''

        })
      }
    }


  }

  checkUserConfirmEmailExist = e => {


    let nameType = e.target.name;
    let value = e.target.value;


    this.setState({
      basicInformation: {
        ...this.state.basicInformation,
        [nameType]: value
      }
    });

    if (e.target.name === 'confirm_email_data') {
      if (e.target.value === '' || e.target.value === null || !e.target.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
        this.setState({
          ConfirmEmailError: true,
          ConfirmEmailErrorMsg: this.props.t('translations:onboardingValidation.enter_valid_value'),
        })
      } else if (e.target.value !== this.state.basicInformation.email) {
        this.setState({
          ConfirmEmailError: true,
          ConfirmEmailErrorMsg: this.props.t('translations:onboardingValidation.confirmation_email'),

        })

      }

      else {
        this.setState({
          ConfirmEmailError: false,
          ConfirmEmailErrorMsg: "",

        })
      }
    }




  }

  checkUserEmailExist = e => {


    let nameType = e.target.name;
    let value = e.target.value;


    this.setState({
      basicInformation: {
        ...this.state.basicInformation,
        [nameType]: value
      }
    });

    if (e.target.name === 'email') {
      if (e.target.value === '' || e.target.value === null || !e.target.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i)) {
        this.setState({
          emailError: true
        })
      }

      else {
        this.setState({
          emailError: false,

        })
      }
    }

    let config = {
      method: 'get',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    }

    fetch(ENDPOINTS.SERVER + '/onboarding/user/check?email=' + value, config)
      .then(status => status.json().then(data => ({ data, status })))
      .then(({ data, status }) => {

        if (data.ID) {
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

        } else {


        }


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
  questionDataChange = (e, type, field_id, field_title) => {

    const target = e.target;
    var value = target.value;
    var arr = ['Organisation type', "Type d'organisation", 'Organizācijas veids', 'Tipologia de Organização', 'Tipo di Azienda/Orgazizzazione', 'Art der Organisation'];


    if (arr.includes(field_title)) {

      this.props.organizationTypeUpdate(value);
    }
    if (type === 'Checkbox Type Box' || type === 'Checkbox Type Button') {
      if (target.checked) {
        this.state.hobbies[value] = value;
      } else {
        this.state.hobbies.splice(value, 1);
        //const newArray = this.state.hobbies.filter((item) => item.nameValue ===value);


      }

    } else {

      //if(target.checked){
      this.state.hobbies = [value];
      // }else{
      // this.state.hobbies.splice(value, 1);
      //const newArray = this.state.hobbies.filter((item) => item.nameValue ===value);


      // }
    }



  }
  validate = (type, currentTab, activeTabeCount) => {
    let val = true;

    let select = document.getElementById(currentTab);

    select.querySelectorAll('#radio-container' + activeTabeCount).forEach(function (container) {


      if (type === 'Dropdown') {

        let radioChecked1 = container.querySelector(".quantityDropdown");
        //container.style.backgroundColor = "white";

        if (radioChecked1.value === '') {
          val = val && false;
          document.querySelector('#output' + activeTabeCount).innerText = "Please select answer";
          // container.append(" <b>Appended text</b>.");;
        }
      } else if (type === 'Text' || type === 'Number') {

        let radioChecked2 = container.querySelector(".quantityDropdown");
        //container.style.backgroundColor = "white";

        if (radioChecked2.value === '') {
          val = val && false;
          document.querySelector('#output' + activeTabeCount).innerText = "Please select answer";
          // container.append(" <b>Appended text</b>.");;
        }
      } else {


        let radioChecked = container.querySelectorAll("input:checked");
        //container.style.backgroundColor = "white";

        if (!radioChecked.length) {
          val = val && false;
          document.querySelector('#output' + activeTabeCount).innerText = "Please select answer";
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
  handleNextStep = (type, stepIndex, prvStep, activeTabeCount, filedId, filedTitle, validationId) => {

    if (this.validate(type, prvStep, validationId)) {
      let errors = {};
      this.setState({
        fetching: true,

      })
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
          "session": localStorage.getItem('userBasicSession'),
          "field_id": filedId,
          "field_value": str,
          "field_title": filedTitle,
          "lang": this.props.language,
          "user_id": this.state.createdUserDetails.data.ID,
          //"user_id": '39d1f738-71f5-43a6-bdfe-f107e3b95a48',
          "oss_admin_id": this.props.selectedOssAdmin,
          "country": this.state.basicInformation.country,
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
          let ttt = activeTabeCount - 1;
          this.setState({
            fetching: false,

          })

          $(".tab-pane").removeClass("active show");
          $('#' + stepIndex).addClass('active show');
          $(".nav-link").removeClass("active show");
          $('li[id=tabStep-' + activeTabeCount + ']').find('a').addClass("active show")
          $("#customeTab > li:has(a[href='#tab-" + activeTabeCount + "']):first()").find('a').addClass("active show")
          this.state.hobbies = [];
          errors["nextRequired"] = "";
          this.setState({ errors: errors });
          this.forceUpdate()
          $("#output" + validationId).text('');

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

  lastStepSubmit = (type, stepIndex, prvStep, activeTabeCount, filedId, filedTitle, validationId) => {

    if (this.validate(type, prvStep, validationId)) {

      let errors = {};
      this.setState({
        fetching: true,

      })
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
          "session": localStorage.getItem('userBasicSession'),
          "field_id": filedId,
          "field_value": str,
          "field_title": filedTitle,
          "lang": this.props.language,
          "user_id": this.state.createdUserDetails.data.ID,
          //"user_id": '39d1f738-71f5-43a6-bdfe-f107e3b95a48',
          "oss_admin_id": this.props.selectedOssAdmin,
          "country": this.props.country,
          "menu_type": this.props.residentsType
        })
      }


      fetch(ENDPOINTS.SERVER + '/user/input/data', config)
        .then(status => status.json().then(data => ({ data, status })))
        .then(({ data, status }) => {
          $(".nav-link").removeClass("active show");
          $('li[id=tabStep-3]').find('a').addClass("active show")
          $("#customeTab > li:has(a[href='#tab-3']):first()").find('a').addClass("active show")
          this.state.hobbies = [];
          errors["nextRequired"] = "";
          this.setState({ errors: errors });
          this.forceUpdate()
          this.props.lastStepSubmit();
          this.setState({
            fetching: false,

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


  handlePrevStep = (stepIndex, prvStep, activeTabeCount) => {
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
    $('#tab-' + kkk).addClass('active show');

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
      errors["name"] = this.props.t('translations:onboardingValidation.name');
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
      errors["surname"] = this.props.t('translations:onboardingValidation.surname');
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
      errors["city"] = this.props.t('translations:onboardingValidation.city');
    }

    if (!fields["registration_date"]) {
      formIsValid = false;
      errors["registration_date"] = this.props.t('translations:onboardingValidation.registration_date');
    }
    if (moment(fields["registration_date"], 'YYYY-MM-DD', true).isValid() !== true) {


      formIsValid = false;
      errors["registration_date"] = this.props.t('translations:onboardingValidation.registration_date_format');
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
      errors["website"] = this.props.t('translations:onboardingValidation.website');
    }
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



    if (!fields["agree_checkbox"]) {
      formIsValid = false;
      errors["agree_checkbox"] = this.props.t('translations:onboardingValidation.agree_checkbox');
    }

    this.setState({ errors: errors });


    return formIsValid;
  }

  handleNextBasicInformation = () => {


    // $(".tab-pane").removeClass("active show");     
    //  $('#tab-3').addClass('active show');
    //  $(".nav-link").removeClass("active show");       
    //  $("#customeTab li").eq(2)

    if (this.handleValidation() && this.state.countryError === false && this.state.ConfirmEmailError === false && this.state.confirmPasswordError === false && this.state.websiteError !== true && this.state.phoneNumberError !== true && this.state.emailError !== true && this.state.passwordError !== true) {


      //$(".tab-pane").removeClass("active show");
      //$('#tab-3').addClass('active show');
      // $(".nav-link").removeClass("active show");
      // $("#customeTab li").eq(2)

      let newPassword = '';

      if (this.state.passwordConfirm === false) {

        newPassword = this.state.basicInformation.password;
      } else {

        newPassword = '';
      }


      let config = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          "name": this.state.basicInformation.name,
          "surname": this.state.basicInformation.surname,
          "email": this.state.basicInformation.email,
          "phone_number": this.state.basicInformation.phoneNumber,
          "city": this.state.basicInformation.city,
          "country": this.state.basicInformation.country,
          "post_code": this.state.basicInformation.postCode,
          "menu_type": this.props.residentsType,
          "lang": this.props.language,
          "oss_admin_id": this.props.selectedOssAdmin,
          "password": newPassword,
          "user_id": (Math.random() + 1).toString(36).substring(2),
          "org_type": this.state.basicInformation.type_of_organization,
          "org_name": this.state.basicInformation.organization_name,
          "reg_number": this.state.basicInformation.registration_number,
          "vat_number": this.state.basicInformation.vat_number,
          "reg_date": this.state.basicInformation.registration_date + 'T00:00:00Z',
          "website": 'https://' + this.state.basicInformation.website,
          "address": this.state.basicInformation.address,
          "legal_rep_org": this.state.basicInformation.legal_rep_org,
          "session": (Math.random() + 1).toString(8).substring(2),
        })
      }

      fetch(ENDPOINTS.SERVER + '/onboarding/user/data', config)

        .then(status => status.json().then(data => ({ data, status })))
        .then(({ data, status }) => {
       
          if (!status.ok) {

            let hhh = data.error;
          
            const m = hhh.match(/duplicate key value violates unique constraint "(.*)"/);

            if (m) {
              const titleKey = this.state.basicInformation.type_of_organization === 4 ? 'organizations.errorRegisterTitle' : 'organizations.errorDuplicateTitle';
              const textKey = this.state.basicInformation.type_of_organization === 4 ? 'organizations.errCommunityExists' : 'organizations.errDuplicateKey';

              alert({
                title: this.props.t(titleKey),
                text: this.props.t(textKey),
                type: 'error',
                delay: 2000,
                closer: true
              });
            } else {
              alert({

                text: data.error,
                type: 'error',
                delay: 2000,
                closer: true
              });

            }



          } else {

            this.setState({
              createdUserDetails: data,
              fetching: false,

            })
            //this.registerNewOrganization();
            //this.registerNewUser();

            this.props.onUpdateMode(data.data.ID);
            $(".tab-pane").removeClass("active show");
            //$('#'+prvStep).removeClass('active show');
            $('#tab-3').addClass('active show');

            $(".nav-link").removeClass("active show");

            //$('#customeTab > .nav-item > .active').next('li').find('a').trigger('click');
            $("#customeTab li").eq(2)
          }





        })
        .catch(error => {

          //console.log(error);
          this.setState({

            fetching: false,

          })

          // $(".tab-pane").removeClass("active show");
          // //$('#'+prvStep).removeClass('active show');
          // $('#tabt-2').addClass('active show');

          // $(".nav-link").removeClass("active show");

          // //$('#customeTab > .nav-item > .active').next('li').find('a').trigger('click');
          // $("#customeTab li").eq(0)
          alert({
            text: 'something went wrong please try again',
            type: 'error',
            delay: 2000,
            closer: true
          });
        });
    }



  }
  registerNewUser = () => {


    let config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "email": this.state.basicInformation.email,
        "password": '123456789',
        "name": this.state.basicInformation.name,
        "country": this.props.selectedCountry,
      })
    }

    fetch(ENDPOINTS.SERVER + '/user', config)
      .then(status => status.json().then(data => ({ data, status })))
      .then(({ data, status }) => {
        alert({
          text: 'Add User Successfully',
          type: 'success',
          delay: 800,
          closer: true
        });

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
    let radioButtonCount = 0;
    let nextStepcount = 4;
    let prvStepcount = 3;

    let backnextStepcount = 4;
    let backprvStepcount = 3;

    let activeTable = 0;
    const langNode = (selectedValue) => {
      if (selectedValue === 'Vector.png')
        return (<img src={Vector} className="dropdown-toggle" type="button" style={{ marginTop: '30px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
      else if (selectedValue === 'Group.png')
        return (<img src={Group} className="dropdown-toggle" type="button" style={{ marginTop: '30px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)

      else if (selectedValue === 'snowflake_1.png')
        return (<img src={snowflake_1} className="dropdown-toggle" type="button" style={{ marginTop: '30px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)

      else if (selectedValue === 'noise-pollution_1.png')
        return (<img src={noisePollution_1} className="dropdown-toggle" type="button" style={{ marginTop: '30px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
      else if (selectedValue === 'fix_window.png')
        return (<img src={fix_window} className="dropdown-toggle" type="button" style={{ marginTop: '30px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
      else if (selectedValue === 'ac.png')
        return (<img src={AcImage} className="dropdown-toggle" type="button" style={{ marginTop: '30px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
      else if (selectedValue === 'fix_window.png')
        return (<img src={fix_window} className="dropdown-toggle" type="button" style={{ marginTop: '30px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
      else if (selectedValue === 'solar-panel.png')
        return (<img src={solarPanel} className="dropdown-toggle" type="button" style={{ marginTop: '30px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
      else if (selectedValue === 'Group_1.png')
        return (<img src={Group_1} className="dropdown-toggle" type="button" style={{ marginTop: '30px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
      else if (selectedValue === 'Group3837.png')
        return (<img src={Group3837} className="dropdown-toggle" type="button" style={{ marginTop: '30px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)

      // else if (selectedValue === 'Central.png')
      // return (<img src={Central} className="dropdown-toggle" type="button"  style={{marginTop:'30px'}} id="dropdownMenuButton"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt=""    />)



      else if (selectedValue === 'IMG_5322_1.png')
        return (<img src={image1} className="dropdown-toggle" type="button" style={{ marginTop: '10px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
      else if (selectedValue === 'ScreenShot.png')
        return (<img src={ScreenShot} className="dropdown-toggle" type="button" style={{ marginTop: '10px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
      else if (selectedValue === 'mfrkwcq1iwuz1.png')
        return (<img src={mfrkwcq1iwuz1} className="dropdown-toggle" type="button" style={{ marginTop: '10px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)
      else if (selectedValue === 'old-block-houses1.png')
        return (<img src={oldBlockHouses1} className="dropdown-toggle" type="button" style={{ marginTop: '10px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)

      else
        return (<img src={Vector1} className="dropdown-toggle" type="button" style={{ marginTop: '30px' }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" alt="" />)

    }
    return (
      <React.Fragment>
        <div className="row row-eq-height align-middle my-auto animate__animated animate__fadeInRight"  >

          <div className="col-md-12">


            <section className="signup-step-container" style={{ marginTop: '10px', marginBottom: '0px' }}>
              <div className="container">
                <div className="row d-flex ">
                  <div className="col-md-12">
                    <div className="wizard">
                      <div className="tab-content mb-5">
                        <div className="tab-pane active show" id="tabt-1">
                          <div className="col-md-12 mb-5">
                            <div className="content-style2">
                              <div className=" mb-5">
                                <h2>{this.props.t('translations:ossOnboardingTitle.title6')}</h2>
                                <br />
                                <div style={{ fontWeight: '500', fontSize: '20px' }} >
                                  {this.props.t('translations:ossOnboardingTitle.title7')}
                                </div>
                              </div>
                              <div className=" mb-5" style={{ border: '1px solid #6b728030', padding: '20px' }}>
                                <div style={{ fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', color: '#6B7280', fontFamily: "'Inter', sans-serif" }} >
                                  <p style={{ textAlign: 'left' }}>{this.props.t('translations:ossOnboardingTitle.title8')}</p>
                                  <p style={{ textAlign: 'left' }}>{this.props.t('translations:ossOnboardingTitle.title9')}</p>
                                </div>
                                <br />
                                <div style={{ fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', color: '#6B7280', fontFamily: "'Inter', sans-serif" }}>
                                  {this.props.t('translations:ossOnboardingTitle.title5')}
                                </div>
                              </div>
                              <div className="d-block">
                                <button type="button" name="submit" onClick={() => this.props.handleNextStepNew()}
                                  className="btn btn-primary btn-md btn-default welcomeButtone"> {this.props.t('translations:ossPreviewTitle.Letsstart')} ! </button>
                              </div>
                            </div>
                          </div>
                        </div>




                        {/* {this.state.fetching
                          ?
                          <ProgressBar />
                          :
                          <> */}



                            <div className="tab-pane" id="tabt-2">
                              <h2 className="mb-1 mt-1">{this.props.t('translations:ossPreviewTitle.title5')}</h2>
                              <div className="mb-2 mt-2" style={{ fontWeight: '500', fontSize: '14px' }}>
                                {this.props.t('translations:ossPreviewTitle.title6')}
                              </div>
                              <div className="row mb-2 mt-2" id="getTouch">
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:documents.name')} <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" name="name" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:documents.name')} />
                                    <span style={{ color: "red" }}>{this.state.errors["name"]}</span>

                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:recordsTitle.Surname')} <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" name="surname" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:recordsTitle.Surname')} />
                                    <span style={{ color: "red" }}>{this.state.errors["surname"]}</span>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:auth.email')} <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" name="email" className="form-control" onChange={(e) => this.checkUserEmailExist(e)} placeholder={this.props.t('translations:auth.email')} autocomplete="off" />
                                    {this.state.emailError === true ? <span style={{ color: "red" }}>{this.props.t('translations:onboardingValidation.enter_valid_value')}</span> : ''}
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:auth.confirmEmail')} <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" name="confirm_email_data" className="form-control" onChange={(e) => this.checkUserConfirmEmailExist(e)} placeholder={this.props.t('translations:auth.confirmEmail')} autocomplete="off" />
                                    {this.state.ConfirmEmailError === true ? <span style={{ color: "red" }}>{this.state.ConfirmEmailErrorMsg}</span> : ''}
                                  </div>
                                </div>
                                {(() => {

                                  if (this.state.passwordConfirm === false) {
                                    return <>
                                      <div className="col-md-6">
                                        <div className="form-group">
                                          <label htmlFor="inputEmail4">{this.props.t('translations:auth.password')} <span style={{ color: 'red' }}>* </span></label>
                                          <input type="password" name="password" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:auth.password')} autocomplete="off" />
                                          {this.state.passwordError === true ? <span style={{ color: "red" }}>{this.state.passwordMsg}</span> : ''}
                                        </div>
                                      </div>
                                      <div className="col-md-6">
                                        <div className="form-group">
                                          <label htmlFor="inputEmail4">{this.props.t('translations:auth.confirmPassword')} <span style={{ color: 'red' }}>* </span></label>
                                          <input type="password" name="confirm_password" className="form-control" onChange={(e) => this.confirmPasswordChange(e)} placeholder={this.props.t('translations:auth.confirmPassword')} autocomplete="off" />
                                          {this.state.confirmPasswordError === true ? <span style={{ color: "red" }}>{this.state.confirmPasswordMsg}</span> : ''}
                                        </div>
                                      </div>
                                    </>

                                  }

                                })()}

                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:ossOnboardingTitle.Areyoualegal')} <span style={{ color: 'red' }}>* </span></label>
                                    <br></br>
                                    <select className="select-country" name="legal_rep_org" id="location" style={{ width: '100%', background: 'none', marginTop: '10px', color: '#6B7280', fontWeight: '500', fontSize: '11.602px' }} onChange={(e) => this.basicInformationChange(e)} required>
                                      <option value="">{this.props.t('translations:ossOnboardingTitle.SelectValue')}</option>
                                      <option value="Yes">{this.props.t('translations:navigation.yes')}</option>
                                      <option value="No">{this.props.t('translations:navigation.no')}</option>

                                    </select>

                                    <span style={{ color: "red" }}>{this.state.errors["legal_rep_org"]}</span>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:organizations.legalForm')} <span style={{ color: 'red' }}>* </span></label>
                                    <br></br>

                                    <select className="select-country" name="type_of_organization" id="location" style={{ width: '100%', background: 'none', marginTop: '10px', color: '#6B7280', fontWeight: '500', fontSize: '11.602px' }} onChange={(e) => this.basicInformationChange(e)} required>

                                      <option value="">{this.props.t('translations:organizations.selectLegalForm')}</option>
                                      <option value="10">{this.props.t('translations:legalForms.Craftsman')}</option>
                                      <option value="1">{this.props.t('translations:legalForms.types.1')}</option>
                                      <option value="8">{this.props.t('translations:legalForms.HOUSING_ASSOCIATION')}</option>
                                      {/* <option value="Natural person">Natural person</option> */}
                                      <option value="5">{this.props.t('translations:legalForms.NGO')}</option>
                                      <option value="11">{this.props.t('translations:legalForms.Operator')}</option>
                                      <option value="12">{this.props.t('translations:legalForms.OSS')}</option>
                                      <option value="9">{this.props.t('translations:legalForms.Professional')}</option>
                                      <option value="3">{this.props.t('translations:legalForms.PUBLIC_ORGANIZATION')}</option>
                                      <option value="4">{this.props.t('translations:legalForms.RESIDENTS_COMMUNITY')}</option>


                                    </select>

                                    <span style={{ color: "red" }}>{this.state.errors["type_of_organization"]}</span>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:organizations.legalNamePlaceholder')} <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" name="organization_name" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:organizations.legalNamePlaceholder')} />
                                    <span style={{ color: "red" }}>{this.state.errors["organization_name"]}</span>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:organizations.registrationNumber')} <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" name="registration_number" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:organizations.registrationNumber')} />
                                    <span style={{ color: "red" }}>{this.state.errors["registration_number"]}</span>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:organizations.vatNumber')} <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" name="vat_number" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:organizations.vatNumber')} />
                                    <span style={{ color: "red" }}>{this.state.errors["vat_number"]}</span>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:organizations.registrationDate')} <span style={{ color: 'red' }}>* </span></label>
                                    <input type="date" name="registration_date" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:organizations.registrationDate')} />
                                    <span style={{ color: "red" }}>{this.state.errors["registration_date"]}</span>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:organizations.phone')} <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" name="phoneNumber" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:organizations.phone')} />
                                    {this.state.phoneNumberError === true ? <span style={{ color: "red" }}>{this.state.phoneNumberMsg}</span> : ''}
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:profile.website')} <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" name="website" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:profile.website')} />
                                    {this.state.websiteError === true ? <span style={{ color: "red" }}>{this.props.t('translations:onboardingValidation.enter_valid_value')}</span> : ''}


                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:auth.country')} <span style={{ color: 'red' }}>* </span></label>
                                    <br></br>
                                    <select className="select-country" name="country" id="location" style={{ width: '100%', background: 'none', marginTop: '10px', color: '#6B7280', fontWeight: '500', fontSize: '11.602px' }} onChange={(e) => this.countryChange(e)} required>
                                      <option value="">{this.props.t('translations:auth.selectCountry')}</option>
                                      {countries.map((stepData, stepKey) => {

                                        return (<>
                                          <option value={stepData.label}>{this.props.t('translations:countriesRegisterKeys.' + stepData.label)}</option>
                                        </>)

                                      })}
                                    </select>
                                    {this.state.countryError === true ? <span style={{ color: "red" }}>{this.state.countryMsg}</span> : ''}
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:assets.city')} <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" name="city" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:assets.city')} />
                                    <span style={{ color: "red" }}>{this.state.errors["city"]}</span>
                                  </div>
                                </div>


                                <div className="col-md-6">
                                  <div className="form-group">
                                    <label htmlFor="inputEmail4">{this.props.t('translations:profile.address')} <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" name="address" className="form-control" onChange={(e) => this.basicInformationChange(e)} placeholder={this.props.t('translations:profile.address')} />
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
                                    <input type="checkbox" name="agree_checkbox" onChange={(e) => this.basicInformationChange(e)} />
                                    <label style={{ fontFamily: 'Inter', fontStyle: 'normal', fontWeight: '500', fontSize: '12px', color: '#556775', marginLeft: '20px' }} >
                                      <span style={{ color: 'red' }}>* </span>
                                      {this.props.t('translations:essCalculaterResultTableTitle.IAgreetomypersonaldata')}
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




                            </div>

                            {(() => {
                              if (this.props.stepData.length === 0) {

                                return (<>
                                  <div class="tab-pane" id="tab-3">
                                    <div className="col-md-12">
                                      <section className="signup-step-container" style={{ marginTop: '10px', marginBottom: '0px' }}>
                                        <div className="container">
                                          <div className="row d-flex ">
                                            <div className="col-md-12">
                                              <div className="content-style2">
                                                <div className=" mb-5">

                                                  <div className=" mb-5 mt-5">
                                                    <h4 style={{ fontWeight: '500', fontSize: '20px' }}>
                                                      {this.props.t('translations:ossOnboardingTitle.title10')}
                                                    </h4>
                                                    <br />
                                                    <div style={{ fontWeight: '500', fontSize: '20px' }}>

                                                      <p style={{ marginBottom: '0px', marginTop: '0px', textAlign: 'left' }}>
                                                        {this.props.t('translations:ossOnboardingTitle.title10')} </p>
                                                    </div>
                                                  </div>


                                                  <div className="d-block">


                                                    {/* <Link to={`/ees_calculator`} className="btn btn-primary btn-md btn-default welcomeButtone" style={{ lineHeight: '50px' }}>Go to Service Operator Checklist</Link> */}
                                                    &nbsp;&nbsp;&nbsp;

                                                    <Link to={`/`} className="btn btn-primary btn-md btn-default welcomeButtone" style={{ lineHeight: '50px' }}>Back to homepage</Link>
                                                  </div>

                                                  <div className="mb-5 mt-5">

                                                    <div style={{ fontWeight: '500', fontSize: '20px' }}>
                                                      <p style={{ marginBottom: '0px', marginTop: '0px', textAlign: 'left' }}>Or Visit</p>

                                                    </div>
                                                  </div>

                                                  <div className="row mt-5 mb-5">
                                                    <div className="col-md-4" STYLE={{ background: '#fff', border: 'solid 1px #BFD4E460' }}>

                                                      <div className="row  row-eq-height" style={{ padding: '10px' }}>
                                                        <div className="col-md-5">
                                                          <img src={sunshunelogo} alt="" />
                                                        </div>

                                                      </div>
                                                      <div className="content-text mt-2 text-left" style={{ color: '#4B4B4A', fontWeight: '600', padding: '10px' }}>
                                                        SUNShINE
                                                      </div>
                                                      {/* <div className="content-text mt-1 text-left" style={{ padding: '10px' }}>
                                                                                                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.


                                                                                                          </div> */}

                                                      <a href="%PUBLIC_URL%/resources" style={{ color: '#f8b309', fontWeight: '600', padding: '10px' }}>Read more</a>
                                                      <br />
                                                    </div>
                                                    <div className="col-md-4" STYLE={{ background: '#fff', border: 'solid 1px #BFD4E460' }}>

                                                      <div className="row  row-eq-height" style={{ padding: '10px' }}>
                                                        <div className="col-md-5">
                                                          <img src={sunshunelogo} alt="" />
                                                        </div>

                                                      </div>
                                                      <div className="content-text mt-2 text-left" style={{ color: '#4B4B4A', fontWeight: '600', padding: '10px' }}>
                                                        Europa
                                                      </div>


                                                      <a href="%PUBLIC_URL%/resources" style={{ color: '#f8b309', fontWeight: '600', padding: '10px' }}>Read more</a>
                                                      <br />
                                                    </div>

                                                  </div>



                                                </div>

                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                      </section>
                                    </div>
                                  </div>
                                </>);

                              } else {

                                return (<>
                                  {this.props.stepData.map((stepData, stepKey) => {
                                    let activeTabeCount = activeTable++;
                                    return (<>


                                      {stepData.data.questions.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1 : -1).map((questionData, questionsKey) => {
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
                                          <span id={'output' + pppp} style={{ color: 'red', fontSize: '14px', float: 'left' }}></span>
                                          <br></br>
                                          <span style={{ color: "red" }}>{this.state.errors["nextRequired"]}</span>
                                          {questionData.step_fields.map((c, i) => (

                                            <>
                                              <div id={'radio-container' + pppp}>
                                                {(() => {
                                                  var arr = ["Type d'organisation", 'Organisation type', 'Organizācijas veids', 'Tipologia de Organização', 'Tipo di Azienda/Orgazizzazione', 'Art der Organisation'];
                                                  if (c.input_type === 'Text' || c.input_type === 'Number') {
                                                    return <div className="col-md-6 mb-2 " key={i}>
                                                      <label htmlFor="inputEmail4">{c.name}
                                                        {(() => {
                                                          if (c.require == true) {
                                                            return <> <span style={{ color: 'red' }}>* </span> </>;
                                                          }
                                                        })()}
                                                      </label>

                                                      <input type={c.text_number} onBlur={(e) => this.questionDataChange(e, c.input_type, c.ID, questionData.name)} className="form-control quantityDropdown"
                                                        placeholder={c.placeholder} />

                                                    </div>
                                                  }
                                                  if (c.input_type === 'Radio Type Box' && arr.includes(questionData.name)) {
                                                    return <div className="row mb-5 mt-5" key={i}>

                                                      {c.options.map((optionValue, optionKey) => (
                                                        <div className="col-md-4" id="step3chk" style={{ height: '200px', marginBottom: '10PX' }}>
                                                          <input type="radio" id={optionValue.ID} onChange={(e) => this.questionDataChange(e, c.input_type, c.ID, questionData.name)} name={c.ID} value={optionValue.option_value} />
                                                          <label htmlFor={optionValue.ID}>
                                                            <div className="serBox">
                                                              <div className="row  row-eq-height" style={{ height: '100px', marginRight: '0px', marginLeft: '0px' }}>
                                                                <div className="col-md-12">
                                                                  <center>
                                                                    {langNode(optionValue.image)}
                                                                  </center>
                                                                </div>
                                                              </div>
                                                              <div className="row  row-eq-height" style={{ height: '100px', marginRight: '0px', marginLeft: '0px' }}
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
                                                  if (c.input_type === 'Dropdown') {
                                                    return <div className="col-md-6 mb-2 " key={i}>
                                                      <div className="form-group">
                                                        <label htmlFor="inputEmail4">{c.name}</label>
                                                        <select className="form-control quantityDropdown" name="" onChange={(e) => this.questionDataChange(e, c.input_type, c.ID, questionData.name)}
                                                          style={{ background: 'none', color: '#6B7280', fontWeight: '500', fontSize: '11.602px' }}>
                                                          <option value="">Select {c.name}</option>
                                                          {c.options.sort((a, b) => a.CreatedAt < b.CreatedAt ? 1 : -1).map((optionValue, optionKey) => {

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

                                                    return <div className="row mb-2 mt-2" key={i}><div className="col-md-12 mb-2 mt-2">
                                                      <div className="row mb-2">
                                                        {c.options.map((optionValue, optionKey) => (

                                                          <div className="col-md-3" id="step5chk">
                                                            <input type="radio" id={optionValue.ID} onChange={(e) => this.questionDataChange(e, c.input_type, c.ID, questionData.name)} name={c.ID} value={optionValue.option_value} />
                                                            <label htmlFor={optionValue.ID}>{optionValue.option_value}</label>
                                                          </div>
                                                        ))
                                                        }
                                                      </div>
                                                    </div>
                                                    </div>
                                                  }

                                                  if (c.input_type === 'Checkbox Type Button') {

                                                    return <div className="row mb-2 mt-2" key={i}><div className="col-md-12 mb-2 mt-2" key={i}>
                                                      <div className="col-md-12" >
                                                        <h2 style={{ fontWeight: '500', fontSize: '15px' }}>{this.props.t('translations:ossOnboardingTitle.title12')}:</h2>
                                                      </div>
                                                      <br></br>
                                                      <br></br>
                                                      <div className="row mb-2">
                                                        {c.options.map((optionValue, optionKey) => (
                                                          <div className="col-md-3" id="step5chk">
                                                            <input type="checkbox" id={optionValue.ID} onChange={(e) => this.questionDataChange(e, c.input_type, c.ID, questionData.name)} name={c.ID} value={optionValue.option_value} />
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
                                                        <h2 style={{ fontWeight: '500', fontSize: '15px' }}>{this.props.t('translations:ossOnboardingTitle.title12')}:</h2>
                                                      </div>
                                                      <br></br>
                                                      <br></br>
                                                      {c.options.map((optionValue, optionKey) => (
                                                        <div className="col-md-3" id="step3chk" style={{ height: '200px', marginBottom: '10PX' }}>
                                                          <input type="checkbox" id={optionValue.ID} onChange={(e) => this.questionDataChange(e, c.input_type, c.ID, questionData.name)} name="hobbies" value={optionValue.option_value} />
                                                          <label htmlFor={optionValue.ID}>
                                                            <div className="serBox">
                                                              <div className="row  row-eq-height" style={{ height: '100px', marginRight: '0px', marginLeft: '0px' }}>
                                                                <div className="col-md-12">
                                                                  <center>
                                                                    {langNode(optionValue.image)}
                                                                  </center>
                                                                </div>
                                                              </div>
                                                              <div className="row  row-eq-height" style={{ height: '100px', marginRight: '0px', marginLeft: '0px' }}
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
                                                  var arr1 = ["Type d'organisation", 'Organisation type', 'Organizācijas veids', 'Tipologia de Organização', 'Tipo di Azienda/Orgazizzazione', 'Art der Organisation'];
                                                  if (c.input_type === 'Radio Type Box' && !arr.includes(questionData.name)) {
                                                    return <div className="row mb-5 mt-5" key={i}>

                                                      {c.options.map((optionValue, optionKey) => (
                                                        <div className="col-md-3" id="step3chk" style={{ height: '200px', marginBottom: '10PX' }}>
                                                          <input type="radio" id={optionValue.ID} onChange={(e) => this.questionDataChange(e, c.input_type, c.ID, questionData.name)} name={c.ID} value={optionValue.option_value} />
                                                          <label htmlFor={optionValue.ID}>
                                                            <div className="serBox">
                                                              <div className="row  row-eq-height" style={{ height: '100px', marginRight: '0px', marginLeft: '0px' }}>
                                                                <div className="col-md-12">
                                                                  <center>
                                                                    {langNode(optionValue.image)}
                                                                  </center>
                                                                </div>
                                                              </div>
                                                              <div className="row  row-eq-height" style={{ height: '100px', marginRight: '0px', marginLeft: '0px' }}
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
                                                if (questionsKey === 0 && stepKey === 0) {
                                                  return <ul className="list-inline pull-left">
                                                    <li> <button type="button"
                                                      className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep(c.input_type, 'tab-' + pppp, 'tab-' + kkkk, activeTabeCount, c.ID, questionData.name, pppp)}>{this.props.t('translations:navigation.next')}</button>
                                                    </li>
                                                  </ul>


                                                } else if (questionsKey + 1 === stepData.data.questions.length) {
                                                  return <ul className="list-inline pull-left">
                                                    <li> <button type="button"
                                                      className="btn btn-primary btn-md btn-default-back prev-step-sub" onClick={() => this.handlePrevStep(yyy, oooo, activeTabeCount)}>{this.props.t('translations:navigation.back')}</button>
                                                    </li>
                                                    <li> <button type="button"
                                                      className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.lastStepSubmit(c.input_type, 'tab-' + pppp, 'tab-' + kkkk, activeTabeCount + 1, c.ID, questionData.name, pppp)}>{this.props.t('translations:navigation.next')}</button>
                                                    </li>
                                                  </ul>
                                                } else {
                                                  return <ul className="list-inline pull-left">
                                                    <li> <button type="button"
                                                      className="btn btn-primary btn-md btn-default-back prev-step-sub" onClick={() => this.handlePrevStep(yyy, oooo, activeTabeCount)}>{this.props.t('translations:navigation.back')}</button>
                                                    </li>

                                                    <li> <button type="button"
                                                      className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep(c.input_type, 'tab-' + pppp, 'tab-' + kkkk, activeTabeCount, c.ID, questionData.name, pppp)}>{this.props.t('translations:navigation.next')}</button>
                                                    </li>
                                                  </ul>
                                                }
                                              })()}
                                              {/* {(() => {
                                                                                                 
                                                                                                 if (questionsKey === 0  && stepKey === 0) {
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                  

                                                                                                  <li> <button type="button"
                                                                                                      className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep(c.input_type,'tab-' + pppp,'tab-' + kkkk ,activeTabeCount,c.ID,questionData.name,pppp)}>{this.props.t('translations:navigation.next')}</button>
                                                                                                  </li>
                                                                                                </ul>

                                                                                                 }else if(stepData.data.questions.length ===  questionsKey + 1 && this.props.stepData.length !==  stepKey + 1){
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                    
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>{this.props.t('translations:navigation.back')}</button>
                                                                                                          </li>

                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep(c.input_type,'tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>{this.props.t('translations:navigation.next')}</button>
                                                                                                          </li>
                                                                                                        </ul>

                                                                                                 }else if(this.props.stepData.length ===  stepKey + 1 && questionsKey === 0 ){
                                                                                                  
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                         <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>{this.props.t('translations:navigation.back')}</button>
                                                                                                          </li>
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub"  onClick={() => this.lastStepSubmit(c.input_type,'tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>{this.props.t('translations:navigation.next')}</button>
                                                                                                          </li>

                                                                                                        </ul>

                                                                                                 }else if(this.props.stepData.length ===  stepKey + 1 && stepData.data.questions.length  === questionsKey +1 ){
                                                                                                  
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                         <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>{this.props.t('translations:navigation.back')}</button>
                                                                                                          </li>
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub"  onClick={() => this.lastStepSubmit(c.input_type,'tab-' +pppp,'tab-' + kkkk ,activeTabeCount + 1,c.ID,questionData.name,pppp)}>{this.props.t('translations:navigation.next')}</button>
                                                                                                          </li>

                                                                                                        </ul>

                                                                                                 }  else {
                                                                                                  return <ul className="list-inline pull-left">
                                                                                                   
                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default-back prev-step-sub"  onClick={() => this.handlePrevStep(yyy, oooo,activeTabeCount)}>{this.props.t('translations:navigation.back')}</button>
                                                                                                          </li>

                                                                                                          <li> <button type="button"
                                                                                                              className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep(c.input_type,'tab-' +pppp,'tab-' + kkkk ,activeTabeCount,c.ID,questionData.name,pppp)}>{this.props.t('translations:navigation.next')}</button>
                                                                                                          </li>
                                                                                                        </ul>
                                                                                                 }
                                                                                                  })()}  */}
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

                                  }

                                </>);
                              }
                            })()}

                          {/* </>
                        } */}
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
