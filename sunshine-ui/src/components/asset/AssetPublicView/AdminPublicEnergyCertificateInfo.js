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
  Add as PlusIcon,
  ArrowBack as ArrowBackIcon,
  Dashboard as DashboardIcon,
  InfoOutlined as InfoIcon,
  CloudUpload,
  CloudDownload,
  DeleteForever,
  CloseOutlined,
} from '@material-ui/icons';
import { assetTypeTitleKey } from './../../../constants/assetTypes';
import { parseAddress } from '../../../../src/components/asset/utils';
import UserTooltip from '../../utils/UserTooltip';

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



class AdminPublicEnergyCertificateInfo extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      assetData: [],
      assetEnergyCertData: [],
      energyCrtCategoryList: [],
      energyReductionList: [],
      fetching: false,
      totalEnergyConsumption: 0,
      energyCertificateDocuments: [],
    }

  }

  componentDidMount() {

    this.getAsset();

    this.energyCertDetailsGet();



  }

  componentDidUpdate() {
    //this.getOssStep();
    // setTimeout(() => {
    //this.getAsset();

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
            this.state.fetching = false;

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
              assetData: result.data,

            })

            this.setState({
              fetching: false,

            })

            this.forceUpdate()
          }
        },

      ).catch(error => {
        //setTabStep([]);                
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

            this.setState({
              fetching: false,

            })

          }
        },

      ).catch(error => {
        //setTabStep([]);                
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

            this.forceUpdate()
          }
        },

      ).catch(error => {
        //setTabStep([]);                
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
              <h2 className="mb-4" style={{ fontSize: '15px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)' }}>{t('translations:assetEnergyCertificate.Energyclass')} &nbsp;&nbsp;
                <input type="text" Value={this.state.assetEnergyCertData ? this.state.assetEnergyCertData.energy_class : ''} o maxLength="1" style={{ border: '1px solid rgba(0, 0, 0, 0.12)', backgroundColor: '#f7f7f7', paddingInline: '10px', height: '35px', width: '20%', borderRadius: '5px' }} disabled></input>
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
                        <h2 className="mb-2 mt-2" style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)', textAlign: 'center' }}>{t('translations:assetEnergyCertificate.Energyusecategory')} </h2>
                      </div>
                      <div className="col-md-6" style={{ paddingRight: '0px', paddingLeft: '5px' }}>
                        <h2 className="mb-2 mt-2" style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)', textAlign: 'center' }}>{t('translations:assetEnergyCertificate.Energyconsumption')}<sup>2</sup> </h2>
                      </div>


                    </div>





                    <div className="col-md-12" >
                      {this.state.fetching ?
                        <ProgressBar />
                        :
                        <div className="row mb-2">
                          {this.state.energyCrtCategoryList.map((data, index) => (

                            <>
                              <div className="col-md-6 mt-2" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                                <input type="text" name="category" Value={data.category} style={{ border: '1px solid rgba(0, 0, 0, 0.12)', paddingInline: '10px', height: '40px', width: '100%', borderRadius: '5px' }} disabled></input>
                              </div>
                              <div className="col-md-6 mt-2" style={{ paddingRight: '0px', paddingLeft: '5px' }}>

                                <input type="number" name="consumption" Value={data.consumption} pattern="^\d+(?:\.\d{1,2})?$" style={{ border: '1px solid rgba(0, 0, 0, 0.12)', paddingInline: '10px', height: '40px', width: '100%', borderRadius: '5px' }} disabled></input>
                              </div>


                            </>
                          ))}
                        </div>
                      }
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
                        <h2 className="mb-2 mt-2" style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)', textAlign: 'center' }}>{t('translations:assetEnergyCertificate.Renovationmeasure')} </h2>
                      </div>
                      <div className="col-md-4" style={{ paddingRight: '0px', paddingLeft: '5px' }}>
                        <h2 className="mb-2 mt-2" style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)', textAlign: 'center' }}>{t('translations:assetEnergyCertificate.Energyusereduction')}  </h2>
                      </div>
                      <div className="col-md-4" style={{ paddingRight: '0px', paddingLeft: '5px' }}>
                        <h2 className="mb-2 mt-2" style={{ fontSize: '14px', fontWeight: '700', color: 'rgb(50 48 48 / 54%)', textAlign: 'center' }}>{t('translations:assetEnergyCertificate.Cost')}<sup>2</sup> </h2>
                      </div>

                    </div>
                    <div className="col-md-12" >
                      <div className="row  mb-2">


                        {this.state.energyReductionList.map((data, index) => (

                          <>
                            <div className="col-md-4  mt-2" style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                              <input type="text" name="renovation_measure" Value={data.renovation_measure} style={{ border: '1px solid rgba(0, 0, 0, 0.12)', paddingInline: '10px', height: '40px', width: '100%', borderRadius: '5px' }} disabled></input>
                            </div>
                            <div className="col-md-4   mt-2" style={{ paddingRight: '0px', paddingLeft: '5px' }}>
                              <input type="number" name="reduction" Value={data.reduction} pattern="^\d+(?:\.\d{1,2})?$" style={{ border: '1px solid rgba(0, 0, 0, 0.12)', paddingInline: '10px', height: '40px', width: '100%', borderRadius: '5px' }} disabled></input>
                            </div>
                            <div className="col-md-4   mt-2" style={{ paddingRight: '0px', paddingLeft: '5px' }}>
                              <input type="number" name="cost_eur_m2" Value={data.cost_eur_m2} pattern="^\d+(?:\.\d{1,2})?$" style={{ border: '1px solid rgba(0, 0, 0, 0.12)', paddingInline: '10px', height: '40px', width: '100%', borderRadius: '5px' }} disabled></input>
                            </div>

                          </>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>

          <h2 className='pt-5' style={{ fontSize: '20px', fontWeight: '700' }}>{t('translations:assetEnergyCertificate.EnergyCertificate')}</h2>
          <div className="row">

            <div className="col-md-7" >
              <div className="box px-2 pt-2 mt-2" style={{ border: '1px solid #d3cfcf', borderRadius: '7px', height: '68px', minHeight: '70px', maxHeight: '70px' }}>
                <div className="row" style={{ padding: '12px' }}>
                  <div className="col-md-1" style={{ paddingRight: '0px' }}>
                    <center>
                      <a
                        href={ENDPOINTS.SERVER + `/energy/file/${this.state.assetEnergyCertData ? this.state.assetEnergyCertData.ID : ''}/cert`}

                        target="_blank"
                        style={{ textDecoration: 'none' }}
                        download
                      >
                        <CloudDownload style={{ width: '28px', height: '28px', color: '#14141469' }} />
                      </a>
                    </center>
                  </div>
                  <div className="col-md-7" style={{ paddingLeft: '5px' }}>
                    <h3 style={{ color: '#14141469', fontSize: '14px' }}>{this.state.energyCertificateDocuments ? this.state.energyCertificateDocuments.file_name : ''}</h3>
                  </div>
                  <div className="col-md-4" >
                    <h3 style={{ color: '#14141469', fontSize: '14px' }}>{t('translations:assetEnergyCertificate.Uploaded')}: {this.state.energyCertificateDocuments ? moment(this.state.energyCertificateDocuments.CreatedAt).format('DD/MM/YYYY HH:mm') : ''}</h3>
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
)(withTranslation('translations')(AdminPublicEnergyCertificateInfo));


