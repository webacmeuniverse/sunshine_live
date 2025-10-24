import React from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from '@material-ui/core';

//import NavContainer from '../smartcomponents/navcontainer';
import NavContainer from './../smartcomponents/LandingPageNavContainer';
import FinancialCalculator from '../../components/utils/FinancialCalculator/FinancialCalculator';

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


const useStyles = makeStyles({
  root: {
    height: '100%',
  },
  content: {
    padding: 20,
  },
});

function FinancialCalculatorPage() {
  const classes = useStyles();
  const { t } = useTranslation('translations');
  return (
    <div className={classes.root}>
      <NavContainer />
      <div>
        <main role="main">
        <section className="help-section mt-0 mb-0">
						<div className="row">
							<div className="col-md-12 text-center">
              {t('translations:ossMenu.CostEstimationCalculator')}
                            
							</div>
						</div>
					</section>
          <section id="market_operator" style={{ marginTop: '0px', marginBottom: '0px' }}>
          <div className="container"> 
            <div className="row">
              <div className="col-md-12 text-center">
                <FinancialCalculator />
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
    </div>
  );
}

export default FinancialCalculatorPage;
