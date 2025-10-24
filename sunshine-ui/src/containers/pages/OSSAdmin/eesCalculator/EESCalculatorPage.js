import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withTranslation } from 'react-i18next';
import NavContainer from '../../../smartcomponents/ossnavcontainer';
import language_icon from '../../../../styles/assets/images/language-icon.png';
import { LV, EN, BG, SK, AT, RO, PL, FR } from './../../../../components/utils/SVGflags';
import calculaadora from '../../../../styles/ossAdmin/assets/calculaadora.png';
import quizHomeIcon from '../../../../styles/ossAdmin/assets/quizHomeIcon.png';
import Logo_europa_White from '../../../../images/3SUNShiNE_Black.svg';
import toggleLanguage from '../../../../actions/language';
import {
  Home as HomeIcon,
  BusinessCenter as OrganizationIcon,
  Business as AssetIcon,
  Equalizer as ProjectIcon,
  Security as AdminIcon,
  TableChart as TableChartIcon,
  Delete as DeleteIcon,
  Add as PlusIcon,
  Visibility as VisibilityIcon,
  Backup as BackupIcon,
  SettingsBackupRestore as SettingsBackupRestoreIcon,
} from '@material-ui/icons';
import i18n from 'i18next';
import { Link } from 'react-router-dom';
import TopBar from '../../../../components/ossnavigation/TopBar';
import { AppendFields, AppendStep } from "./AppendFields";
import { ResultData } from "./ResultData";
import { HeatingEnergyResultData } from "./HeatingEnergyResultData";

import { ResultDataTable2 } from "./ResultDataTable2";
import { ResultDataTable4 } from "./ResultDataTable4";
import ENDPOINTS from '../../../../constants/endpoints';
import MobileNavContainer from '../../../smartcomponents/ossMobileNavContainer';


import gbFlag from '../../../../images/flags/english.svg';
import latviaFlag from '../../../../images/flags/latvia.svg';
import bulgarianFlag from '../../../../images/flags/bulgaria.svg';
import slovakFlag from '../../../../images/flags/slovak.png';
import austrianFlag from '../../../../images/flags/austria.svg';
import romanianFlag from '../../../../images/flags/romania.svg';
import polishFlag from '../../../../images/flags/poland.svg';
import europeanFlag from '../../../../images/flags/europe.svg';
import GermanFlag from '../../../../images/flags/germany.svg';
import ItalyFlag from '../../../../images/flags/italy.svg';
import PortugalFlag from '../../../../images/flags/portugal.svg';
import FrenchFlag from '../../../../images/flags/french.svg';


import Bulgarian from '../../../../styles/assets/images/country/Belgium.png';
import France from '../../../../styles/assets/images/country/France.png';
import Latvia from '../../../../styles/assets/images/country/Latvia.png';
import Spain from '../../../../styles/assets/images/country/Spain.png';
import Italy from '../../../../styles/assets/images/country/Italy.png';
import Portugal from '../../../../styles/assets/images/country/Portugal.png';
import UK from '../../../../styles/assets/images/country/UK.png';

import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import ProgressBar from '../../../../components/utils/ProgressBar';
import ReactTags from 'react-tag-autocomplete'
import './style.css';
import i18next from 'i18next';

class EESCalculatorView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tabStep: [],
      tabStepResult: [],
      tabStepResultTable2: [],
      langSelected: this.props.language,
      fetching: false,
      shortDescriptionInfo:'',
      backUpTitle: '',
      titleErrorMsg: '',
      table2Tags: [
        {
          'first_year_value': [
          ]
        }
      ],
      table4Tags: [
        {
          'first_year_value': [
          ]
        }
      ],
      tags: [
        {
          'cost_vat_xcl': [
          ]
        },
        {
          'cost_vat_inc': [
          ],

        },
        {
          'total_vat_xcl': [
          ],
        },

        {
          'total_vat_inc': [


          ],

        },

      ],
      tagsHeatingEnergy: [

        {
          'cost_vat_xcl': [
          ]
        },
        {
          'cost_vat_inc': [


          ],

        },

        {
          'total_vat_xcl': [


          ],

        },

        {
          'total_vat_inc': [


          ],

        },

      ],

      newTag: [

      ],
      suggestionsTable2: [
        { id: '+', name: "+", field_id: "" },
        { id: '-', name: "-", field_id: "" },
        { id: '/', name: "/", field_id: "" },
        { id: '*', name: "*", field_id: "" },
        { id: '(', name: "(", field_id: "" },
        { id: ')', name: ")", field_id: "" },
        { id: 'year', name: "year", field_id: "" },
        { id: 'selected_year', name: "selected_year", field_id: "" }

      ],
      suggestions: [
        { id: '+', name: "+", field_id: "" },
        { id: '-', name: "-", field_id: "" },
        { id: '/', name: "/", field_id: "" },
        { id: '*', name: "*", field_id: "" },
        { id: '(', name: "(", field_id: "" },
        { id: ')', name: ")", field_id: "" },
        { id: '%', name: "%", field_id: "" },
        { id: 'year', name: "year", field_id: "" },
        { id: 'selected_year', name: "selected_year", field_id: "" }
      ]
    }
    this.stepDataGet = this.stepDataGet.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onDeleteTable2 = this.onDeleteTable2.bind(this);
    this.onAddition = this.onAddition.bind(this);
    this.onAdditionHeating = this.onAdditionHeating.bind(this);

    this.onTable2Addition = this.onTable2Addition.bind(this);
    this.onTable4Addition = this.onTable4Addition.bind(this);

    this.reactTags = React.createRef()
    //this.reactTags1 = React.createRef()
  }


  backUpTitleChange = e => {

    let nameType = e.target.name;
    let value = e.target.value;

    this.setState({
      backUpTitle: value
    });

  }
  lngChange = (e) => {

    this.setState({
      fetching: true,

    })

    $(".tab-pane").removeClass("active show");

    $(".nav-link").removeClass("active show");

    // $( '.tab' ).tabs('select', 0);
    //$(".tab").removeClass("active");


    //$('.nav-link li:first-child').addClass('active show');
    //this.props.toggleLanguage(e.target.value);
    this.state.suggestions = [];
    this.state.langSelected = e.target.value
    this.state.suggestions = [
      { id: '+', name: "+", field_id: "" },
      { id: '-', name: "-", field_id: "" },
      { id: '/', name: "/", field_id: "" },
      { id: '*', name: "*", field_id: "" },
      { id: '(', name: "(", field_id: "" },
      { id: ')', name: ")", field_id: "" },
      { id: '%', name: "%", field_id: "" },
      { id: 'year', name: "year", field_id: "" },
      { id: 'selected_year', name: "selected_year", field_id: "" }
    ]
    this.forceUpdate();
    this.shortDescriptionGet(e.target.value);
    this.stepDataGet();

    //   this.setState({
    //     langSelected: e.target.value
    // })
    for (var i = 0; i <= 100000; i++) {
      // this.state.suggestionsTable2.push( { id:i.toString(), name: i.toString(),field_id:"" } );
      //this.state.suggestions.push( { id:i.toString(), name:i.toString(),field_id:"" } );
      let yyyy = { id: String(i), name: String(i), field_id: '' }
      this.state.suggestions.push(yyyy);
    }


    this.forceUpdate();


    this.dataPushInTag();

    // i18next.changeLanguage(e.target.value, (err, t) => {

    // });



  }


  onDelete(i, id) {

    let config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    }


    fetch(ENDPOINTS.SERVER + '/step/result/subitem/' + id[i].field_id, config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.resultDataGet();

          alert({
            text: 'Deleted Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
        } else {

          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
        }


      });

  }

  onDeleteTable2(i, id) {

    let config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    }


    fetch(ENDPOINTS.SERVER + '/oss/ees/tbl2/' + id[i].id + '/year', config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.resultTable2DataGet();

          alert({
            text: 'Deleted Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
        } else {

          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
        }


      });

  }

  onAdditionHeating(tag, filedName, id, index) {

    let filedId = 0;

    if (filedName == 'cost_vat_xcl') {

      filedId = 0
    } else {
      filedId = 1

    }
    let stepCount = 0;
    let filedNewName = 0;

    if (filedName == 'cost_vat_xcl') {
      stepCount = this.state.tagsHeatingEnergy[0].cost_vat_xcl[index].length === 0 ? 0 : this.state.tagsHeatingEnergy[0].cost_vat_xcl[index].length + 1;
      filedNewName = 'COST_VAT_XCL'
    } else if (filedName == 'cost_vat_inc') {

      stepCount = this.state.tagsHeatingEnergy[1].cost_vat_inc[index].length === 0 ? 0 : this.state.tagsHeatingEnergy[1].cost_vat_inc[index].length + 1;
      filedNewName = 'COST_VAT_INC'

    } else if (filedName == 'total_vat_inc') {
      stepCount = this.state.tagsHeatingEnergy[3].total_vat_inc[index].length === 0 ? 0 : this.state.tagsHeatingEnergy[3].total_vat_inc[index].length + 1;
      filedNewName = 'TOTAL_VAT_INC'

    } else if (filedName == 'total_vat_xcl') {
      stepCount = this.state.tagsHeatingEnergy[2].total_vat_xcl[index].length === 0 ? 0 : this.state.tagsHeatingEnergy[2].total_vat_xcl[index].length + 1;
      filedNewName = 'TOTAL_VAT_XCL'

    }
    const menu_path = window.location.pathname.split('/')[2];

    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }
    //  this.state.tags[0].cost_vat_xcl =cost_vat_xcl_array
    //  this.state.tags[1].cost_vat_inc =cost_vat_inc_array
    //  this.state.tags[2].total_vat_xcl =total_vat_xcl_array
    //  this.state.tags[3].total_vat_inc =total_vat_inc_array

    // let stepCount = this.state.tags[0].[filedName][index].length + 1;
    let config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "cost_type": filedNewName,
        "field_id": tag.id,
        "field_name": tag.name,
        "index": stepCount,
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "is_default_template": is_default_template

      })
    }

    fetch(ENDPOINTS.SERVER + '/step/result/subitem/' + id, config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.resultDataGet();
          alert({
            text: 'Data Update Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
        } else {
          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
        }
      });
  }
  onAddition(tag, filedName, id, index) {


    let filedId = 0;

    if (filedName == 'cost_vat_xcl') {

      filedId = 0
    } else {
      filedId = 1

    }
    let stepCount = 0;
    let filedNewName = 0;
    if (filedName == 'cost_vat_xcl') {
      stepCount = this.state.tags[0].cost_vat_xcl[index].length === 0 ? 0 : this.state.tags[0].cost_vat_xcl[index].length + 1;
      filedNewName = 'COST_VAT_XCL'
    } else if (filedName == 'cost_vat_inc') {

      stepCount = this.state.tags[1].cost_vat_inc[index].length === 0 ? 0 : this.state.tags[1].cost_vat_inc[index].length + 1;
      filedNewName = 'COST_VAT_INC'

    } else if (filedName == 'total_vat_inc') {
      stepCount = this.state.tags[3].total_vat_inc[index].length === 0 ? 0 : this.state.tags[3].total_vat_inc[index].length + 1;
      filedNewName = 'TOTAL_VAT_INC'

    } else if (filedName == 'total_vat_xcl') {
      stepCount = this.state.tags[2].total_vat_xcl[index].length === 0 ? 0 : this.state.tags[2].total_vat_xcl[index].length + 1;
      filedNewName = 'TOTAL_VAT_XCL'

    }

    //  this.state.tags[0].cost_vat_xcl =cost_vat_xcl_array
    //  this.state.tags[1].cost_vat_inc =cost_vat_inc_array
    //  this.state.tags[2].total_vat_xcl =total_vat_xcl_array
    //  this.state.tags[3].total_vat_inc =total_vat_inc_array

    // let stepCount = this.state.tags[0].[filedName][index].length + 1;
    const menu_path = window.location.pathname.split('/')[2];

    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }
    let config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "cost_type": filedNewName,
        "field_id": tag.id,
        "field_name": tag.name,
        "index": stepCount,
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "is_default_template": is_default_template

      })
    }


    fetch(ENDPOINTS.SERVER + '/step/result/subitem/' + id, config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {

        if (result.status == 200) {
          this.resultDataGet();

          alert({
            text: 'Data Update Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
        } else {

          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
        }


      });


  }
  stepDefaultTemplateConfirm() {


    confirmAlert({
      title: this.props.t('translations:onboardingValidation.set_the_default_title'),
      message: this.props.t('translations:onboardingValidation.set_the_default_title_sub'),
      buttons: [
        {
          label: this.props.t('translations:navigation.yes'),
          onClick: () => this.stepDefaultTemplate()
        },
        {
          label: this.props.t('translations:navigation.no'),
          //onClick: () => alert('Click No')
        }
      ]
    });

  }
  stepDefaultTemplate = () => {

    this.setState({
      fetching: true,

    })

    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "new_email": this.props.userdata.email,
        //"lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "menu_type": "Renovation cost calculator",
        "lang": 'all',
      })
    };


    fetch(ENDPOINTS.SERVER + '/set/default/temp', config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          console.log(result);
          if (result.ok) {
            this.shortDescriptionGet(this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected);
            this.stepDataGet();
            alert({
              text: 'default template set successfully',
              type: 'success',
              delay: 800,
              closer: true
            });


          } else {
            this.setState({
              fetching: false,

            })
            alert({
              text: 'There was an error!',
              type: 'error',
              delay: 800,
              closer: true
            });



          }
        

        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.shortDescriptionGet(this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected);
          this.setState({
            fetching: false,

          })
        }
      )
      .catch(error => {
        this.setState({
          fetching: false,

        })
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true

        });
      });


  }
  onTable2Addition(tag, filedName, id, index) {



    let stepCount = 0;


    stepCount = this.state.table2Tags[0].first_year_value[index].length === 0 ? 0 : this.state.table2Tags[0].first_year_value[index].length + 1;
    const menu_path = window.location.pathname.split('/')[2];

    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }

    let config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({

        "field_id": tag.id,
        "field_name": tag.name,
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "index": stepCount,
        "is_default_template": is_default_template

      })
    }



    fetch(ENDPOINTS.SERVER + '/oss/ees/tbl2/' + id + '/year', config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.resultTable2DataGet();

          alert({
            text: 'Data Update Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
        } else {

          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
        }


      });


  }

  onTable4Addition(tag, filedName, id, index) {



    let stepCount = 0;


    stepCount = this.state.table4Tags[0].first_year_value[index].length === 0 ? 0 : this.state.table4Tags[0].first_year_value[index].length + 1;

    const menu_path = window.location.pathname.split('/')[2];

    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }
    let config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({

        "field_id": tag.id,
        "field_name": tag.name,
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "index": stepCount,
        "is_default_template": is_default_template

      })
    }


    fetch(ENDPOINTS.SERVER + '/oss/ees/tbl2/' + id + '/year', config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.resultTable2DataGet();

          alert({
            text: 'Data Update Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
        } else {

          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
        }


      });


  }

  stepDataGet() {
    this.setState({

      fetching: true
    })
    
    const menu_path = window.location.pathname.split('/')[2];

    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }
    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    fetch(ENDPOINTS.SERVER + `/step?is_default_template=${is_default_template}&oss_admin_id=${this.props.userdata.email}&lang=${this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          console.log(result);
          console.log('jjjjjjjjjjj');
          if (result.documents !== null) {
            
            result.documents.map((stepVal, stepValindex) => {
              console.log('Step Name :- ' + stepVal.data.name);
              console.log('Step ID :- ' + stepVal.data.ID);

              stepVal.data.step_fields.map((fieldVal, fieldindex) => {

                console.log('field Name :- ' + fieldVal.name);
                console.log('field ID :- ' + fieldVal.ID);

              })
              console.log('-----------------------------');
            })

            this.setState({
              tabStep: result.documents,
              fetching: false,
            })

          } else {

            this.setState({
              tabStep: [],
              fetching: false,
            })
          }

        },

      )
  }
  shortDescriptionGet = (lang) => {
    
    const menu_path = window.location.pathname.split('/')[2];
    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }
    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };

    console.log(ENDPOINTS.SERVER + `/onboarding/description?menu_type=Renovation cost calculator&is_default_template=${is_default_template}&oss_admin_id=${this.props.userdata.email}&lang=${lang === 'en-US' ? 'en' : lang}`);
     fetch(ENDPOINTS.SERVER + `/onboarding/description?menu_type=Renovation cost calculator&is_default_template=${is_default_template}&oss_admin_id=${this.props.userdata.email}&lang=${lang === 'en-US' ? 'en' : lang}`, config)
    .then(res => res.json())
    // .then((result) => result.length ? JSON.parse(text) : {})
    .then(
      (result) => {

        console.log(result.length);
        if (result.length !== 0 ) {
          this.state.shortDescriptionInfo= result[0].description
          this.forceUpdate()

          
         console.log(this.state.shortDescriptionInfo);
        }else{

          this.state.shortDescriptionInfo = ''
          this.forceUpdate()
        } 
       
      },

    )
  

  }

  shortDescriptionUpdate = (event, id) => {
    const fieldName = event.target.name;
    const key = event.target.key;
    let value = event.target.value;
    const menu_path = window.location.pathname.split('/')[2];
    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }

    let config = {
      method: 'Post',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "description": value,
        "oss_admin_id": this.props.userdata.email,
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "menu_type": "Renovation cost calculator",
        "is_default_template": is_default_template
        //"image": 'snowflake_1.png',

      })
    }
    console.log(config);
    fetch(ENDPOINTS.SERVER + '/onboarding/description', config)
    ///.then(status => status.json().then(data => ({ data, status })))
    .then((result) => {
      if (result.status == 200) {
      

        alert({
          text: 'Short Description Update Successfully',
          type: 'success',
          delay: 800,
          closer: true
        });
      } else {

        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
      }


    });
  

  }
  resultDataGet() {
    // $(".tab >button").removeClass("active");
    // $(".tab >button:first-child").addClass("active");

    // document.getElementById("Table1").style.display = "block";
    // document.getElementById("Table2").style.display = "none";
    // document.getElementById("YEARLYDISTRIBUTIONOFCOSTS").style.display = "none";
    // document.getElementById("table4").style.display = "none";
    this.setState({
      fetching: true,

    })

    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    const menu_path = window.location.pathname.split('/')[2];

    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }

    fetch(ENDPOINTS.SERVER + `/step/result?is_default_template=${is_default_template}&oss_admin_id=${this.props.userdata.email}&lang=${this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected}`, config)
      .then(res => res.json())
      //.then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result.documents != null) {

            console.log();
            console.log('Result Table1 & Table 2');
            result.documents.map((stepVal, stepValindex) => {
              console.log('result title :- ' + stepVal.data.result_title);
              console.log('result id :- ' + stepVal.data.ID);
              console.log('table_type :- ' + stepVal.data.table_type);

              console.log('-----------------------------');
            })


            this.state.tabStepResult = result.documents


            this.forceUpdate()

            let cost_vat_xcl_array = [];
            let cost_vat_inc_array = [];


            let total_vat_inc_array = [];
            let total_vat_xcl_array = [];

            {
              this.state.tabStepResult.filter(item => item.data.table_type == 'Table 1').map((stepVal, stepValindex) => {

                cost_vat_xcl_array[stepValindex] = []
                cost_vat_inc_array[stepValindex] = []
                total_vat_inc_array[stepValindex] = []
                total_vat_xcl_array[stepValindex] = []

                {
                  stepVal.data.cost_vat_xcl.map((nameArrVal, nameArrIndex) => {

                    cost_vat_xcl_array[stepValindex][nameArrIndex] = { id: nameArrVal.field_id, name: nameArrVal.field_name, field_id: nameArrVal.id };

                  })
                }

                {
                  stepVal.data.cost_vat_inc.map((nameArrVal1, nameArrIndex1) => {

                    cost_vat_inc_array[stepValindex][nameArrIndex1] = { id: nameArrVal1.field_id, name: nameArrVal1.field_name, field_id: nameArrVal1.id };

                  })
                }

                {
                  stepVal.data.total_vat_inc.map((nameArrVal2, nameArrIndex2) => {

                    total_vat_inc_array[stepValindex][nameArrIndex2] = { id: nameArrVal2.field_id, name: nameArrVal2.field_name, field_id: nameArrVal2.id };

                  })
                }

                {
                  stepVal.data.total_vat_xcl.map((nameArrVal3, nameArrIndex3) => {

                    total_vat_xcl_array[stepValindex][nameArrIndex3] = { id: nameArrVal3.field_id, name: nameArrVal3.field_name, field_id: nameArrVal3.id };

                  })
                }



              })
            }

            this.state.tags[0].cost_vat_xcl = cost_vat_xcl_array
            this.state.tags[1].cost_vat_inc = cost_vat_inc_array
            this.state.tags[2].total_vat_xcl = total_vat_xcl_array
            this.state.tags[3].total_vat_inc = total_vat_inc_array
            this.forceUpdate()


            /////Heating Energy

            let cost_vat_xcl_array_heating = [];
            let cost_vat_inc_array_heating = [];


            let total_vat_inc_array_heating = [];
            let total_vat_xcl_array_heating = [];

            {
              this.state.tabStepResult.filter(item => item.data.table_type == 'Heating Energy').sort((a, b) => a.data.CreatedAt > b.data.CreatedAt ? 1 : -1).map((stepVal, stepValindex) => {

                cost_vat_xcl_array_heating[stepValindex] = []
                cost_vat_inc_array_heating[stepValindex] = []
                total_vat_inc_array_heating[stepValindex] = []
                total_vat_xcl_array_heating[stepValindex] = []

                {
                  stepVal.data.cost_vat_xcl.map((nameArrVal, nameArrIndex) => {

                    cost_vat_xcl_array_heating[stepValindex][nameArrIndex] = { id: nameArrVal.field_id, name: nameArrVal.field_name, field_id: nameArrVal.id };

                  })
                }

                {
                  stepVal.data.cost_vat_inc.map((nameArrVal1, nameArrIndex1) => {

                    cost_vat_inc_array_heating[stepValindex][nameArrIndex1] = { id: nameArrVal1.field_id, name: nameArrVal1.field_name, field_id: nameArrVal1.id };

                  })
                }

                {
                  stepVal.data.total_vat_inc.map((nameArrVal2, nameArrIndex2) => {

                    total_vat_inc_array_heating[stepValindex][nameArrIndex2] = { id: nameArrVal2.field_id, name: nameArrVal2.field_name, field_id: nameArrVal2.id };

                  })
                }

                {
                  stepVal.data.total_vat_xcl.map((nameArrVal3, nameArrIndex3) => {

                    total_vat_xcl_array_heating[stepValindex][nameArrIndex3] = { id: nameArrVal3.field_id, name: nameArrVal3.field_name, field_id: nameArrVal3.id };

                  })
                }



              })
            }


            this.state.tagsHeatingEnergy[0].cost_vat_xcl = cost_vat_xcl_array_heating
            this.state.tagsHeatingEnergy[1].cost_vat_inc = cost_vat_inc_array_heating
            this.state.tagsHeatingEnergy[2].total_vat_xcl = total_vat_xcl_array_heating
            this.state.tagsHeatingEnergy[3].total_vat_inc = total_vat_inc_array_heating
            this.state.tabStepResult = this.state.tabStepResult;


            this.forceUpdate()


            // this.setState({
            //   tabStepResult: this.state.tabStepResult,
            //   fetching: false,
            // })

          } else {

            this.state.tabStepResult = []


            this.forceUpdate()
          }

          this.setState({
            fetching: false,

          })
        },

      )
  }


  resultTable2DataGet() {
    this.setState({

      fetching: true
    })
    const menu_path = window.location.pathname.split('/')[2];

    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }
    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "oss_admin_id": this.props.userdata.email,
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "is_default_template": is_default_template

      })
    };

    fetch(ENDPOINTS.SERVER + '/oss/ees/tbl2', config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {
            console.log(result);
            console.log('Result Befor & After');
            result.map((stepVal, stepValindex) => {
              console.log('result title :- ' + stepVal.data.result_title);
              console.log('result id :- ' + stepVal.data.ID);
              console.log('table_type :- ' + stepVal.data.table_type);

              console.log('-----------------------------');
            })


            this.state.tabStepResultTable2 = result
            this.forceUpdate()

            let first_year_value_data = [];
            let first_year_value_data4 = [];

            {
              this.state.tabStepResultTable2.filter(item => item.data.table_type == 'Before').map((stepVal, stepValindex) => {
                first_year_value_data[stepValindex] = []
                {
                  stepVal.data.year_formula.map((nameArrVal, nameArrIndex) => {

                    first_year_value_data[stepValindex][nameArrIndex] = { id: nameArrVal.ID, name: nameArrVal.field_name, field_id: nameArrVal.field_id };

                  })
                }
              })
            }

            {
              this.state.tabStepResultTable2.filter(item => item.data.table_type == 'After').map((stepVal, stepValindex) => {
                first_year_value_data4[stepValindex] = []
                {
                  stepVal.data.year_formula.map((nameArrVal, nameArrIndex) => {

                    first_year_value_data4[stepValindex][nameArrIndex] = { id: nameArrVal.ID, name: nameArrVal.field_name, field_id: nameArrVal.field_id };

                  })
                }
              })
            }

            this.state.table4Tags[0].first_year_value = first_year_value_data4
            this.state.table2Tags[0].first_year_value = first_year_value_data
            //this.state.tabStepResultTable2 = result
            this.forceUpdate()
            this.setState({

              fetching: false
            })
            // this.setState({
            //   tabStepResultTable2: this.state.tabStepResultTable2
            // })

          } else {

            this.state.tabStepResultTable2 = [];
            this.forceUpdate()

            this.setState({

              fetching: false
            })
          }

        },

      )
  }


  dataPushInTag() {
    this.state.suggestions = [];
    this.state.suggestions = [
      { id: '+', name: "+", field_id: "" },
      { id: '-', name: "-", field_id: "" },
      { id: '/', name: "/", field_id: "" },
      { id: '*', name: "*", field_id: "" },
      { id: '(', name: "(", field_id: "" },
      { id: ')', name: ")", field_id: "" },
      { id: '%', name: "%", field_id: "" },
      { id: 'year', name: "year", field_id: "" },
      { id: 'selected_year', name: "selected_year", field_id: "" }
    ]
    this.forceUpdate();
    for (var i = 0; i <= 100000; i++) {
      // this.state.suggestionsTable2.push( { id:i.toString(), name: i.toString(),field_id:"" } );
      //this.state.suggestions.push( { id:i.toString(), name:i.toString(),field_id:"" } );
      let yyyy = { id: String(i), name: String(i), field_id: '' }
      this.state.suggestions.push(yyyy);
    }


    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    const menu_path = window.location.pathname.split('/')[2];

    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }
    fetch(ENDPOINTS.SERVER + `/step?is_default_template=${is_default_template}&oss_admin_id=${this.props.userdata.email}&lang=${this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result.documents != null) {


            this.setState({ tabStep: result.documents });
            //settabStep(result.documents);
            {
              result.documents.map((stepVal, stepValindex) => {

                {
                  stepVal.data.step_fields.map((filedVal, filedValindex) => {

                    let yyyy = { id: filedVal.is_default_template_id === '' ? filedVal.ID : filedVal.is_default_template_id, name: filedVal.name }


                    this.state.suggestions.push(yyyy);
                  })
                }
              })
            }
            this.setState({
              tabStep: this.state.tabStep
            })


          }

        },

      )
  }

  componentDidMount() {

    // const script = document.createElement("script");
    // script.src = "../../../../styles/ossAdmin/dist/js/app.js";
    // script.async = true;
    // document.body.appendChild(script);
    for (var i = 0; i <= 100000; i++) {
      // this.state.suggestionsTable2.push( { id:i.toString(), name: i.toString(),field_id:"" } );
      //this.state.suggestions.push( { id:i.toString(), name:i.toString(),field_id:"" } );
      let yyyy = { id: String(i), name: String(i), field_id: '' }
      this.state.suggestions.push(yyyy);
    }


    this.stepDataGet();
    this.shortDescriptionGet(this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected);
    this.dataPushInTag();

  }
  componentDidUpdate() {

  }


  textBoxChange = (event, id, stepKey, fieldKey) => {

    const fieldName = event.target.name;
    const key = event.target.key;
    let value = event.target.value;

    if ([fieldName] == 'require') {

      if (value == 'true') {

        value = false;
      } else {

        value = true;
      }

    } else {
      value = event.target.value;

    }
    this.state.tabStep[stepKey].data.step_fields[fieldKey][fieldName] = value
    this.forceUpdate()

    let config = {
      method: 'Put',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(this.state.tabStep[stepKey].data.step_fields[fieldKey])
    }

    fetch(ENDPOINTS.SERVER + '/step/' + id + '/field', config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.stepDataGet();
          this.dataPushInTag();
          alert({
            text: 'Data Update Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
        } else {

          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
        }


      });

  }

  stepTitleUpdate = (event, id) => {

    let config = {
      method: 'Put',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "name": event.target.value,

      })
    }


    fetch(ENDPOINTS.SERVER + '/step/' + id, config)
      //.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.stepDataGet();
          alert({
            text: 'Data Update Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
          // alert('Data Update Successfully');

        } else {

          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
        }


      });


  }

  addNewRow = id => {


    let { tabStep } = this.state;

    let stepCount = this.state.tabStep[id].data.step_fields.length + 1;
    const menu_path = window.location.pathname.split('/')[2];

    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }
    let config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "step_name": this.state.tabStep[id].data.name,
        "name": this.state.tabStep[id].data.name + ' Step Field ' + stepCount,
        "index": stepCount,
        "require": false,
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "placeholder": 'Step Field ' + stepCount,
        "text": 'this is Step Field 1 text',
        "is_default_template": is_default_template

      })
    }

    fetch(ENDPOINTS.SERVER + '/step/' + this.state.tabStep[id].data.ID + '/field', config)
      .then(status => status.json().then(data => ({ data, status })))
      .then(({ data, status }) => {
        this.stepDataGet();
        this.dataPushInTag();
        alert({
          text: 'Add New Field Successfully',
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
  };


  addNewStep = e => {



    let stepCount = this.state.tabStep.length + 1;

    const menu_path = window.location.pathname.split('/')[2];

    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }

    let config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "name": this.props.userdata.name + ' Step ' + stepCount,
        "index": stepCount,
        "require": true,
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "oss_admin_id": this.props.userdata.email,
        "is_default_template": is_default_template
      })
    }
    console.log(config);
    fetch(ENDPOINTS.SERVER + '/step', config)
      .then(status => status.json().then(data => ({ data, status })))
      .then(({ data, status }) => {
        this.stepDataGet();
        alert({
          text: 'Add New Step Successfully',
          type: 'success',
          delay: 800,
          closer: true
        });

        // this.setState(prevState => ({

        //   tabStep: [
        //     ...prevState.tabStep,
        //     {
        //       _id: data.data.ID,
        //       type:data.type,
        //       data: {
        //             ID: data.data.ID,
        //             CreatedAt: data.data.CreatedAt,
        //             UpdatedAt: data.data.UpdatedAt,
        //             DeletedAt: data.data.DeletedAt,
        //             index: data.data.index,
        //             name: data.data.name,
        //             require: data.data.require,
        //             oss_admin_id:data.data.oss_admin_id,
        //             step_fields: [

        //             ]
        //       },
        //       timestamp:data.timestamp
        //       }

        //   ]
        // }));

      })
      .catch(error => {
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
      });



  };


  handleNextStep() {

    $('.nav-tabs > .nav-item > .active').parent().next('li').find('a').trigger('click');

  }

  handlePrevStep() {

    $('.nav-tabs > .nav-item > .active').parent().prev('li').find('a').trigger('click');

  }

  // deteteRow = e => {

  //   this.setState({tabStep: this.state.tabStep.filter(function(tabStep) { 
  //     return tabStep !== e.target.value 
  // })});
  // };


  deleteStep = id => {
    const { tabStep } = this.state;

    const config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    fetch(ENDPOINTS.SERVER + '/step/' + id, config)
      // .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          if (result.status == 200) {
            this.stepDataGet();

            alert({
              text: 'Delete Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });

          } else {
            alert({
              text: 'There was an error!',
              type: 'error',
              delay: 800,
              closer: true
            });
          }


        },

      ).catch(error => {
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
        // console.error('There was an error!', error);
      });



  };


  clickOnDelete = (fieldId, stepId) => {
    this.setState({
      fetching: true,

    })
    const config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    fetch(ENDPOINTS.SERVER + '/step/' + fieldId + '/field', config)
      //.then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          if (result.status == 200) {
            this.resultDataGet();
            alert({
              text: 'Delete Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });


          } else {
            alert({
              text: 'There was an error!',
              type: 'error',
              delay: 800,
              closer: true
            });



          }

        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            fetching: false,

          })
        }
      )
      .catch(error => {
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true

        });
      });




  }

  addNewResult = (id, table_type) => {

    this.setState({
      fetching: true,

    })
    let { tabStepResult } = this.state;

    const menu_path = window.location.pathname.split('/')[2];

    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }
    let config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "cost_vat_xcl": [],
        "unit_vat_xcl": "€/m2",
        "cost_vat_inc": [],
        "unit_vat_inc": "€/m2",
        "vat": "0",
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "total_vat_xcl": [],
        "total_vat_inc": [],
        "oss_admin_id": this.props.userdata.email,
        "table_type": table_type,
        "is_default_template": is_default_template
      })
    }

    fetch(ENDPOINTS.SERVER + '/step/result', config)
      .then(status => status.json().then(data => ({ data, status })))
      .then(({ data, status }) => {

        this.resultDataGet();


        alert({
          text: 'Add New Successfully',
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
  };


  addNewResultTable2 = (id, table_type) => {


    let { tabStepResultTable2 } = this.state;

    const menu_path = window.location.pathname.split('/')[2];

    let is_default_template = 0;
    if (menu_path === 'admin') {

      is_default_template = 1;
    }
    let config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "result_title": '',
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "oss_admin_id": this.props.userdata.email,
        "is_default_template": is_default_template,
        "table_type": table_type
      })
    }

    fetch(ENDPOINTS.SERVER + '/oss/ees/tbl2', config)
      .then(status => status.json().then(data => ({ data, status })))
      .then(({ data, status }) => {
        this.resultTable2DataGet();
        alert({
          text: 'Add New Successfully',
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
  };

  resultValueUpdate = (event, id, resultKey, table_type) => {

    const fieldName = event.target.name;
    const key = event.target.key;
    const value = event.target.value;

    let gggg = this.state.tabStepResult.filter(item => item.data.table_type === table_type);


    gggg[resultKey].data[fieldName] = value
    this.forceUpdate()


    let config = {
      method: 'Put',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(gggg[resultKey].data)
    }


    fetch(ENDPOINTS.SERVER + '/step/result/' + id, config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          //this.resultDataGet();

          alert({
            text: 'Data Update Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
        } else {

          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
        }


      });


  }

  resultTable2ValueUpdate = (event, id, resultKey, table_type) => {

    const fieldName = event.target.name;
    const key = event.target.key;
    const value = event.target.value;

    let gggg = this.state.tabStepResultTable2.filter(item => item.data.table_type === table_type);


    gggg[resultKey].data[fieldName] = value
    this.forceUpdate()

    //this.state.tabStepResultTable2[resultKey].data[fieldName] =value
    // this.forceUpdate()


    let config = {
      method: 'Put',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(gggg[resultKey].data)
    }


    fetch(ENDPOINTS.SERVER + '/oss/ees/tbl2/' + id, config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.resultTable2DataGet();

          alert({
            text: 'Data Update Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
        } else {

          alert({
            text: 'There was an error!',
            type: 'error',
            delay: 800,
            closer: true
          });
        }


      });


  }

  resultTabChange = (evt, cityName) => {

    this.resultDataGet();


    let i = '';

    let tabcontent = '';
    let tablinks = '';


    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";

  }

  resultTab2Change = (evt, cityName) => {
    this.resultTable2DataGet();
    let i = '';

    let tabcontent = '';
    let tablinks = '';


    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";

  }
  deleteResultRow = id => {
    const { tabStepResult } = this.state;

    const config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    fetch(ENDPOINTS.SERVER + '/step/result/' + id, config)
      // .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          if (result.status == 200) {
            this.resultDataGet();

            alert({
              text: 'Delete Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });

          } else {
            alert({
              text: 'There was an error!',
              type: 'error',
              delay: 800,
              closer: true
            });
          }


        },

      ).catch(error => {
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
        // console.error('There was an error!', error);
      });



  };

  deleteResultTable2Row = id => {
    let { tabStepResultTable2 } = this.state;

    const config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    fetch(ENDPOINTS.SERVER + '/oss/ees/tbl2/' + id, config)
      // .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          if (result.status == 200) {
            this.resultTable2DataGet();

            alert({
              text: 'Delete Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });

          } else {
            alert({
              text: 'There was an error!',
              type: 'error',
              delay: 800,
              closer: true
            });
          }


        },

      ).catch(error => {
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
        // console.error('There was an error!', error);
      });



  };
  dataBackupConfirm() {

    confirmAlert({
      customUI: ({ onClose }) => {
        return (

          <div className='custom-ui'>
            <div className="p-5 text-center">
              <div className="text-3xl mt-5">{this.props.t('translations:onboardingValidation.confirm_to_backup')}</div>
              <div className="text-gray-600 mt-2">{this.props.t('translations:onboardingValidation.confirm_to_backup1')}</div>
            </div>
            <div className="preview">
              <div>
                <label>{this.props.t('translations:ossOnboardingTitle.Title')}</label>
                <input type="text" name="title" onChange={(e) => this.backUpTitleChange(e)} className="input w-full border mt-2" placeholder="Title" />
                {this.state.titleError === true ? <span style={{ color: "red" }}>{this.state.titleErrorMsg}</span> : ''}
                <span style={{ color: "red", display: 'none' }} id="titleError"> {this.props.t('translations:onboardingValidation.title_field')}</span>
              </div>
            </div>
            <br></br>

            <div className="px-5 py-3 text-right border-t border-gray-200 dark:border-dark-5">
              <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-1" onClick={onClose}>{this.props.t('translations:navigation.no')}</button>

              {(() => {

                if (this.state.backUpTitle === '') {
                  return <>
                    <button type="button" className="button w-20 bg-theme-1 text-white" onClick={() => { this.dataBackup(); onClose(); }}>{this.props.t('translations:navigation.yes')}</button>
                  </>

                } else {
                  return <>
                    <button type="button" className="button w-20 bg-theme-1 text-white" onClick={() => { this.dataBackup(); onClose(); }}>{this.props.t('translations:navigation.yes')}</button>
                  </>

                }
              })()}



            </div>

          </div>
        );
      }
    });

  }

  dataBackup() {
    if (this.state.backUpTitle === '') {

      $('#titleError').show();

    } else {
      this.setState({
        fetching: true,

      })

      let config = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          "title": this.state.backUpTitle,
          "oss_admin_id": this.props.userdata.email,

          "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,

        })
      }


      fetch(ENDPOINTS.SERVER + '/backup/restore/ees/calculator', config)
        //.then(res => res.json())
        ///.then(status => status.json().then(data => ({ data, status })))
        .then((result) => {

          if (result.status == 200) {
            alert({
              text: 'Backup Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });
            $('#titleError').hide();

            this.setState({
              backUpTitle: '',
              fetching: false,

            })
          } else {
            this.setState({
              fetching: false,

            })
            alert({
              text: 'There was an error!',
              type: 'error',
              delay: 800,
              closer: true
            });

          }
        });
    }

  }
  render() {
    const { userdata, t } = this.props;
    let { bookDetails, tabStep, fetching, tabStepResult, tags, suggestions, newTag, tags2, table2Tags, table4Tags, suggestionsTable2, tabStepResultTable2, tagsHeatingEnergy } = this.state;

    console.log(tabStepResultTable2);
    return (
      <React.Fragment>

        <Helmet>

          <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style>
        </Helmet>
        <MobileNavContainer />
        <div className="flex">
          {/* <div className="flex"> */}
          <NavContainer />
          <div className="content oss-admin">
            <TopBar userdata={userdata} pageTitle='translations:ossMenu.SimulationTools' subTitle="translations:ossMenu.RenovationCostCalculator" />


            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <section style={{ marginTop: '10px', marginBottom: '0px' }}    >
                  <div className="container oss-admin h-auto">
                    <div className="row row-eq-height" style={{ background: ' #F5F7FA' }}  >
                      <div className="col-md-3 pl-0" id="EEScalculator">
                        <div className="row">
                          <div className="col-md-12 mb-3 mt-2 text-center">
                            <center><img src={Logo_europa_White} alt="EUROPA" style={{ height: '150px' }} /></center>
                          </div>
                          <div className="col-md-12 mb-3 text-center ">
                            <h2 className="welcomeTitle mt-2"> {t('translations:ossOnboardingTitle.title1')}</h2>
                          </div>
                          <div className="col-md-12 mb-2 mt-2 text-center" style={{ paddingRight: '0px' }} >
                            <center>
                              <img src={calculaadora} alt="" style={{ marginTop: '-34px', marginLeft: '126px', height: '50%', position: 'absolute' }} />
                              <img src={quizHomeIcon} alt="" style={{ marginTop: '30px' }} />
                            </center>
                          </div>
                        </div>
                        <div className="row" style={{ marginLeft: '0PX', marginRight: '0PX' }}>
                          <div className="col-md-12 mb-2 mt-2" style={{ marginLeft: 'auto', marginRight: 'auto' }} >
                            <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={this.addNewStep}>
                              <span className="w-5 h-5 flex items-center justify-center" id="add_question">

                                <PlusIcon /> </span>
                            </button>
                            <ul className="nav nav-tabs flex-column mb-3" id="customeTab">
                              {/* {this.state.fetching ?
                                                      <ProgressBar />
                                                      :   */}
                              <AppendStep add={this.addNewRow}
                                addNewRow={this.addNewRow}
                                delete={this.clickOnDelete}
                                tabStep={tabStep}
                                fetching={fetching}
                                nextButtonClick={this.handleNextStep}
                                bookDetails={bookDetails}
                                prevButtonClick={this.handlePrevStep}
                                deleteStep={this.deleteStep}
                                textBoxChange={this.textBoxChange}
                                stepTitleUpdate={this.stepTitleUpdate}
                              />
                              {/* }  */}

                              <li className="nav-item" >
                                <a className="nav-link" data-toggle="tab" href="#result" onClick={() => this.resultDataGet()} style={{ lineHeight: '20px' }}>
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                  <div className="circle">0</div>
                                  <input type="text" className="input w-full" style={{ width: '70%', margin: '-9px 0px 0px 31px', position: 'absolute', background: '#ff000000', borderWidth: '1px', border: 'none', borderBottom: '0.89246px solid #BFD4E4' }} readOnly={true} defaultValue="Result" placeholder="Result" />
                                </a>
                              </li>

                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-9 " style={{ background: 'white' }} >
                        <div className="row row-eq-height align-middle my-auto">
                          <div className="col-md-12" style={{ paddingLeft: "15px" }}>
                            <h2 className="basicinfo-title"><span style={{ fontSize: '9.92639px', color: '#FE9B00' }}>Q:
                              <span id="currentCounter">1 </span>/5 </span> &nbsp;&nbsp;<span > {t('translations:ossMenu.RenovationCostCalculator')}</span>
                            </h2>
                            <br />
                            <br />
                           
                           
                            <div className="row">        
                            <div className="col-md-6">
                            <h2 className="modelH2">
                              {t('translations:ossOnboardingTitle.selectLanguage')}</h2>
                              </div>  
                                  {(() => {
                                    const menu_path = window.location.pathname.split('/')[2];
                                    if (menu_path !== "admin") {

                                      return <div className="col-md-6">

                                        <a onClick={() => this.stepDefaultTemplateConfirm()} className="button px-2 mr-1 mb-2 bg-theme-1 text-white" title="Set Default" style={{ float: 'right' }}>

                                          <SettingsBackupRestoreIcon />

                                        </a>
                                        <a onClick={() => this.dataBackupConfirm()} className="button px-2 mr-1 mb-2 bg-theme-1 text-white" title="Backup" style={{ float: 'right' }} >

                                          <BackupIcon />

                                        </a>
                                        <Link to={'/preview/renovation-cost-calculator/' + this.props.userdata.ID} className="button px-2 mr-1 mb-2 bg-theme-1 text-white" title="Preview" style={{ float: 'right' }}><VisibilityIcon /> </Link>

                                      </div>
                                    } else {

                                      return <div className="col-md-6">


                                        <Link to={'/simulationTools/admin/preview/renovation-cost-calculator/' + this.props.userdata.ID} className="button px-2 mr-1 mb-2 bg-theme-1 text-white" title="Preview" style={{ float: 'right' }}><VisibilityIcon /> </Link>

                                      </div>

                                    }
                                  })()}
                                </div>
                            <div className="row">
                              <div className="col-md-12">
                                <div className="row">

                                  {/* <img src={Belgium} alt="Belgium" />
                                    <img src={France} alt="France" />
                                    <img src={Italy} alt="Italy" />
                                    <img src={Latvia} alt="Latvia" />
                                    <img src={Portugal} alt="Portugal" />
                                    <img src={Spain} alt="Spain" />
                                    <img src={UK} alt="UK" /> */}


                                  <div className="col-md-1" id="ossstep5chk">
                                    <center>
                                      <input type="radio" id="language111" name="languageggggg" defaultChecked={this.state.langSelected === "en" || this.state.langSelected === "en-US"} value="en" onClick={e => this.lngChange(e)} />
                                      <label htmlFor="language111" title="English" style={{ cursor: 'pointer' }}> <center><img src={gbFlag} alt="UK" style={{ height: '20px', width: '30px', marginTop: '9px' }} /> </center></label>
                                    </center>
                                  </div>


                                  <div className="col-md-1" id="ossstep5chk">
                                    <center>
                                      <input type="radio" id="language444" name="languageggggg" defaultChecked={this.state.langSelected === "lv"} value="lv" onChange={e => this.lngChange(e)} />
                                      <label htmlFor="language444" title="Latvia" style={{ cursor: 'pointer' }}> <center> <img src={latviaFlag} alt="Latvia" style={{ height: '20px', width: '30px', marginTop: '9px' }} /> </center></label>
                                    </center>
                                  </div>

                                  <div className="col-md-1" id="ossstep5chk">
                                    <center>
                                      <input type="radio" id="language555" name="languageggggg" defaultChecked={this.state.langSelected === "pt"} value="pt" onChange={e => this.lngChange(e)} />
                                      <label htmlFor="language555" title="Portugal" style={{ cursor: 'pointer' }}> <center> <img src={PortugalFlag} alt="Portugal" style={{ height: '20px', width: '30px', marginTop: '9px' }} /> </center></label>
                                    </center>
                                  </div>

                                  <div className="col-md-1" id="ossstep5chk">
                                    <center>
                                      <input type="radio" id="language666" name="languageggggg" defaultChecked={this.state.langSelected === "it"} value="it" onChange={e => this.lngChange(e)} />
                                      <label htmlFor="language666" title="Italian" style={{ cursor: 'pointer' }}> <center> <img src={ItalyFlag} alt="Italian" style={{ height: '20px', width: '30px', marginTop: '9px' }} /> </center></label>
                                    </center>
                                  </div>
                                  <div className="col-md-1" id="ossstep5chk">
                                    <center>
                                      <input type="radio" id="language777" name="languageggggg" defaultChecked={this.state.langSelected === "de"} value="de" onChange={e => this.lngChange(e)} />
                                      <label htmlFor="language777" title="German" style={{ cursor: 'pointer' }}> <center> <img src={GermanFlag} alt="German" style={{ height: '30px', width: '30px', marginTop: '4px' }} /> </center></label>
                                    </center>
                                  </div>

                                  <div className="col-md-1" id="ossstep5chk">
                                    <center>
                                      <input type="radio" id="language888" name="languageggggg" defaultChecked={this.state.langSelected === "fr"} value="fr" onChange={e => this.lngChange(e)} />
                                      <label htmlFor="language888" title="French" style={{ cursor: 'pointer' }}> <center> <img src={FrenchFlag} alt="French" style={{ height: '30px', width: '30px', marginTop: '4px' }} /> </center></label>
                                    </center>
                                  </div>

                                   
                                  <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language001" name="languageggggg" defaultChecked={this.state.langSelected === "at"} value="at"onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language001" title="Austrian" style={{ cursor: 'pointer' }}> <center><img src={austrianFlag} alt="Austrian" style={{ height: '30px', width: '30px',marginTop: '4px'  }} /> </center></label>
                                        </center>
                                      </div>                                                                     
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language002" name="languageggggg" defaultChecked={this.state.langSelected === "sk"} value="sk" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language002" title="Slovak" style={{ cursor: 'pointer' }}> <center><img src={slovakFlag} alt="Slovak" style={{ height: '22px', width: '30px',marginTop: '8px'  }} /> </center></label>
                                        </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language003" name="languageggggg" defaultChecked={this.state.langSelected === "ro"} value="ro" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language003" title="Romanian" style={{ cursor: 'pointer' }}><center><img src={romanianFlag} alt="Romanian" style={{ height: '22px', width: '30px',marginTop: '8px'  }} /> </center></label>
                                        </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language004" name="languageggggg" defaultChecked={this.state.langSelected === "pl"} value="pl" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language004" title="Polish" style={{ cursor: 'pointer' }}><center><img src={polishFlag} alt="Polish" style={{ height: '30px', width: '30px',marginTop: '4px'  }} /> </center></label>
                                        </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">                                    
                                      <center>
                                      <input type="radio" id="language005" name="languageggggg"  defaultChecked={this.state.langSelected === "bg"}  value="bg" onClick={e =>this.lngChange(e)}/>
                                      <label htmlFor="language005" title="Bulgarian" style={{ cursor: 'pointer' }}> <center><img src={bulgarianFlag} alt="Bulgarian" style={{ height: '30px', width: '30px',marginTop: '4px'  }} /> </center></label>                                     
                                      </center>
                                      </div>
                                 
                                 </div>

                             
                              </div>




                            </div>

                            <hr />
                            <br></br>
                            <div className="row">
                            {this.state.fetching ?
                                                   <p></p>
                                                      : 
                              <div className="col-md-12">
                                <h4 style={{ marginBottom: '10px' }}>Short Description</h4>
                                <textarea id="w3review" name="shortDescription" defaultValue={this.state.shortDescriptionInfo}  rows="4" cols="100" style={{ border: "0.89246px solid rgb(191, 212, 228)", width: "100%" }} onBlur={(e) => this.shortDescriptionUpdate(e)}>
                           
                                </textarea>
                              </div>
                               }
                            </div>
                            <br></br>
                          </div>
                          <div className="col-md-12">
                            <section className="signup-step-container" style={{ marginTop: '10px', marginBottom: '10px' }} >
                              <div className="container">
                                <div className="row d-flex " style={{ marginLeft: '5px' }}>

                                  <div className="col-md-12">
                                    <div className="wizard">
                                      <div className="tab-content" id="tab-details">

                                        <AppendFields
                                          add={this.addNewRow}
                                          delete={this.clickOnDelete}
                                          tabStep={tabStep}
                                          nextButtonClick={this.handleNextStep}
                                          prevButtonClick={this.handlePrevStep}
                                          bookDetails={bookDetails}
                                          addNewRow={this.addNewRow}
                                          deleteStep={this.deleteStep}
                                          textBoxChange={this.textBoxChange}
                                          stepTitleUpdate={this.stepTitleUpdate}
                                        />

                                        <div className="tab-pane" id="result">
                                        
                                          <h2 style={{ fontSize: " 21.2266px" }} className="mt-3 mb-4">Results   </h2>


                                          <div className="row">
                                            <div className="col-md-12 mb-2" id="esscaltab" style={{ paddingRight: '0px', paddingLeft: '0px' }}>


                                              <div className="tab">
                                                <button type="button" className="tablinks active" onClick={(e) => this.resultTabChange(e, 'Table1')} >Total costs</button>
                                                <button type="button" className="tablinks" onClick={(e) => this.resultTabChange(e, 'Table2')} >Energy indicators</button>
                                                <button type="button" className="tablinks" onClick={(e) => this.resultTab2Change(e, 'YEARLYDISTRIBUTIONOFCOSTS')} >Yearly distribution of cost before renovation</button>
                                                <button type="button" className="tablinks" onClick={(e) => this.resultTab2Change(e, 'table4')} >Yearly distribution of cost after renovation</button>
                                              </div>


                                            </div>
                                          </div>

                                          <div className="row">
                                            <div className="col-md-12 mb-3" id="esscaltab" style={{ overflow: 'auto' }}>

                                              <div id="Table1" className="tabcontent" style={{ display: 'block' }}>
                                                <br></br>
                                                <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={() => this.addNewResult(0, 'Table 1')} >
                                                  <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                                                    <PlusIcon />
                                                  </span>
                                                </button>

                                                {this.state.fetching ?
                                                  <ProgressBar />
                                                  :
                                                  <table className="table table-bordered">
                                                    <thead>
                                                      <tr>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>
                                                          Action
                                                        </th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>
                                                          Title
                                                        </th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>
                                                          Cost/unit<br />(excl. VAT)
                                                        </th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>Unit</th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>VAT</th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}> Cost/unit<br />(incl. VAT)</th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>Unit</th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>Totals <br />(excl VAT)</th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>Totals <br />(incl VAT)</th>

                                                      </tr>
                                                    </thead>

                                                    <tbody>


                                                      <ResultData tags={tags} fetching={fetching} suggestions={suggestions} reactTags={this.reactTags} reactTags1={this.reactTags1} onDelete={this.onDelete} onAddition={this.onAddition} handleChangeTag={this.handleChangeTag} deleteResultRow={this.deleteResultRow} tabStepResult={tabStepResult} tabStep={tabStep} resultValueUpdate={this.resultValueUpdate} />




                                                    </tbody>
                                                  </table>
                                                }
                                              </div>

                                              <div id="Table2" className="tabcontent" >
                                                <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={() => this.addNewResult(0, 'Heating Energy')} >
                                                  <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                                                    <PlusIcon />
                                                  </span>
                                                </button>

                                                {this.state.fetching ?
                                                  <ProgressBar />
                                                  :
                                                  <table className="table table-bordered">
                                                    <thead>
                                                      <tr>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>
                                                          Action
                                                        </th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>
                                                          Title
                                                        </th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>
                                                          %
                                                        </th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>Unit</th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>VAT</th>
                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}> Tariff (incl VAT)</th>

                                                        <th scope="col" style={{ fontSize: '10.77542px', lineHeight: '12px' }}>Energy use<br /> for Building</th>


                                                      </tr>
                                                    </thead>

                                                    <tbody>

                                                      <HeatingEnergyResultData onAdditionHeating={this.onAdditionHeating} tagsHeatingEnergy={tagsHeatingEnergy} tags={tags} suggestions={suggestions} reactTags={this.reactTags} reactTags1={this.reactTags1} onDelete={this.onDelete} onAddition={this.onAddition} handleChangeTag={this.handleChangeTag} deleteResultRow={this.deleteResultRow} tabStepResult={tabStepResult} tabStep={tabStep} resultValueUpdate={this.resultValueUpdate} />


                                                    </tbody>
                                                  </table>
                                                }
                                              </div>

                                              <div id="YEARLYDISTRIBUTIONOFCOSTS" className="tabcontent">
                                                <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={() => this.addNewResultTable2(0, 'Before')} >
                                                  <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                                                    <PlusIcon />
                                                  </span>
                                                </button>

                                                {this.state.fetching ?
                                                  <ProgressBar />
                                                  :
                                                  <table className="table table-bordered">
                                                    <thead>
                                                      <tr>
                                                        <th scope="col">
                                                          Action
                                                        </th>
                                                        <th scope="col">Years</th>
                                                        <th scope="col">1</th>

                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      <ResultDataTable2 tags={table2Tags} suggestions={suggestions} reactTags={this.reactTags} reactTags1={this.reactTags1} onDelete={this.onDeleteTable2} onAddition={this.onTable2Addition} handleChangeTag={this.handleChangeTag} deleteResultRow={this.deleteResultTable2Row} tabStepResult={tabStepResultTable2} tabStep={tabStep} resultValueUpdate={this.resultTable2ValueUpdate} />

                                                    </tbody>
                                                  </table>
                                                }
                                              </div>
                                              <div id="table4" className="tabcontent">
                                                <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={() => this.addNewResultTable2(0, 'After')} >
                                                  <span className="w-5 h-5 flex items-center justify-center" id="add_question">
                                                    <PlusIcon />
                                                  </span>
                                                </button>

                                                <table className="table table-bordered">
                                                  <thead>
                                                    <tr>
                                                      <th scope="col">
                                                        Action
                                                      </th>
                                                      <th scope="col">Years</th>
                                                      <th scope="col">1</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {this.state.fetching ?
                                                      <ProgressBar />
                                                      :
                                                      <ResultDataTable4 tags={table4Tags} suggestions={suggestions} reactTags={this.reactTags} reactTags1={this.reactTags1} onDelete={this.onDeleteTable2} onAddition={this.onTable4Addition} handleChangeTag={this.handleChangeTag} deleteResultRow={this.deleteResultTable2Row} tabStepResult6={tabStepResultTable2} tabStep={tabStep} resultValueUpdate={this.resultTable2ValueUpdate} />
                                                    }
                                                  </tbody>
                                                </table>

                                              </div>
                                            </div>
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
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );

  }
}

export default connect(state => ({
  alerts: state.alerts.pending,
  userdata: state.user.profileInfo.data,
  language: state.user.language,
}),
  dispatch => ({
    toggleLanguage: (lang) => {
      dispatch(toggleLanguage(lang));
    }

  })
)(withTranslation('translations')(EESCalculatorView));
