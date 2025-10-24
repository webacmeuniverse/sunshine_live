import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
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

function EnergyCalculatorPage(props) {

    const { classes } = props;
    const { userdata } = props;
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

                    <section className="help-section mt-0">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                {t('landingPage:Footer.FAQ')}
                            </div>
                        </div>
                    </section>
                    <section className="faq-section">

                        <div className="row">
                            <div className="col-md-12 offset-md-1">

                                <div className="text-left pb-3">
                                    <h2 style={{ fontWeight: '700' }}>{t('landingPage:faqList.mainTitle')}
                                        <br></br>
                                        <p style={{ marginBottom: '0px', marginTop: '0PX', textAlign: 'left' }}>{t('landingPage:faqList.subTitle')} </p>
                                    </h2>

                                </div>
                            </div>

                            <div className="col-md-10 offset-md-1">
                                <div className="faq" id="accordion">

                                    <div className="card">
                                        <div className="card-header" id="faqHeading-2">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-2" data-aria-expanded="false" data-aria-controls="faqCollapse-2">
                                                    <span className="badge">1</span>{t('landingPage:faqList.titles1.questionList.question1')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-2" className="collapse" aria-labelledby="faqHeading-2" data-parent="#accordion">
                                            <div className="card-body">
                                                <p> {t('landingPage:faqList.titles1.answerList.answer1')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="faqHeading-3">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-3" data-aria-expanded="false" data-aria-controls="faqCollapse-3">
                                                    <span className="badge">2</span>{t('landingPage:faqList.titles1.questionList.question2')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-3" className="collapse" aria-labelledby="faqHeading-3" data-parent="#accordion">
                                            <div className="card-body">
                                                <p>{t('landingPage:faqList.titles1.answerList.answer2')}</p>

                                                <p>{t('landingPage:faqList.titles1.answerList.answer2Sub1')}</p>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="faqHeading-4">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-4" data-aria-expanded="false" data-aria-controls="faqCollapse-4">
                                                    <span className="badge">3</span> {t('landingPage:faqList.titles1.questionList.question3')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-4" className="collapse" aria-labelledby="faqHeading-4" data-parent="#accordion">
                                            <div className="card-body">
                                                <p>{t('landingPage:faqList.titles1.answerList.answer3')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="faqHeading-5">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-5" data-aria-expanded="false" data-aria-controls="faqCollapse-5">
                                                    <span className="badge">4</span> {t('landingPage:faqList.titles1.questionList.question4')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-5" className="collapse" aria-labelledby="faqHeading-5" data-parent="#accordion">
                                            <div className="card-body">
                                                <p> {t('landingPage:faqList.titles1.answerList.answer4')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="faqHeading-6">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-6" data-aria-expanded="false" data-aria-controls="faqCollapse-6">
                                                    <span className="badge">5</span> {t('landingPage:faqList.titles1.questionList.question5')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-6" className="collapse" aria-labelledby="faqHeading-6" data-parent="#accordion">
                                            <div className="card-body">

                                                <p>{t('landingPage:faqList.titles1.answerList.answer5')}</p>

                                                <p>{t('landingPage:faqList.titles1.answerList.answer5Sub1')}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </section>

                    <section className="faq-section">

                        <div className="row">

                            <div className="col-md-12 offset-md-1">

                                <div className="faq-title text-left pb-3">
                                    <h2>{t('landingPage:faqList.titles2.questionTitle')}</h2>
                                </div>
                            </div>
                            <div className="col-md-10 offset-md-1">
                                <div className="faq" id="accordion">
                                    <div className="card">
                                        <div className="card-header" id="faqHeading-7">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-7" data-aria-expanded="true" data-aria-controls="faqCollapse-7">
                                                    <span className="badge">1</span>{t('landingPage:faqList.titles2.questionList.question1')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-7" className="collapse" aria-labelledby="faqHeading-7" data-parent="#accordion">
                                            <div className="card-body">
                                                <p>{t('landingPage:faqList.titles2.answerList.answer1')}</p>
                                                <ul>
                                                    <li>1. {t('landingPage:faqList.titles2.answerList.answer1Sub1')} </li>
                                                    <li>2. {t('landingPage:faqList.titles2.answerList.answer1Sub2')} </li>
                                                    <li>3. {t('landingPage:faqList.titles2.answerList.answer1Sub3')} </li>
                                                    <li>4. {t('landingPage:faqList.titles2.answerList.answer1Sub4')} </li>
                                                    <li>5. {t('landingPage:faqList.titles2.answerList.answer1Sub5')} </li>
                                                    <li>6. {t('landingPage:faqList.titles2.answerList.answer1Sub6')} </li>
                                                </ul>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="faqHeading-8">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-8" data-aria-expanded="false" data-aria-controls="faqCollapse-8">
                                                    <span className="badge">2</span> {t('landingPage:faqList.titles2.questionList.question2')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-8" className="collapse" aria-labelledby="faqHeading-8" data-parent="#accordion">
                                            <div className="card-body">
                                                <p>{t('landingPage:faqList.titles2.answerList.answer2')}  </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="faqHeading-9">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-9" data-aria-expanded="false" data-aria-controls="faqCollapse-9">
                                                    <span className="badge">3</span>{t('landingPage:faqList.titles2.questionList.question3')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-9" className="collapse" aria-labelledby="faqHeading-9" data-parent="#accordion">
                                            <div className="card-body">
                                                <p> {t('landingPage:faqList.titles2.answerList.answer3')}  </p>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="faqHeading-10">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-10" data-aria-expanded="false" data-aria-controls="faqCollapse-10">
                                                    <span className="badge">4</span>{t('landingPage:faqList.titles2.questionList.question4')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-10" className="collapse" aria-labelledby="faqHeading-10" data-parent="#accordion">
                                            <div className="card-body">
                                                <p> {t('landingPage:faqList.titles2.answerList.answer4')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="faqHeading-11">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-11" data-aria-expanded="false" data-aria-controls="faqCollapse-11">
                                                    <span className="badge">5</span> {t('landingPage:faqList.titles2.questionList.question5')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-11" className="collapse" aria-labelledby="faqHeading-11" data-parent="#accordion">
                                            <div className="card-body">

                                                <p>{t('landingPage:faqList.titles2.answerList.answer5')} </p>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="faqHeading-12">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-12" data-aria-expanded="false" data-aria-controls="faqCollapse-12">
                                                    <span className="badge">6</span> {t('landingPage:faqList.titles2.questionList.question6')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-12" className="collapse" aria-labelledby="faqHeading-12" data-parent="#accordion">
                                            <div className="card-body">
                                                <p>{t('landingPage:faqList.titles2.answerList.answer6')} </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </section>

                    <section className="faq-section">

                        <div className="row">

                            <div className="col-md-12 offset-md-1">

                                <div className="faq-title text-left pb-3">
                                    <h2>{t('landingPage:faqList.titles3.questionTitle')} </h2>
                                    {/* <p>I want to use the platform to help renovate the building I manage.</p> */}
                                </div>

                            </div>
                            <div className="col-md-10 offset-md-1">
                                <div className="faq" id="accordion">
                                    <div className="card">
                                        <div className="card-header" id="faqHeading-13">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-13" data-aria-expanded="true" data-aria-controls="faqCollapse-13">
                                                    <span className="badge">1</span>{t('landingPage:faqList.titles3.questionList.question1')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-13" className="collapse" aria-labelledby="faqHeading-13" data-parent="#accordion">
                                            <div className="card-body">
                                                <p>{t('landingPage:faqList.titles3.answerList.answer1')}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card">
                                        <div className="card-header" id="faqHeading-14">
                                            <div className="mb-0">
                                                <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-14" data-aria-expanded="false" data-aria-controls="faqCollapse-14">
                                                    <span className="badge">2</span> {t('landingPage:faqList.titles3.questionList.question2')}
                                                </h5>
                                            </div>
                                        </div>
                                        <div id="faqCollapse-14" className="collapse" aria-labelledby="faqHeading-14" data-parent="#accordion">
                                            <div className="card-body">
                                                <p> {t('landingPage:faqList.titles3.answerList.answer2')}</p>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                    </section>
                    <section className="faq-section">

                        <div className="row">

                            <div className="col-md-12 offset-md-1">

                                <div className="faq-title text-left pb-3">
                                    <h2>{t('landingPage:faqList.titles4.questionTitle')} </h2>
                                </div>
                            </div>
                            <div className="col-md-10 offset-md-1">
                                <div className="faq" id="accordion">
                                    <div className="card">

                                        <div className="card">
                                            <div className="card-header" id="faqHeading-15">
                                                <div className="mb-0">
                                                    <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-15" data-aria-expanded="false" data-aria-controls="faqCollapse-15">
                                                        <span className="badge">1</span>{t('landingPage:faqList.titles4.questionList.question1')}


                                                    </h5>
                                                </div>
                                            </div>
                                            <div id="faqCollapse-15" className="collapse" aria-labelledby="faqHeading-15" data-parent="#accordion">
                                                <div className="card-body">
                                                    <p>{t('landingPage:faqList.titles4.answerList.answer1')}</p>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header" id="faqHeading-16">
                                                <div className="mb-0">
                                                    <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-16" data-aria-expanded="false" data-aria-controls="faqCollapse-16">
                                                        <span className="badge">2</span>{t('landingPage:faqList.titles4.questionList.question2')}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div id="faqCollapse-16" className="collapse" aria-labelledby="faqHeading-16" data-parent="#accordion">
                                                <div className="card-body">
                                                    <p>{t('landingPage:faqList.titles4.answerList.answer2')} </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header" id="faqHeading-17">
                                                <div className="mb-0">
                                                    <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-17" data-aria-expanded="false" data-aria-controls="faqCollapse-17">
                                                        <span className="badge">3</span> {t('landingPage:faqList.titles4.questionList.question3')}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div id="faqCollapse-17" className="collapse" aria-labelledby="faqHeading-17" data-parent="#accordion">
                                                <div className="card-body">

                                                    <p>{t('landingPage:faqList.titles4.answerList.answer3')}</p>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header" id="faqHeading-18">
                                                <div className="mb-0">
                                                    <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-18" data-aria-expanded="false" data-aria-controls="faqCollapse-18">
                                                        <span className="badge">4</span> {t('landingPage:faqList.titles4.questionList.question4')}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div id="faqCollapse-18" className="collapse" aria-labelledby="faqHeading-18" data-parent="#accordion">
                                                <div className="card-body">
                                                    <p>{t('landingPage:faqList.titles4.answerList.answer4')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header" id="faqHeading-19">
                                                <div className="mb-0">
                                                    <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-19" data-aria-expanded="false" data-aria-controls="faqCollapse-19">
                                                        <span className="badge">5</span> {t('landingPage:faqList.titles4.questionList.question5')}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div id="faqCollapse-19" className="collapse" aria-labelledby="faqHeading-19" data-parent="#accordion">
                                                <div className="card-body">
                                                    <p>{t('landingPage:faqList.titles4.answerList.answer5')} </p>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>
                    <section className="faq-section">

                        <div className="row">

                            <div className="col-md-12 offset-md-1">

                                <div className="faq-title text-left pb-3">
                                    <h2>{t('landingPage:faqList.titles5.questionTitle')} </h2>
                                </div>
                            </div>
                            <div className="col-md-10 offset-md-1">
                                <div className="faq" id="accordion">
                                    <div className="card">

                                        <div className="card">
                                            <div className="card-header" id="faqHeading-20">
                                                <div className="mb-0">
                                                    <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-20" data-aria-expanded="false" data-aria-controls="faqCollapse-20">
                                                        <span className="badge">1</span>{t('landingPage:faqList.titles5.questionList.question1')}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div id="faqCollapse-20" className="collapse" aria-labelledby="faqHeading-20" data-parent="#accordion">
                                                <div className="card-body">
                                                    <p>{t('landingPage:faqList.titles5.answerList.answer1')}</p>

                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header" id="faqHeading-21">
                                                <div className="mb-0">
                                                    <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-21" data-aria-expanded="false" data-aria-controls="faqCollapse-21">
                                                        <span className="badge">2</span>{t('landingPage:faqList.titles5.questionList.question2')}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div id="faqCollapse-21" className="collapse" aria-labelledby="faqHeading-21" data-parent="#accordion">
                                                <div className="card-body">
                                                    <p>{t('landingPage:faqList.titles5.answerList.answer2')} </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header" id="faqHeading-22">
                                                <div className="mb-0">
                                                    <h5 className="faq-title" data-toggle="collapse" data-target="#faqCollapse-22" data-aria-expanded="false" data-aria-controls="faqCollapse-22">
                                                        <span className="badge">3</span> {t('landingPage:faqList.titles5.questionList.question3')}
                                                    </h5>
                                                </div>
                                            </div>
                                            <div id="faqCollapse-22" className="collapse" aria-labelledby="faqHeading-22" data-parent="#accordion">
                                                <div className="card-body">

                                                    <p>{t('landingPage:faqList.titles5.answerList.answer3')}</p>

                                                </div>
                                            </div>
                                        </div>

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

