import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {withRouter,useHistory,Link} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import NavContainer from '../../../smartcomponents/ossnavcontainer';
import language_icon from '../../../../styles/assets/images/language-icon.png';
import Vector1 from '../../../../styles/assets/Vector1.png';
import snowflake_1 from '../../../../styles/assets/snowflake_1.png';
import calculaadora from '../../../../styles/ossAdmin/assets/calculaadora.png';
import quizHomeIcon from '../../../../styles/ossAdmin/assets/quizHomeIcon.png';
import Logo_europa_White from '../../../../styles/ossAdmin/assets/Logo_europa_White.png';
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
  ArrowBack as ArrowBackIcon,
} from '@material-ui/icons';

import TopBar from '../../../../components/ossnavigation/TopBar';
import {AppendFields,AppendStep} from "./AppendFields";
import {ResultData} from "./ResultData";
import ENDPOINTS from '../../../../constants/endpoints';

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

import Loader from '../../../../components/utils/Loader';
import ReactTags from 'react-tag-autocomplete'
import './style.css';

function EESCalculator(props) {

    const [tabStep, setTabStep] = useState([]);
    const [langSelected, setLangSelected] = useState("en");
    const [menutypename, setMenuTypeName] = useState([]);
    const ossEmail = localStorage.getItem('selectedOssEmail');
    const { setMenus, getPRUsers } = props;
    const { alerts, userdata } = props;
    const { toggleLanguage } = props;
    const history = useHistory();
    const { language, country } = props;
    const menu_path = window.location.pathname;
    const lngChange = value => {
     
      setLangSelected(value)
      
    }
    

  useEffect(() => {
      
    const menu_path = window.location.pathname.split('/')[3];

    let menu_type = "";
    if(menu_path === 'residents'){

       menu_type = "Resident";

    }else if(menu_path === 'housing'){
       menu_type = "Housing Association";

    }else if(menu_path === 'operator'){

       menu_type = "Service Operator";

    }else if(menu_path === 'building-calculator'){

      menu_type = "Building Calculator";
    }else if(menu_path === 'sustainability'){

        menu_type = "Sustainability";
  
    }else if(menu_path === 'standard-renovation-packages'){

        menu_type = "Standard Renovation Packages";

      }else if(menu_path === 'contract'){

        menu_type = "Contract";

      }else if(menu_path === 'measurement-project'){

        menu_type = "Measurement Verification of the project";

      }else if(menu_path === 'refinancability-Checklist'){

        menu_type = "EES Refinancability Checklist";

     }else {

         menu_type = "";
    }

    setMenuTypeName(menu_type);
    stepDataGet();
   

   

}, [stepDataGet,lngChange])

  

//Step Function Start
const stepDataGet = () => {
 
    const config = {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
              "oss_admin_id":userdata.email,
              "lang":langSelected,     
              "menu_type":menutypename                 
            })
          };

          
          fetch(ENDPOINTS.SERVER + '/onboarding/residents/step', config)
              .then(res => res.json())
             // .then((result) => result.length ? JSON.parse(text) : {})
              .then(
                  (result) => {
                   
                    if (result != null) {
                      setTabStep(result);
                          
                          
                        }else{
                          setTabStep([]);
                         

                        }

                  },
                  
              ).catch(error => {
                setTabStep([]);
                
            });
  }
  
  const handleNextStep = () => {
  

    $('#customeTab > .nav-item > .active').parent().next('li').find('a').trigger('click');

}
const handlePrevStep = () => {


  $('#customeTab > .nav-item > .active').parent().prev('li').find('a').trigger('click');

}
const handleNextSubQuestion = (index,questionsKey) => {




    $('#mytabs-'+questionsKey+' > .nav-item > .active').parent().next('li').find('a').trigger('click');

 }
 const handleBackSubQuestion = (ttt) => {


    $('#mytabs-'+ttt+' .nav-item > .active').parent().prev('li').find('a').trigger('click');

 }
 
 
  
 return (
      <React.Fragment>
        
        <Helmet>
          <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: InOpen Sans, sans-serifter;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style>
        </Helmet>
        <div className="flex">
          <NavContainer />
          <div className="content oss-admin">
            <TopBar userdata={userdata} pageTitle={menutypename} />
            
            <div className="intro-y grid grid-cols-12 gap-12 mt-1">
              <div className="col-span-12 lg:col-span-12">
                <section style={{ marginTop: '10px',marginBottom:'0px' }}    >
                  <div className="container oss-admin h-auto">
                    <div className="row row-eq-height" style={{ background: ' #F5F7FA' }}  >
                      <div className="col-md-3 pl-0" id="EEScalculator">
                        <div className="row">
                          <div className="col-md-12 mb-3 mt-2 text-center">
                            <center><img src={Logo_europa_White} alt="EUROPA" /></center>
                          </div>
                          <div className="col-md-12 mb-3 text-center ">
                            <h2 className="welcomeTitle mt-10"> How much will it cost?</h2>
                          </div>
                          <div className="col-md-12 mb-2 mt-2 text-center" style={{ paddingRight: '0px' }} >
                            <center>
                              <img src={calculaadora} alt="" style={{ marginTop: '-34px',marginLeft:'126px',height:'50%',position:'absolute' }} />
                                <img src={quizHomeIcon} alt="" style={{ marginTop: '30px' }} />
                            </center>
                          </div>
                        </div>
                        <div className="row" style={{ marginLeft: '0PX',marginRight:'0PX' }}>
                          <div className="col-md-12 mb-2 mt-2" style={{ marginLeft: 'auto',marginRight:'auto' }} >
                         
                            <ul  className="nav nav-tabs flex-column mb-3" id="customeTab">
                            {tabStep.map((stepValue, stepKey) => (

                                                    <li className="nav-item" key={stepKey}>
                                                        {/* <a className="nav-link active show" data-toggle="tab" href="#tab-1"> */}
                                                        <a className={stepKey === 0 ? "nav-link active show" : "nav-link"} data-toggle="tab" href={'#tab-' + stepKey}>
                                                            <div className="circle">{stepKey + 1}</div>
                                                            <div className="nav-item-title">{stepValue.data.name}</div>
                                                        </a>
                                                    </li>

                                                ))

                            }
                                                            
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-9 " style={{ background: 'white' }} >
                                  <div className="row row-eq-height align-middle my-auto">
                                      <div className="col-md-12" style={{  paddingLeft: "15px"}}>
                                          <h2 className="basicinfo-title"><span style={{ fontSize: '9.92639px',color:'#FE9B00' }}>Q: 
                                          <span id="currentCounter">1 </span>/5 </span> &nbsp;&nbsp;<span >{menutypename}</span>
                                          </h2>
                                          <br/>
											<br/>
											<h2 className="modelH2"> 
													  Select Language
                            
                          
											
                            </h2>
													<br/>

													<div className="row">
                            <div className="col-md-8">
                                <div className="row">
                                    <div className="col-md-1" id="ossstep5chk">
                                      <center>
                                      <input type="radio" id="language" name="language" value="bg" onChange={val => lngChange("bg")} />
                                      <label htmlFor="language" ><img src={Belgium} alt="Belgium" style= {{marginTop:'6px'   }} /></label>
                                      </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                      <center>
                                      <input type="radio" id="language1" name="language" value="fr" onChange={val => lngChange("fr")}/>
                                      <label htmlFor="language1"> <img src={France} alt="France"  style= {{marginTop:'6px'   }} /></label>
                                      </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                      <center>
                                      <input type="radio" id="language2" name="language" value="lv"  onClick={val => lngChange("lv")}/>
                                      <label htmlFor="language2" > <img src={Latvia} alt="Latvia"  style= {{marginTop:'6px'   }} /></label>
                                      </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                      <center>
                                      <input type="radio" id="language3" name="language" value="sp"  onChange={val => lngChange("sp")}/>
                                      <label htmlFor="language3" > <img src={Spain} alt="Spain"  style= {{marginTop:'6px'   }}/></label>
                                      </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                      <center>
                                      <input type="radio" id="language4" name="language" value="it"  onChange={val => lngChange("it")}/>
                                      <label htmlFor="language4" ><img src={Italy} alt="Italy" style= {{marginTop:'6px'   }} /></label>
                                      </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                      <center>
                                      <input type="radio" id="language5" name="language" value="pt"  onChange={val => lngChange("pt")}/>
                                      <label htmlFor="language5" ><img src={Portugal} alt="Portugal" style= {{marginTop:'6px'   }} /></label>
                                      </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                      <center>
                                      <input type="radio" id="language6" name="language"  defaultChecked={true} value="en"onClick={val => lngChange("en")}/>
                                      <label htmlFor="language6" >        <img src={UK} alt="English"  style= {{marginTop:'6px'   }}/></label>
                                      </center>
                                      </div>
                                </div>
                              </div>
                                            {/* <div className="col-md-4">
                                            <Link to={menu_path} title="Set Default" style={{ float: 'right' }} className="button px-2 mr-1 mb-2 bg-theme-1 text-white">
                                            <ArrowBackIcon />
              </Link>
                                                     
                                                       
                                            </div> */}
									</div>
                                        
                                          <hr/>
                                      </div>
                                      <div className="col-md-12">
                                        <section className="signup-step-container" style={{ marginTop: '10px',marginBottom:'10px' }} >
                                          <div className="container">
                                            <div className="row d-flex ">
                                              <div className="col-md-12">                                       
                                                <div className="wizard">
                                                    <div className="tab-content" id="tab-details">
                                                 
                                                    {tabStep.map((menu, index) => (
                                                         <div className={index === 0 ? "tab-pane active show" : "tab-pane"} id={'tab-' + index} key={index + 1}>
                                                            
                                                                   {/* <ul id={'mytabs-' + index}  className="nav nav-tabs flex-column mb-3" >
                                                                          {menu.data.questions.map((questionsValue, questionsKey) => (
                                                                                    <li className="nav-item" key={questionsKey}>
                                                                                        <a className={questionsKey === 0 ? "nav-link active show" : "nav-link"}  data-toggle="tab" href={'#basicTab-'+index+'-' + questionsKey}>{questionsValue.name}</a>
                                                                                    </li>
                                                                               ))}
                                                                         </ul> */}

                                                                 <div className="row mb-4 mt-4">  
                                                                         {menu.data.questions.map((questionsValue, questionsKey) => (
																		                                       <div className="col-12 col-md-12 col-lg-12">
                                                                              
                                                                                    <div className="col-12 col-md-12 col-lg-12">
                                                                                     
                                                                                        <h2 className="mt-3" style={{ fontSize: ' 21.2266px' }} > {questionsValue.name}</h2>
                                                                                    </div>
                                                                                    
                                                                                    {questionsValue.step_fields.sort((a, b) => a.index > b.index ? 1 : -1).map((c, i) => (
                                                                                      <div>
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
                                                                                                              style="background: none;color: #6B7280;font-weight: 500;font-size: 11.602px;">
                                                                                                                  {fieldValue.options.sort((a, b) => a.CreatedAt < b.CreatedAt ? 1:-1).map((optionValue, optionKey) => {
                                                                                                          
                                                                                                                                        return ( 
                                                                                                                                          <option value={optionValue.option_value}>{optionValue.option_value}</option>
                                                                                                                                        );
                                                                                                                              })                                                                                                                                      
                                                                                                                              }                                                                                                               
                                                                                                            </select>
                                                                                                          </div>                                                                                                                                                                                                                                                                                                       
                                                                                                    </div>                                                                                                                                                                                                       
                                                                                                  }

                                                                                                  if (c.input_type === 'Checkbox Type Button') {                                                                                                   
                                                                                                    return<div className="col-md-12 mb-2 mt-5" key={i}> 
                                                                                                    <div className="row mb-2">
                                                                                                            {c.options.map((optionValue, optionKey) => (                                                                                                                                                                                                                               
                                                                                                                            <div className="col-md-3" id="step5chk">
                                                                                                                              <input type="checkbox" id={'checkbox'+optionKey} name="radioFruit" value={optionValue.option_value}/>
                                                                                                                              <label htmlFor={'checkbox'+optionKey}>{optionValue.option_value}</label>
                                                                                                                            </div>
                                                                                                                             ))
                                                                                                          }       
                                                                                                          </div>                                                                                                                                                                                                                                                                                           
                                                                                                    </div>                                                                                                                                                                                                       
                                                                                                  }

                                                                                                  if (c.input_type === 'Checkbox Type Box') {                                                                                                   
                                                                                                    return<div className="row mb-2 mt-5" key={i}> 
                                                                                                       
                                                                                                            {c.options.map((optionValue, optionKey) => (     
                                                                                                              <div className="col-md-3" id="step3chk">                                                                                                                                                                                                                          
                                                                                                                           <input type="checkbox" id={'checkboxFence'+optionKey} name="describes_home" value="apple"/>
                                                                                                                                <label htmlFor={'checkboxFence'+optionKey}>
                                                                                                                                  <div className="serBox">
                                                                                                                                    <div className="row  row-eq-height" style={{height:'100px',marginRight: '0px', marginLeft: '0px'}}>
                                                                                                                                      <div className="col-md-12">
                                                                                                                                      <center>                                                                                                                                           
                                                                                                                                          <img src={Vector1} alt="" style={{marginTop: '30px'}} />
                                                                                                                                          <img src={snowflake_1} alt="" style={{marginTop: '-17px'}} />
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


                                                                                                  if (c.input_type === 'Radio Type Button') {                                                                                                   
                                                                                                    return<div className="col-md-12 mb-2 mt-5" key={i}> 
                                                                                                        <div className="row mb-2">
                                                                                                            {c.options.map((optionValue, optionKey) => (                                                                                                                                                                                                                               
                                                                                                                            <div className="col-md-3" id="step5chk">
                                                                                                                              <input type="radio" id={'radio'+optionKey} name="radioFruit" value={optionValue.option_value}/>
                                                                                                                              <label htmlFor={'radio'+optionKey}>{optionValue.option_value}</label>
                                                                                                                            </div>
                                                                                                                             ))
                                                                                                          }       
                                                                                                          </div>                                                                                                                                                                                                                                                                                           
                                                                                                    </div>                                                                                                                                                                                                       
                                                                                                  }

                                                                                                  if (c.input_type === 'Radio Type Box') {                                                                                                   
                                                                                                    return<div className="row mb-2 mt-5" key={i}> 
                                                                                                       
                                                                                                            {c.options.map((optionValue, optionKey) => (     
                                                                                                              <div className="col-md-3" id="step3chk">                                                                                                                                                                                                                          
                                                                                                                           <input type="radio" id={'radioFence'+optionKey} name="describes_home" value="apple"/>
                                                                                                                                <label htmlFor={'radioFence'+optionKey}>
                                                                                                                                  <div className="serBox">
                                                                                                                                    <div className="row  row-eq-height" style={{height:'100px',marginRight: '0px', marginLeft: '0px'}}>
                                                                                                                                      <div className="col-md-12">
                                                                                                                                      <center>                                                                                                                                           
                                                                                                                                          <img src={Vector1} alt="" style={{marginTop: '30px'}} />
                                                                                                                                          <img src={snowflake_1} alt="" style={{marginTop: '-17px'}} />
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
                                                                                      ))}                                                                               
                                                                           </div>
                                                                            ))}
                                                                        </div>
<br></br>
<br></br>
<br></br>
<br></br>
                                                                        <div className="row mb-4 mt-4">
                                                                        <ul className="list-inline pull-left">
                                                                                <li> <button type="button" onClick={() => handleNextStep()}
                                                                                    className="btn btn-primary btn-md btn-default">Next</button>
                                                                                </li>
                                                                                <li> <button type="button" onClick={() => handlePrevStep()}
                                                                                    className="btn btn-primary btn-md btn-default">Next Back</button>
                                                                                </li>
                                                                               
                                                                              </ul>
                                                                              </div>       
                                                         </div>
                                                        ))
                                                    }                                                                                                                                                                                                                                   
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

export default connect(
    state => ({
        alerts: state.alerts.pending,
        menus: state.oss_menus,
        userdata: state.user.profileInfo.data,
        country: state.user.country,
        language: state.user.language,
       
    }),
    dispatch => ({

        getPRUsers: () => dispatch(getPRUsersAction()),

    })
)(EESCalculator);
