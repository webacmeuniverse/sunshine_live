import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import NavContainer from '../../../smartcomponents/ossnavcontainer';
import MobileNavContainer from '../../../smartcomponents/ossMobileNavContainer';
import language_icon from '../../../../styles/assets/images/language-icon.png';
import { Link } from 'react-router-dom';
import calculaadora from '../../../../styles/ossAdmin/assets/calculaadora.png';
import quizHomeIcon from '../../../../styles/ossAdmin/assets/quizHomeIcon.png';
import Logo_europa_White from '../../../../images/3SUNShiNE_Black.svg';
import toggleLanguage from '../../../../actions/language';
import i18n from 'i18next';
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
import { LV, EN, BG, SK, AT, RO, PL, FR } from './../../../../components/utils/SVGflags';
import ProgressBar from '../../../../components/utils/ProgressBar';
import TopBar from '../../../../components/ossnavigation/TopBar';
import { AppendFields, AppendStep } from "./AppendFields";
import { ResultData } from "./ResultData";
import ENDPOINTS from '../../../../constants/endpoints';

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
import Belgium from '../../../../styles/assets/images/country/Belgium.png';
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

import ReactTags from 'react-tag-autocomplete'
import './style.css';


class EESCalculatorView extends React.Component {



  constructor(props) {

    super(props);
    this.state = {
      errors: {},
      tabStep: [],
      tabStepResult: [],
      langSelected: this.props.language,
      fetching: true,
      menu_type_name: "",
      pageTitle: "",
      backUpDataList: [],
      open: false,
      anchorEl: '',
      backUpTitle: '',
      titleErrorMsg: ''

    }
    this.stepDataGet = this.stepDataGet.bind(this);
    this.lngChange = this.lngChange.bind(this);


  }

  backUpTitleChange = e => {

    let nameType = e.target.name;
    let value = e.target.value;

    this.setState({
      backUpTitle: value
    });

  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
  lngChange = (e) => {
    //this.props.toggleLanguage(e.target.value);
    this.setState({
      fetching: true,
    })

    this.state.langSelected = e.target.value

    this.forceUpdate();
    //this.shortDescriptionGet();
    this.stepDataGet();


  }


  // onDelete (i,id) {

  //   let config = {
  //     method: 'DELETE',
  //     headers: { 'Content-Type': 'text/plain' },

  //   }


  //    fetch(ENDPOINTS.SERVER + '/step/result/subitem/'+id[i].field_id, config)
  //       ///.then(status => status.json().then(data => ({ data, status })))
  //       .then((result) => {
  //         if(result.status == 200){


  //           alert({
  //             text: 'Deleted Successfully',
  //             type: 'success',
  //             delay: 800,
  //             closer: true
  //           });
  //         }else{

  //           alert({
  //             text: 'There was an error!',
  //             type: 'error',
  //             delay: 800,
  //             closer: true
  //           });
  //         }


  //       });

  // }

  componentDidMount() {

    const menu_path = window.location.pathname.split('/')[3];

    let menu_type = "";
    let pageTitleText = "";
    if (menu_path === 'residents') {

      menu_type = "Resident";
      pageTitleText = "Onboarding";

    } else if (menu_path === 'housing') {
      menu_type = "Housing Association";
      pageTitleText = "Onboarding";

    } else if (menu_path === 'operator') {

      menu_type = "Service Operator";
      pageTitleText = "Onboarding";

    } else if (menu_path === 'building-calculator') {
      pageTitleText = "Simulation Tools";
      menu_type = "Building Calculator";
    } else if (menu_path === 'sustainability') {
      pageTitleText = "Simulation Tools";
      menu_type = "Sustainability";

    } else if (menu_path === 'standard-renovation-packages') {
      pageTitleText = "Simulation Tools";
      menu_type = "Standard Renovation Packages";

    } else if (menu_path === 'contract') {
      pageTitleText = "Simulation Tools";
      menu_type = "Contract";

    } else if (menu_path === 'measurement-project') {
      pageTitleText = "Simulation Tools";
      menu_type = "Measurement Verification of the project";

    } else if (menu_path === 'refinancability-Checklist') {
      pageTitleText = "Simulation Tools";
      menu_type = "EES Refinancability Checklist";

    } else {

      menu_type = "";
    }

    this.state.menu_type_name = menu_type
    this.state.pageTitle = pageTitleText
    this.forceUpdate()
    this.setState({
      menu_type_name: menu_type,
      pageTitle: pageTitleText
    })
    this.stepDataGet();
    this.backUpList();
    //
  }
  componentDidUpdate() {
    //this.backUpList(); 
  }

  backUpRestoreConfirm(backup_time) {


    confirmAlert({
      title: 'Confirm to restore',
      message: 'Are you sure to restore this data.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => this.backUpRestore(backup_time)
        },
        {
          label: 'No',
          //onClick: () => alert('Click No')
        }
      ]
    });

  }

  backUpRestore(backup_time) {

    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "oss_admin_id": this.props.userdata.email,
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "menu_type": this.state.menu_type_name,
        "backup_time": backup_time,
      })
    };


    fetch(ENDPOINTS.SERVER + '/backup/step/question/field/options', config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          alert({
            text: 'restore successfully completed',
            type: 'success',
            delay: 800,
            closer: true
          });



        },

      ).catch(error => {

        alert({
          text: 'data not available',
          type: 'error',
          delay: 800,
          closer: true

        });
      });

  }
  backUpList() {


    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    };


    fetch(ENDPOINTS.SERVER + '/backup/step/question/field/options?oss_admin_id=' + this.props.userdata.email + '&menu_type=' + this.state.menu_type_name + '&lang=' + this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {


          if (result != null) {

            this.setState({
              backUpDataList: result
            })

          } else {
            this.setState({
              backUpDataList: []
            })


          }

        },

      ).catch(error => {

      });
  }
  //Step Function Start
  stepDataGet() {

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
        "menu_type": this.state.menu_type_name,
        "is_default_template": is_default_template
      })
    };


    fetch(ENDPOINTS.SERVER + '/onboarding/residents/step', config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result.documents != null) {

            this.setState({
              tabStep: result.documents
            })

          } else {

            this.setState({
              tabStep: []
            })
            alert({
              text: 'data not available',
              type: 'success',
              delay: 800,
              closer: true
            });

          }
          this.setState({
            fetching: false,

          })
        },

      ).catch(error => {
        this.setState({
          tabStep: []
        })
        alert({
          text: 'data not available',
          type: 'error',
          delay: 800,
          closer: true

        });
      });
  }

  addNewStep = e => {

    this.setState({
      fetching: true,

    })

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
        "name": this.props.userdata.name + ' ' + this.state.menu_type_name + '  Step ' + stepCount,
        "index": stepCount,
        "require": true,
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "oss_admin_id": this.props.userdata.email,
        "menu_type": this.state.menu_type_name,
        "is_default_template": is_default_template
      })
    }
  

    fetch(ENDPOINTS.SERVER + '/onboarding/residents/step', config)
      .then(status => status.json().then(data => ({ data, status })))
      .then(({ data, status }) => {
        this.stepDataGet();

        alert({
          text: 'Add New Step Successfully',
          type: 'success',
          delay: 800,
          closer: true
        });


      })
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



  };
  stepTitleUpdate = (event, id) => {

    let config = {
      method: 'Put',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "name": event.target.value,

      })
    }


    fetch(ENDPOINTS.SERVER + '/onboarding/residents/step/' + id, config)
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

  deleteStep = id => {
    this.setState({
      fetching: true,

    })
    const { tabStep } = this.state;

    const config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    fetch(ENDPOINTS.SERVER + '/onboarding/residents/step/' + id, config)
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

      ).catch(error => {
        this.setState({
          fetching: false,

        })
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
        // console.error('There was an error!', error);
      });



  };

  //Step Function Finish

  //Add New Question
  questionAdd = (event, id) => {
    this.setState({
      fetching: true,

    })
    let stepId = '' + id;
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
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "name": "Question",
        "step_id": stepId,
        "index": 0,
        "is_default_template": is_default_template

      })
    }

    fetch(ENDPOINTS.SERVER + '/onboarding/resident/question', config)
      .then(status => status.json().then(data => ({ data, status })))
      .then(({ data, status }) => {
        this.stepDataGet();
        alert({
          text: 'Add New Question Successfully',
          type: 'success',
          delay: 800,
          closer: true
        });


      })
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
  };

  //Question Data Update

  questionUpdate = (event, id, stepKey, fieldKey) => {

    const fieldName = event.target.name;
    const key = event.target.key;
    let value = event.target.value;

    let config = {
      method: 'Put',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({

        "name": value,

      })
    }

    fetch(ENDPOINTS.SERVER + '/onboarding/resident/question/' + id, config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.stepDataGet();

          alert({
            text: 'Question Update Successfully',
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


      });

  }
  questionDelete = (id) => {
    this.setState({
      fetching: true,

    })
    const config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };


    fetch(ENDPOINTS.SERVER + '/onboarding/resident/question/' + id, config)
      //.then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result.status === 200) {

            this.stepDataGet();
            alert({
              text: 'Delete Successfully',
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
          //
          //setError(error);
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
    //
    //

  }

  //Add New Field
  addNewField = id => {
    this.setState({
      fetching: true,

    })
    let filedTypeValue = $('#filedType-' + id).val();

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
        "index": 0,
        "name": 'Title',
        "require": false,
        "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "placeholder": 'placeholder',
        "input_type": filedTypeValue,
        "is_default_template": is_default_template
      })
    }

    fetch(ENDPOINTS.SERVER + '/onboarding/residents/field/' + id, config)
      .then(status => status.json().then(data => ({ data, status })))
      .then(({ data, status }) => {

        this.stepDataGet();
        alert({
          text: 'Add New Field Successfully',
          type: 'success',
          delay: 800,
          closer: true
        });


      })
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

  };
  fieldUpdate = (event, id, stepKey, fieldKey, questionKey) => {

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

    if ([fieldName] == 'text_number') {
      if (value == 'checkbox') {

        this.addFiledOption(stepKey, fieldKey);
      } else if (value == 'radio') {

        this.addFiledOption(stepKey, fieldKey);
      }

    }



    this.state.tabStep[stepKey].data.questions[questionKey].step_fields[fieldKey][fieldName] = value
    this.forceUpdate()

    let config = {
      method: 'Put',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(this.state.tabStep[stepKey].data.questions[questionKey].step_fields[fieldKey])
    }


    fetch(ENDPOINTS.SERVER + '/onboarding/residents/field/' + id, config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.stepDataGet();

          alert({
            text: 'Data Update Successfully',
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


      });
    //   .catch(error => {
    //     alert('There was an error!');
    //     console.error('There was an error!', error);
    // });



  }
  fieldDelete = (fieldId, stepId) => {
    this.setState({
      fetching: true,

    })
    const config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    fetch(ENDPOINTS.SERVER + '/onboarding/residents/field/' + fieldId, config)
      //.then(res => res.json())
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
          //
          //setError(error);
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
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "new_email": this.props.userdata.email,
        "menu_type": this.state.menu_type_name,
        //"lang":this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
        "lang": 'all',
      })
    };
  

    fetch(ENDPOINTS.SERVER + '/set/default/temp', config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result.message !== '200') {

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

          //setError(error);
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

  fieldOptionImageUpdate = (event, id, imageName) => {

    const fieldName = event.target.name;
    const key = event.target.key;
    let value = event.target.value;

    let config = {
      method: 'Put',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "image": imageName,
      })
    }

    fetch(ENDPOINTS.SERVER + '/step/field/option/' + id, config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.stepDataGet();
          this.handleRequestClose();
          alert({
            text: 'Field Option Update Successfully',
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


      });
    //   .catch(error => {
    //     alert('There was an error!');
    //     console.error('There was an error!', error);
    // });



  }

 
  fieldOptionUpdate = (event, id) => {

    const fieldName = event.target.name;
    const key = event.target.key;
    let value = event.target.value;



    let config = {
      method: 'Put',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "title": value,
        "option_value": value,
        //"image": 'snowflake_1.png',

      })
    }


    fetch(ENDPOINTS.SERVER + '/step/field/option/' + id, config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.stepDataGet();

          alert({
            text: 'Field Option Update Successfully',
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


      });
    //   .catch(error => {
    //     alert('There was an error!');
    //     console.error('There was an error!', error);
    // });



  }


  addNewFieldOption = (event, id) => {


    this.setState({
      fetching: true,

    })

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
        "title": 'Title',
        "option_value": 'Option Value',
        "image": '',
        "is_default_template": is_default_template

      })
    }


    fetch(ENDPOINTS.SERVER + '/step/field/option/' + id, config)
      ///.then(status => status.json().then(data => ({ data, status })))
      .then((result) => {
        if (result.status == 200) {
          this.stepDataGet();

          alert({
            text: 'Add Option Successfully',
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


      });

  }

  deleteFiled = (fieldId, stepId) => {
    this.setState({
      fetching: true,

    })
    const config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    fetch(ENDPOINTS.SERVER + '/onboarding/residents/field/' + fieldId, config)
      //.then(res => res.json())
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
          //
          //setError(error);
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

  deleteFieldOption = (id) => {
    this.setState({
      fetching: true,

    })
    const config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };


    fetch(ENDPOINTS.SERVER + '/step/field/option/' + id, config)
      //.then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result.status === 200) {

            this.stepDataGet();
            alert({
              text: 'Delete Successfully',
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
          //
          //setError(error);
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
    //
    //

  }

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

              {(() => {

                if (this.state.backUpTitle === '') {
                  return <>
                    <button type="button" className="button w-20 bg-theme-1 text-white" onClick={() => { this.dataBackup(); onClose(); }}>{this.props.t('translations:navigation.yes')}</button>
                  </>

                } else {
                  return <>
                    <button type="button" className="button w-20 bg-theme-1 text-white" onClick={() => {
                      this.dataBackup();//onClose();
                    }}>Yes</button>
                  </>

                }
              })()}

              <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-1" onClick={onClose}>{this.props.t('translations:navigation.no')}</button>


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
          "oss_admin_id": this.props.userdata.email,
          "menu_type": this.state.menu_type_name,
          "lang": this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,
          "title": this.state.backUpTitle,
        })
      }


      fetch(ENDPOINTS.SERVER + '/backup/step/question/field/options', config)
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

  handleNextStep() {

    $('.nav-tabs > .nav-item > .active').parent().next('li').find('a').trigger('click');
  }

  handlePrevStep() {

    $('.nav-tabs > .nav-item > .active').parent().prev('li').find('a').trigger('click');

  }


  render() {

    const { userdata, t } = this.props;
    const menu_path = window.location.pathname.split('/')[3];
    let { bookDetails, tabStep, tabStepResult, tags, suggestions, newTag, tags2, menu_type_name, pageTitle, fetching, open, anchorEl } = this.state;

    return (
      <React.Fragment>

        <Helmet>
          <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style>
        </Helmet>
        <MobileNavContainer />
        <div className="flex">
          <NavContainer />
          <div className="content oss-admin">
            <TopBar userdata={userdata} pageTitle='translations:ossMenu.Onboarding' subTitle={'translations:ossMenu.' + menu_type_name} />

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
                            <h2 className="welcomeTitle mt-2"> {t('translations:ossOnboardingTitle.title1')}  </h2>
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
                                <PlusIcon />
                              </span>
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
                                questionUpdate={this.questionUpdate}
                                stepTitleUpdate={this.stepTitleUpdate}
                                addNewField={this.addNewField}
                                fieldDelete={this.fieldDelete}
                                fieldUpdate={this.fieldUpdate}
                                addNewFieldOption={this.addNewFieldOption}
                                deleteFiled={this.deleteFiled}
                                fieldOptionUpdate={this.fieldOptionUpdate}
                                fieldOptionImageUpdate={this.fieldOptionImageUpdate}
                                deleteFieldOption={this.deleteFieldOption}
                                questionAdd={this.questionAdd}
                                questionDelete={this.questionDelete}
                                t={this.props.t}

                              />

                              {/* }  */}
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-9 " style={{ background: 'white' }} >
                        <div className="row row-eq-height align-middle my-auto">
                          <div className="col-md-12" style={{ paddingLeft: "15px" }}>
                            <h2 className="basicinfo-title"><span style={{ fontSize: '9.92639px', color: '#FE9B00' }}>Q:
                              <span id="currentCounter">1 </span>/5 </span> &nbsp;&nbsp;<span > {t('translations:ossMenu.' + menu_type_name)} </span>
                            </h2>
                            <br />
                            <br />
                            
                            <div className="row">  
                                  <div className="col-md-6">
                                      <h2 className="modelH2">
                                        {t('translations:ossOnboardingTitle.selectLanguage')}
                                      </h2>
                                  </div>                                          
                                  {(() => {
                                    const menu_path1 = window.location.pathname.split('/')[2];
                                    if (menu_path1 !== "admin") {
                                      return <div className="col-md-6">
                                        <a onClick={() => this.stepDefaultTemplateConfirm()} className="button px-2 mr-1 mb-2 bg-theme-1 text-white" title="Set Default" style={{ float: 'right' }}>
                                          <SettingsBackupRestoreIcon />
                                        </a>
                                        <a onClick={() => this.dataBackupConfirm()} className="button px-2 mr-1 mb-2 bg-theme-1 text-white" title="Backup" style={{ float: 'right' }} >
                                          <BackupIcon />
                                        </a>
                                        {(() => {
                                          if (menu_path === 'residents') {
                                            return <Link to={'/preview/onboarding/' + this.props.userdata.ID} className="button px-2 mr-1 mb-2 bg-theme-1 text-white" title="Preview" style={{ float: 'right' }}> <VisibilityIcon /></Link>
                                          } else if (menu_path === 'housing') {
                                            return <Link to={'/preview/onboarding/' + this.props.userdata.ID} className="button px-2 mr-1 mb-2 bg-theme-1 text-white" title="Preview" style={{ float: 'right' }}> <VisibilityIcon /></Link>
                                          } else {
                                            return <Link to={'/preview/operator/' + this.props.userdata.ID} className="button px-2 mr-1 mb-2 bg-theme-1 text-white" title="Preview" style={{ float: 'right' }}> <VisibilityIcon /></Link>
                                          }
                                        })()}

                                      </div>
                                    } else {

                                      return <div className="col-md-6">



                                        {(() => {

                                          if (menu_path === 'residents') {

                                            return <Link to={'/onboarding/admin/preview/' + this.props.userdata.ID} className="button px-2 mr-1 mb-2 bg-theme-1 text-white" title="Preview" style={{ float: 'right' }}> <VisibilityIcon /></Link>

                                          } else if (menu_path === 'housing') {
                                            return <Link to={'/onboarding/admin/preview/' + this.props.userdata.ID} className="button px-2 mr-1 mb-2 bg-theme-1 text-white" title="Preview" style={{ float: 'right' }}> <VisibilityIcon /></Link>


                                          } else {
                                            return <Link to={'/onboarding/admin/operator/preview/' + this.props.userdata.ID} className="button px-2 mr-1 mb-2 bg-theme-1 text-white" title="Preview" style={{ float: 'right' }}> <VisibilityIcon /></Link>


                                          }

                                        })()}

                                      </div>
                                    }
                                  })()}
                                </div>                           
                            <br />
                            <div className="row">
                              <div className="col-md-12">
                                <div className="row">
                                  <div className="col-md-1" id="ossstep5chk">
                                    <center>
                                      <input type="radio" id="language8" name="languageresidents" defaultChecked={this.state.langSelected === "en" || this.state.langSelected === "en-US"} value="en" onClick={e => this.lngChange(e)} />
                                      <label htmlFor="language8" title="English" style={{ cursor: 'pointer' }}> <center><img src={gbFlag} alt="UK" style={{ height: '20px', width: '30px', marginTop: '9px' }} /> </center></label>
                                    </center>
                                  </div>
                                  <div className="col-md-1" id="ossstep5chk">
                                    <center>
                                      <input type="radio" id="language9" name="languageresidents" defaultChecked={this.state.langSelected === "lv"} value="lv" onChange={e => this.lngChange(e)} />
                                      <label htmlFor="language9" title="Latvia" style={{ cursor: 'pointer' }}> <center><img src={latviaFlag} alt="Latvia" style={{ height: '20px', width: '30px', marginTop: '9px' }} /> </center></label>
                                    </center>
                                  </div>

                                  <div className="col-md-1" id="ossstep5chk">
                                    <center>
                                      <input type="radio" id="language23" name="languageresidents" defaultChecked={this.state.langSelected === "pt"} value="pt" onChange={e => this.lngChange(e)} />
                                      <label htmlFor="language23" title="Portugal" style={{ cursor: 'pointer' }}> <center><img src={PortugalFlag} alt="Portugal" style={{ height: '20px', width: '30px', marginTop: '9px' }} /> </center></label>
                                    </center>
                                  </div>

                                  <div className="col-md-1" id="ossstep5chk">
                                    <center>
                                      <input type="radio" id="language24" name="languageresidents" defaultChecked={this.state.langSelected === "it"} value="it" onChange={e => this.lngChange(e)} />
                                      <label htmlFor="language24" title="Italian" style={{ cursor: 'pointer' }}> <center> <img src={ItalyFlag} alt="Italian" style={{ height: '20px', width: '30px', marginTop: '9px' }} /> </center></label>
                                    </center>
                                  </div>
                                  <div className="col-md-1" id="ossstep5chk">
                                    <center>
                                      <input type="radio" id="language25" name="languageresidents" defaultChecked={this.state.langSelected === "de"} value="de" onChange={e => this.lngChange(e)} />
                                      <label htmlFor="language25" title="German" style={{ cursor: 'pointer' }}> <center> <img src={GermanFlag} alt="German" style={{ height: '30px', width: '30px', marginTop: '4px' }} /> </center></label>
                                    </center>
                                  </div>
                                  <div className="col-md-1" id="ossstep5chk">
                                    <center>
                                      <input type="radio" id="language255" name="languageresidents" defaultChecked={this.state.langSelected === "fr"} value="fr" onChange={e => this.lngChange(e)} />
                                      <label htmlFor="language255" title="French" style={{ cursor: 'pointer' }}> <center> <img src={FrenchFlag} alt="French" style={{ height: '30px', width: '30px', marginTop: '4px' }} /> </center></label>
                                    </center>
                                  </div>
                                  
                                  <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language11" name="languageresidents" defaultChecked={this.state.langSelected === "at"} value="at"onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language11" title="Austrian" style={{ cursor: 'pointer' }}> <center><img src={austrianFlag} alt="Austrian" style={{ height: '30px', width: '30px',marginTop: '4px'  }} /> </center></label>
                                        </center>
                                      </div>                                                                     
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language10" name="languageresidents" defaultChecked={this.state.langSelected === "sk"} value="sk" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language10" title="Slovak" style={{ cursor: 'pointer' }}> <center><img src={slovakFlag} alt="Slovak" style={{ height: '22px', width: '30px',marginTop: '8px'  }} /> </center></label>
                                        </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language12" name="languageresidents" defaultChecked={this.state.langSelected === "ro"} value="ro" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language12" title="Romanian" style={{ cursor: 'pointer' }}><center><img src={romanianFlag} alt="Romanian" style={{ height: '22px', width: '30px',marginTop: '8px'  }} /> </center></label>
                                        </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language13" name="languageresidents" defaultChecked={this.state.langSelected === "pl"} value="pl" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language13" title="Polish" style={{ cursor: 'pointer' }}><center><img src={polishFlag} alt="Polish" style={{ height: '30px', width: '30px',marginTop: '4px'  }} /> </center></label>
                                        </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">                                    
                                      <center>
                                      <input type="radio" id="language7" name="languageresidents"  defaultChecked={this.state.langSelected === "bg"}  value="bg" onClick={e =>this.lngChange(e)}/>
                                      <label htmlFor="language7" title="Bulgarian" style={{ cursor: 'pointer' }}> <center><img src={bulgarianFlag} alt="Bulgarian" style={{ height: '30px', width: '30px',marginTop: '4px'  }} /> </center></label>                                     
                                      </center>
                                      </div>
                                   </div>  
                             



                              </div>



                            </div>

                            <hr />
                            {/* <br></br>
                                          <div className="row">                            
                                            <div className="col-md-12">
                                                <h4 style={{ marginBottom: '10px' }}>Short Description</h4>
                                                <textarea id="w3review" name="shortDescription" rows="4" cols="100" style={{border:"0.89246px solid rgb(191, 212, 228)",width: "100%" }} onBlur={(e) => this.shortDescriptionUpdate(e)}>
                                                </textarea>
                                              </div> 
                                          </div> 
                                         <br></br> */}
                          </div>
                          <div className="col-md-12">
                            <section className="signup-step-container" style={{ marginTop: '10px', marginBottom: '10px' }} >
                              <div className="container">
                                <div className="row d-flex ">
                                  <div className="col-md-12">
                                    <div className="wizard">
                                      <div className="tab-content" id="tab-details">

                                        {/* {this.state.fetching ?
                                                      <ProgressBar />
                                                      :  */}
                                        <AppendFields
                                          add={this.addNewRow}
                                          addNewRow={this.addNewRow}
                                          handleTouchTap={this.handleTouchTap}
                                          handleRequestClose={this.handleRequestClose}
                                          open={open}
                                          anchorEl={anchorEl}
                                          delete={this.clickOnDelete}
                                          tabStep={tabStep}
                                          nextButtonClick={this.handleNextStep}
                                          bookDetails={bookDetails}
                                          prevButtonClick={this.handlePrevStep}
                                          deleteStep={this.deleteStep}
                                          questionUpdate={this.questionUpdate}
                                          stepTitleUpdate={this.stepTitleUpdate}
                                          addNewField={this.addNewField}
                                          fieldDelete={this.fieldDelete}
                                          fieldUpdate={this.fieldUpdate}
                                          addNewFieldOption={this.addNewFieldOption}
                                          deleteFiled={this.deleteFiled}
                                          fieldOptionUpdate={this.fieldOptionUpdate}
                                          fieldOptionImageUpdate={this.fieldOptionImageUpdate}
                                          deleteFieldOption={this.deleteFieldOption}
                                          questionAdd={this.questionAdd}
                                          questionDelete={this.questionDelete}
                                          t={this.props.t}
                                        />

                                        {/* }                                                                                                               */}
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
        <div className="modal" id="restoreModel">
          <div className="modal__content">
            <div className="flex items-center px-3 py-3 sm:py-3 border-b border-gray-200 dark:border-dark-5">
              <h2 className="font-medium text-base mr-auto">
                Backup List
              </h2>

            </div>
            <div className="col-span-12 mt-6">

              <div className="intro-y overflow-auto  px-5 py-2 lg:overflow-visible mt-8 sm:mt-0" style={{ height: '450px', overflowX: 'auto' }}>
                <table className="table table-report sm:mt-2">
                  <thead>
                    <tr style={{ border: 'none' }}>
                      <th className="whitespace-no-wrap" style={{ border: 'none' }}>Date Time</th>
                      <th className="whitespace-no-wrap" style={{ border: 'none' }}>Total Question</th>
                      <th className="whitespace-no-wrap" style={{ border: 'none' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.backUpDataList.map((userInfo, userInfoKey, arr) => {
                      return (<>


                        <tr className="intro-x">

                          <td style={{ border: 'none' }}>  {userInfo.backup_time} </td>
                          <td style={{ border: 'none' }}>  {userInfo.questions} </td>
                          <td style={{ border: 'none' }}><button type="button" onClick={() => this.backUpRestoreConfirm(userInfo.backup_time)} className="button w-20 bg-theme-1 text-white">Restore</button>  </td>
                        </tr>

                      </>

                      );
                    })
                    }

                  </tbody>
                </table>

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
