import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import NavContainer from '../../../smartcomponents/ossnavcontainer';
import MobileNavContainer from '../../../smartcomponents/ossMobileNavContainer';
import language_icon from '../../../../styles/assets/images/language-icon.png';
import calculaadora from '../../../../styles/ossAdmin/assets/calculaadora.png';
import quizHomeIcon from '../../../../styles/ossAdmin/assets/quizHomeIcon.png';
import Logo_europa_White from '../../../../styles/ossAdmin/assets/Logo_europa_White.png';
import { withTranslation } from 'react-i18next';
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
  Search as SearchIcon,
} from '@material-ui/icons';

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
import ReactTags from 'react-tag-autocomplete'
import './style.css';
import Moment from 'moment';

class EESCalculatorView extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      userDataList: [],
      langSelected: 'en',
      filter_type: 'All'

    }
    this.filter = this.filter.bind(this);
  }
  lngChange = (e) => {

   
    this.state.langSelected = e.target.value;

    this.forceUpdate()
    this.userListGet();
    
  }
  filter = (e) => {

    this.state.filter_type = e.target.value
    this.forceUpdate();
    this.userListGet();

  }

  componentDidMount() {
    this.userListGet();
  }
  userListGet() {

    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    };
console.log(ENDPOINTS.SERVER + '/onboarding/user/data?oss_admin_id=' + this.props.userdata.email + '&filter_type=' + this.state.filter_type);
    fetch(ENDPOINTS.SERVER + '/onboarding/user/data?oss_admin_id=' + this.props.userdata.email + '&filter_type=' + this.state.filter_type, config)
      .then(res => res.json())
      // .then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {

          if (result.documents.length != 0) {
            this.setState({
              userDataList: result.documents
            })

          } else {
            this.setState({
              userDataList: []
            })
            alert({
              text: 'data not available',
              type: 'success',
              delay: 800,
              closer: true
            });

          }


        },

      ).catch(error => {
        this.setState({
          userDataList: []
        })
        alert({
          text: 'data not available',
          type: 'error',
          delay: 800,
          closer: true

        });
      });
  }




  render() {
    const { userdata, t, language } = this.props;

    const menu_path = window.location.pathname.split('/')[3];
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
            <TopBar userdata={userdata} pageTitle='translations:ossMenu.Records' subTitle='' />
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12">
                <div className="intro-y box mt-1">
                  <div className="flex flex-col sm:flex-row items-center p-2 border-b border-gray-200 dark:border-dark-5">
                    <div className="p-2" id="select-options">
                      <div className="preview">
                        <div className="flex flex-col sm:flex-row items-center">
                          <div className="sm:mt-2">
                            <select className="input input--sm border mr-2" onChange={e => this.filter(e)}>
                               <option value="All">All</option> 
                              <option value="Resident">Resident</option>
                              <option value="Housing Association">Housing Association</option>
                              <option value="Service Operator">Service Operator </option>
                              <option value="EES Checklist">EES Checklist</option>
                              <option value="EES Refinancability Checklist">EES Refinanceability Checklist</option>
                              <option value="Renovation Cost Calculator">Renovation Cost Calculator</option>


                            </select>
                          </div>

                          {/* <div className="ml-2">
                                          <button type="button" className="button bg-theme-1 text-white mt-1" style={{color: 'white',border: 'none'}}><SearchIcon  /></button>
                                        </div> */}
                        </div>
                      </div>

                    </div>
                    <div className="row" style={{ width: '100%' }}>
                    <div className="col-md-1" id="ossstep5chk">                                     
                                      <center>
                                      <input type="radio" id="languageBackUp1" name="languageresidents" defaultChecked={this.state.langSelected === "en" || this.state.langSelected === "en-US"}  value="en" onClick={e =>this.lngChange(e)}/>
                                      <label htmlFor="languageBackUp1" title="English" style={{ cursor: 'pointer' }}> <center><img src={gbFlag} alt="UK" style={{ height: '20px', width: '30px',marginTop: '9px'  }} /> </center></label>                                     
                                      </center>
                                      </div>

                                    
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="languageBackUp2" name="languageresidents" defaultChecked={this.state.langSelected === "lv"} value="lv" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="languageBackUp2" title="Latvia" style={{ cursor: 'pointer' }}> <center><img src={latviaFlag} alt="Latvia" style={{ height: '20px', width: '30px',marginTop: '9px'  }} /> </center></label>
                                        </center>
                                      </div>

                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="languageBackUp3" name="languageresidents" defaultChecked={this.state.langSelected === "pt"} value="pt" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="languageBackUp3" title="Portugal" style={{ cursor: 'pointer' }}> <center><img src={PortugalFlag} alt="Portugal" style={{ height: '20px', width: '30px',marginTop: '9px'  }} /> </center></label>
                                        </center>
                                      </div>

                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="languageBackUp4" name="languageresidents" defaultChecked={this.state.langSelected === "it"} value="it" onChange={e => this.lngChange(e)} />
                                          <label htmlFor="languageBackUp4" title="Italian" style={{ cursor: 'pointer' }}> <center> <img src={ItalyFlag} alt="Italian" style={{ height: '20px', width: '30px',marginTop: '9px'  }}  /> </center></label>
                                        </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="languageBackUp5" name="languageresidents" defaultChecked={this.state.langSelected === "de"} value="de" onChange={e => this.lngChange(e)} />
                                          <label htmlFor="languageBackUp5" title="German" style={{ cursor: 'pointer' }}> <center> <img src={GermanFlag} alt="German" style={{ height: '30px', width: '30px',marginTop: '4px'  }}  /> </center></label>
                                        </center>
                                      </div>

                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="languageBackUp6" name="languageresidents" defaultChecked={this.state.langSelected === "fr"} value="fr" onChange={e => this.lngChange(e)} />
                                          <label htmlFor="languageBackUp6" title="French" style={{ cursor: 'pointer' }}> <center> <img src={FrenchFlag} alt="French" style={{ height: '30px', width: '30px',marginTop: '4px'  }}  /> </center></label>
                                        </center>
                                      </div>




                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="languageBackUp7" name="languageresidents" defaultChecked={this.state.langSelected === "at"} value="at" onChange={e => this.lngChange(e)} />
                                            <label htmlFor="languageBackUp7" title="Austrian" style={{ cursor: 'pointer' }}>
                                              <center> 
                                                <img src={austrianFlag} alt="Austrian" style={{ height: '30px', width: '30px',marginTop: '4px'  }}  /> 
                                               </center>
                                            </label>
                                        </center>
                                      </div>

                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="languageBackUp8" name="languageresidents" defaultChecked={this.state.langSelected === "sk"} value="sk" onChange={e => this.lngChange(e)} />
                                            <label htmlFor="languageBackUp8" title="Slovak" style={{ cursor: 'pointer' }}>
                                              <center> 
                                                <img src={slovakFlag} alt="Slovak" style={{ height: '30px', width: '30px',marginTop: '4px'  }}  /> 
                                               </center>
                                            </label>
                                        </center>
                                      </div>

                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="languageBackUp9" name="languageresidents" defaultChecked={this.state.langSelected === "ro"} value="ro" onChange={e => this.lngChange(e)} />
                                            <label htmlFor="languageBackUp9" title="Romanian" style={{ cursor: 'pointer' }}>
                                              <center> 
                                                <img src={romanianFlag} alt="Romanian" style={{ height: '30px', width: '30px',marginTop: '4px'  }}  /> 
                                               </center>
                                            </label>
                                        </center>
                                      </div>



                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="languageBackUp10" name="languageresidents" defaultChecked={this.state.langSelected === "pl"} value="pl" onChange={e => this.lngChange(e)} />
                                            <label htmlFor="languageBackUp10" title="Polish" style={{ cursor: 'pointer' }}>
                                              <center> 
                                                <img src={polishFlag} alt="Polish" style={{ height: '30px', width: '30px',marginTop: '4px'  }}  /> 
                                               </center>
                                            </label>
                                        </center>
                                      </div>

                                    <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="languageBackUp11" name="languageresidents" defaultChecked={this.state.langSelected === "bg"} value="bg" onChange={e => this.lngChange(e)} />
                                            <label htmlFor="languageBackUp11" title="Bulgarian" style={{ cursor: 'pointer' }}>
                                              <center> 
                                                <img src={bulgarianFlag} alt="Bulgarian" style={{ height: '30px', width: '30px',marginTop: '4px'  }}  /> 
                                               </center>
                                            </label>
                                        </center>
                                      </div>


                           
                    </div>
                  </div>
                  <hr />

                </div>
              </div>

              <div className="col-span-12 mt-6">

                <div className="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">
                  <table className="table table-report sm:mt-2">
                    <thead>
                      <tr style={{ border: 'none' }}>
                        <th className="whitespace-no-wrap" style={{ border: 'none' }}> {t('translations:recordsTitle.Name')}</th>
                        <th className="whitespace-no-wrap" style={{ border: 'none' }}>{t('translations:recordsTitle.Surname')} </th>
                        <th className="whitespace-no-wrap" style={{ border: 'none' }}>{t('translations:recordsTitle.NameofOrganization')} </th>
                        <th className="text-left whitespace-no-wrap" style={{ border: 'none' }}>{t('translations:recordsTitle.Email')} </th>
                        <th className="text-left whitespace-no-wrap" style={{ border: 'none' }}>{t('translations:recordsTitle.Country')} </th>
                        <th className="text-left whitespace-no-wrap" style={{ border: 'none' }}>{t('translations:recordsTitle.City')}</th>
                        <th className="text-left whitespace-no-wrap" style={{ border: 'none' }}>{t('translations:recordsTitle.Type')} </th>
                        <th className="text-left whitespace-no-wrap" style={{ border: 'none' }}>{t('translations:recordsTitle.Time')} </th>
                        <th className="text-left whitespace-no-wrap" style={{ border: 'none' }}>{t('translations:recordsTitle.language')} </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.userDataList.filter(item => item.data.lang === this.state.langSelected).map((userInfo, userInfoKey, arr) => {

                        return (<>
                          {(() => {
                            if (userInfo.data.menu_type === 'Renovation Cost Calculator') {
                              return (<>


                                <tr className="intro-x">

                                  <td style={{ border: 'none' }}> <Link to={`/oss/RenovationCostCalculator/records/${userInfo.data.ID}`}> {userInfo.data.name === '' ? userInfo.data.session : userInfo.data.name} </Link> </td>

                                  <td style={{ border: 'none' }}> <Link to={`/oss/RenovationCostCalculator/records/${userInfo.data.ID}`}> {userInfo.data.surname}  </Link></td>
                                  <td style={{ border: 'none' }}> <Link to={`/oss/RenovationCostCalculator/records/${userInfo.data.ID}`}> {userInfo.data.org_name}  </Link></td>
                                  <td style={{ border: 'none' }}>  <Link to={`/oss/RenovationCostCalculator/records/${userInfo.data.ID}`}> {userInfo.data.email}  </Link></td>
                                  <td style={{ border: 'none' }}> <Link to={`/oss/RenovationCostCalculator/records/${userInfo.data.ID}`}> {userInfo.data.country} </Link> </td>
                                  <td style={{ border: 'none' }}> <Link to={`/oss/RenovationCostCalculator/records/${userInfo.data.ID}`}> {userInfo.data.city}  </Link></td>
                                  <td style={{ border: 'none' }}> <Link to={`/oss/RenovationCostCalculator/records/${userInfo.data.ID}`}> {userInfo.data.menu_type}  </Link></td>
                                  <td style={{ border: 'none' }}> <Link to={`/oss/RenovationCostCalculator/records/${userInfo.data.ID}`}> {Moment(userInfo.data.CreatedAt).format('DD-MM-YYYY HH:mm:ss') }  </Link></td>
                                  <td style={{ border: 'none' }}> <Link to={`/oss/RenovationCostCalculator/records/${userInfo.data.ID}`}> {userInfo.data.lang}  </Link></td>
                                </tr>

                              </>

                              );
                            } else {
                              return (<tr className="intro-x">
                                <td style={{ border: 'none' }}> <Link to={`/oss/onboarding/records/${userInfo.data.ID}`}> {userInfo.data.name} </Link> </td>
                                <td style={{ border: 'none' }}> <Link to={`/oss/onboarding/records/${userInfo.data.ID}`}> {userInfo.data.surname}  </Link></td>
                                <td style={{ border: 'none' }}> <Link to={`/oss/onboarding/records/${userInfo.data.ID}`}> {userInfo.data.org_name}  </Link></td>
                                <td style={{ border: 'none' }}>  <Link to={`/oss/onboarding/records/${userInfo.data.ID}`}> {userInfo.data.email}  </Link></td>
                                <td style={{ border: 'none' }}> <Link to={`/oss/onboarding/records/${userInfo.data.ID}`}> {userInfo.data.country} </Link> </td>
                                <td style={{ border: 'none' }}> <Link to={`/oss/onboarding/records/${userInfo.data.ID}`}> {userInfo.data.city}  </Link></td>
                                <td style={{ border: 'none' }}> <Link to={`/oss/onboarding/records/${userInfo.data.ID}`}> {userInfo.data.menu_type}  </Link></td>
                                <td style={{ border: 'none' }}> <Link to={`/oss/onboarding/records/${userInfo.data.ID}`}>{Moment(userInfo.data.CreatedAt).format('DD-MM-YYYY HH:mm:ss') }   </Link></td>
                                <td style={{ border: 'none' }}> <Link to={`/oss/onboarding/records/${userInfo.data.ID}`}> {userInfo.data.lang}  </Link></td>
                              </tr>);
                            }
                          })()}



                        </>);

                      })
                      }


                    </tbody>
                  </table>
                </div>

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
}))(withTranslation('translations')(EESCalculatorView));
