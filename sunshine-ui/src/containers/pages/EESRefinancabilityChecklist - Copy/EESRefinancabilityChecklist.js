import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {withRouter,Link} from 'react-router-dom';
import {
    Grid,
    makeStyles,
} from '@material-ui/core';

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
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon 
} from '@material-ui/icons';


import '../../../styles/assets/css/bootstrap.min.css';
import '../../../styles/assets/css/stepwizard.css';
//images
import logo_footer2 from '../../../images/3SUNShiNE_Black.svg';
import Logo_europa_White from'../../../images/3SUNShiNE_Black.svg';
import calculaadora from '../../../styles/assets/calculaadora.png';
import quizHomeIcon from '../../../styles/assets/quizHomeIcon.png';

import icon_calc from '../../../styles/assets/images/icon-calc.png';
import energy_drivers from '../../../styles/assets/energy_drivers.png';
import economic_text from '../../../styles/assets/economic_text.png';
import bolt_1 from '../../../styles/assets/bolt_1.png';
import database from '../../../styles/assets/database.png';
import pdf_logo2 from '../../../styles/assets/images/logo-footer2.png';

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
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';

class EESRefinancabilityChecklist extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            ossAdminData: [],
            selectedOssData: [],
            isFormSubmit: false,
            selectedCountry: this.props.country,
            selectedOssAdmin: '',
            fetching: false,
            residentsType:'EES Refinancability Checklist',
            postCode:'',
            stepData:[],
            userInputDataGet: [],
            createdUserId:'',
            questionData: {                         
                field_id:'',
                field_value:[],
                field_title:'',                               
                   
                   }, 
                   hobbies:[], 
        }
        
     
        
    }
    componentDidMount() {
      this.ossList();   
      
  }

//   componentDidUpdate() {
//       this.getOssStep();
//     }

 
  formFiledDataSave = (e,filedId,filedTitle,default_score) => {

    
       const fieldName = e.target.name;
       const key = e.target.key;
       let value     = e.target.value;
       let  default_score_value = 0;
       if(value === 'Yes' || value === 'yes'){

          default_score_value = Number(default_score);
       }
      
      
       
         let config = {
           method: 'POST',
           credentials: 'include',
           headers: { 'Content-Type': 'text/plain' },
           body: JSON.stringify({
             "session":localStorage.getItem('userBasicSession'),
             "field_id":filedId,
             "field_value": value,
             "field_title":filedTitle,
             "default_score":default_score_value,
             "lang": this.props.language?this.props.language:'en',
             "user_id":this.state.createdUserId,
             "oss_admin_id": this.state.selectedOssAdmin,
             "country":  this.props.country,
             "menu_type": this.props.residentsType
           })
         }

        
          fetch(ENDPOINTS.SERVER + '/user/input/data', config)
             .then(status => status.json().then(data => ({ data, status })))
             .then(({ data, status }) => {
            
              //  alert({
              //    text: 'Add New Field Successfully',
              //    type: 'success',
              //    delay: 800,
              //    closer: true
              //  });
             
              
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
  userCreate = () => {

      
      let config = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          "name":this.props.userdata.name,
          "surname":'',
          "email":this.props.userdata.email,
          "phone_number":this.props.userdata.telephone,
          "city": '',
          "country":  this.props.userdata.country,
          "post_code":'',
          "menu_type": this.state.residentsType,
          "lang": this.props.language?this.props.language:'en',
          "oss_admin_id":this.state.selectedOssAdmin,
          "reg_date":"2022-05-25T00:00:00Z",
          "user_id":this.props.userdata.ID
        })
      }
     
  
       fetch(ENDPOINTS.SERVER + '/onboarding/user/data', config)
          .then(status => status.json().then(data => ({ data, status })))
          .then(({ data, status }) => {
              
           this.setState({
             createdUserDetails: data,
             
           })   
          
           this.state.createdUserId = data.data.ID;

                        this.forceUpdate()
           
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


 printDocument() {
  //const input = document.getElementById('divToPrint');

      const doc = new jsPDF();
     
      //get table html
      const pdfTable = document.getElementById('divToPrint');
      //html to pdf format
      // var html = htmlToPdfmake(`<table style="width:100%;">
      //                           <tr style="height:100px;width:100%;">
      //                             <td>height:100px / width:250px</td>
      //                             <td>height:100px / width:'auto'</td>
      //                           </tr>
      //                           <tr>
      //                             <td >Here it will use 250px for the width because we have to use the largest col's width</td>
      //                             <td style="height:200px">height:200px / width:'auto'</td>
      //                           </tr>
      //                         </table>`, {
      //                           tableAutoSize:true
      //                         });
    var html = htmlToPdfmake(pdfTable.innerHTML ,{
      tableAutoSize:true
    });
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
  

    lastStepSubmit = (stepIndex,prvStep,activeTabeCount,oooo,lllll) => {
      let uuuu = oooo;
      if (this.validate(uuuu,lllll)){
         
        this.setState({
            fetching:true,
            
          }) 
          let ttt = activeTabeCount- 1;
     
      $(".tab-pane").removeClass("active show");
      //$('#'+prvStep).removeClass('active show');
       $('#'+stepIndex).addClass('active show');
       $(".nav-link").removeClass("active show");
       
       $('li[id=tabStep-' + activeTabeCount + ']').find('a').addClass("active show")
       //tabStep-2
       //$('#customeTab > .nav-item > .active').next('li').find('a').trigger('click');
       $("#customeTab > li:has(a[href='#tab-" +activeTabeCount+ "']):first()").find('a').addClass("active show");
       this.getUserInputData();
       $("#output").text('');

       this.setState({
              fetching:false,        
           })
        } 
     
    
    }
     validate=(currentTab,activeTabeCount) => {
      let val = true;
     
      let select = document.getElementById(currentTab);
      
      select.querySelectorAll('#radio-container'+activeTabeCount).forEach(function(container) 
      {
    
        let radioChecked = container.querySelectorAll("input:checked");
        //container.style.backgroundColor = "white";
       
        if(!radioChecked.length) {
          val = val && false;
          document.querySelector('#output').innerText = "Please select all answer";
         // container.append(" <b>Appended text</b>.");;
        }
      });
      return val;
    }
    handleNextStep = (stepIndex,prvStep,activeTabeCount) => {
      let tttll = stepIndex- 1;
        let uuuu = prvStep;
      if (this.validate(uuuu,activeTabeCount)){
        this.setState({
            fetching:true,
            
          })
         
           $(".tab-pane").removeClass("active show");
           
            $('#'+stepIndex).addClass('active show');
            $(".nav-link").removeClass("active show");
            
            $('li[id=tabStep-' + activeTabeCount + ']').find('a').addClass("active show")
           
            $("#customeTab > li:has(a[href='#tab-" +activeTabeCount+ "']):first()").find('a').addClass("active show");

            $("#output").text('');

            this.setState({
                fetching:false,
                
              })
         } 
     
    
    }
    
    handlePrevStep = (stepIndex,prvStep,activeTabeCount) => {
      let activeTbale = activeTabeCount;
      let kkk = prvStep - 1;
   
        $(".tab-pane").removeClass("active show");
       // $('#'+stepIndex).removeClass('active show');
        $('#tab-'+kkk).addClass('active show');

        $(".nav-link").removeClass("active show");

        $('li[id=tabStep-' + activeTbale + ']').find('a').addClass("active show");

     
    }

    getUserInputData = () => {
      const config = {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'text/plain' },
  
      };
 
      fetch(ENDPOINTS.SERVER + '/onboarding/user/data/'+this.state.createdUserId, config)
        .then(res => res.json())
        //.then((result) => result.length ? JSON.parse(text) : {})
        .then(
          (result) => {
  
  
            if (result != null) {
              this.setState({
                userInputDataGet: [result],
  
              })
            }
          },
  
        ).catch(error => {
          //setTabStep([]);                
        });
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

                      let resultData = result.filter(item => item.country === this.state.selectedCountry)
                     
                      
                          
                         
                      if(resultData.length === 0){
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

                      // let resultData = result;
                     
                      
                      //     this.setState({
                      //         ossAdminData: resultData,
                      //         selectedOssData: resultData[0],
                      //     })
  
                      //     this.state.selectedOssAdmin = resultData[0]? resultData[0].email:'';
  
                      //     this.forceUpdate()

                          this.getOssStep();

                          this.userCreate();

                  }else{

                      this.state.selectedOssAdmin = '';

                      this.forceUpdate()
                  }
              }
          )

  }

  getOssStep =()=>{
    this.setState({
        fetching:true,
        
      })
      const config = {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            "oss_admin_id":this.state.selectedOssAdmin,
            "lang": this.props.language?this.props.language:'en',    
            "menu_type":this.state.residentsType                 
          })
        };
        
        fetch(ENDPOINTS.SERVER + '/onboarding/residents/step', config)
            .then(res => res.json())
           // .then((result) => result.length ? JSON.parse(text) : {})
            .then(
                (result) => {   
                  ;
                  if (result != null) {
                       this.setState({
                          stepData: result.documents,
                          
                        })                                                    
                      }
                      this.setState({
                        fetching:false,
                        
                      })
                },                  
            ).catch(error => {
              //setTabStep([]);                
          });
  }
  ossAdminChange = (fieldValue) => {
    this.setState({
        fetching:true,
        
      }) 
         
      //let resultData = this.stat.ossAdminData.filter(item => item.country == this.state.selectedCountry && item.email == fieldValue)
      this.state.selectedOssAdmin = fieldValue;
     // this.state.selectedOssData = resultData;
      this.forceUpdate()
      this.getOssStep();


  }

   refreshPage= (event) => {
      window.location.reload(false);
    }

    render() {
    
        let { isFormSubmit, ossAdminChange,fetching, ossEmail, selectedOssData, residentsType, selectedOssAdmin,postCode, selectedResidentsTypeChange, selectedCountry, ossAdminData } = this.state;
        let count = 0;
        let uuu =1;   
        let countStep = 3;
        let count1 = 0;
        let basicSubCount = 0;
        let radioButtonCount =0;
        let nextStepcount = 4;
        let prvStepcount = 3;    
        let backnextStepcount = 4;
        let backprvStepcount = 3;    
        let activeTable =1;
        let questionCount =1;
        let yesCount =0;

        let startQ = 0;
        let endQ   = 7;
        let questionsCount = 3;
      
       

        const final = [];
           for (let i = 0; i <= questionsCount; i++) {
             let activeTabeCount = activeTable++;
             let pppp = nextStepcount++;
             let kkkk = prvStepcount++;
             

             final.push(<>
               <div className={i === 0  ? "tab-pane active show" : "tab-pane"} id={'tab-' + countStep++} key={i}>
                     <div className="row mb-2">
                         <div className="col-md-12 mb-2 mt-2"> 
                           <div className="p-1" id="basic-button">
                                   <div className="preview" style={{ float: 'RIGHT', marginRight: '40px'}}>
                                      
                                       <button className="button w-24 mr-2 mb-2 bg-gray-200 text-gray-600" style={{background:'rgb(255 255 255)',fontFamily:'Inter',fontStyle:'normal',fontWeight:'900',width: '63px',height: '31px',fontSize:'12px',alignItems:'center' ,textAlign:'center',color: 'rgb(85 103 117)' }}>Yes</button>
                                       <button className="button w-24 mr-4 mb-2 bg-gray-200 text-gray-600" style={{background:'rgb(255 255 255)',fontFamily:'Inter',fontStyle:'normal',fontWeight:'900',width: '63px',height: '31px',fontSize:'12px',alignItems:'center' ,textAlign:'center',color: 'rgb(85 103 117)' }}>No</button>
                                     
                                   </div>   
                                                         
                               </div>
                         </div>
                       </div>
                      
                       
                       {this.state.stepData.map((stepData, stepKey) => {     
                                            
                                        return (<>                     
                                         {stepData.data.questions.sort((a, b) => a.CreatedAt > b.CreatedAt  ? 1 : -1).slice(startQ, endQ).map((questionData,questionsKey, arr) => {
                                                 
                                                
                                               
                                                                     let yyy = backnextStepcount++;
                                                                     let oooo = backprvStepcount++;
                                               return (<>
                                                             
                                                       
                                                    
                                                    {questionData.step_fields.map((c, i) => {
                                                                                          
                                                        return (<>
                                                             
                                                                     <div className="row mb-1" >
                                                                             <div className="col-md-12 mb-1 mt-2"> 
                                                                               <div className="intro-y">
                                                                                     <div className="inbox__item inline-block sm:block text-gray-700 dark:text-gray-500 bg-gray-100 dark:bg-dark-1 border-b border-gray-200 dark:border-dark-1 ">
                                                                                         <div className="flex px-5 py-1 ">
                                                                                         <div className="w-64 sm:w-auto truncate " dangerouslySetInnerHTML={{__html: questionCount++ +'.' + questionData.name}} style={{whiteSpace: 'unset'}}/>
                                                                                             
                                                                                             <div className="inbox__item--time whitespace-no-wrap ml-auto pl-10 " id={'radio-container'+activeTabeCount}>
                                                                                                 
                                                                                                 
                                                                                                                     {(() => {
                                          
                                                                                                                                     if (c.input_type === 'Radio Type Button') {      

                                                                                                                                         return <>
                                                                                                                                                 {c.options.map((optionValue, optionKey) => (    
                                                                                                                                                                                                                                                                                                                                                                             
                                                                                                                                                                 <> 
                                                                                                                                                                                                            
                                                                                                                                                                 <input type="radio" id={optionValue.ID} className="input  mr-5 "  style={{ border: '1px solid #0b0c0c' }} onChange={(e) => this.formFiledDataSave(e,optionValue.ID,questionData.name,c.default_score)}  name={c.ID} value={optionValue.option_value}/>
                                                                                                                                                                 </>
                                                                                                                                                                 ))
                                                                                                                                             }       
                                                                                                                                                 </>                                                                                                                                                                                                
                                                                                                                                     }    
                                                                                                                                     
                                                                                                                                 })()}
                                             
                                             
                                             
                                                                                                 </div>
                                                                                         </div>
                                                                                     </div>
                                                                                 </div>
                                                                             </div>
                                                                             </div>  
                                                             

                                                             </>);
                                                             
                                                                                                                             })}
                                                               <hr></hr>
                                                              
                                                           

                                                      
                                                               </>);

                                                               
                                                   
                                                    }
                                                    
                                            )
                                            }   
                                            <br></br>
                                                                                                               
                                            </>   
                                                                                 
                               );}                                          
                             )}
                            {(() => {
                                   if ( i ===  questionsCount) {
                                       return<ul className="list-inline pull-left">                                                                
                                       <li> <button type="button"
                                           className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.lastStepSubmit('tab-88','tab-7',8,'tab-' + kkkk,activeTabeCount)}>Submit</button>
                                       </li>
                                     </ul>
                                     
                                   }else {
                                       return<ul className="list-inline pull-left">                                                                
                                       <li> <button type="button"
                                           className="btn btn-primary btn-md btn-default next-step-sub" onClick={() => this.handleNextStep('tab-' + pppp,'tab-' + kkkk ,activeTabeCount)}>Continue</button>
                                       </li>
                                     </ul>
                                   }

                                   
                             })()}  
                          </div>
                          
                         </>)
                         startQ += 7;
                         endQ   += 7;
                      
           }
        return (
            <React.Fragment>
                <main role="main" className="h-auto">
                    <EESNavigationMenu />
                    <section style={{ marginTop: '0px', marginBottom: '0px' }}>
                        <div className="container h-auto" style={{ width: '100%', maxWidth: '100%' }}  >
                            <div className="row row-eq-height" style={{ background: '#F5F7FA', minHeight: '100vh' }} >
                                <div className="col-md-3 pl-0 animate__animated animate__fadeInLeft" id="EEScalculator" style={{ paddingRight: '15px', paddingLeft: '15px' }}>
                                    <div className="row">
                                        <div className="col-md-12 mb-3 mt-2 text-center">
                                        <Link to={`/`}><img src={logo_footer2} alt="EUROPA"style={{ height: '200PX' }} /></Link>
                                        </div>
                                        <div className="col-md-12 mb-3 text-center ">
                                            <h2 className="welcomeTitle mt-5 mb-5"> Welcome to <br />THE EUROPA PROJECT</h2>
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
                                        {/* <ul className="nav nav-tabs flex-column mb-3" id="customeTab">
                                    {this.state.stepData.map((stepData, stepKey) => (
                                      
                                      <>
                                     <li className="nav-item" key={stepKey} id={'tabStep-'+count++} >
                                                       <a className={stepKey === 0 ? "nav-link active show" : "nav-link"} readOnly  style={{ lineHeight: '20px' }}>                                                              
                                                           <div className="nav-item-title" style={{fontFamily:'Inter',fontStyle:'normal',fontWeight:'600',fontsize:'11.50833px',lineHeight:'11px',color:'rgba(35, 31, 32, 0.5)'  }}><div className="circle">{uuu++}</div>&nbsp;&nbsp;{stepData.data.name}</div>
                                                      </a>
                                                  </li>

                                     
                            
                                 </>
                           ))}

                                             
                                            </ul>    */}
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
                                        <div className="col-md-12" style={{ paddingRight: '15px', paddingLeft: '15px' }}>
                                       
                                            <NavContainer ossAdminChange={this.ossAdminChange.bind(this) }  selectedOssValue={ossEmail} ossAdminData={ossAdminData} />
                                        </div>
                                        <div className="col-md-12">
                                           <hr/>
                                        </div>
                                    </div>

                                    <div className="row row-eq-height align-middle my-auto animate__animated animate__fadeInRight"  style={{ position: 'absolute',zIndex:'0',width: '100%' }}>

<div className="col-md-12">
<section className="signup-step-container" style={{ marginTop:'10px',marginBottom:'0px' }}>
   <div className="container">
       <div className="row d-flex ">
           <div className="col-md-12">
               <div className="wizard">
               <div className="tab-content">
                       <p id="output" style={{ color:'red',fontSize: '14px',marginTop: '10px' }}></p>
                       {this.state.fetching?
                                              <ProgressBar />
                                             :
                                            <>
                       {final}

                       
                                    
                      
                                    <div className="tab-pane"  id='tab-88' >
                                    <div className="px-5 sm:px-20 pb-10 sm:pb-5 flex flex-col-reverse sm:flex-row">
                                           <div className="text-center sm:text-left mt-10 sm:mt-0">
                                           <button className="button text-white bg-theme-1 shadow-md mr-2" data-toggle="modal" data-target="#pdfDownloadDetails" >Download PDF</button>
                                         
                                           <button className="button text-white bg-theme-1 shadow-md mr-2" onClick={this.refreshPage}>Restart</button>
                                           
                                           </div>
                                          
                                       </div>
                                            <div className="intro-y box overflow-hidden mt-2" style={{ maxHeight: '600px',overflow: 'auto' }}>
                                          
                                              
                                                <div className="px-5 sm:px-16 py-10 sm:py-10">
                                                    <div className="overflow-x-auto">
                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th className="border-b-2 dark:border-dark-5 whitespace-no-wrap" style={{ width:'30px' }}>Question</th>
                                                                    <th className="border-b-2 dark:border-dark-5 text-right whitespace-no-wrap">Yes</th>
                                                                    <th className="border-b-2 dark:border-dark-5 text-right whitespace-no-wrap">No</th>
                                                                   
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                            {this.state.userInputDataGet.map((data, index) => {
                                                                        return (
                                                                        <>
                                                                        
                                                                        
                                                                            {data.data.data_inputs.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1 : -1).map((c, i) => {
                                                                                if (c.field_value === 'Yes' || c.field_value === 'yes') {
                                                                                     yesCount += c.default_score;
                                                                                }
                                                                              return (
                                                                                <><tr>
                                                                                        <td className="border-b dark:border-dark-5 w-32" style={{ width:'80%' }}>
                                                                                            Q{i +1}.{c.field_title}
                                                                                            
                                                                                        </td>
                                                                                        {(() => {
                                                                                                    if (c.field_value === 'Yes' || c.field_value === 'yes') {
                                                                                                        return  <td className="text-right border-b dark:border-dark-5 w-32"><CheckCircleIcon style={{color: '#06cd06'}}/></td>
                                                                                                        
                                                                                                    }else{
                                                                                                        return  <td className="text-right border-b dark:border-dark-5 w-32">-</td>
                                                                                                    

                                                                                                    }
                                                                                                })()} 
                                                                                            {(() => {      
                                                                                                    if (c.field_value === 'Yes' || c.field_value === 'yes') {
                                                                                                        return  <td className="text-right border-b dark:border-dark-5 w-32">-</td>
                                                                                                    
                                                                                                    }else{
                                                                                                        return  <td className="text-right border-b dark:border-dark-5 w-32"><CancelIcon style={{color: 'red'}}/></td>
                                                                                                    

                                                                                                    }
                                                                                            })()} 
                                                                                        
                                                                                        
                                                                                    </tr>
                                                                         </>
                                                                        );
                                                                            
                                                                                })}

                                                                        </>
                                                                        );
                                                                    })}
                                                               
                                                              
                                                               
                                                                
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                {/* <div className="px-5 sm:px-20 pb-10 sm:pb-5 flex flex-col-reverse sm:flex-row">
                                                    
                                                    <div className="text-center sm:text-right sm:ml-auto">
                                                        <div className="text-base text-gray-600">Result</div>
                                                        <div className="text-xl text-theme-1 dark:text-theme-10 font-medium mt-2">{yesCount}</div>
                                                     
                                                    </div>
                                                </div> */}
                                            </div>
                
                                          
                                            <div  id="divToPrint" style={{ padding:'0.25rem',width:'100%',borderTop: '1px solid RED',display:'none'}}>
                               
                               {this.state.userInputDataGet.map((data, index) => {
                                   return (
                                   <>
                                    <table style={{ width: '100%',border:'none',background :'white' }}>
                                       <tr style={{ border:'none' ,background :'white',width: '100%'}}>
                                           <td style={{ border:'none' ,background :'white',width: '50%',fontSize: '13px',color:'#718096'}}> <img src={pdf_logo2} alt="EUROPA" style={{width:'170px',height: '80px',padding :'0px'}} /> </td>
                                           <td style={{ border:'none' ,background :'white',width: '50%',fontSize: '13px',color:'#718096',textAlign: 'right'}}>EES Refinanceability Checklist</td>
                                       </tr>
                                       </table>
                                   
                                       <p  style={{ display:'inline-block',marginBottom:'0.5rem',fontSize: '20px',color:'Black',textAlign: 'center',width: '100%',fontWeight: '900'}}>Information regarding the User </p>
                                       <br></br>
                                       <div className="text-lg font-medium text-theme-1 dark:text-theme-10 mt-2" style={{ display:'inline-block',marginBottom:'0.5rem',fontSize: '13px',color:'#718096'}}><span style={{color:'Black',fontWeight: '900'}}>Name :</span> {data.data.name} {data.data.surname}  </div>
                                       <div className="mt-1" style={{ display:'inline-block',marginBottom:'0.5rem',fontSize: '13px',color:'#718096'}}><span style={{color:'Black',fontWeight: '900'}}>Email :</span> {data.data.email}</div>
                                       <div className="mt-1" style={{ display:'inline-block',marginBottom:'0.5rem',fontSize: '13px',color:'#718096'}}><span style={{color:'Black',fontWeight: '900'}}>Country :</span> {data.data.country}</div>
                   
                                       
                                                                           
                                                                               
                                       <p  style={{ display:'inline-block',marginBottom:'0.5rem',fontSize: '20px',color:'Black',textAlign: 'center',width: '100%',fontWeight: '900'}}> Answers to the EES Refinanceability Checklist</p>
                                       <br></br>
                                      
                                       <table className="table" style={{ width: '100%',border:'none',background :'white' }}>
                                      
                                       <tbody>
                                       <tr style={{ border:'none' ,background :'white',width: '100%',marginBottom:'20px'}}>
                                               <td  style={{ width: '80%',border:'none' ,background :'white', }}></td>
                                               <td  style={{ border:'none' ,width: '15%',background :'white',fontSize: '13px',color:'black'}} >Yes</td>
                                               <td style={{ border:'none' ,width: '15%',background :'white',fontSize: '13px',color:'black'}}>No</td>
                                              
                                           </tr>
                                       {this.state.userInputDataGet.map((data, index) => {
                                          
                                                   return (
                                                   <>
                                                   
                                                   
                                                   {data.data.data_inputs.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1 : -1).map((c, i) => {
                                                            let poipi =  i +1;
                                                           
                                                         return (
                                                           <><tr style={{ border:'none' ,background :'white',width: '100%'}}>
                                                                   <td className="essChecklistquestions" style={{ border:'none' ,background :'white',width: '80%',fontSize: '13px',color:'Black',fontWeight: '900'}}  dangerouslySetInnerHTML={{__html: c.field_title}}>
                                                                     
                                                                       
                                                                   </td>
                                                                   {(() => {
                                                                               if (c.field_value === 'Yes' || c.field_value === 'yes') {
                                                                                   return  <td style={{ border:'none' ,background :'white',width: '15%',verticalAlign:'middle'}} ><span style={{ fontSize: '13px',fontWeight: '900',color:'green',marginTop:'50px'}}>Yes</span></td>
                                                                                   
                                                                               }else{
                                                                                   return  <td style={{ border:'none' ,background :'white',width: '15%'}} ></td>
                                                                               

                                                                               }
                                                                           })()} 
                                                                       {(() => {      
                                                                               if (c.field_value === 'Yes' || c.field_value === 'yes') {
                                                                                   return  <td style={{ border:'none' ,background :'white',width: '15%'}} ></td>
                                                                               
                                                                               }else{
                                                                                   return  <td style={{ border:'none' ,background :'white',width: '15%',verticalAlign:'middle'}} ><span style={{ fontSize: '13px',fontWeight: '900',color:'red',marginTop:'20px'}}>No</span></td>
                                                                               

                                                                               }
                                                                       })()} 
                                                                   
                                                                   
                                                               </tr>
                                                    </>
                                                   );
                                                       
                                                           })}

                                                   </>
                                                   );
                                               })}
                                          
                                         
                                          
                                           
                                       </tbody>
                                   </table>


                                   </>
                                   );
                               })}
                               

                   </div>
                                    </div>

                                    </>}
                       </div>



               </div>
           </div>

       </div>
   </div>
   
</section>
</div>
</div>



                                    <EESFooter />
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="pdfDownloadDetails" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content" style={{width: '416px',height: '300px' }}>
                    <div className="modal-header" style={{background: '#FCCB00'}}>
                        <center>
                            <h5 className="modal-title" style={{padding: '1rem',margin:'-1rem -1rem -1rem 7rem',textTransform: 'uppercase',fontFamily: 'Poppins',fontStyle: 'normal',fontWeight: 'bold',fontSize: '16.1691px',color:'#FFFFFF'}}>Download  PDF </h5>
                        </center>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                            style={{padding: '0px',margin: '0px'}}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <h2 className="mb-3" style={{fontFamily: 'Inter',fontStyle: 'normal',fontWeight: '800',fontSize: '18.0073px',lineHeight: '32px',textAlign: 'center',color: '#4B4B4A'}}>Do you want to download result?</h2>

                        <hr  className="mb-3" style={{borderTop: '1px solid #FBC304'}}/>
                        <div className="row mt-5" style={{marginLeft: 'auto',marginRight: 'auto'}}>

                            <div className="col-md-12 mb-4 ">
                                
                                <input type="text" className="form-control modelTextbox" placeholder="Enter Email" style={{fontSize: '14.3482px'}}/>
                            </div>
                            
                        </div>
                        <div className="px-5 py-3 text-right border-t border-gray-200 dark:border-dark-5">
                          <center>
                        <button type="button" className="button w-20 bg-theme-1 text-white" data-dismiss="modal"  onClick={this.printDocument}>Yes</button>&nbsp;&nbsp;&nbsp;
                              <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-1">No</button>
                              </center>
                       </div>
                      
                    </div>

                </div>
            </div>
            </div>
                    </section>
                </main>
                <SelectLanguageModel residentsType={this.state.residentsType} selectedOssAdmin={ this.state.selectedOssAdmin}/>
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
)(EESRefinancabilityChecklist);


