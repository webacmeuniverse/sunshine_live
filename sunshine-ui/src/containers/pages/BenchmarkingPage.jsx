import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import NavContainer from './../smartcomponents/LandingPageNavContainer';
//import NavContainer from '../smartcomponents/navcontainer';
import SnackbarNotification from '../smartcomponents/SnackbarNotification';
import Benchmarking from '../../components/Benchmarking/Benchmarking';
import SelectLanguageModel from './../smartcomponents/SelectLanguageModel';
import EESNavigationMenu from './../smartcomponents/EESNavigationMenu';
import Footer from '././LandingPage/Footer';
import { useTranslation } from 'react-i18next';
function BenchmarkingPage(props) {
  const {
    alerts,
  } = props;
  const { t } = useTranslation('translations');
  return (
    <React.Fragment>
      {/* <Helmet title="Benchmarking | SUNShINE" /> */}
      <NavContainer />
      {alerts && alerts.map((a, index) => (
        <SnackbarNotification open alert={a} key={index} />
      ))}
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
                  <Benchmarking />
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
}))(BenchmarkingPage);
