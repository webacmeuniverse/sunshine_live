import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
    Grid,
    makeStyles,
} from '@material-ui/core';


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


class OperateSelect extends React.Component {

    constructor(props) {
        super(props);
    }

     handleNextStep = () => {
       $('.nav-tabs > .nav-item > .active').parent().next('li').find('a').trigger('click');
    }

     handlePrevStep = () => {
        $('.nav-tabs > .nav-item > .active').parent().prev('li').find('a').trigger('click');
    }

    render() { 
   
    return (
        <React.Fragment>
          
          <div className="row row-eq-height align-middle my-auto animate__animated animate__fadeInRight"  style={{position: 'absolute',top: '30%'}}>
							<div className="col-md-12">

								<div className="content-style2 ">
                                <form >
									<div className=" mb-5">
										<h2> {this.props.t('translations:ossPreviewTitle.title1')} </h2>
										<br/>
                                       
											<div  style={{ fontWeight: '500', fontSize: '14px' }} >{this.props.t('translations:ossPreviewTitle.Enteryourlocation')} 
												<select className="select-country" name="location" onChange={(e) => this.props.countryChange(e)}  id="location" style={{ background: 'none', fontSize: '14px' }} value={this.props.selectedCountry}
                                                                                required>
													
													<option value="Latvia">{this.props.t('translations:countriesKeys.Latvia')}</option>
													<option value="Italy">{this.props.t('translations:countriesKeys.Italy')}</option>
													<option value="Germany">{this.props.t('translations:countriesKeys.Germany')}</option>
													<option value="Portugal">{this.props.t('translations:countriesKeys.Portugal')}</option>
                                                    <option value="France">France</option>
										
													<option value="Poland">{this.props.t('translations:countriesKeys.Poland')}</option>
													<option value="Spain">Spain</option>
													<option value="Lithuania">Lithuania</option>
													<option value="Other">{this.props.t('translations:legalForms.Other')}</option>
												</select>
												
												<select className="select-country" name="type" id="type" onChange={(e) => this.props.residentsTypeChange(e)} style={{ background: 'none' }}  required>
													<option value="">{this.props.t('translations:recordsTitle.Type')}</option>
													<option value="Resident">{this.props.t('translations:organizations.residents')} </option>
													<option value="Housing Association">{this.props.t('translations:ossMenu.HousingAssociation')}</option>
													
												</select>
                                                
												<input type="text" className="select-country" style={{ background: 'none' }} onChange={(e) => this.props.postCodeChange(e)} placeholder={this.props.t('translations:assets.postcode')} required />
												{this.props.t('translations:ossPreviewTitle.toseeif')}  
											</div>
                                            <br></br>
                                            <span style={{ color: "red" }}>{this.props.operateErrors["country"]}</span>
									</div>
									<div className="d-block">
										<button type="button" name="submit" onClick={()=>this.props.operateDataSavey()} 
											className="btn btn-primary btn-md btn-default welcomeButtone">{this.props.t('translations:ossPreviewTitle.Submit')} </button>
									</div>
									</form>
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
)(OperateSelect);
