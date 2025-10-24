import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
    Grid,
    makeStyles,
} from '@material-ui/core';


import ProgressBar from '../../../../../../components/utils/ProgressBar';
import NavContainer from '../../../../../smartcomponents/EESNavcontainer';
import EESFooter from '../../../../../smartcomponents/EESFooter';
import SelectLanguageModel from '../../../../../smartcomponents/SelectLanguageModel';
import EESNavigationMenu from '../../../../../smartcomponents/EESNavigationMenu';

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


import '../../../../../../styles/assets/css/bootstrap.min.css';
import '../../../../../../styles/assets/css/stepwizard.css';
//images
import logo_footer2 from '../../../../../../styles/assets/images/logo-footer2.png';
import Logo_europa_White from '../../../../../../images/3SUNShiNE_Black.svg';
import calculaadora from '../../../../../../styles/assets/calculaadora.png';
import quizHomeIcon from '../../../../../../styles/assets/quizHomeIcon.png';

import icon_calc from '../../../../../../styles/assets/images/icon-calc.png';
import energy_drivers from '../../../../../../styles/assets/energy_drivers.png';
import economic_text from '../../../../../../styles/assets/economic_text.png';
import bolt_1 from '../../../../../../styles/assets/bolt_1.png';
import database from '../../../../../../styles/assets/database.png';


import getCookie from '../../../../../../components/utils/getCookie';


import { useSelector } from 'react-redux';
import ENDPOINTS from '../../../../../../constants/endpoints';
import { setCalcMenuItems } from '../../../../../../actions/calcmenu';

import {
    searchUsers as searchUsersAction,
    getUsersByPlatformRoles as getPRUsersAction,
} from '../../../../../../actions/users';
import publicIp from 'public-ip';



class OssStep extends React.Component {



    render() {   
       
   let count = 0;
   let uuu =2;
    return (
        <React.Fragment>
           
                                    <ul className="nav nav-tabs flex-column mb-3" id="customeTab">
                                   
                                    <li className="nav-item" id="tabStepOne">
                                        <a className="nav-link"  title="Basic information" readOnly style={{ lineHeight: '20px' }}>
                                           
                                             <div className="nav-item-title" style={{fontFamily:'Inter',fontStyle:'normal',fontWeight:'600',fontsize:'11.50833px',lineHeight:'11px',color:'rgba(35, 31, 32, 0.5)'  }}> <div className="circle">1</div>&nbsp;&nbsp;Basic information</div>
                                         </a>
                                     </li>
                                   
                                    {this.props.stepData.map((stepData, stepKey) => (
                                      
                                                           <>
                                                          <li className="nav-item" key={stepKey} id={'tabStep-'+count++} >
                                                                            <a className={stepKey === 0 ? "nav-link" : "nav-link"} readOnly style={{ lineHeight: '20px' }}>                                                              
                                                                                <div className="nav-item-title" style={{fontFamily:'Inter',fontStyle:'normal',fontWeight:'600',fontsize:'11.50833px',lineHeight:'11px',color:'rgba(35, 31, 32, 0.5)'  }}><div className="circle">{uuu++}</div>&nbsp;&nbsp;{stepData.data.name}</div>
                                                                           </a>
                                                                       </li>

                                                          
                                                   {/* {stepData.data.questions.map((questionData,questionsKey) => (
                                                            <li className="nav-item" key={stepKey} style={{ display:'none' }}>
                                                                 <a className={stepKey === 0 ? "nav-link" : "nav-link"} data-toggle="tab" href={"#tab-" + count++}>                                                              
                                                                    <div className="circle">2</div>&nbsp; <div className="nav-item-title">{questionsKey}</div>
                                                                </a>
                                                            </li>
                                                            )) } */}
                                                      </>
                                                ))}

                                                
                                       {(() => {
                                                if (this.props.selectedOrganizationType !== '') {

                                                    return ( <li className="nav-item"  id={'tabStep-'+count++} >
                                                    <a className={"nav-link"} readOnly style={{ lineHeight: '20px' }}>                                                              
                                                        <div className="nav-item-title" style={{fontFamily:'Inter',fontStyle:'normal',fontWeight:'600',fontsize:'11.50833px',lineHeight:'11px',color:'rgba(35, 31, 32, 0.5)'  }}><div className="circle">{uuu++}</div>&nbsp;&nbsp;{this.props.selectedOrganizationType}</div>
                                                   </a>
                                               </li>);
                                                }
                                            })()}
                                  
                                </ul>
                                    
            <SelectLanguageModel />
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
)(OssStep);
