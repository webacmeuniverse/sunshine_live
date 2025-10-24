import React from 'react';
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

const styles = {
  root: {
    height: '100%',
  },
  content: {
    padding: 20,
  },
  
};

function BuildingCalculator(props) {
  const { classes } = props;
  const {  userdata } = props;
  const { t } = useTranslation('translations');
    const ossAdminChange = (event) => {

    let resultData = this.stat.ossAdminData.filter(item => item.country == this.state.selectedCountry && item.email == this.state.selectedOssAdmin)
    this.state.selectedOssAdmin = event.target.value;
    this.state.selectedOssData = resultData;
    this.forceUpdate()


}
  return (
    <React.Fragment>
        <NavContainer />
              <div>
				<main role="main">

        <section className="help-section mt-0 mb-0">
						<div className="row">
							<div className="col-md-12 text-center">
              {t('translations:ossMenu.BuildingCalculator')}
                            
							</div>
						</div>
					</section>
               

                <section id="market_operator" style={{ marginTop: '0px' , marginBottom: '0px' }}>
                <div className="container">
						<div className="row">
							<div className="col-md-12 text-center">
                            <Calculator />
							</div>
						</div>
                        </div>
					</section>
<br></br>
				
<br></br>		


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
}))(withStyles(styles)(BuildingCalculator));

