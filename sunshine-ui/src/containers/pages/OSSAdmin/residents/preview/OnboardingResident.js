import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {withRouter,Link} from 'react-router-dom';
import {
    Grid,
    makeStyles,
} from '@material-ui/core';

import ProgressBar from '../../../../../components/utils/ProgressBar';
import NavContainer from '../../../../smartcomponents/EESNavcontainer';
import EESFooter from '../../../../smartcomponents/EESFooter';
import SelectLanguageModel from '../../../../smartcomponents/SelectLanguageModel';
import EESNavigationMenu from '../../../../smartcomponents/EESNavigationMenu';

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


import '../../../../../styles/assets/css/bootstrap.min.css';
import '../../../../../styles/assets/css/stepwizard.css';
//images
import logo_footer2 from '../../../../../images/3SUNShiNE_Black.svg';
import pdf_logo from '../../../../../styles/assets/images/SUNShINElogo.jpg';
import Logo_europa_White from '../../../../../images/3SUNShiNE_Black.svg';
import calculaadora from '../../../../../styles/assets/calculaadora.png';
import quizHomeIcon from '../../../../../styles/assets/quizHomeIcon.png';

import icon_calc from '../../../../../styles/assets/images/icon-calc.png';
import energy_drivers from '../../../../../styles/assets/energy_drivers.png';
import economic_text from '../../../../../styles/assets/economic_text.png';
import bolt_1 from '../../../../../styles/assets/bolt_1.png';
import database from '../../../../../styles/assets/database.png';


import getCookie from '../../../../../components/utils/getCookie';


import { useSelector } from 'react-redux';
import ENDPOINTS from '../../../../../constants/endpoints';
import { setCalcMenuItems } from '../../../../../actions/calcmenu';
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import {
    searchUsers as searchUsersAction,
    getUsersByPlatformRoles as getPRUsersAction,
} from '../../../../../actions/users';
import publicIp from 'public-ip';
import OperateSelect from './OperateSelect'
import OssStep from './OssStep'
import OssStepFrom from './OssStepFrom'
import ProcessCompleate from './ProcessCompleate'
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';



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
            postCode:'',
            createdUserId:'',
            stepData: [],
            operateErrors: {},
            
        }
        this.countryChange = this.countryChange.bind(this);
        this.residentsTypeChange = this.residentsTypeChange.bind(this);
        this.updateMode = this.updateMode.bind(this);
        //this.onDelete =this.onDelete.bind(this);

    }
    updateMode = (newMode) => {

        this.setState({createdUserId: newMode});
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

        // setTimeout(() => {
           
        //     this.getOssStep();
        //   }, 7000)
       
      }
    getOssStep =()=>{
        const config = {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
              "oss_admin_id":this.state.selectedOssAdmin,
              "lang":this.props.language?this.props.language :'en',     
              "menu_type":this.state.residentsType,
              "is_default_template":this.props.userdata.is_oss_admin === true ? 0:1                  
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
            //.then((result) => result.length ? JSON.parse(text) : {})
            .then(
                (result) => {
                    
                    if (result != null) {
                        let resultData = result.filter(item => item.email === this.props.userdata.email)
                       
                        
                            
                           
                            if(resultData.length === 0){
                                ;
                                let resultData1 = result.filter(item => item.country === 'Latvia')
                               
                                this.state.selectedOssAdmin = resultData1[0]? resultData1[0].email:'';
                                this.setState({
                                    ossAdminData: resultData1,
                                    selectedOssData: resultData1[0],
                                })
                            }else{
                                this.state.selectedOssAdmin = resultData[0]? resultData[0].email:'';
                                this.setState({
                                    ossAdminData: resultData,
                                    selectedOssData: resultData[0],
                                })
                            }
                           
    
                            this.forceUpdate()

                      

                        

                    }else{

                        this.state.selectedOssAdmin = '';

                        this.forceUpdate()
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
       
        if(this.state.selectedOssAdmin == ''){

            alert({
                text: 'oss not available',
                type: 'success',
                delay: 1500,
                closer: true
              });

        }else{
            this.state.processStart = true

            this.forceUpdate()
            this.getOssStep();
        }
        
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
        //const { userdata } = this.props;
        //const menu_path = window.location.pathname.split('/')[3];

           
        let { isFormSubmit,processStart,fetching,let_start, ossAdminChange,operateErrors,stepData,handleNextStepNew, ossEmail,userFormSubmit, selectedOssData, residentsType, selectedOssAdmin,postCode, selectedResidentsTypeChange,createdUserId, selectedCountry, ossAdminData } = this.state;

        return (
            <React.Fragment>
                <main role="main" className="h-auto">
               <EESNavigationMenu />
                                       
            
                    <section style={{ marginTop: '0px', marginBottom: '0px' }}>
                        <div className="container h-auto" style={{ width: '100%', maxWidth: '100%' }}  >
                            <div className="row row-eq-height" style={{ background: '#F5F7FA', minHeight: '100vh' }} >
                                <div className="col-md-3 pl-0 animate__animated animate__fadeInLeft" id="EEScalculator" style={{ paddingRight: '15px', paddingLeft: '15px' }}>
                                    <div className="row">
                                        <div className="col-md-12 mb-1 mt-2 text-center">
                                        <Link to={`/`}><img src={logo_footer2} alt="EUROPA" style={{ height: '150PX' }} /></Link>
                                        </div>
                                        <div className="col-md-12 mb-1 text-center ">
                                            <h2 className="welcomeTitle mt-2 mb-2"> Welcome to <br />THE EUROPA PROJECT</h2>
                                        </div>
                                        <div className="col-md-12 mb-2 mt-2 text-center" style={{ paddingRight: '0px' }} >
                                            <center>
                                                <img src={calculaadora} alt="" style={{ marginTop: '-11px', marginLeft: '13px', height: '50%', position: 'absolute' }} />
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
                                    <div className="row" style={{ bottom: '0', width: '100%', position: 'absolute' }}>
                                        <div className="col-md-10 mb-2 mt-2" style={{ marginLeft: 'auto', marginRight: 'auto' }} >
                                            <button type="button" data-toggle="modal" data-target="#bookCallExampleModalCenter" className="bookcall">
                                                <PlusIcon />
                                                &nbsp;&nbsp; Book a call</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-9" style={{ background: 'white', paddingRight: '15px', paddingLeft: '15px' }} >
                                    <div className="row row-eq-height align-middle my-auto animate__animated animate__fadeInRight">
                                   
                                    <div className="col-md-12" style={{  background: 'rgb(253 207 0)',    textAlign: 'center' }}>
                                    <Link to={`dashboard`} style={{ marginTop: '16px', display: 'inline-block',float:'left'}}> <DashboardIcon style={{ verticalAlign: 'middle', height: '22PX',color: 'black' }} /> <span style={{color: 'black',
    fontSize: '13px',
    textAlign: 'justify',
    fontFamily: "Open Sans, sans-serif",
    fontStyle: 'normal',
    fontWeight: 'bold' }}>My Dashboard</span></Link>
                                            <h3 style={{ textAlign: 'center',    display: 'inline-block',textAlign: 'center',fontSize: '30px',fontWeight: 'bold',fontFamily: "Open Sans, sans-serif", }}>Preview Mode </h3>
                                           

                                            </div>
                                            <hr/>
                                        <div className="col-md-12" style={{ paddingRight: '15px', paddingLeft: '15px' }}>

                                           
                                        <NavContainer ossAdminChange={this.ossAdminChange.bind(this) }  selectedOssValue={ossEmail} ossAdminData={ossAdminData} />
                                       
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


                                    <EESFooter />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <SelectLanguageModel residentsType="Housing Association" selectedOssAdmin={ this.state.selectedOssAdmin} />
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
