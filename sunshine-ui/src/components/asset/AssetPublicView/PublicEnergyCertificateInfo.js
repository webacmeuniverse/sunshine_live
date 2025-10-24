import React from 'react';
import { connect } from 'react-redux';
import { useParams, withRouter, Link } from 'react-router-dom';
import ENDPOINTS from '../../../constants/endpoints';
import { confirmAlert } from 'react-confirm-alert';
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import moment from 'moment';
import {
  Grid,
  IconButton,
  Paper,
  makeStyles,
  Typography,
  Avatar,
  Divider,
  Button,
  Fab,
  withStyles,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';

import {
  Home as HomeIcon,
  BusinessCenter as OrganizationIcon,
  Business as AssetIcon,
  Equalizer as ProjectIcon,
  Security as AdminIcon,
  TableChart as TableChartIcon,

  Delete as DeleteIcon,
  CloudDownload as DownloadIcon,
  Add as PlusIcon,
  ArrowBack as ArrowBackIcon,
  Dashboard as DashboardIcon,
  InfoOutlined as InfoIcon,
  CloudUpload,

  DeleteForever,
  CloseOutlined,
} from '@material-ui/icons';
import { assetTypeTitleKey } from './../../../constants/assetTypes';
import { parseAddress } from '../../../../src/components/asset/utils';
import UserTooltip from '../../utils/UserTooltip';
import Tooltip from '../../utils/TooltipWrapper';
import { canViewAssetPrivateInfo } from '../../../utils/can';
import styles from './styles';
import toggleLanguage from '../../../actions/language';
import toggleCountry from '../../../actions/country';
import { withTranslation, useTranslation } from 'react-i18next';
import UploadFileEnergyCertificate from '../../../containers/smartcomponents/UploadFile/UploadFileEnergyCertificate';
import {
  approveEntity as canApproveAset,
  canEditEntity as canEditAsset,
  canUploadFiles,
  canDeleteFiles,
} from '../../../utils/can';
import ProgressBar from '../../../../src/components/utils/ProgressBar';
const useStyles = makeStyles(styles);



class PublicEnergyCertificateInfo extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      assetData: [],
      assetEnergyCertData: [],
      energyCrtCategoryList: [],
      energyReductionList: [],
      energyCertificateDocuments: [],
      fetching: false,
      fetching1: false,
      totalEnergyConsumption: 0,
    }
    this.getEnergyReduction = this.getEnergyReduction.bind(this);
  }

  componentDidMount() {

    this.getAsset();
    this.energyCertDetailsSave();




  }

  componentDidUpdate() {
    //this.getOssStep();
    // setTimeout(() => {
    //this.getAsset();
    //this.energyCertDetailsSave();
    //     this.getOssStep();
    //   }, 7000)

  }

  getEnergyCertDetailsFile = () => {

    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };


    fetch(`${ENDPOINTS.SERVER}/energy/cert/file/${this.state.assetEnergyCertData ? this.state.assetEnergyCertData.ID : ''}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {

            this.state.energyCertificateDocuments = result.data;



            this.forceUpdate()
          }
        },

      ).catch(error => {
        //setTabStep([]);                
      });
  }
  appendOneConfirm(dataId) {


    confirmAlert({
      title: "",
      message: this.props.t('translations:assetEnergyCertificate.deleteTitle'),
      buttons: [
        {
          label: this.props.t('translations:navigation.yes'),
          onClick: () => this.appendOneRemove(dataId)
        },
        {
          label: this.props.t('translations:navigation.no'),
          //onClick: () => alert('Click No')
        }
      ]
    });

  }


  appendTwoConfirm(dataId) {


    confirmAlert({
      title: "",
      message: this.props.t('translations:assetEnergyCertificate.deleteTitle'),
      buttons: [
        {
          label: this.props.t('translations:navigation.yes'),
          onClick: () => this.appendTwoRemove(dataId)
        },
        {
          label: this.props.t('translations:navigation.no'),
          //onClick: () => alert('Click No')
        }
      ]
    });

  }

  fileDelete(dataId) {


    confirmAlert({
      title: "",
      message: this.props.t('translations:assetEnergyCertificate.deleteTitle'),
      buttons: [
        {
          label: this.props.t('translations:navigation.yes'),
          onClick: () => this.fileRemove(dataId)
        },
        {
          label: this.props.t('translations:navigation.no'),
          //onClick: () => alert('Click No')
        }
      ]
    });

  }
  fileRemove = (dataId) => {

    let assetID = window.location.pathname.split('/')[3];
    const config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    };


    fetch(`${ENDPOINTS.SERVER}/energy/cert/file/${dataId}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          //console.log(result.data.energy_class);
          if (result != null) {

            this.state.energyCertificateDocuments = '';
            this.forceUpdate()

            alert({
              text: 'Deleted Successfully',
              type: 'success',
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
      });
  };



  appendTwoRemove = (dataId) => {
    this.setState({
      fetching: true,

    })
    let assetID = window.location.pathname.split('/')[3];
    const config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    };


    fetch(`${ENDPOINTS.SERVER}/energy/cert/reduction?id=${dataId}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
        

          this.getEnergyReduction();
          alert({
            text: 'Deleted Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
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
      });
  };


  energyCertDetailsSave = () => {
    let assetID = window.location.pathname.split('/')[3];
    const config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "asset_id": assetID,
        "user_id": this.props.user.isAuthenticated,
        "energy_class": '',
        "consumption": 0,

      })
    };


    fetch(`${ENDPOINTS.SERVER}/energy/cert/details`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {

            this.setState({
              assetEnergyCertData: result.data,
            })


            this.forceUpdate();

            this.energyCertDetailsGet();

          }
        },

      ).catch(error => {
        //setTabStep([]);                
      });
  }

  energyCertDetailsGet = () => {

    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    };
    let assetID = window.location.pathname.split('/')[3];

    fetch(`${ENDPOINTS.SERVER}/energy/cert/details?id=${assetID}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          //console.log(result.data.energy_class);
          if (result != null) {
            this.state.assetEnergyCertData = result.data;
            // this.state.fetching = false;

            this.forceUpdate();

            this.getEnergyCertDetailsFile();
            this.getEnergyCategory();
            this.getEnergyReduction();

          }
        },

      ).catch(error => {
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
      });
  }

  getAsset = () => {

    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    let assetID = window.location.pathname.split('/')[3];

    fetch(`${ENDPOINTS.SERVER}/asset/${assetID}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {
            this.setState({
              assetData: result,
            })



            this.forceUpdate()
          }
        },

      ).catch(error => {
        //setTabStep([]);                
      });
  }
  totalEnergyConsumptionUpdate = () => {


    let assetID = window.location.pathname.split('/')[3];




    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "asset_id": assetID,
        "user_id": this.props.user.isAuthenticated,
        "energy_class": this.state.assetEnergyCertData ? this.state.assetEnergyCertData.energy_class : 0,
        "consumption": Number(this.state.totalEnergyConsumption),

      })
    };


    fetch(`${ENDPOINTS.SERVER}/energy/cert/details?id=${this.state.assetEnergyCertData.ID}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {



          }
        },

      ).catch(error => {

      });

  }
  energyClassUpdate = e => {

    let nameType = e.target.name;
    let value = e.target.value;

    let assetID = window.location.pathname.split('/')[3];
    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "asset_id": assetID,
        "user_id": this.props.user.isAuthenticated,
        "energy_class": value,
        "consumption": Number(this.state.assetEnergyCertData ? this.state.assetEnergyCertData.consumption : 0),

      })
    };

    fetch(`${ENDPOINTS.SERVER}/energy/cert/details?id=${this.state.assetEnergyCertData.ID}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {

            this.setState({
              assetEnergyCertData: result.data,
            })


            this.forceUpdate();
            alert({
              text: 'Update Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });
            this.energyCertDetailsGet();
          }
        },

      ).catch(error => {
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
      });

  }

  energyTotalConsumptionUpdate = e => {

    let nameType = e.target.name;
    let value = e.target.value;

    let assetID = window.location.pathname.split('/')[3];
    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "asset_id": assetID,
        "user_id": this.props.user.isAuthenticated,
        "energy_class": this.state.assetEnergyCertData ? this.state.assetEnergyCertData.energy_class : '',
        "consumption": Number(value),

      })
    };


    fetch(`${ENDPOINTS.SERVER}//energy/cert/details?id=${this.state.assetEnergyCertData.ID}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {

            this.setState({
              assetEnergyCertData: result.data,
            })

            this.forceUpdate();
            alert({
              text: 'Update Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });
            this.energyCertDetailsGet();
          }
        },

      ).catch(error => {
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
      });

  }
  getEnergyCategory = () => {

    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    let assetID = window.location.pathname.split('/')[3];

    fetch(`${ENDPOINTS.SERVER}/energy/cert/category?id=${assetID}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {

            this.state.energyCrtCategoryList = result;

            this.state.totalEnergyConsumption = (result.reduce((a, v) => a = a + v.consumption, 0)).toFixed(2);
            this.forceUpdate();


            this.totalEnergyConsumptionUpdate();

          } else {

            this.state.energyCrtCategoryList = [];

            this.state.totalEnergyConsumption = 0.0;
            this.forceUpdate();


            this.totalEnergyConsumptionUpdate();
          }
        },

      ).catch(error => {
        this.state.energyCrtCategoryList = [];

        this.state.totalEnergyConsumption = 0.0;
        this.forceUpdate();


        this.totalEnergyConsumptionUpdate();
        //setTabStep([]);                
      });
  }
  appendOneRemove = (dataId) => {
    this.setState({
      fetching1: true,

    })
    let assetID = window.location.pathname.split('/')[3];
    const config = {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    };


    fetch(`${ENDPOINTS.SERVER}/energy/cert/category?id=${dataId}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          //console.log(result.data.energy_class);
          if (result != null) {

            this.energyCertDetailsGet();
            this.setState({
              fetching1: false,

            })
            this.forceUpdate()
            alert({
              text: 'Deleted Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });

          }
        },

      ).catch(error => {
        this.setState({
          fetching1: false,

        })
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
      });
  };
  energyCategoryAdd = () => {
    this.setState({
      fetching1: true,

    })
    let assetID = window.location.pathname.split('/')[3];
    const config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "asset_id": assetID,
        "user_id": this.props.user.isAuthenticated,
        "details_id": this.state.assetEnergyCertData ? this.state.assetEnergyCertData.ID : '',
        "category": '',
        "consumption": 0,

      })
    };


    fetch(`${ENDPOINTS.SERVER}/energy/cert/category`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          //console.log(result.data.energy_class);
          if (result != null) {

            this.energyCertDetailsGet();
            this.setState({
              fetching1: false,

            })
            this.forceUpdate();
            alert({
              text: 'Add Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });

          }
        },

      ).catch(error => {
        this.setState({
          fetching1: false,

        })
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
      });
  }



  getEnergyReduction = () => {

    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
    };
    let assetID = window.location.pathname.split('/')[3];

    fetch(`${ENDPOINTS.SERVER}/energy/cert/reduction?id=${assetID}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
        
          if (result != null) {
          
            this.state.energyReductionList = result;

            this.setState({
              fetching: false,

            })
            this.forceUpdate();

          } else {
        
            this.state.energyReductionList = [];

            this.setState({
              fetching: false,

            })
            this.forceUpdate();

          }
        },

      ).catch(error => {
      
        this.state.energyReductionList = [];

        this.setState({
          fetching: false,

        })
        this.forceUpdate();
        //setTabStep([]);                
      });
  }
  energyReductionAdd = () => {
    this.setState({
      fetching: true,

    })
    let assetID = window.location.pathname.split('/')[3];
    const config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "asset_id": assetID,
        "user_id": this.props.user.isAuthenticated,
        "details_id": this.state.assetEnergyCertData ? this.state.assetEnergyCertData.ID : '',
        "renovation_measure": '',
        "reduction": 0,
        "cost_eur_m2": 0,

      })
    };


    fetch(`${ENDPOINTS.SERVER}/energy/cert/reduction`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {
          //console.log(result.data.energy_class);
          if (result != null) {


            this.getEnergyReduction();
            alert({
              text: 'Add Successfully',
              type: 'success',
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
      });
  }

  energyReductionUpdate = (e, data_renovation_measure, data_reduction, data_cost_eur_m2, data_id) => {

    let nameType = e.target.name;
    let value = e.target.value;

    let renovation_measure = value;
    let reduction = data_reduction;
    let cost_eur_m2 = data_cost_eur_m2;


    let assetID = window.location.pathname.split('/')[3];
    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "asset_id": assetID,
        "user_id": this.props.user.isAuthenticated,
        "details_id": this.state.assetEnergyCertData ? this.state.assetEnergyCertData.ID : '',
        "renovation_measure": renovation_measure,
        "reduction": Number(reduction),
        "cost_eur_m2": Number(cost_eur_m2),

      })
    };


    fetch(`${ENDPOINTS.SERVER}/energy/cert/reduction?id=${data_id}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {


            alert({
              text: 'Update Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });
            this.getEnergyReduction();
          }
        },

      ).catch(error => {
        this.setState({
          fetching: false,

        })
        this.forceUpdate();
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
      });

  }

  energyReductionUpdate1 = (e, data_renovation_measure, data_reduction, data_cost_eur_m2, data_id) => {

    let nameType = e.target.name;
    let value = e.target.value;

    let renovation_measure = data_renovation_measure;
    let reduction = value;
    let cost_eur_m2 = data_cost_eur_m2;



    let assetID = window.location.pathname.split('/')[3];
    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "asset_id": assetID,
        "user_id": this.props.user.isAuthenticated,
        "details_id": this.state.assetEnergyCertData ? this.state.assetEnergyCertData.ID : '',
        "renovation_measure": renovation_measure,
        "reduction": Number(reduction),
        "cost_eur_m2": Number(cost_eur_m2),

      })
    };


    fetch(`${ENDPOINTS.SERVER}/energy/cert/reduction?id=${data_id}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {


            alert({
              text: 'Update Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });
            this.getEnergyReduction();
          }
        },

      ).catch(error => {
        this.setState({
          fetching: false,

        })
        this.forceUpdate();
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
      });

  }
  energyReductionUpdate2 = (e, data_renovation_measure, data_reduction, data_cost_eur_m2, data_id) => {

    let nameType = e.target.name;
    let value = e.target.value;

    let renovation_measure = data_renovation_measure;
    let reduction = data_reduction;
    let cost_eur_m2 = value;



    let assetID = window.location.pathname.split('/')[3];
    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "asset_id": assetID,
        "user_id": this.props.user.isAuthenticated,
        "details_id": this.state.assetEnergyCertData ? this.state.assetEnergyCertData.ID : '',
        "renovation_measure": renovation_measure,
        "reduction": Number(reduction),
        "cost_eur_m2": Number(cost_eur_m2),

      })
    };


    fetch(`${ENDPOINTS.SERVER}/energy/cert/reduction?id=${data_id}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {


            alert({
              text: 'Update Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });
            this.getEnergyReduction();
          }
        },

      ).catch(error => {
        this.setState({
          fetching: false,

        })
        this.forceUpdate();
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
      });

  }
  energyCertCategoryUpdate = (e, data_category, data_consumption, data_id) => {


    let nameType = e.target.name;
    let value = e.target.value;

    let category = '';
    let consumption = '';
    if (nameType === 'category') {

      category = value;
      consumption = data_consumption;
    } else {
      consumption = value;
      category = data_category;
    }



    let assetID = window.location.pathname.split('/')[3];
    const config = {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        "asset_id": assetID,
        "user_id": this.props.user.isAuthenticated,
        "details_id": this.state.assetEnergyCertData ? this.state.assetEnergyCertData.ID : '',
        "category": category,
        "consumption": Number(consumption),

      })
    };


    fetch(`${ENDPOINTS.SERVER}/energy/cert/category?id=${data_id}`, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result != null) {



            this.forceUpdate();
            alert({
              text: 'Update Successfully',
              type: 'success',
              delay: 800,
              closer: true
            });
            this.energyCertDetailsGet();
            this.getEnergyCategory();
          }
        },

      ).catch(error => {
        alert({
          text: 'There was an error!',
          type: 'error',
          delay: 800,
          closer: true
        });
      });

  }
  render() {

    let { t } = this.props;

    const assetTitle = parseAddress(this.state.assetData.address || '');
    return (
      <React.Fragment>
        <h2 style={{ fontSize: '25px', fontWeight: '900' }} className="mb-5">{assetTitle}</h2>
        <main role="main" className="h-auto">
          <div className="row">
            <div className="col-md-5" >
              <h2 className="mb-4" style={{ fontSize: '15px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)' }}>{t('translations:assetEnergyCertificate.Energyclass')}&nbsp;&nbsp;
                <input type="text" Value={this.state.assetEnergyCertData ? this.state.assetEnergyCertData.energy_class : ''} onKeyUp={(e) => this.energyClassUpdate(e)} maxLength="1" style={{ border: '1px solid rgba(0, 0, 0, 0.12)', paddingInline: '10px', height: '35px', width: '20%', borderRadius: '5px' }}></input>
              </h2>

              <h2 className="mb-4" style={{ fontSize: '15px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)' }}>{t('translations:assetEnergyCertificate.Totalenergyconsumption')} &nbsp;&nbsp;
                <input type="text" Value={this.state.totalEnergyConsumption} style={{ border: '1px solid rgba(0, 0, 0, 0.12)', backgroundColor: '#f7f7f7', height: '35px', width: '20%', paddingInline: '10px', borderRadius: '5px' }} disabled></input>
                &nbsp;&nbsp; {t('translations:assetEnergyCertificate.kWhm2')}<sup>2</sup>

              </h2>

              <div className="box px-2 pt-2 mt-2" style={{ border: '1px solid #d3cfcf', borderRadius: '7px', }}>
                <div className="row">
                  <div className="col-md-12" style={{ padding: '20px' }}>
                    <div className="row">
                      <div className="col-md-6" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                        <center> <h2 className="mb-2 mt-2" style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)', textAlign: 'center' }}>{t('translations:assetEnergyCertificate.Energyusecategory')} </h2></center>
                      </div>
                      <div className="col-md-5" style={{ paddingRight: '0px', paddingLeft: '5px' }}>
                        <center><h2 className="mb-2 mt-2" style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)', textAlign: 'center' }}>{t('translations:assetEnergyCertificate.Energyconsumption')}<sup>2</sup> </h2></center>
                      </div>

                      <div className="col-md-1" >
                        <h2 className="mb-2 mt-2" style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)', textAlign: 'center' }}></h2>
                      </div>
                    </div>





                    <div className="col-md-12" >
                      {this.state.fetching1 ?
                        <ProgressBar />
                        :
                        <div className="row">
                          {this.state.energyCrtCategoryList.map((data, index) => (

                            <>
                              <div className="col-md-6 mt-2" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                                <input type="text" name="category" Value={data.category} onKeyUp={(e) => this.energyCertCategoryUpdate(e, data.category, data.consumption, data.ID)} style={{ border: '1px solid rgba(0, 0, 0, 0.12)', paddingInline: '10px', height: '40px', width: '100%', borderRadius: '5px' }}></input>
                              </div>
                              <div className="col-md-5 mt-2" style={{ paddingRight: '0px', paddingLeft: '5px' }}>

                                <input type="number" name="consumption" Value={data.consumption} onKeyUp={(e) => this.energyCertCategoryUpdate(e, data.category, data.consumption, data.ID)} pattern="^\d+(?:\.\d{1,2})?$" style={{ border: '1px solid rgba(0, 0, 0, 0.12)', paddingInline: '10px', height: '40px', width: '100%', borderRadius: '5px' }}></input>
                              </div>
                              <div className="col-md-1 mt-2" style={{ paddingRight: '0px', paddingLeft: '5px' }}>

                                <Tooltip
                                  placement="top"
                                  title={t('documents.delete')}
                                  component="a"
                                >
                                  <IconButton

                                    size="small"
                                    onClick={() => this.appendOneConfirm(data.ID)}
                                  >
                                    <DeleteIcon style={{ width: '25px', height: '25px' }} />
                                  </IconButton>
                                </Tooltip>



                              </div>


                            </>
                          ))}
                        </div>
                      }
                    </div>
                    <div className="row" style={{paddingTop: '15px'}}>
                      <div className="col-md-12" >
                        <center> <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={() => this.energyCategoryAdd()} style={{ backgroundColor: '#fdcf00' }}>
                          <span className="w-20 h-10 flex items-center justify-center" id="add_question" style={{ width: '50px', height: '30px' }}>
                            <PlusIcon /> </span>
                        </button></center>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-7" >
              <div className="box px-2 pt-2 mt-2" style={{ border: '1px solid #d3cfcf', borderRadius: '7px', }}>
                <div className="row">
                  <div className="col-md-12" style={{ padding: '20px' }}>
                    <div className="row ">
                      <div className="col-md-4" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                        <center><h2 className="mb-2 mt-2" style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)', textAlign: 'center' }}>{t('translations:assetEnergyCertificate.Renovationmeasure')} </h2></center>
                      </div>
                      <div className="col-md-4" style={{ paddingRight: '0px', paddingLeft: '5px' }}>
                        <center><h2 className="mb-2 mt-2" style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)', textAlign: 'center' }}>{t('translations:assetEnergyCertificate.Energyusereduction')} </h2></center>
                      </div>
                      <div className="col-md-3" style={{ paddingRight: '0px', paddingLeft: '5px' }}>
                        <center><h2 className="mb-2 mt-2" style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)', textAlign: 'center' }}>{t('translations:assetEnergyCertificate.Cost')}<sup>2</sup> </h2></center>
                      </div>
                      <div className="col-md-1" >
                        <h2 className="mb-2 mt-2" style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)', textAlign: 'center' }}></h2>
                      </div>
                    </div>
                    <div className="col-md-12" >
                      {this.state.fetching ?
                        <ProgressBar />
                        :
                        <div className="row ">


                          {this.state.energyReductionList.map((data, index) => (

                            <>
                              <div className="col-md-4  mt-2" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                                <input type="text" name="renovation_measure" Value={data.renovation_measure} onBlur={(e) => this.energyReductionUpdate(e, data.renovation_measure, data.reduction, data.cost_eur_m2, data.ID)} style={{ border: '1px solid rgba(0, 0, 0, 0.12)', paddingInline: '10px', height: '40px', width: '100%', borderRadius: '5px' }}></input>
                              </div>
                              <div className="col-md-4   mt-2" style={{ paddingRight: '0px', paddingLeft: '5px' }}>
                                <input type="number" name="reduction" Value={data.reduction} onBlur={(e) => this.energyReductionUpdate1(e, data.renovation_measure, data.reduction, data.cost_eur_m2, data.ID)} pattern="^\d+(?:\.\d{1,2})?$" style={{ border: '1px solid rgba(0, 0, 0, 0.12)', paddingInline: '10px', height: '40px', width: '100%', borderRadius: '5px' }}></input>
                              </div>
                              <div className="col-md-3   mt-2" style={{ paddingRight: '0px', paddingLeft: '5px' }}>
                                <input type="number" name="cost_eur_m2" Value={data.cost_eur_m2} onBlur={(e) => this.energyReductionUpdate2(e, data.renovation_measure, data.reduction, data.cost_eur_m2, data.ID)} pattern="^\d+(?:\.\d{1,2})?$" style={{ border: '1px solid rgba(0, 0, 0, 0.12)', paddingInline: '10px', height: '40px', width: '100%', borderRadius: '5px' }}></input>
                              </div>
                              <div className="col-md-1 mt-2" >
                                <Tooltip
                                  placement="top"
                                  title={t('documents.delete')}
                                  component="a"
                                >
                                  <IconButton

                                    size="small"
                                    onClick={() => this.appendTwoConfirm(data.ID)}
                                  >
                                    <DeleteIcon style={{ width: '25px', height: '25px' }} />
                                  </IconButton>
                                </Tooltip>

                              </div>
                            </>
                          ))}
                        </div>
                      }
                    </div>
                    <div className="row" style={{paddingTop: '15px'}}>
                      <div className="col-md-12" >
                        <center> <button className="button px-2 mr-1 mb-2 bg-theme-1 text-white" onClick={() => this.energyReductionAdd()} style={{ backgroundColor: '#fdcf00' }}>
                          <span className="w-20 h-10 flex items-center justify-center" id="add_question" style={{ width: '50px', height: '30px' }}>
                            <PlusIcon /> </span>
                        </button></center>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <h2 className='pt-5' style={{ fontSize: '20px', fontWeight: '700' }}>{t('translations:assetEnergyCertificate.Uploadenergycertificate')}</h2>
          <div className="row">
            <div className="col-md-5" >

              <UploadFileEnergyCertificate
                entity={{
                  id: this.state.assetEnergyCertData ? this.state.assetEnergyCertData.ID : '',
                  attachments: Object.values(this.state.energyCertificateDocuments || {}),
                  type: 'asset',
                }}
                alertText={t('documents.unsupportedFileType')}
                //canUpload={canUploadFiles(this.props.user, this.state.assetData)}
                //canDelete={canDeleteFiles(this.props.user, this.state.assetData)}
                onSuccess={this.getEnergyCertDetailsFile}
                uploadedFileData={this.state.energyCertificateDocuments}
              />


            </div>
            <div className="col-md-7" >
              <div className="box px-2 pt-2 mt-2" style={{ border: '1px solid #d3cfcf', borderRadius: '7px', height: '100px', minHeight: '100px', maxHeight: '100px' }}>
                <div className="row" style={{ padding: '25px' }}>
                  <div className="col-md-2" style={{ paddingRight: '0px' }}>
                    <center>
                      <Tooltip placement="top" title={t('documents.download')} >
                        <IconButton
                          size="small"
                          component="a"
                          href={ENDPOINTS.SERVER + `/energy/file/${this.state.assetEnergyCertData ? this.state.assetEnergyCertData.ID : ''}/cert`}
                          download
                          target="_blank"
                        >
                          <DownloadIcon style={{ width: '25px', height: '25px' }} />
                        </IconButton>
                      </Tooltip>

                      &nbsp;&nbsp;
                      <Tooltip
                        placement="top"
                        title={t('documents.delete')}
                        component="a"
                      >
                        <IconButton

                          size="small"
                          onClick={() => this.fileDelete(this.state.energyCertificateDocuments ? this.state.energyCertificateDocuments.details_id : '')}
                        >
                          <DeleteIcon style={{ width: '25px', height: '25px' }} />
                        </IconButton>
                      </Tooltip>

                    </center>
                  </div>
                  <div className="col-md-5" style={{ paddingLeft: '0px' }}>
                    <h3 style={{ color: '#14141469', fontSize: '14px' }}>{this.state.energyCertificateDocuments ? this.state.energyCertificateDocuments.file_name : ''}</h3>
                  </div>
                  <div className="col-md-5" >
                    <h3 style={{ color: '#14141469', fontSize: '14px', float: 'right' }}>{t('translations:assetEnergyCertificate.Uploaded')}: {this.state.energyCertificateDocuments ? moment(this.state.energyCertificateDocuments.CreatedAt).format('DD/MM/YYYY HH:mm') : ''}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
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
    user: state.user,
  }),
  dispatch => ({

    getPRUsers: () => dispatch(getPRUsersAction()),
    toggleLanguage: (lang) => {
      dispatch(toggleLanguage(lang));
    },
    toggleCountry: (countryName) => {
      dispatch(toggleCountry(countryName));
    }

  })
)(withTranslation('translations')(PublicEnergyCertificateInfo));


