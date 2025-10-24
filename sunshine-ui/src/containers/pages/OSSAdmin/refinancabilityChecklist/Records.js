import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {withRouter,Link} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import NavContainer from '../../../smartcomponents/ossnavcontainer';
import language_icon from '../../../../styles/assets/images/language-icon.png';

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
  Search as SearchIcon ,
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


import ReactTags from 'react-tag-autocomplete'
import './style.css';


class EESCalculatorView extends React.Component {

  

  constructor(props) {
    
    super(props);
    this.state = {
      userDataList: [],
      filter_type:'EES Checklist'
    
    }
    this.filter = this.filter.bind(this);
  }
  filter = (e) => {

    
    this.state.filter_type =e.target.value
             
      this.userListGet();
  }
  
  componentDidMount(){     
        this.userListGet();
  }
  userListGet(){
   
    const config = {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'text/plain' },
           
          };

          fetch(ENDPOINTS.SERVER + '/onboarding/user/data?oss_admin_id='+this.props.userdata.email +'&filter_type='+this.state.filter_type , config)
          .then(res => res.json())
         // .then((result) => result.length ? JSON.parse(text) : {})
          .then(
              (result) => {
              
                if (result.documents.length != 0) {                   
                    this.setState({
                        userDataList: result.documents
                         })
           
                 }else{
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
    const { userdata } = this.props;
    const menu_path = window.location.pathname.split('/')[3];
    return (
      <React.Fragment>
        
        <Helmet>
          <style>{
            'body {  -webkit-font-smoothing: antialiased;overflow-x: hidden;padding: .75rem 5px 0px 5px!important;background-color: #FDCF00 !important;font-family: Open Sans, sans-serif;font-style: normal;font-weight: 600;font-size: 14px;color: #2d3748; }audio,canvas,embed,iframe,img,object,svg,video {display: block;vertical-align: middle}'
          }</style>
        </Helmet>
        <div className="flex">
          <NavContainer />
          <div className="content oss-admin">
            <TopBar userdata={userdata} pageTitle='Simulation Tools' subTitle='Records'/>
            
            <div className="grid grid-cols-12 gap-6">
				 
				 <div className="intro-y col-span-12 lg:col-span-12">
                    <div className="intro-y box mt-1">
                            <div className="flex flex-col sm:flex-row items-center p-2 border-b border-gray-200 dark:border-dark-5">
                                  <div className="p-2" id="select-options">
                                <div className="preview">
                                    <div className="flex flex-col sm:flex-row items-center">
                                        <div className="sm:mt-2">
                                            <select className="input input--sm border mr-2" onChange={e =>this.filter(e)}>
                                          
                                                 <option value="EES Checklist">EES Checklist</option>
                                                <option value="EES Refinancability Checklist">EES Refinanceability Checklist</option>
                                              
												
                                            </select>
                                        </div>
                                       
                                        {/* <div className="ml-2">
                                          <button type="button" className="button bg-theme-1 text-white mt-1" style={{color: 'white',border: 'none'}}><SearchIcon  /></button>
                                        </div> */}
                                    </div>
                                </div>
                                
                            </div>
                                
                            </div>
							<hr/>
                          
                        </div>
					 </div>	
                       
                        <div className="col-span-12 mt-6">
                           
                            <div className="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">
                                <table className="table table-report sm:mt-2">
                                    <thead>
                                        <tr style={{ border: 'none' }}> 
                                        <th className="whitespace-no-wrap" style={{ border: 'none' }}>Name</th>
                                            <th className="whitespace-no-wrap" style={{ border: 'none' }}>Surname</th>
											
											
                                            <th className="text-left whitespace-no-wrap" style={{ border: 'none' }}>Email</th>
                                            <th className="text-left whitespace-no-wrap" style={{ border: 'none' }}>Country</th>
                                              <th className="text-left whitespace-no-wrap" style={{ border: 'none' }}>City</th>
                                              <th className="text-left whitespace-no-wrap" style={{ border: 'none' }}>Type</th>
                                              <th className="text-left whitespace-no-wrap" style={{ border: 'none' }}>Time</th>
                                         
                                           
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.userDataList.map((userInfo,userInfoKey, arr) => {
                                            return (<>
                                           
                                          
                                            <tr className="intro-x">
                                           
                                            <td style={{ border:'none' }}> <Link to={`/oss/simulation-tools/records/${userInfo.data.ID}`}> {userInfo.data.name} </Link> </td> 
                                            
                                            <td style={{ border:'none' }}> <Link to={`/oss/simulation-tools/records/${userInfo.data.ID}`}> {userInfo.data.surname}  </Link></td>
                                         
                                            <td style={{ border:'none' }}>  <Link to={`/oss/simulation-tools/records/${userInfo.data.ID}`}> {userInfo.data.email}  </Link></td>
                                            <td style={{ border:'none' }}> <Link to={`/oss/simulation-tools/records/${userInfo.data.ID}`}> {userInfo.data.country} </Link> </td>
                                            <td style={{ border:'none' }}> <Link to={`/oss/simulation-tools/records/${userInfo.data.ID}`}> {userInfo.data.city}  </Link></td>
                                            <td style={{ border:'none' }}> <Link to={`/oss/simulation-tools/records/${userInfo.data.ID}`}> {userInfo.data.menu_type}  </Link></td>
                                            <td style={{ border:'none' }}> <Link to={`/oss/simulation-tools/records/${userInfo.data.ID}`}> {userInfo.data.reg_date}  </Link></td>                                           
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
        </div>
      </React.Fragment>
    );

  }
}

export default connect(state => ({
  alerts: state.alerts.pending,
  userdata: state.user.profileInfo.data,
}))(EESCalculatorView);
