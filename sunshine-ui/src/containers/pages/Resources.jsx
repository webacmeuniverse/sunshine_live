import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import NavContainer from './../smartcomponents/LandingPageNavContainer';
//import NavContainer from '../smartcomponents/ossnavcontainer';
//import NavContainer from './../smartcomponents/EESNavcontainer';
import EESFooter from './../smartcomponents/EESFooter';
import SelectLanguageModel from './../smartcomponents/SelectLanguageModel';
import EESNavigationMenu from './../smartcomponents/EESNavigationMenu';
import Footer from '././LandingPage/Footer';
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

import { useTranslation } from 'react-i18next';
import '../../styles/assets/css/bootstrap.min.css';
import '../../styles/assets/css/stepwizard.css';
//images
import logo_footer2 from '../../styles/assets/images/logo-footer2.png';
import Logo_europa_White from '../../styles/assets/Logo_europa_White.png';
import calculaadora from '../../styles/assets/calculaadora.png';
import quizHomeIcon from '../../styles/assets/quizHomeIcon.png';

import icon_calc from '../../styles/assets/images/icon-calc.png';
import energy_drivers from '../../styles/assets/energy_drivers.png';
import economic_text from '../../styles/assets/economic_text.png';
import bolt_1 from '../../styles/assets/bolt_1.png';
import database from '../../styles/assets/database.png';

import TopBar from '../../components/ossnavigation/TopBar';
import Calculator from '../../components/utils/EnergyCalculator/Calculator';

import InfographicPDF from '../../styles/pdf/Infographic-for-stakeholder-awareness.pdf';
import TheGeneralFrameworkPDF from '../../styles/pdf/The-general-framework-of-Energy-Efficiency-Subscription.pdf';
import TheSUNShINEHandbookPDF from '../../styles/pdf/The-SUNShINE-handbook-on-dEEp-building-renovation.pdf';
import TheUserManual from '../../styles/pdf/SUNShINE powered by EUROPA - User Manual.pdf';




import resourceImg from '../../styles/assets/resource.jpg';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


const styles = {
  root: {
    height: '100%',
  },
  content: {
    padding: 20,
  },
};

function EnergyCalculatorPage(props) {
  const { classes } = props;
  const {  userdata } = props;
  const { t } = useTranslation('translations');
    const ossAdminChange = (event) => {

    let resultData = this.stat.ossAdminData.filter(item => item.country == this.state.selectedCountry && item.email == this.state.selectedOssAdmin)
    this.state.selectedOssAdmin = event.target.value;
    this.state.selectedOssData = resultData;
    this.forceUpdate()

}
const pdfOpen= (evt,pdfFile) => {

  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        
        <div className='custom-ui' style={{     width: '1400px' }}>
         
            
            <div className="px-5 py-3 text-right border-t border-gray-200 dark:border-dark-5">
            <iframe src={pdfFile} width="100%" style={{ maxHeight: '90vh',minHeight: '90vh' }}></iframe>
                                                    
                                         
                                         <button type="button" data-dismiss="modal" className="button w-20 border text-gray-700 dark:border-dark-5 dark:text-gray-300 mr-1" onClick={onClose}>Close</button>
                                     
                                        
                                      </div>                  
          
        </div>
      );
    }
  });

}
  return (
    <React.Fragment>
        <NavContainer />
              <div>
				<main role="main">

        <section className="help-section mt-0 mb-0">
						<div className="row">
							<div className="col-md-12 text-center">
              {t('landingPage:Resources.Resources')}
                            
							</div>
						</div>
					</section>

                    <section id="services" className="bg-gray" style={{ paddingTop: '0PX',paddingBottom: '0PX',marginTop: '0PX',marginBottom: '0PX' }}>
                                      
                        <div className="row">                      
                          <div className="col-md-5" style={{ backgroundImage: `url('${resourceImg}')`,backgroundRepeat: 'no-repeat',backgroundSize: '100% 650px',height: '650px'}}>
                        
                          </div>   
                          <div className="col-md-7">
                               <div className="row" style={{ padding: '10px',marginBottom: '4rem',marginTop: '4rem',marginRight: '0px',marginLeft: '0px',background: '#e1e3e778' }}>
                                  <div className="col-md-12 text-left" style={{ padding: '20px'}}>

                                  <h3 className="h3" style={{ fontFamily: "'Open Sans', sans-serif",fontStyle: 'normal',fontWeight: '800',fontSize: '15px',marginBottom: '0px'}}>{t('landingPage:Resources.title1')}  
                                  <a href="#" className="ex1" onClick={(e) => pdfOpen(e,TheUserManual)}  style={{  float: 'right',fontFamily: "'Open Sans', sans-serif",fontStyle: 'normal',fontWeight: '800',fontSize: '17px' }} >{t('landingPage:Resources.Learnmore')} </a>
                                  </h3>

                                  </div>
                                  </div>

                                  <div className="row" style={{ padding: '10px',marginBottom: '4rem',marginTop: '4rem',marginRight: '0px',marginLeft: '0px',background: '#e1e3e778' }}>
                                  <div className="col-md-12 text-left" style={{ padding: '20px'}}>
                                  <h3 className="h3 " style={{ fontFamily: "'Open Sans', sans-serif",fontStyle: 'normal',fontWeight: '800',fontSize: '15px',marginBottom: '0px'}}>{t('landingPage:Resources.title2')} 
                                  <a href="#" onClick={(e) => pdfOpen(e,TheGeneralFrameworkPDF)} style={{  float: 'right',fontFamily: "'Open Sans', sans-serif",fontStyle: 'normal',fontWeight: '800',fontSize: '17px' }} >{t('landingPage:Resources.Learnmore')}</a>
                                  </h3>
                                  </div>
                                </div>

                                <div className="row" style={{ padding: '10px',marginBottom: '4rem',marginTop: '4rem',marginRight: '0px',marginLeft: '0px',background: '#e1e3e778' }}>
                                  <div className="col-md-12 text-left" style={{ padding: '20px'}}>
                                  <h3 className="h3 " id="balklongwaarde" style={{ fontFamily: "'Open Sans', sans-serif",fontStyle: 'normal',fontWeight: '800',fontSize: '15px',marginBottom: '0px'}}>{t('landingPage:Resources.title3')}  
                                  <a href="#"  onClick={(e) => pdfOpen(e,InfographicPDF)} style={{  float: 'right',fontFamily: "'Open Sans', sans-serif",fontStyle: 'normal',fontWeight: '800',fontSize: '17px' }} >{t('landingPage:Resources.Learnmore')}</a>
                                  </h3>
                                  </div>
                                </div>

                                <div className="row " style={{ padding: '10px',marginBottom: '4rem',marginTop: '4rem',marginRight: '0px',marginLeft: '0px',background: '#e1e3e778' }}>
                                  <div className="col-md-12 text-left" style={{ padding: '20px'}}>
                                  <h3 className="h3 " id="balklongwaarde" style={{ fontFamily: "'Open Sans', sans-serif",fontStyle: 'normal',fontWeight: '800',fontSize: '15px',marginBottom: '0px'}}>{t('landingPage:Resources.title4')}  
                                  <a href="#"   onClick={(e) => pdfOpen(e,TheSUNShINEHandbookPDF)} style={{  float: 'right',fontFamily: "'Open Sans', sans-serif",fontStyle: 'normal',fontWeight: '800',fontSize: '17px' }} >{t('landingPage:Resources.Learnmore')}</a>
                                  
                                  </h3>
                                  </div>
                                </div>



                          </div>                     
                        </div>
                     
                    </section>
				
				


				</main>
				<Footer />
				<SelectLanguageModel />
			</div>
            </React.Fragment>
  );
}
export default connect(state => ({
  alerts: state.alerts.pending,
  userdata: state.user.profileInfo.data,
}))(withStyles(styles)(EnergyCalculatorPage));

