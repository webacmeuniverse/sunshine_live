import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {
  Grid,
  makeStyles,
} from '@material-ui/core';

import NavMenu from './../../smartcomponents/LandingPageNavContainer';
import { alert, defaultModules } from '@pnotify/core';
import CarouselSlide from './CarouselSlide';
import Footer from './Footer';

import SelectLanguageModel from '../../smartcomponents/SelectLanguageModel';
//images
import istockphoto from '../../../styles/assets/images/istockphoto-1256298004-2048x2048 1.png';
import img_icon from '../../../styles/assets/images/img-icon.png';
import icon_calc from '../../../styles/assets/images/icon-calc.png';
import img_icon_54 from '../../../styles/assets/images/img-icon-54.png';

import Qualification_Onboarding_Questionnaire from '../../../images/howItWorks/2959860_laptop_online_computer_work.png';
import Phone_Call from '../../../images/howItWorks/2959845_communication_send_message_mobile_chat.png';
import Energy_Audit_Profile_Analysis from '../../../images/howItWorks/2959851_business_pie_piechart_graph.png';
import Find_a_Solution from '../../../images/howItWorks/2959848_target_goal_aim_arrow.png';
import Follow_your_Building_Renovation_on_SUNShINE from '../../../images/howItWorks/2959856_graph_grow_analytics_mobile.png';
import Renovation_Work from '../../../images/howItWorks/2959843_office_city_workplace_office_business_business_city_workplace.png';
import Monitoring from '../../../images/howItWorks/2959838_up_grow_profit_growth_graph.png';



import Shape from '../../../styles/assets/images/Shape.png';
import sunshune_logo from '../../../styles/assets/images/sunshune-logo.png';
import icon_book from '../../../styles/assets/images/icon-book.png';
import hero_img_home from '../../../styles/assets/images/hero_img_home.png';
import img_10 from '../../../styles/assets/images/img 10.png';
import icon_Star from '../../../styles/assets/images/icon-Star.png';

import weWork_01 from '../../../styles/assets/images/weWork-01.jpg';
import weWork_02 from '../../../styles/assets/images/weWork-02.jpg';
import weWork_03 from '../../../styles/assets/images/weWork-03.jpg';
import weWork_04 from '../../../styles/assets/images/weWork-04.jpg';
import weWork_05 from '../../../styles/assets/images/weWork-05.jpg';
import weWork_06 from '../../../styles/assets/images/weWork-06.jpg';
import weWork_07 from '../../../styles/assets/images/weWork-07.jpg';
import weWork_08 from '../../../styles/assets/images/weWork-08.jpg';
import weWork_09 from '../../../styles/assets/images/weWork-09.jpg';
import weWork_10 from '../../../styles/assets/images/weWork-10.jpg';


import modelBackground from '../../../styles/assets/images/mapa_retoque_2.png';


//Country flag icon
import ENDPOINTS from '../../../constants/endpoints';
import Belgium from '../../../styles/assets/images/country/Belgium.png';
import France from '../../../styles/assets/images/country/France.png';
import Italy from '../../../styles/assets/images/country/Italy.png';
import Latvia from '../../../styles/assets/images/country/Latvia.png';
import Portugal from '../../../styles/assets/images/country/Portugal.png';
import Spain from '../../../styles/assets/images/country/Spain.png';
import UK from '../../../styles/assets/images/country/UK.png';

import Switch from '../../../styles/assets/images/Switch.png';
import toggleCountry from '../../../actions/country';
import toggleLanguage from '../../../actions/language';
import ContactUsDialog from './ContactUs';
function HomePage(props) {
  const {
    toggleCountry
      } = props;

  const { alerts } = props;

  const { toggleLanguage } = props;
  const { t } = useTranslation('translations');
  const [countryAdminDialogOpen, setCountryAdminDialogOpen] = useState(false);
  const toggleCountryAdminDialog = () => setCountryAdminDialogOpen(!countryAdminDialogOpen);

  const { language, country } = props;
  const [emailError, setEmailError] = useState();
  const [userEmail, setUserEmail] = useState();
  const [publicIp, setPublicIp] = useState();

  const pdfUserEmailGet = (e) => {
    let nnnn = e.target.value;

    if(e.target.name==='email'){
        if(e.target.value==='' || e.target.value===null || !e.target.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) ){
         

          setEmailError(true);
        } 
        
        else {
            setEmailError(false);
         
        }
      }
      setUserEmail(nnnn);
}
const newsletterSend = () => {


  if(emailError === false){

    const config = {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        
        "email":userEmail,    
        "public_ip":'', 
       
      })
    };
    
    fetch(ENDPOINTS.SERVER + '/subscribe', config)
       .then(res => res.json())
       .then(
         (result) => {
          setUserEmail('');
          alert({
            text: 'Successfully',
            type: 'success',
            delay: 800,
            closer: true
          });
                    
         },
       ).catch(error => {
                     
					alert({
						text: 'something went wrong',
						type: 'error',
						delay: 800,
						closer: true
					  });
       });
    
   
  }else{
    setEmailError(true);

  }
 


//   const config = {
//       method: 'GET',
//       credentials: 'include',
//       headers: { 'Content-Type': 'text/plain' },
//   };
//   fetch(ENDPOINTS.SERVER + `/step/result?is_default_template=0&oss_admin_id=${ossEmail}&lang=${hhh}`, config)

//  // fetch(ENDPOINTS.SERVER + '/step/result', config)
//   .then(res => res.json())
//   .then(
//       (result) => {
        
//           if(result.documents != null){
              

//           }

        
//       }

//   )


}

 useEffect(() => {
  
          fetch('https://ipapi.co/json/')
                  .then( res => res.json())
                  .then(response => {
               
                  let countryName  = '';
                  let languageName = '';
                  setPublicIp(response.ip);
                    if (response.country_name === 'Italy'){
                         countryName = 'Italy';
                         languageName = 'it';

                    }else if (response.country_name === 'Germany'){
                        countryName = 'Germany';
                        languageName = 'de';
                    }else if (response.country_name === 'Portugal'){
                        countryName = 'Portugal';  
                        languageName = 'pt';
                      }else if (response.country_name === 'France'){
                        countryName = 'France';
                        languageName = 'en';
                      }else if (response.country_name === 'Latvia'){
                        countryName = 'Latvia';
                        languageName = 'lv';
                      }else if (response.country_name === 'Poland'){
                        countryName = 'Poland';
                        languageName = 'pl';
                      }else if (response.country_name === 'Spain'){
                        countryName = 'Spain';  
                        languageName = 'lv';
                      }else if (response.country_name === 'Lithuania'){
                        countryName = 'Lithuania';  
                        languageName = 'lv';
                               
                      }else {
                          countryName = 'Latvia';
                          languageName = 'lv';
                       }

                       if (language === '')  {
                        toggleLanguage(languageName);
                        toggleCountry(countryName);
                       // toggleLanguage(languageName);
                       } 
                      
                   
                     if (country === '')  {
                      toggleLanguage(languageName);
                      toggleCountry(countryName);
                     // toggleLanguage(languageName);
                     }   
                
                 })
                
        .catch((data, status) => {
          toggleCountry('Latvia');
        });
  // Update the document title using the browser API
 // toggleCountry(countryName);
 
}, [toggleCountry]);
  return (
    <React.Fragment>
      <NavMenu />
      <main role="main">
        <CarouselSlide />
        <section className="help-section mt-0">
          <div className="row">
            <div className="col-md-12 text-center">
              {t('landingPage:mainTitle.title1')}
            </div>
          </div>
        </section>

        <section id="residentsSec">
          <div className="container">
            <div className="row row-eq-height" style={{ background: '#F5F7FA' }}>
              <div className="col-md-12 align-middle my-auto animate__animated animate__fadeInRight" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <div >
                  <h3 className="mt-4">{t('landingPage:individualPrivate.title')}</h3>
                  <p className="mt-3" style={{ textAlign: 'left' }} >{t('landingPage:individualPrivate.title1')}</p>
                  <p className="font-weight-bold mb-4" style={{ textAlign: 'left' }}>{t('landingPage:individualPrivate.title2')}&nbsp;&nbsp;&nbsp; <a href="residents" className="btn btn-primary btn-md btn-default" style={{ lineHeight: '37px' }}>
                    {t('landingPage:individualPrivate.LetStart')}
                  </a></p>

                </div>
              </div>

              <div className="col-md-12 pl-0 animate__animated animate__fadeInLeft">
                <ol className="olcards">
                  <li style={{ width: '33%', cardColor: '#fcce00' }}>
                    <a href="residents" style={{ color: 'white', width: '700px', fontWeight: 'bold' }} >
                      <div className="contentStep" style={{ background: '#fcce00', height: '85px' }}>
                        <div className="text" style={{ fontSize: '13px' }}>{t('landingPage:individualPrivate.box1')}
                        </div>
                      </div>
                    </a>
                  </li>
                  <li style={{ width: '33%', cardColor: '#fcce00' }}>
                    <a href="find-my-partner" style={{ color: 'white', width: '700px', fontWeight: 'bold' }}>
                      <div className="contentStep" style={{ background: '#676e7b', height: '85px' }} >
                        <div className="text" style={{ fontSize: '13px' }} >{t('landingPage:individualPrivate.box2')}   <br></br>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li style={{ width: '33%', cardColor: '#fcce00' }}>
                    <a href="residents" style={{ color: 'white', width: '700px', fontWeight: 'bold' }}>
                      <div className="contentStep" style={{ background: '#fcce00', height: '85px' }}>
                        <div className="text" style={{ fontSize: '13px' }}> {t('landingPage:individualPrivate.box3')}
                        </div>
                      </div>
                    </a>
                  </li>

                </ol>
              </div>

            </div>


          </div>
        </section>




        <section id="howItWorks">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="sectionTitle">{t('landingPage:howItWorks.mainTitle')}</h2>
              <p>{t('landingPage:howItWorks.subTitle')} </p>
            </div>

            <div className="row mt-5">
              <div className="col-md-4 animate__animated animate__fadeInUp animate__delay-1s">
                <img src={Qualification_Onboarding_Questionnaire} alt="" style={{ height: '50px' }} />
                <h4 className="h5  mt-2">{t('landingPage:howItWorks.title1')}</h4>
                <div className="content-text mt-2">
                  {t('landingPage:howItWorks.description1')}
                </div>
              </div>
              <div className="col-md-4 animate__animated animate__fadeInUp animate__delay-1s">
                <img src={Phone_Call} alt="" style={{ height: '50px' }} />
                <h4 className="h5  mt-2">{t('landingPage:howItWorks.title2')}</h4>
                <div className="content-text mt-2">
                  {t('landingPage:howItWorks.description2')}
                </div>
              </div>
              <div className="col-md-4 animate__animated animate__fadeInUp animate__delay-1s">
                <img src={Energy_Audit_Profile_Analysis} alt="" style={{ height: '50px' }} />
                <h4 className="h5  mt-2">{t('landingPage:howItWorks.title3')}</h4>
                <div className="content-text mt-2">
                  {t('landingPage:howItWorks.description3')}
                </div>
              </div>
            </div>


            <div className="row mt-5">
              <div className="col-md-4 animate__animated animate__fadeInUp animate__delay-2s">
                <img src={Find_a_Solution} alt="" style={{ height: '50px' }} />
                <h4 className="h5  mt-2">{t('landingPage:howItWorks.title4')}</h4>
                <div className="content-text mt-2">
                  {t('landingPage:howItWorks.description4')}
                </div>
              </div>
              <div className="col-md-4 animate__animated animate__fadeInUp animate__delay-2s">
                <img src={Follow_your_Building_Renovation_on_SUNShINE} alt="" style={{ height: '50px' }} />
                <h4 className="h5  mt-2">{t('landingPage:howItWorks.title5')}  </h4>
                <div className="content-text mt-2">
                  {t('landingPage:howItWorks.description5')}
                </div>
              </div>
              <div className="col-md-4 animate__animated animate__fadeInUp animate__delay-2s">
                <img src={Renovation_Work} alt="" style={{ height: '50px' }} />
                <h4 className="h5  mt-2">{t('landingPage:howItWorks.title6')}</h4>
                <div className="content-text mt-2">
                  {t('landingPage:howItWorks.description6')}
                </div>
              </div>
            </div>



            <div className="row mt-5">
              <div className="col-md-4 animate__animated animate__fadeInUp animate__delay-3s">
                <img src={Monitoring} alt="" style={{ height: '50px' }} />
                <h4 className="h5  mt-2">{t('landingPage:howItWorks.title7')}</h4>
                <div className="content-text mt-2">
                  {t('landingPage:howItWorks.description7')}
                </div>
              </div>


            </div>

          </div>
        </section>
        {countryAdminDialogOpen && (
                          <ContactUsDialog
                            title={t('platformRoles.dataProtectionOfficers')}
                            role="data_protection_officer"
                            onClose={toggleCountryAdminDialog}
                          />
                        )}
        <section id="EES-calculator">
          <div className="container">
            <div className="row  row-eq-height">
              <div className="col-md-9 mx-auto">
                <div className="widBox">
                  <div className="row">
                    <div className="col-2 col-md-2 col-lg-2 my-auto text-center">
                      <img src={icon_calc} alt="" />
                    </div>
                    <div className="col-7  col-sm-7 col-lg-7 my-auto">
                      <h4 className="h4">{t('landingPage:howMuchRenovationCost.title1')}</h4>
                      <p className="content-text">{t('landingPage:howMuchRenovationCost.title2')}</p>
                    </div>
                    <div className="col-3 col-sm-3 col-lg-3  my-auto text-right">
                      <a href="ees_calculator" className="btn btn-primary btn-default" style={{ lineHeight: '37px' }}>{t('landingPage:howMuchRenovationCost.title3')} </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="newsletter" className="mt-0">
          <div className="container">
            <div className="row row-eq-height">
              <div className="col-md-5 x-auto">
                <h2>{t('landingPage:SUBSCRIBE.title1')}</h2>
              </div>
              <div className="col-md-7">
                <div className="row">
                  <div className="col-md-6">

                    <input type="text" className="htmlForm-control" value={userEmail} name="email" onChange={(e) => pdfUserEmailGet(e)} style={{ padding: '15px', background: '#fee470', border: 'solid 2px #fff', borderRadius: '0', width: '100%', fontSize: '1rem', lineHeight: '1.5', color: '#495057' }} placeholder={t('landingPage:SUBSCRIBE.Email')} />
                    {emailError === true ? <span style={{color: "red"}}>{t('translations:onboardingValidation.enter_valid_value')}</span> : ''}
                  </div>
                  <div className="col-md-6">
                    <button className="btn btn-primary btn-default ml-5" style={{ color: 'white' }} onClick={(e) => newsletterSend(e)}>{t('landingPage:SUBSCRIBE.Send')}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="calltoactionGray">
          <div className="container">
            <div className="row  row-eq-height">
              <div className="col-md-10 mx-auto">
                <div className="calltoactionContent">
                  <div className="row pt-3 pb-3">
                    <div className="col-md-8 col-8 my-auto">
                      <h3>{t('landingPage:GetInTouch.title1')}</h3>
                    </div>
                    <div className="col-md-4  col-8 my-auto text-center">
                      <a onClick={toggleCountryAdminDialog} className="btn btn-primary btn-default" style={{ lineHeight: '37px', color: 'white',cursor: 'pointer' }}>{t('landingPage:GetInTouch.ContactUs')}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="whoDoWeWork">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="sectionTitle">{t('landingPage:GetInTouch.title2')}</h2>
            </div>
            <div className="row  row-eq-height">
              <div className="col-md-10 mx-auto">
                <div className="calltoactionContent">
                  <div className="row pt-3 pb-3">
                    <div className="col-md-1 col-1 my-auto">

                    </div>
                    <div className="col-md-2 col-2 my-auto">
                      <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_01} alt="" /></div>
                    </div>

                    <div className="col-md-2 col-2 my-auto">
                      <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_02} alt="" /></div>
                    </div>

                    <div className="col-md-2 col-2 my-auto">
                      <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_03} alt="" /></div>
                    </div>

                    <div className="col-md-2 col-2 my-auto">
                      <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_04} alt="" /></div>
                    </div>

                    <div className="col-md-2 col-2 my-auto">
                      <div className="p-2 animate__animated animate__zoomin='true'" animate__zoomin='true'><img src={weWork_05} alt="" /></div>
                    </div>
                    <div className="col-md-1 col-1 my-auto">

                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row  row-eq-height">
              <div className="col-md-10 mx-auto">
                <div className="calltoactionContent">
                  <div className="row pt-3 pb-3">
                    <div className="col-md-1 col-1 my-auto">

                    </div>
                    <div className="col-md-2 col-2 my-auto">
                      <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_06} alt="" /></div>
                    </div>

                    <div className="col-md-2 col-2 my-auto">
                      <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_07} alt="" /></div>
                    </div>

                    <div className="col-md-2 col-2 my-auto">
                      <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_08} alt="" /></div>
                    </div>

                    <div className="col-md-2 col-2 my-auto">
                      <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_09} alt="" /></div>
                    </div>

                    <div className="col-md-2 col-2 my-auto">
                      <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_10} alt="" /></div>
                    </div>
                    <div className="col-md-1 col-1 my-auto">

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
    </React.Fragment>
  );
}

export default connect(
  state => ({
    alerts: state.alerts.pending,
    country: state.user.country,
    language: state.user.language
  }), dispatch => ({

    toggleLanguage: (lang) => {
      dispatch(toggleLanguage(lang));
    },
    toggleCountry: (countryName) => {
      dispatch(toggleCountry(countryName));
    }

  })
)(HomePage);
