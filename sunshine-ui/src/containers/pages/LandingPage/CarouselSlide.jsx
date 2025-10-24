import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import {withRouter,Link} from 'react-router-dom';
import {
  Grid,
  makeStyles,
} from '@material-ui/core';


import icon_sunshune from '../../../styles/assets/images/icon-sunshune.png';
import banner_photo1 from '../../../styles/assets/images/banner-photo1.png';
import banner_photo2 from '../../../styles/assets/images/banner-photo2.jpg';
import banner_photo3 from '../../../styles/assets/images/banner-photo3.jpg';

function CarouselSlide(props) {

  const { t } = useTranslation('landingPage');

  return (
    <React.Fragment>
      <div id="demo" className="carousel slide" data-ride="carousel">     
        <ul className="carousel-indicators">
         
          <li data-target="#demo" data-slide-to="0" className="active"></li>
          <li data-target="#demo" data-slide-to="1"></li>
        </ul>      
        <div className="carousel-inner">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-sm-12 slider-content">
                <h2>{t('landingPage:slider.mainTitle')}</h2>
                <div className="slider-text">{t('landingPage:slider.subTitle')} </div>
                <div className="slider-link">
                <Link to={`/residents`}>{t('landingPage:slider.learnMore')}</Link>
                  
                </div>
                <div className="mt-5">
                  <img src={icon_sunshune} alt="" />
                </div>
              </div>
              <div className="col-md-6 col-sm-12 slider-img">              
                <div id="demo" className="carousel slide" data-ride="carousel">             
                  <div className="carousel-inner">
                                  
                    <div className="carousel-item active">
                      <Link to={`/residents`}> 
                        <div className="sliderImgText">
                        {t('landingPage:slider.imageTitle')}
                        </div>
                      </Link>
                      <img src={banner_photo2}  alt="" height="100%" />
                    </div>                   
                    <div className="carousel-item">
                    <Link to={`/residents`}>  <div className="sliderImgText">
                      {t('landingPage:slider.imageTitle1')}
                      </div> </Link>
                      <img src={banner_photo3}  alt="" height="100%" />                 
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>         
        </div>
      </div>
    </React.Fragment>
  );
}

export default connect(
  state => ({
    alerts: state.alerts.pending,
  }),
)(CarouselSlide);
