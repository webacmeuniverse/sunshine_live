import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
  Grid,
  makeStyles,
} from '@material-ui/core';
import {
  Info as InfoIcon,
} from '@material-ui/icons';
import NavContainer from './../../smartcomponents/LandingPageNavContainer';
//import NavContainer from './../../smartcomponents/navcontainer';
import OSSAdmin from '../../../containers/pages/OSSAdmin/Dashboard/DashboardPage';
import OSSNavContainer from './../../smartcomponents/ossnavcontainer';
import SnackbarNotification from './../../smartcomponents/SnackbarNotification';
import QuickLinks from './QuickLinks';
import CountriesMap from './CountriesMap';
import MarkdownText from '../../../components/utils/MarkdownText';
import UserTooltip from '../../../components/utils/UserTooltip';
import AdminPage from './AdminPage';
import OSSAdminPage from '../OSSAdmin/Dashboard/DashboardPage';
import EESFooter from './../../smartcomponents/EESFooter';
import SelectLanguageModel from './../../smartcomponents/SelectLanguageModel';
import EESNavigationMenu from './../../smartcomponents/EESNavigationMenu';
import Footer from './../LandingPage/Footer';
const useStyles = makeStyles({
  root: {
    height: '100%',
  },
  content: {
    padding: 20,
  },
});

function NationalBenchmarking(props) {
  const { alerts } = props;

  const classes = useStyles();

  const { t } = useTranslation('translations');

   return (
    <React.Fragment>
      
     

      <div className={classes.root}>
      <NavContainer />
      <div>
        <main role="main">
        <section className="help-section mt-0 mb-0">
						<div className="row">
							<div className="col-md-12 text-center">
              {t('translations:ossMenu.NationalBenchmarking')}
                            
							</div>
						</div>
					</section>
          <section id="market_operator" style={{ marginTop: '0px', marginBottom: '0px' }}>
          <div className="container"> 
            <div className="row">
              <div className="col-md-12 text-center">
             
          <CountriesMap />
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

      
    </React.Fragment>
  ); 
  
  
}

export default connect(
  state => ({
    alerts: state.alerts.pending,

  }),
)(NationalBenchmarking);
