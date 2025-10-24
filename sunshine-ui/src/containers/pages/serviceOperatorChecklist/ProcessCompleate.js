import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
  Grid,
  makeStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';

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
} from '@material-ui/icons';


import '../../../styles/assets/css/bootstrap.min.css';
import '../../../styles/assets/css/stepwizard.css';
//images
import sunshunelogo from '../../../styles/assets/images/sunshune-logo.png';
import logo_footer2 from '../../../styles/assets/images/logo-footer2.png';
import Logo_europa_White from '../../../styles/assets/Logo_europa_White.png';
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

import {
  searchUsers as searchUsersAction,
  getUsersByPlatformRoles as getPRUsersAction,
} from '../../../actions/users';
import publicIp from 'public-ip';

import Vector1 from '../../../styles/assets/Vector1.png';
import snowflake_1 from '../../../styles/assets/snowflake_1.png';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
class ProcessComplete extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      hhhhhhhhhh: [],
      countLi: 0,

    }
    // this.countryChange = this.countryChange.bind(this);
    // this.residentsTypeChange = this.residentsTypeChange.bind(this);
    //this.onDelete =this.onDelete.bind(this);


  }
  componentDidMount() {
    this.getUserInputData();


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
  getUserInputData = () => {
    const config = {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },

    };


    
    fetch(ENDPOINTS.SERVER + '/onboarding/user/data/'+this.props.createdUserId, config)
    //fetch(ENDPOINTS.SERVER + '/onboarding/user/data/00c99a92-f66c-4409-97d8-b4898017b98a', config)
      .then(res => res.json())
      //.then((result) => result.length ? JSON.parse(text) : {})
      .then(
        (result) => {


          if (result != null) {
            this.setState({
              hhhhhhhhhh: [result],

            })
          }
        },

      ).catch(error => {
        //setTabStep([]);                
      });
  }
  render() {
    
    const { values } = this.state;
  
    return (
      <React.Fragment>
        <div className="row row-eq-height align-middle my-auto animate__animated animate__fadeInRight"  >
          
          <div  id="divToPrint" style={{ padding:'0.25rem',width:'100%',borderTop: '1px solid RED',display:'none'}}>

           
                    
                      {this.state.hhhhhhhhhh.map((data, index) => {
                        return (
                          <>
                         
                         <div style={{ height:'100px',width:'100%',backgroundColor:'#f2f4f6' }}>
                          <center>
                         <img src={logo_footer2} alt="EUROPA" style={{width:'170px' ,marginLeft: '240px',background:'#f2f4f6'}} /></center>
                         </div>
                       <br></br>
                       <br></br>
                       <table style={{ width: '100%',border:'none',background :'white' }}>
                                    
                                    <tr style={{ border:'none' ,background :'white',width: '100%'}}>
                                      <td style={{ border:'none' ,background :'white',width: '50%',fontSize: '13px',color:'#718096'}}>Name :- {data.data.name} {data.data.surname} </td>
                                      <td style={{ border:'none' ,background :'white',width: '50%',fontSize: '13px',color:'#718096'}}>Name of Organization :- {data.data.org_name}</td>
                                    

                                    </tr>
                                    <tr style={{ border:'none' ,background :'white',width: '100%'}}>
                                      <td style={{ border:'none' ,background :'white',width: '50%',fontSize: '13px',color:'#718096'}}>Email :- {data.data.email}</td>
                                      <td style={{ border:'none' ,background :'white',width: '50%',fontSize: '13px',color:'#718096'}}>Registration number :- {data.data.reg_number}</td>
                                    </tr>
                                    <tr style={{ border:'none' ,background :'white',width: '100%'}}>
                                      <td style={{ border:'none' ,background :'white',width: '50%',fontSize: '13px',color:'#718096'}}>Country :- {data.data.country}</td>
                                      <td style={{ border:'none' ,background :'white',width: '50%',fontSize: '13px',color:'#718096'}}>VAT number :- {data.data.vat_number}</td>
                                    
                                    </tr>
                                    <tr style={{ border:'none' ,background :'white',width: '100%'}}>
                                      <td style={{ border:'none' ,background :'white',width: '50%',fontSize: '13px',color:'#718096'}}>City :- {data.data.city}</td>
                                      <td style={{ border:'none' ,background :'white',width: '50%',fontSize: '13px',color:'#718096'}}>Address :- {data.data.address}</td>
                                    
                                    </tr>
                                    <tr style={{ border:'none' ,background :'white',width: '100%'}}>
                                      <td style={{ border:'none' ,background :'white',width: '50%',fontSize: '13px',color:'#718096'}}>Post Code :- {data.data.post_code}</td>
                                      <td style={{ border:'none' ,background :'white',width: '50%',fontSize: '13px',color:'#718096'}}></td>
                                    
                                    </tr>
                                    
                                  </table>
                     
                                                                                        
                                <hr style={{ borderTopWidth: '1px',color: '#000000' }}></hr>
                            {data.data.data_inputs.sort((a, b) => a.CreatedAt > b.CreatedAt ? 1 : -1).map((c, i) => (
                            
                             <div className="col-span-12 sm:col-span-12 xxl:col-span-12 box p-1" style={{ padding:'0.25rem' }}>
                                        <label style={{ display:'inline-block',marginBottom:'0.5rem',color: '#000000',fontWeight: '500',fontSize: '11.602px'}}>Q{i +1}. {c.field_title}</label>
                                        <div className="text-gray-600 mt-1" style={{marginBottom:'0.5rem',fontSize: '13px',color:'#718096' }}>Answer. {c.field_value}</div>
                                      </div>
                              
                            ))}

                          </>
                        );
                      })}




          </div>

          <div className="col-md-12">            
            <section className="signup-step-container" style={{ marginTop: '10px', marginBottom: '0px' }}>
              <div className="container">
                <div className="row d-flex ">
                  <div className="col-md-12">
                    <div className="content-style2">
                      <div className=" mb-5">
                       
                      <div className=" mb-5 mt-5">
																		<h2>Thank you for filling in the questionnaire. </h2>
																		<br/>
																		<div style={{fontWeight: '500',fontSize: '20px'}}>
																			<p style={{marginBottom: '0px',marginTop: '0px',textAlign: 'left'}}>We will contact you shortly. </p>
																			<p style={{marginBottom: '0px',marginTop: '0px',textAlign: 'left'}}>Check out the EES project Refinanceability! </p>
																		</div>
																	</div>
																	
																	
																	 <div className="d-block">
                                   <Link to={`/ees_calculator`} className="btn btn-primary btn-md btn-default welcomeButtone" style={{ lineHeight: '50px' }}>Go to Service Operator Checklist</Link>
																	 &nbsp;&nbsp;&nbsp;
                                       <button  className="btn btn-primary btn-md btn-default welcomeButtone" data-toggle="modal" data-target="#pdfDownloadDetails" >Download  PDF</button>
                       
																	</div>
																	
																	<div className="mb-5 mt-5">
															
																		<div style={{fontWeight: '500',fontSize: '20px'}}>
                                    <p style={{marginBottom: '0px',marginTop: '0px',textAlign: 'left'}}>Or Visit</p>
																			
																		</div>
																	</div>
																	
																	 <div className="row mt-5 mb-5">
																	  <div className="col-md-4" STYLE={{background: '#fff',border: 'solid 1px #BFD4E460'}}>
																		
																		  <div className="row  row-eq-height" style={{padding: '10px'}}>
																			<div className="col-md-5">
																			  <img src={sunshunelogo} alt="" />
																			</div>
																			
																		  </div>
																		  <div className="content-text mt-2 text-left" style={{color: '#4B4B4A',fontWeight: '600',padding: '10px'}}>
																			Sunshine 
																		  </div>
																		  <div className="content-text mt-1 text-left" style={{padding: '10px'}}>
																			Lorem Ipsum is simply dummy text of the printing and typesetting industry.
																			
																			
																		  </div>
																		  
																		 <a href="" style={{color: '#f8b309',fontWeight: '600',padding: '10px'}}>Read more</a>
																		<br/>
																	  </div>
																	 <div className="col-md-4" STYLE={{background: '#fff',border: 'solid 1px #BFD4E460'}}>
																		
																		  <div className="row  row-eq-height" style={{padding: '10px'}}>
																			<div className="col-md-5">
																			  <img src={sunshunelogo} alt="" />
																			</div>
																			
																		  </div>
																		  <div className="content-text mt-2 text-left" style={{color: '#4B4B4A',fontWeight: '600',padding: '10px'}}>
																			Europa
																		  </div>
																		  <div className="content-text mt-1 text-left" style={{padding: '10px'}}>
																			Lorem Ipsum is simply dummy text of the printing and typesetting industry.
																			
																			
																		  </div>
																		  
																		 <a href="" style={{color: '#f8b309',fontWeight: '600',padding: '10px'}}>Read more</a>
																		<br/>
																	  </div>
																	 
																	</div>

                      
                        
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>

            </section>
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
        </div>
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
  }),
  dispatch => ({

    getPRUsers: () => dispatch(getPRUsersAction()),

  })
)(ProcessComplete);
