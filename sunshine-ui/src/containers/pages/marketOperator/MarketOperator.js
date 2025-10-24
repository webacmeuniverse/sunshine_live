import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { withRouter, Link } from 'react-router-dom';
import {
    Grid,
    makeStyles,
} from '@material-ui/core';

import { withTranslation } from 'react-i18next';
import NavContainer from '../../smartcomponents/EESNavcontainer';
import EESFooter from '../../smartcomponents/EESFooter';
import SelectLanguageModel from '../../smartcomponents/SelectLanguageModel';
import EESNavigationMenu from '../../smartcomponents/EESNavigationMenu';
import gbFlag from '../../../images/flags/english.svg';
import latviaFlag from '../../../images/flags/latvia.svg';
import bulgarianFlag from '../../../images/flags/bulgaria.svg';
import slovakFlag from '../../../images/flags/slovak.png';
import austrianFlag from '../../../images/flags/austria.svg';
import romanianFlag from '../../../images/flags/romania.svg';
import polishFlag from '../../../images/flags/poland.svg';
import europeanFlag from '../../../images/flags/europe.svg';
import AustriaFlag from '../../../images/flags/austria.svg';
import ItalyFlag from '../../../images/flags/italy.svg';
import PortugalFlag from '../../../images/flags/portugal.svg';
import FrenchFlag from '../../../images/flags/french.svg';
import Belgium from '../../../styles/assets/images/country/Belgium.png';
import France from '../../../styles/assets/images/country/France.png';
import Italy from '../../../styles/assets/images/country/Italy.png';
import Latvia from '../../../styles/assets/images/country/Latvia.png';
import Portugal from '../../../styles/assets/images/country/Portugal.png';
import Spain from '../../../styles/assets/images/country/Spain.png';
import UK from '../../../styles/assets/images/country/UK.png';
import GermanFlag from '../../../images/flags/germany.svg';
import modelBackground from '../../../styles/assets/images/mapa_retoque_2.png';
import Switch from '../../../styles/assets/images/Switch.png';

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

import ProgressBar from '../../../components/utils/ProgressBar';
import '../../../styles/assets/css/bootstrap.min.css';
import '../../../styles/assets/css/stepwizard.css';
//images
import logo_footer2 from '../../../images/3SUNShiNE_Black.svg';
import Logo_europa_White from '../../../images/3SUNShiNE_Black.svg';
import calculaadora from '../../../styles/assets/calculaadora.png';
import quizHomeIcon from '../../../styles/assets/quizHomeIcon.png';

import icon_calc from '../../../styles/assets/images/icon-calc.png';
import energy_drivers from '../../../styles/assets/energy_drivers.png';
import economic_text from '../../../styles/assets/economic_text.png';
import bolt_1 from '../../../styles/assets/bolt_1.png';
import database from '../../../styles/assets/database.png';


import getCookie from '../../../components/utils/getCookie';


import { useSelector } from 'react-redux';
import ENDPOINTS from '../../../constants/endpoints';
import { setCalcMenuItems } from '../../../actions/calcmenu';
import { alert, defaultModules } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import {
    searchUsers as searchUsersAction,
    getUsersByPlatformRoles as getPRUsersAction,
} from '../../../actions/users';
import publicIp from 'public-ip';
import OperateSelect from './OperateSelect'
import OssStep from './OssStep'
import OssStepFrom from './OssStepFrom'
import ProcessCompleate from './ProcessCompleate'

import ServiceOperatorChecklist from './ServiceOperatorChecklist'
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';

import toggleLanguage from '../../../actions/language';
import toggleCountry from '../../../actions/country';

class OnboardingResident extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            ossAdminData: [],
            selectedOssData: [],
            let_start: false,
            isFormSubmit: false,
            fetching: true,
            processStart: false,
            selectedCountry: this.props.country,
            selectedOssAdmin: '',
            serviceOperatorChecklistStart: false,
            residentsType: 'Service Operator',
            selectedOrganizationType: '',
            postCode: '',
            createdUserId: '',
            serviceOperatorChecklistResult: false,
            stepData: [],
            operateErrors: {},
            langSelected: this.props.language,

        }
        this.countryChange = this.countryChange.bind(this);
        this.residentsTypeChange = this.residentsTypeChange.bind(this);
        this.updateMode = this.updateMode.bind(this);
        //this.onDelete =this.onDelete.bind(this);

    }
    handleSelect = (lng) => {

        this.props.toggleLanguage(lng);
        this.state.let_start = false;
        this.state.isFormSubmit = false;
        this.state.processStart = false;
        this.state.serviceOperatorChecklistStart = false;
        this.state.serviceOperatorChecklistResult = false;
        this.state.langSelected = lng
        this.forceUpdate()
        this.ossList();
        this.getOssStep();

    }
    handleSelectCountry = (country) => {

        this.props.toggleCountry(country);


        this.state.let_start = false;
        this.state.isFormSubmit = false;
        this.state.processStart = false;
        this.state.serviceOperatorChecklistStart = false;
        this.state.serviceOperatorChecklistResult = false;


        this.state.selectedCountry = country
        this.forceUpdate()
        this.ossList();
        this.getOssStep();


    }



    updateMode = (newMode) => {

        this.setState({ createdUserId: newMode });
    }

    organizationTypeUpdate = (newMode) => {

        this.setState({ selectedOrganizationType: newMode });
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
            styles: {
                'html-strong': {
                    background: 'yellow' // it will add a yellow background to all <STRONG> elements
                }
            }
        };
        const documentDefinition = {
            content: [
                html
            ],
            defaultStyles: {
                red: { // we define the class called "red"
                    color: 'red'
                }
            }
        };
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        pdfMake.createPdf(documentDefinition).open();

    }
    componentDidMount() {
        this.ossList();
        this.getOssStep();
    }
    componentDidUpdate() {
        this.getOssStep();
    }

    getOssStep = () => {


        let newLng = '';

        var army=["at", "sk", "ro", "bg", "pl"];  
       if(["at", "sk", "ro", "bg", "pl"].includes(this.state.langSelected) === true){
         newLng = 'en';
        
       }else{
         newLng = this.state.langSelected;
   
       }

        const config = {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({
                "oss_admin_id": this.state.selectedOssAdmin,
                "lang": newLng,
                "menu_type": this.state.residentsType
            })
        };

        fetch(ENDPOINTS.SERVER + '/onboarding/residents/step', config)
            .then(res => res.json())
            // .then((result) => result.length ? JSON.parse(text) : {})
            .then(
                (result) => {

                    if (result != null) {
                        var arr = ['Craftsman', 'Professional', 'Market Operator', 'Professionnel', 'Artisan', 'Opérateur de marché', 'Operator', 'Profesionālis', 'Amatnieks', 'operators', 'Profissional', 'Técnico Especializado', 'Operador', 'Professionista', 'Artigiano', 'Operatore', 'Operatore', 'Fachmann', 'Handwerker', 'Generalunternehmer'];

                        let resultData = result.documents.filter(item => !arr.includes(item.data.name)

                            //    item.data.name != 'Craftsman' 
                            //     && item.data.name != 'Professional' 
                            //     && item.data.name != 'Market Operator' 
                            //     && item.data.name != 'Operator' 

                            //     && item.data.name != 'Profesionālis'
                            //     && item.data.name != 'Amatnieks'
                            //     && item.data.name != 'operators'

                            //     && item.data.name != 'Profissional'
                            //     && item.data.name != 'Técnico Especializado'
                            //     && item.data.name != 'Operador'

                            //     && item.data.name != 'Professionista'
                            //     && item.data.name != 'Artigiano'
                            //     && item.data.name != 'Operatore'

                            //     && item.data.name != 'Fachmann'
                            //     && item.data.name != 'Handwerker'
                            //     && item.data.name != 'Generalunternehmer'

                            && item.data.questions.length !== 0)



                        this.setState({
                            stepData: resultData,
                            fetching: false,

                        })



                    }
                },

            ).catch(error => {
                //setTabStep([]);                
            });
    }
    countryChange = value => {
        this.props.toggleCountry(value.target.value);
        this.state.selectedCountry = value.target.value
        this.forceUpdate()
        this.ossList();
        this.getOssStep();
        // this.ossList();

    }

    residentsTypeChange = value => {

        this.setState({
            residentsType: value.target.value,

        })

    }

    postCodeChange = value => {


        this.state.postCode = value.target.value

        this.forceUpdate()


    }



    // userCreate = () => {

    //     const config1 = {
    //         method: 'POST',
    //         credentials: 'include',
    //         headers: { 'Content-Type': 'text/plain' },
    //         body: JSON.stringify({

    //             "user_public_ip": '127.0.0',
    //             "session": localStorage.getItem('userBasicSession'),
    //             "selected_oss": selectedOssValue,
    //             "country": country,
    //             "lang":language?language :'en',
    //             "user_id": (userdata ? userdata.ID : "0")




    //         })
    //     };

    //     fetch(ENDPOINTS.SERVER + '/user/input/result', config1)
    //         .then(res => res.json())
    //         // .then((result) => result.length ? JSON.parse(text) : {})
    //         .then(
    //             (result) => {
    //                 setCreatedUserData(result.data)

    //             },
    //             (error) => {

    //                 setError(error);
    //             }
    //         )

    // }

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
                        let resultData = result.filter(item => item.country === this.state.selectedCountry)




                        if (resultData.length === 0) {
                            let resultData1 = result.filter(item => item.country === 'Latvia')

                            this.state.selectedOssAdmin = resultData1[0] ? resultData1[0].email : '';
                            this.setState({
                                ossAdminData: resultData1,
                                selectedOssData: resultData1[0],
                            })
                        } else {
                            this.state.selectedOssAdmin = resultData[0] ? resultData[0].email : '';
                            this.setState({
                                ossAdminData: resultData,
                                selectedOssData: resultData[0],
                            })
                        }


                        this.forceUpdate()





                    } else {

                        this.state.selectedOssAdmin = '';

                        this.forceUpdate()
                    }
                }
            )

    }
    ossAdminChange = (fieldValue) => {
        // this.state.selectedOssData = resultData;
        $(".tab-pane").removeClass("active show");
        //$('#'+prvStep).removeClass('active show');
        $('#tabt-1').addClass('active show');

        this.setState({
            fetching: true,
            let_start: false,
            isFormSubmit: false,
            processStart: false,
            serviceOperatorChecklistStart: false,
            serviceOperatorChecklistResult: false,


        })


        //let resultData = this.stat.ossAdminData.filter(item => item.country == this.state.selectedCountry && item.email == fieldValue)
        this.state.selectedOssAdmin = fieldValue;
        // this.state.selectedOssData = resultData;



        this.state.selectedOrganizationType = '';

        this.forceUpdate()
        this.getOssStep();


    }

    operateDataSave = (event) => {

        let operateErrors1 = {};
        if (this.state.selectedCountry === '') {

            operateErrors1["country"] = this.props.t('translations:dpfText.required_onbording');
        } else if (this.state.residentsType === '') {
            operateErrors1["country"] = this.props.t('translations:dpfText.required_onbording');
        } else if (this.state.postCode === '') {

            operateErrors1["country"] = this.props.t('translations:dpfText.required_onbording');
        } else {

            if (this.state.selectedOssAdmin == '') {

                alert({
                    text: 'oss not available',
                    type: 'success',
                    delay: 1500,
                    closer: true
                });

            } else {
                this.state.processStart = true

                this.forceUpdate()
                $(".tab-pane").removeClass("active show");

                $('#tabt-1').addClass('active show');
            }
        }

        this.setState({ operateErrors: operateErrors1 });




    }

    lastStepSubmit = (event) => {

        this.state.serviceOperatorChecklistStart = true
        this.state.isFormSubmit = true
        this.forceUpdate()

    }

    serviceOperatorChecklistLastStepSubmit = (event) => {

        this.state.isFormSubmit = true
        this.state.serviceOperatorChecklistResult = true
        this.state.serviceOperatorChecklistStart = false
        this.forceUpdate()

    }

    serviceOperatorChecklistStart = (event) => {



        this.state.serviceOperatorChecklistStart = true

        this.forceUpdate()




    }

    backFirstStep = () => {

        $(".tab-pane").removeClass("active show");
        // $('#'+stepIndex).removeClass('active show');
        $('#tab-3').addClass('active show');

        $(".nav-link").removeClass("active show");

        $('li[id=tabStep-0]').find('a').addClass("active show");

        this.state.serviceOperatorChecklistStart = false

        this.forceUpdate()

        //$("#customeTab > li:has(a[href='#tab-" +activeTbale+ "']):first()").find('a').addClass("active show")
        // $("#customeTab > li:has(a[href='#tab-" +removeactiveTbale+ "']):first()").find('a').removeClass("active show")
        // $( "#mytabs > ul li:nth-child(2)" ).find('a').trigger('click')
        //$('#customeTab > .nav-item > .active').next('li').eq( 2 ).find('a').trigger('click');
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

        let { isFormSubmit, processStart, let_start, serviceOperatorChecklistResult, operateErrors, fetching, stepData, ossAdminChange, selectedOrganizationType, handleNextStepNew, serviceOperatorChecklistStart, ossEmail, userFormSubmit, selectedOssData, residentsType, selectedOssAdmin, postCode, selectedResidentsTypeChange, createdUserId, selectedCountry, ossAdminData } = this.state;

        const { t } = this.props;
        return (
            <React.Fragment>
                <main role="main" className="h-auto">

                    <EESNavigationMenu />


                    <section style={{ marginTop: '0px', marginBottom: '0px' }}>
                        <div className="container h-auto" style={{ width: '100%', maxWidth: '100%' }}  >
                            <div className="row row-eq-height" style={{ background: '#F5F7FA', minHeight: '100vh' }} >
                                <div className="col-md-3 pl-0 animate__animated animate__fadeInLeft" id="EEScalculator" style={{ paddingRight: '15px', paddingLeft: '15px' }}>
                                    <div className="row">
                                        <div className="col-md-12 text-center">
                                            <Link to={`/`}> <img src={logo_footer2} alt="EUROPA" style={{ height: '200PX' }} /></Link>
                                        </div>
                                        <div className="col-md-12 text-center ">
                                            <h2 className="welcomeTitle"> {t('translations:ossPreviewTitle.welcomeText')}</h2>
                                            <center>
                                                <img src={calculaadora} alt="" style={{ marginTop: '11px', marginLeft: '21px', height: '30%', position: 'absolute' }} />
                                                <img src={quizHomeIcon} alt="" style={{ marginTop: '30px' }} />
                                            </center>
                                        </div>

                                    </div>

                                    <div className="row">

                                        <div className="col-md-12"  >
                                            {(() => {
                                                if (processStart === true) {

                                                    return (<OssStep stepData={stepData} t={this.props.t} selectedOssAdmin={selectedOssAdmin} selectedOrganizationType={selectedOrganizationType} residentsType={residentsType} let_start={let_start} />);
                                                }
                                            })()}
                                        </div>
                                    </div>
                                    <div className="row" style={{ bottom: '0', width: '100%', position: 'absolute' }}>
                                        <div className="col-md-10 mb-2 mt-2" style={{ marginLeft: 'auto', marginRight: 'auto' }} >
                                            <button type="button" data-toggle="modal" data-target="#bookCallExampleModalCenter" className="bookcall">
                                                <PlusIcon />
                                                &nbsp;&nbsp; {t('translations:ossOnboardingTitle.Bookacall')}</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-9" style={{ background: 'white', paddingRight: '15px', paddingLeft: '15px' }} >
                                    <div className="row row-eq-height align-middle my-auto animate__animated animate__fadeInRight">
                                        <div className="col-md-12" style={{ paddingRight: '15px', paddingLeft: '15px' }}>
                                            <NavContainer ossAdminChange={this.ossAdminChange.bind(this)} selectedOssValue={ossEmail} ossAdminData={ossAdminData} />

                                        </div>
                                        <div className="col-md-12">
                                            <hr />
                                        </div>
                                    </div>
                                    {fetching
                                        ?
                                        <ProgressBar />
                                        : <>

                                            {(() => {

                                                if (processStart === false && isFormSubmit === false && serviceOperatorChecklistStart === false) {

                                                    return (<OperateSelect selectedOssData={selectedOssData} t={this.props.t} operateErrors={operateErrors} operateDataSavey={this.operateDataSave} residentsTypeChange={this.residentsTypeChange} countryChange={this.countryChange} selectedCountry={selectedCountry} postCodeChange={this.postCodeChange} ossAdminChange={ossAdminChange} ossAdminData={ossAdminData} />);
                                                } else if (processStart === true && isFormSubmit === true && serviceOperatorChecklistResult === true) {

                                                    return (<ProcessCompleate stepData={stepData} t={this.props.t} printDocument={this.printDocument} serviceOperatorChecklistResult={serviceOperatorChecklistResult} createdUserId={createdUserId} residentsType={residentsType} serviceOperatorChecklistStart={this.serviceOperatorChecklistStart} />);
                                                } else if (processStart === true && serviceOperatorChecklistStart === false) {

                                                    return (<OssStepFrom stepData={stepData} t={this.props.t} selectedOssData={selectedOssData} onUpdateMode={this.updateMode} let_start={let_start} handleNextStepNew={this.handleNextStepNew} organizationTypeUpdate={this.organizationTypeUpdate} lastStepSubmit={this.lastStepSubmit} residentsType={residentsType} postCode={postCode} selectedOssAdmin={selectedOssAdmin} selectedResidentsTypeChange={selectedResidentsTypeChange} selectedCountry={selectedCountry} />);
                                                } else {
                                                    return (<ServiceOperatorChecklist stepData={stepData} t={this.props.t} serviceOperatorChecklistLastStepSubmit={this.serviceOperatorChecklistLastStepSubmit} backFirstStep={this.backFirstStep} selectedOssData={selectedOssData} createdUserId={createdUserId} selectedOrganizationType={selectedOrganizationType} onUpdateMode={this.updateMode} let_start={let_start} handleNextStepNew={this.handleNextStepNew} lastStepSubmit={this.lastStepSubmit} residentsType={residentsType} postCode={postCode} selectedOssAdmin={selectedOssAdmin} selectedResidentsTypeChange={selectedResidentsTypeChange} selectedCountry={selectedCountry} />);
                                                    //return (<ProcessCompleate printDocument={this.printDocument} createdUserId={createdUserId} residentsType={residentsType} />);
                                                }

                                            })()}

                                        </>
                                    }



                                    <EESFooter />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <div className="modal fade" id="exampleModalCenter1" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered  modal-lg" role="document" style={{ width: '749px' }} >
                        <div className="modal-content">
                            <div className="modal-header" style={{ height: '139px', backgroundImage: `url(${modelBackground})`, backgroundRepeat: 'no-repeat' }}>

                                <div className="row" style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 'auto', marginBottom: 'auto' }} >

                                    <img src={Belgium} alt="Belgium" />
                                    <img src={France} alt="France" />
                                    <img src={Italy} alt="Italy" />
                                    <img src={Latvia} alt="Latvia" />
                                    <img src={Portugal} alt="Portugal" />
                                    <img src={Spain} alt="Spain" />
                                    <img src={UK} alt="UK" />
                                    <img src={GermanFlag} alt="German" style={{ height: '34px',width: '45px' }} />
                        <img src={AustriaFlag} alt="Austrian" style={{ height: '34px',width: '45px' }} />
                                </div>

                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{ margin: '-1rem -1rem 0rem 0px' }}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container-fluid">

                                    <div className="row">
                                        <div className="col-sm-10" style={{ marginLeft: 'auto', marginRight: 'auto' }} >
                                            <h2 className="modelH2"> <img src={Switch} alt="Switch" />&nbsp;&nbsp;&nbsp;

                                                {t('translations:ossOnboardingTitle.Suggestedlanguage')}

                                            </h2>
                                            {/* {lang && langNode()} */}
                                            <br />
                                            <div className="row">

                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="language52" name="languageOnbording" value="en" defaultChecked={this.state.langSelected === "en" || this.state.langSelected === "en-US"} onClick={() => this.handleSelect("en")} />
                                                    <label htmlFor="language52">English</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="language53" name="languageOnbording" value="lv" defaultChecked={this.state.langSelected === "lv"} onClick={() => this.handleSelect("lv")} />
                                                    <label htmlFor="language53">Latvian</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="language59" name="languageOnbording" value="de" defaultChecked={this.state.langSelected === "de"} onClick={() => this.handleSelect("de")} />
                                                    <label htmlFor="language59">German</label>
                                                </div>

                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="language58" name="languageOnbording" value="it" defaultChecked={this.state.langSelected === "it"} onClick={() => this.handleSelect("it")} />
                                                    <label htmlFor="language58">Italian</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="language60" name="languageOnbording" value="pt" defaultChecked={this.state.langSelected === "pt"} onClick={() => this.handleSelect("pt")} />
                                                    <label htmlFor="language60">Portuguese</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="language606" name="languageOnbording" value="fr" defaultChecked={this.state.langSelected === "fr"} onClick={() => this.handleSelect("fr")} />
                                                    <label htmlFor="language606">French</label>
                                                </div>
                                                {/* <div className="col-md-3" id="step5chk1">
                                                    <input type="radio" id="language55" name="languageOnbording" value="at" defaultChecked={this.state.langSelected === "at"} onClick={() => this.handleSelect("at")} />
                                                    <label htmlFor="language55">Austrian</label>
                                                </div> */}
                                                <div className="col-md-3" id="step5chk1">
                                                    <input type="radio" id="language54" name="languageOnbording" value="sk" defaultChecked={this.state.langSelected === "sk"} onClick={() => this.handleSelect("sk")} />
                                                    <label htmlFor="language54">Slovak</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk1">
                                                    <input type="radio" id="language56" name="languageOnbording" value="ro" defaultChecked={this.state.langSelected === "ro"} onClick={() => this.handleSelect("ro")} />
                                                    <label htmlFor="language56">Romanian</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk1">
                                                    <input type="radio" id="language57" name="languageOnbording" value="pl" defaultChecked={this.state.langSelected === "pl"} onClick={() => this.handleSelect("pl")} />
                                                    <label htmlFor="language57">Polish</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk1">
                                                    <input type="radio" id="language51" name="languageOnbording" value="bg" defaultChecked={this.state.langSelected === "bg"} onClick={() => this.handleSelect("bg")} />
                                                    <label htmlFor="language51">Bulgarian</label>
                                                </div>

                                            </div>
                                            <br></br>
                                            <hr />
                                            <br></br>
                                            <h2 className="modelH2"> <img src={Switch} alt="Switch" />&nbsp;&nbsp;&nbsp;{t('translations:ossOnboardingTitle.Chooseyourcountry')} </h2>
                                            <br />

                                            <div className="row">
                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="country55" name="countryOnbording" value="Latvia" defaultChecked={this.state.selectedCountry === "Latvia"} onClick={() => this.handleSelectCountry("Latvia")} />
                                                    <label htmlFor="country55">Latvia</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="country51" name="countryOnbording" value="Italy" defaultChecked={this.state.selectedCountry === "Italy"} onClick={() => this.handleSelectCountry("Italy")} />
                                                    <label htmlFor="country51">Italy</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="country52" name="countryOnbording" value="Germany" defaultChecked={this.state.selectedCountry === "Germany"} onClick={() => this.handleSelectCountry("Germany")} />
                                                    <label htmlFor="country52">Germany</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="country53" name="countryOnbording" value="Portugal" defaultChecked={this.state.selectedCountry === "Portugal"} onClick={() => this.handleSelectCountry("Portugal")} />
                                                    <label htmlFor="country53">Portugal</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="country54" name="countryOnbording" value="France" defaultChecked={this.state.selectedCountry === "France"} onClick={() => this.handleSelectCountry("France")} />
                                                    <label htmlFor="country54">France</label>
                                                </div>

                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="country56" name="countryOnbording" value="Poland" defaultChecked={this.state.selectedCountry === "Poland"} onClick={() => this.handleSelectCountry("Poland")} />
                                                    <label htmlFor="country56">Poland</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="country57" name="countryOnbording" value="Spain" defaultChecked={this.state.selectedCountry === "Spain"} onClick={() => this.handleSelectCountry("Spain")} />
                                                    <label htmlFor="country57">Spain</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="country58" name="countryOnbording" value="Lithuania" defaultChecked={this.state.selectedCountry === "Lithuania"} onClick={() => this.handleSelectCountry("Lithuania")} />
                                                    <label htmlFor="country58">Lithuania</label>
                                                </div>
                                                <div className="col-md-3" id="step5chk">
                                                    <input type="radio" id="country59" name="country" defaultChecked={this.state.selectedCountry === "Austrian"} onClick={() => this.handleSelectCountry("Austrian")}/>
                                                    <label htmlFor="country59">Austrian</label>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <SelectLanguageModel residentsType={this.state.residentsType} selectedOssAdmin={this.state.selectedOssAdmin} />
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
        toggleLanguage: (lang) => {
            dispatch(toggleLanguage(lang));
        },
        toggleCountry: (countryName) => {
            dispatch(toggleCountry(countryName));
        }

    })
)((withTranslation('translations')(OnboardingResident)));


