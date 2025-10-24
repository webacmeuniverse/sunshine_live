import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {withRouter,Link} from 'react-router-dom';
import {
    Grid,
    Typography,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    makeStyles,
} from '@material-ui/core';
import testlogo from '../../../../images/Sunshine-Logo-FB1200x627.png';
import ProgressBar from '../../../../components/utils/ProgressBar';
import NavContainer from '../../../smartcomponents/EESNavcontainer';
import EESFooter from '../../../smartcomponents/EESFooter';
import SelectLanguageModel from '../../../smartcomponents/SelectLanguageModel';
import EESNavigationMenu from '../../../smartcomponents/EESNavigationMenu';

import {
    Home as HomeIcon,
    BusinessCenter as OrganizationIcon,
    Business as AssetIcon,
    Equalizer as ProjectIcon,
    Security as AdminIcon,
    TableChart as TableChartIcon,
    Delete as DeleteIcon,
    CalendarTodaySharp as PlusIcon,
    ArrowBack as ArrowBackIcon,
    Dashboard as DashboardIcon
} from '@material-ui/icons';

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
import '../../../../styles/assets/css/bootstrap.min.css';
import '../../../../styles/assets/css/stepwizard.css';
//images
import logo_footer2 from '../../../../images/3SUNShiNE_Black.svg';
import pdf_logo from '../../../../styles/assets/images/SUNShINElogo.jpg';
import Logo_europa_White from '../../../../images/3SUNShiNE_Black.svg';
import calculaadora from '../../../../styles/assets/calculaadora.png';
import quizHomeIcon from '../../../../styles/assets/quizHomeIcon.png';

import icon_calc from '../../../../styles/assets/images/icon-calc.png';
import energy_drivers from '../../../../styles/assets/energy_drivers.png';
import economic_text from '../../../../styles/assets/economic_text.png';
import bolt_1 from '../../../../styles/assets/bolt_1.png';
import database from '../../../../styles/assets/database.png';

import { LV, EN, BG, SK, AT, RO, PL ,FR} from './../../../../components/utils/SVGflags';


import { useSelector } from 'react-redux';
import ENDPOINTS from '../../../../constants/endpoints';
import { setCalcMenuItems } from '../../../../actions/calcmenu';
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import {
    searchUsers as searchUsersAction,
    getUsersByPlatformRoles as getPRUsersAction,
} from '../../../../actions/users';
import publicIp from 'public-ip';
import OperateSelect from './OperateSelect'
import OssStep from './OssStep'
import OssStepFrom from './OssStepFrom'
import ProcessCompleate from './ProcessCompleate'
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
import styles from './styles';



class OnboardingResident extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            ossAdminData: [],
            selectedOssData: [],
            let_start: false,
            fetching: true,
            isFormSubmit: false,
            processStart: false,
            selectedCountry: this.props.country,
            selectedOssAdmin: '',
            residentsType:'',
            is_default_template_data:0,
            langSelected: this.props.language,
            postCode:'',
            createdUserId:'',
            stepData: [],
            operateErrors: {},
            
        }
        this.countryChange = this.countryChange.bind(this);
        this.residentsTypeChange = this.residentsTypeChange.bind(this);
        this.updateMode = this.updateMode.bind(this);
        this.lngChange = this.lngChange.bind(this);
        //this.onDelete =this.onDelete.bind(this);

    }
    updateMode = (newMode) => {

        this.setState({createdUserId: newMode});
    }
    lngChange = (e) => {
        //this.props.toggleLanguage(e.target.value);
        this.setState({
               fetching:true,
           })
           
        this.state.langSelected =e.target.value
        this.state.let_start = false
        this.state.isFormSubmit = false
        this.state.processStart = false
        this.forceUpdate();
        this.getOssStep();
        
          
      }
    printDocument() {
        //const input = document.getElementById('divToPrint');
      
            const doc = new jsPDF();
           
            //get table html
            const pdfTable = document.getElementById('divToPrint');
            //html to pdf format
            var html = htmlToPdfmake(pdfTable.innerHTML);
            var docDefinition = {
                content: [
                  html
                ],
                styles:{
                  'html-strong':{
                    background:'yellow' // it will add a yellow background to all <STRONG> elements
                  }
                }
              };
            const documentDefinition = {  content: [
                html
              ],
              defaultStyles:{
                red:{ // we define the class called "red"
                    color:'red'
                  }
              } };
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
            pdfMake.createPdf(documentDefinition).open();
          
      }
    componentDidMount() {
        this.ossList();
        this.getOssStep();
       
    }

    componentDidUpdate() {
        //this.getOssStep();
        // setTimeout(() => {
           
        //     this.getOssStep();
        //   }, 7000)
       
      }
    getOssStep =()=>{
        const menu_path = window.location.pathname.split('/')[2];
    
    let is_default_template = 0;
    if(menu_path === 'admin'){

       is_default_template = 1;
    }
        const config = {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
              "oss_admin_id":this.state.selectedOssAdmin,
              "lang":this.state.langSelected === 'en-US' ? 'en' : this.state.langSelected,     
              "menu_type":this.state.residentsType,
              "is_default_template":is_default_template                
            })
          };    
          
        
          fetch(ENDPOINTS.SERVER + '/onboarding/residents/step', config)
              .then(res => res.json())
             // .then((result) => result.length ? JSON.parse(text) : {})
              .then(
                  (result) => {   
                  
                    if (result != null) {
                         this.setState({
                            stepData: result.documents,
                            
                          }) 
                          this.state.createdUserId ='pppp'
                          this.setState({
                            fetching:false,
                            
                          }) 
                           
                           this.forceUpdate()                                         
                        }
                  },
                  
              ).catch(error => {
                //setTabStep([]);                
            });
    }   
   
    countryChange = value => {
        this.state.selectedCountry = value.target.value
        this.forceUpdate()
        this.ossList();

    }

    residentsTypeChange = value => {
        this.state.residentsType = value.target.value
        this.forceUpdate()
     
    }

    postCodeChange = value => {

        this.state.postCode = value.target.value
        this.forceUpdate()

    }

    ossList = () => {

        const config = {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain' },
        };

        fetch(ENDPOINTS.SERVER + '/oss/admins', config)
            .then(res => res.json())         
            .then(
                (result) => {
                    
                    if (result != null) {
                        
                       // const ossAdminId = window.location.pathname.split('/')[3];
                        
                        const menu_path = window.location.pathname.split('/')[2];
    
                        let ossAdminId = 0;
                        if(menu_path === 'admin'){
                    
                           ossAdminId = window.location.pathname.split('/')[4];
                        }else{
  
                           ossAdminId = window.location.pathname.split('/')[3];
                        }
                        let resultData = result.filter(item => item.user_id === ossAdminId)
                       if(this.props.userdata.is_oss_admin === true ){
                        
                        this.state.ossAdminData = resultData[0];
                        this.state.selectedOssAdmin = resultData[0].email;
                        this.state.is_default_template_data = 0;
                        
                        this.forceUpdate()

                       }else if(this.props.userdata.is_oss_admin === false && resultData.length  === 1){

                        
                        this.state.ossAdminData = resultData[0];
                        this.state.selectedOssAdmin = resultData[0].email;
                        this.state.is_default_template_data = 0;
                        this.forceUpdate()
                       }else{

                        let resultData = result.filter(item => item.ID === ossAdminId)
                        this.state.ossAdminData =this.props.userdata;
                        this.state.selectedOssAdmin ='';
                        this.state.is_default_template_data = 1;
                        this.forceUpdate()

                       }
                       this.getOssStep(); 

                    }else{

                        this.state.selectedOssAdmin = '';
                        this.state.ossAdminData = [];
                        this.forceUpdate()
                        this.getOssStep(); 

                    }
                    
                }
            )

    }
    ossAdminChange = (fieldValue) => {
           
        
        
        //let resultData = this.stat.ossAdminData.filter(item => item.country == this.state.selectedCountry && item.email == fieldValue)
        this.state.selectedOssAdmin = fieldValue;
       // this.state.selectedOssData = resultData;
       $(".tab-pane").removeClass("active show");
       //$('#'+prvStep).removeClass('active show');
        $('#tabt-1').addClass('active show');
        this.setState({
            fetching:true,
            
          }) 
       
        this.state.let_start = false
       this.state.isFormSubmit = false
       this.state.processStart = false
      
        this.forceUpdate()
        this.getOssStep();


    }
   
    operateDataSave = (event) => {

        let operateErrors1 = {};
        if(this.state.selectedCountry  === ''){

            operateErrors1["country"] = "all fields are required";
        }else if(this.state.residentsType === ''){
            operateErrors1["country"] = "all fields are required";
        }else if(this.state.postCode === ''){

            operateErrors1["country"] = "all fields are required";
        }else{
       
            this.state.processStart = true

            this.forceUpdate()
            this.getOssStep();
        
    }
    this.setState({ operateErrors: operateErrors1 });
    }

    lastStepSubmit = (event) => {

       
        
            this.state.isFormSubmit = true

            this.forceUpdate()

       
        

    }
    handleNextStepNew = (stepIndex) => {
     
        this.state.let_start = true
  
        this.forceUpdate()
        $(".tab-pane").removeClass("active show");
        //$('#'+prvStep).removeClass('active show');
         $('#tabt-2').addClass('active show');
  
         $(".nav-link").removeClass("active show");
         $('li[id=tabStepOne').find('a').addClass("active show");
         //$('#customeTab > .nav-item > .active').next('li').find('a').trigger('click');
         //$("#customeTab > li:has(a[href='#tabt-2']):first()").find('a').addClass("active show")
        //$('#customeTab > .nav-item > .active').parent().next('li').find('a').trigger('click');
     }

     

    render() {
           
        let { isFormSubmit,processStart,fetching,let_start, ossAdminChange,operateErrors,stepData,handleNextStepNew, ossEmail,userFormSubmit, selectedOssData, residentsType, selectedOssAdmin,postCode, selectedResidentsTypeChange,createdUserId, selectedCountry, ossAdminData } = this.state;
       
        return (
            <React.Fragment>
                <main role="main" className="h-auto">
               <EESNavigationMenu />

               {(() => {
                                                if (this.props.userdata.superuser === true ) {

                                                    return   <span className="line">
                                                    <h2><span><Link to={`/simulationTools#all`} >OSS List</Link></span></h2>
                                                </span>
                                                }
                                            })()}

                                <div className="intro-y box px-2 pt-2 mt-2">
                                <div className="row">

                                    <div className="col-md-1" id="ossstep5chk">                                     
                                        <center>
                                          <input type="radio" id="language7" name="languageresidents" defaultChecked={this.state.langSelected === "en" || this.state.langSelected === "en-US"}  value="en" onClick={e =>this.lngChange(e)}/>
                                          <label htmlFor="language7" title="English" style={{ cursor: 'pointer' }}> <center><img src={gbFlag} alt="UK" style={{ height: '20px', width: '30px',marginTop: '9px'  }} /> </center></label>                                     
                                        </center>
                                      </div>

                                    
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language8" name="languageresidents" defaultChecked={this.state.langSelected === "lv"} value="lv" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language8" title="Latvia" style={{ cursor: 'pointer' }}> <center><img src={latviaFlag} alt="Latvia" style={{ height: '20px', width: '30px',marginTop: '9px'  }} /> </center></label>
                                        </center>
                                      </div>

                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language9" name="languageresidents" defaultChecked={this.state.langSelected === "pl"} value="pl" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language9" title="Portugal" style={{ cursor: 'pointer' }}> <center><img src={PortugalFlag} alt="Portugal" style={{ height: '20px', width: '30px',marginTop: '9px'  }} /> </center></label>
                                        </center>
                                      </div>

                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language10" name="languageresidents" defaultChecked={this.state.langSelected === "it"} value="it" onChange={e => this.lngChange(e)} />
                                          <label htmlFor="language10" title="Italian" style={{ cursor: 'pointer' }}> <center> <img src={ItalyFlag} alt="Italian" style={{ height: '20px', width: '30px',marginTop: '9px'  }}  /> </center></label>
                                        </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language11" name="languageresidents" defaultChecked={this.state.langSelected === "de"} value="de" onChange={e => this.lngChange(e)} />
                                          <label htmlFor="language11" title="German" style={{ cursor: 'pointer' }}> <center> <img src={GermanFlag} alt="German" style={{ height: '30px', width: '30px',marginTop: '4px'  }}  /> </center></label>
                                        </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language11930" name="languageresidents" defaultChecked={this.state.langSelected === "fr"} value="fr" onChange={e => this.lngChange(e)} />
                                          <label htmlFor="language11930" title="French" style={{ cursor: 'pointer' }}> <center> <img src={FrenchFlag} alt="French" style={{ height: '30px', width: '30px',marginTop: '4px'  }}  /> </center></label>
                                        </center>
                                      </div>
                                      

                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language001" name="languageresidents" defaultChecked={this.state.langSelected === "at"} value="at"onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language001" title="Austrian" style={{ cursor: 'pointer' }}> <center><img src={austrianFlag} alt="Austrian" style={{ height: '30px', width: '30px',marginTop: '4px'  }} /> </center></label>
                                        </center>
                                      </div>                                                                     
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language002" name="languageresidents" defaultChecked={this.state.langSelected === "sk"} value="sk" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language002" title="Slovak" style={{ cursor: 'pointer' }}> <center><img src={slovakFlag} alt="Slovak" style={{ height: '22px', width: '30px',marginTop: '8px'  }} /> </center></label>
                                        </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language003" name="languageresidents" defaultChecked={this.state.langSelected === "ro"} value="ro" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language003" title="Romanian" style={{ cursor: 'pointer' }}><center><img src={romanianFlag} alt="Romanian" style={{ height: '22px', width: '30px',marginTop: '8px'  }} /> </center></label>
                                        </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">
                                        <center>
                                          <input type="radio" id="language004" name="languageresidents" defaultChecked={this.state.langSelected === "pl"} value="pl" onChange={e =>this.lngChange(e)}/>
                                          <label htmlFor="language004" title="Polish" style={{ cursor: 'pointer' }}><center><img src={polishFlag} alt="Polish" style={{ height: '30px', width: '30px',marginTop: '4px'  }} /> </center></label>
                                        </center>
                                      </div>
                                      <div className="col-md-1" id="ossstep5chk">                                    
                                      <center>
                                      <input type="radio" id="language005" name="languageresidents"  defaultChecked={this.state.langSelected === "bg"}  value="bg" onClick={e =>this.lngChange(e)}/>
                                      <label htmlFor="language005" title="Bulgarian" style={{ cursor: 'pointer' }}> <center><img src={bulgarianFlag} alt="Bulgarian" style={{ height: '30px', width: '30px',marginTop: '4px'  }} /> </center></label>                                     
                                      </center>
                                      </div>
                                      
                                </div>
                             </div>

                                <div className="intro-y box px-2 pt-2 mt-2">
                                        <div className="flex flex-col lg:flex-row border-b border-gray-200 dark:border-dark-5 pb-2 -mx-5">
                                            <div className="flex flex-1 px-5 items-center justify-center lg:justify-start">
                                                <div className="flex-none relative">
                                                    <img alt="Midone Tailwind HTML Admin Template" className="rounded-full" style={{height:'100px'}} src={testlogo}/>
                                                </div>
                                            
                                            </div>                       
                                            <div style={{marginTop: '-3.5rem'}} className="flex mt-6 lg:mt-2 items-center lg:items-start flex-1 flex-col justify-center text-gray-600 dark:text-gray-300 px-5 border-l border-r border-gray-200 dark:border-dark-5 border-t lg:border-t-0 pt-5 lg:pt-0">
                                            <div className="truncate sm:whitespace-normal flex items-center"> {this.state.ossAdminData.name} </div>
                                            <div className="truncate sm:whitespace-normal flex items-center mt-3">{this.state.ossAdminData.email}</div>
                                            
                                        </div>
                                        </div>                   
                                </div>

                      <br></br>
                    <section style={{ marginTop: '0px', marginBottom: '0px' }}>

                    

                        
                        <div className="container h-auto" style={{ width: '100%', maxWidth: '100%' }}  >
                            <div className="row row-eq-height" style={{ background: '#F5F7FA', minHeight: '80vh' }} >
                                <div className="col-md-3 pl-0 animate__animated animate__fadeInLeft" id="EEScalculator" style={{ paddingRight: '15px', paddingLeft: '15px' }}>
                                    <div className="row">
                                        <div className="col-md-12 mb-1 mt-2 text-center">
                                        <center> <Link to={`/`}><img src={logo_footer2} alt="EUROPA" style={{ height: '150PX' }} /></Link></center>
                                        </div>
                                        <div className="col-md-12 mb-1 text-center ">
                                            <h2 className="welcomeTitle mt-2 mb-2"> Welcome to <br />THE EUROPA PROJECT</h2>
                                        </div>
                                        <div className="col-md-12 mb-2 mt-2 text-center" style={{ paddingRight: '0px' }} >
                                            <center>
                                                <img src={calculaadora} alt="" style={{ marginTop: '-38px', marginLeft: '135px', height: '50%', position: 'absolute' }} />
                                                <img src={quizHomeIcon} alt="" style={{ marginTop: '30px' }} />
                                            </center>
                                        </div>
                                    </div>

                                
                                    <div className="row">

                                        <div className="col-md-10 mb-2 mt-2" style={{ marginLeft: 'auto', marginRight: 'auto' }} >
                                            {(() => {
                                                if (processStart === true && isFormSubmit === false) {

                                                    return (<OssStep stepData={stepData} selectedOssAdmin={selectedOssAdmin} residentsType={residentsType} let_start={let_start} />);
                                                }
                                            })()}
                                        </div>
                                    </div>
                                    {/* <div className="row" style={{ bottom: '0', width: '100%', position: 'absolute' }}>
                                        <div className="col-md-10 mb-2 mt-2" style={{ marginLeft: 'auto', marginRight: 'auto' }} >
                                            <button type="button" data-toggle="modal" data-target="#bookCallExampleModalCenter" className="bookcall">
                                                <PlusIcon />
                                                &nbsp;&nbsp; Book a call</button>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="col-md-9" style={{ background: 'white', paddingRight: '15px', paddingLeft: '15px' }} >
                                    <div className="row row-eq-height align-middle my-auto animate__animated animate__fadeInRight">
                                   
                                    {/* <div className="col-md-12" style={{  background: 'rgb(253 207 0)',    textAlign: 'center' }}>
                                    <Link to={`/dashboard`} style={{ marginTop: '16px', display: 'inline-block',float:'left'}}> <DashboardIcon style={{ verticalAlign: 'middle', height: '22PX',color: 'black' }} /> <span style={{color: 'black',
    fontSize: '13px',
    textAlign: 'justify',
    fontFamily: "Open Sans, sans-serif",
    fontStyle: 'normal',
    fontWeight: 'bold' }}>My Dashboard</span></Link>
                                            <h3 style={{ textAlign: 'center',    display: 'inline-block',textAlign: 'center',fontSize: '30px',fontWeight: 'bold',fontFamily: "Open Sans, sans-serif", }}>Preview Mode </h3>
                                           

                                            </div> */}
                                            <hr/>
                                        <div className="col-md-12" style={{ paddingRight: '15px', paddingLeft: '15px' }}>

                                           
                                        {/* <NavContainer ossAdminChange={this.ossAdminChange.bind(this) }  selectedOssValue={ossEmail} ossAdminData={ossAdminData} /> */}
                                       
                                        </div>
                                        <div className="col-md-12">
                                           <hr/>
                                           <br></br>
                                          
                                          
                                        </div>
                                    </div>
                                   
                                    {fetching
                                            ?
                                                <ProgressBar />
                                            :<>
                                            {(() => {
                                                if (processStart === false && isFormSubmit === false) {
                                                   
                                                    return (<OperateSelect selectedOssData={selectedOssData} operateDataSavey={this.operateDataSave} operateErrors={operateErrors} residentsTypeChange={this.residentsTypeChange} countryChange={this.countryChange} selectedCountry={selectedCountry} postCodeChange={this.postCodeChange} ossAdminChange={ossAdminChange} ossAdminData={ossAdminData} />);
                                                }else if(processStart === true && isFormSubmit === true) {
        
                                                    return (<ProcessCompleate stepData={stepData} printDocument={this.printDocument} createdUserId={createdUserId} residentsType={residentsType}/>);
                                                }else {
                                                    //return (<ProcessCompleate printDocument={this.printDocument} createdUserId={createdUserId} residentsType={residentsType} />);
                                                    return (<OssStepFrom stepData={stepData} selectedOssData={selectedOssData} onUpdateMode={this.updateMode} let_start={let_start} handleNextStepNew={this.handleNextStepNew} lastStepSubmit={this.lastStepSubmit} residentsType={residentsType} postCode={postCode} selectedOssAdmin={selectedOssAdmin} selectedResidentsTypeChange={selectedResidentsTypeChange} selectedCountry={selectedCountry} />);
                                                }
                                            })()}
                                            </>
                                            }
 
                                  

{/* 
  <ProcessCompleate stepData={stepData} printDocument={this.printDocument} createdUserId={createdUserId} residentsType={residentsType}/>  */}


                                   
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                
            </React.Fragment>
        );

    }
}
export default connect(
    state => ({
       
        menus: state.oss_menus,
        userdata: state.user.profileInfo.data,
        country: state.user.country,
        language: state.user.language,
    }),
    dispatch => ({

        getPRUsers: () => dispatch(getPRUsersAction()),

    })
)(OnboardingResident);


