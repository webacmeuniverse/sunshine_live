import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
/// WRAPPERS
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter,Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

/// COMPONENTS
import NavMenu from '../../smartcomponents/LandingPageNavContainer';

import Footer from '../LandingPage/Footer';
import SelectLanguageModel from '../../smartcomponents/SelectLanguageModel';

/// ACTIONS
import { registerUser } from '../../../actions/authentication';
import ENDPOINTS from '../../../constants/endpoints';

import Group610 from '../../../styles/assets/Group610.png';
import mapserchbox from '../../../styles/assets/mapserchbox.png';
import mapzom from '../../../styles/assets/mapzom.png';
import Group3790 from '../../../styles/assets/Group3790.png';
import bannerphoto4 from '../../../styles/assets/images/banner-photo4.png';
import istockphoto1256298004 from '../../../styles/assets/images/istockphoto-1256298004-2048x2048 1.png';
import imgicon from '../../../styles/assets/images/img-icon.png';
import iconcalc from '../../../styles/assets/images/icon-calc.png';

import sunshunelogo from '../../../styles/assets/images/sunshune-logo.png';
import iconsunshune from '../../../styles/assets/images/icon-sunshune.png';
import iconbook from '../../../styles/assets/images/icon-book.png';
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
import { alert, defaultModules } from '@pnotify/core';
class ServicesProvider extends React.Component {
	constructor(props) {

        super(props);
        this.state = {
            emailError: '',
            userEmail:'',
			publicIp:''
        }
      
    }

	pdfUserEmailGet = (e) => {
		let nnnn = e.target.value;
	
		if(e.target.name==='email'){
			if(e.target.value==='' || e.target.value===null || !e.target.value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) ){
				this.setState({
					emailError:true,
					
				  })
	
			  //setEmailError(true);
			} 
			
			else {
				this.setState({
					emailError:false,
					
				  })
				
			 
			}
		  }

		  this.state.userEmail =nnnn;
		  this.forceUpdate()
		
	}
	 newsletterSend = () => {


		if(this.state.emailError === false){
			
			const config = {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'text/plain' },
				body: JSON.stringify({
				  
				  "email":this.state.userEmail,    
				  "public_ip":'', 
				 
				})
			  };
			  
			  fetch(ENDPOINTS.SERVER + '/subscribe', config)
				 .then(res => res.json())
				 .then(
				   (result) => {
					this.state.userEmail ='';
					this.state.publicIp ='';
					this.forceUpdate()
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
			this.setState({
				emailError:true,
				
			  })
	
	  
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

	  componentDidMount() {
  
	
	  }
	render() {
		let { register,t, fetching, alerts, language, classes } = this.props;
		
		return (
			<div>
				<main role="main">


					<div id="demo" className="carousel slide" data-ride="carousel">


						<ul className="carousel-indicators">
							<li data-target="#demo" data-slide-to="0" className="active"></li>
							<li data-target="#demo" data-slide-to="1"></li>
							{/* <li data-target="#demo" data-slide-to="2"></li> */}
						</ul>


						<div className="carousel-inner">

							<div className="container">
								<div className="row">
									<div className="col-md-6 col-sm-12 slider-content">
										<h2>{t('operatorsPage:slider.mainTitle')}</h2>
										<div className="slider-text">{t('operatorsPage:slider.subTitle')}</div>
										<div className="slider-link">
										<Link to={`/market_operator`}>{t('operatorsPage:slider.learnMore')}</Link>
											
										</div>
										<div className="mt-5">

											<img src={iconsunshune} alt="" />
										</div>
									</div>
									<div className="col-md-6 col-sm-12 slider-img">
										<div id="demo" className="carousel slide" data-ride="carousel">


											<div className="carousel-inner">
												<div className="carousel-item active">
												<Link to={`/market_operator`}><div className="sliderImgText">
													{t('operatorsPage:slider.imageTitle')}
													</div></Link>
													<img src={bannerphoto4} alt="" height="100%" />
												</div>

												<div className="carousel-item">
												<Link to={`/market_operator`}><div className="sliderImgText">
													{t('operatorsPage:slider.imageTitle')}
													</div></Link>
													<img src={bannerphoto4} alt="" height="100%" />
												</div>

												{/* <div className="carousel-item">
													<div className="sliderImgText">
													{t('operatorsPage:slider.imageTitle')}
													</div>
													<img src={bannerphoto4} alt="" height="100%" />

												</div> */}


											</div>
										</div>

									</div>
								</div>
							</div>


						</div>



					</div>


					<section className="help-section mt-0">
						<div className="row">
							<div className="col-md-12 text-center">
							{t('operatorsPage:slider.imageTitle1')}
							</div>
						</div>
					</section>

					<section id="market_operator">
                  <div className="container">
                    <div className="row row-eq-height" style={{background:'#F5F7FA'}}>         
                        <div className="col-md-12 align-middle my-auto animate__animated animate__fadeInRight" style={{marginLeft:'auto',marginRight:'auto'}}>
						<div >
										<h3 className="mt-3" >{t('operatorsPage:Operators.Operators')}</h3>
										<p className="mt-3" style={{textAlign:'left'}}>{t('operatorsPage:Operators.subTitle')} &nbsp;&nbsp;&nbsp;&nbsp;<a href="market_operator" className="btn btn-primary btn-md btn-default" style={{ lineHeight: '37px' }}>{t('operatorsPage:Operators.LetStart')}</a>
										</p>

									
									</div>
                        </div>
						<div className="col-md-12 pl-0 pt-3 animate__animated animate__fadeInLeft">            
                            <ol className="olcards">
                              <li style={{width:'33%',cardColor:'#fcce00'}}>
                                <a href="find-my-partner" style={{color:'white',width: '700px',fontWeight: 'bold'}} >
                                <div className="contentStep" style={{background:'#fcce00',height: '60px'}}>
                                  <div className="text" style={{fontSize:'13px'}}>
									
								  {t('operatorsPage:Operators.box1')}
                                  </div>
                                </div>
                                </a>
                              </li>
                              <li style={{width:'33%',cardColor:'#fcce00'}}>
                                <a href="#" style={{color:'white',width: '700px',fontWeight: 'bold'}}>
                                  <div className="contentStep" style={{background:'#676e7b',height: '60px'}} >
								  <Link to={`/login`}><div className="text" style={{fontSize:'13px',    color: 'white'}} >
									{t('operatorsPage:Operators.box2')}
                                    </div></Link>
                                  </div>
                                </a>	
                              </li>
                              <li style={{width:'33%',cardColor:'#fcce00'}}>
                              <a href="ees_calculator" style={{color:'white',width: '700px',fontWeight: 'bold'}}>
                                <div className="contentStep" style={{background:'#fcce00',height: '60px'}}>
                                  <div className="text" style={{fontSize:'13px',transform: 'translateY(18%)'}}>
								  {t('operatorsPage:Operators.box3')}
                                  </div>
                                </div>
                                </a>
                              </li>
                              
                            </ol>
                          </div>
                      </div>
<br></br>
                      <div className="row row-eq-height" style={{background:'#F5F7FA'}}>
                          
                        
                        </div>


                  
                  </div>
                </section>
				
					{/* <section id="feedback" className="bg-gray mb-0">
						<div className="container">
							<div className="text-center mb-5">
								<h2 className="sectionTitle">Still not convinced?</h2>
								<div>See what some our other market operators are saying about our OSS and its services</div>
							</div>

							<div className="row mt-5 mb-5">
								<div className="col-md-12">
									<div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
										<div className="carousel-inner">
											<div className="carousel-item active">
												<div className="row">
													<div className="col-md-4">
														<div className="feedback-block">
															<h4>Feedback</h4>
															<div className="userName">Kaye P.</div>
															<div className="star-icon">
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
																	className="bi bi-star" viewBox="0 0 16 16" style={{ color: 'rgb(253 178 0)' }} >
																	<path
																		d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
																</svg>
															</div>
															<p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra sit nunc sagittis mi
																non dignissim cursus.”</p>
														</div>
													</div>


													<div className="col-md-4">
														<div className="feedback-block">
															<h4>Feedback</h4>
															<div className="userName">Heather D.</div>
															<div className="star-icon">
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
																	className="bi bi-star" viewBox="0 0 16 16" style={{ color: 'rgb(253 178 0)' }}>
																	<path
																		d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
																	className="bi bi-star" viewBox="0 0 16 16" style={{ color: 'rgb(253 178 0)' }}>
																	<path
																		d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
																</svg>
															</div>
															<p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra sit nunc sagittis mi
																non dignissim cursus.”</p>
														</div>
													</div>


													<div className="col-md-4">
														<div className="feedback-block">
															<h4>Feedback</h4>
															<div className="userName">Karen F.</div>
															<div className="star-icon">
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
																	className="bi bi-star" viewBox="0 0 16 16" style={{ color: 'rgb(253 178 0)' }}>
																	<path
																		d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
																</svg>
															</div>
															<p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra sit nunc sagittis mi
																non dignissim cursus.”</p>
														</div>
													</div>

												</div>
											</div>
											<div className="carousel-item">
												<div className="row">
													<div className="col-md-4">
														<div className="feedback-block">
															<h4>Feedback</h4>
															<div className="userName">Kaye P.</div>
															<div className="star-icon">
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
																	className="bi bi-star" viewBox="0 0 16 16" style={{background:'#FDB200'}}>
																	<path
																		d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
																</svg>
															</div>
															<p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra sit nunc sagittis mi
																non dignissim cursus.”</p>
														</div>
													</div>


													<div className="col-md-4">
														<div className="feedback-block">
															<h4>Feedback</h4>
															<div className="userName">Heather D.</div>
															<div className="star-icon">
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
																	className="bi bi-star" viewBox="0 0 16 16" style={{background:'#FDB200'}}>
																	<path
																		d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
																	className="bi bi-star" viewBox="0 0 16 16" style={{background:'#FDB200'}}>
																	<path
																		d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
																</svg>
															</div>
															<p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra sit nunc sagittis mi
																non dignissim cursus.”</p>
														</div>
													</div>


													<div className="col-md-4">
														<div className="feedback-block">
															<h4>Feedback</h4>
															<div className="userName">Karen F.</div>
															<div className="star-icon">
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
																	className="bi bi-star" viewBox="0 0 16 16" style={{background:'#FDB200'}}>
																	<path
																		d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
																</svg>
															</div>
															<p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra sit nunc sagittis mi
																non dignissim cursus.”</p>
														</div>
													</div>

												</div>
											</div>
											<div className="carousel-item">
												<div className="row">
													<div className="col-md-4">
														<div className="feedback-block">
															<h4>Feedback</h4>
															<div className="userName">Kaye P.</div>
															<div className="star-icon">
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
																	className="bi bi-star" viewBox="0 0 16 16" style={{background:'#FDB200'}}>
																	<path
																		d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
																</svg>
															</div>
															<p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra sit nunc sagittis mi
																non dignissim cursus.”</p>
														</div>
													</div>


													<div className="col-md-4">
														<div className="feedback-block">
															<h4>Feedback</h4>
															<div className="userName">Heather D.</div>
															<div className="star-icon">
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
																	className="bi bi-star" viewBox="0 0 16 16" style={{background:'#FDB200'}}>
																	<path
																		d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
																	className="bi bi-star" viewBox="0 0 16 16" style={{background:'#FDB200'}}>
																	<path
																		d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
																</svg>
															</div>
															<p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra sit nunc sagittis mi
																non dignissim cursus.”</p>
														</div>
													</div>


													<div className="col-md-4">
														<div className="feedback-block">
															<h4>Feedback</h4>
															<div className="userName">Karen F.</div>
															<div className="star-icon">
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FDB200"
																	className="bi bi-star-fill" viewBox="0 0 16 16">
																	<path
																		d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
																</svg>
																<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
																	className="bi bi-star" viewBox="0 0 16 16"style={{background:'#FDB200'}}>
																	<path
																		d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
																</svg>
															</div>
															<p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra sit nunc sagittis mi
																non dignissim cursus.”</p>
														</div>
													</div>

												</div>
											</div>
										</div>
										<a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
											<span className="carousel-control-prev-icon" aria-hidden="true"></span>
											<span className="sr-only">Previous</span>
										</a>
										<a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
											<span className="carousel-control-next-icon" aria-hidden="true"></span>
											<span className="sr-only">Next</span>
										</a>
									</div>
								</div>
							</div>


							<div className="text-center">
								<span className="h5">Take a look at the renovated buildings that we have completed</span>
								<button className="btn btn-primary btn-default ml-5">Discover</button>
							</div>

						</div>
					</section> */}

					<section id="newsletter" className="mt-0">
						<div className="container">
							<div className="row row-eq-height">
								<div className="col-md-5 x-auto">
									<h2>{t('operatorsPage:SUBSCRIBE.title1')}</h2>
								</div>
								<div className="col-md-7">
									<div className="row">
										<div className="col-md-6">
											<input type="text" className="form-control" name="email" value={this.state.userEmail} onChange={(e) => this.pdfUserEmailGet(e)} placeholder={t('operatorsPage:SUBSCRIBE.Email')} />
											{this.state.emailError === true ? <span style={{color: "red"}}>{t('translations:onboardingValidation.enter_valid_value')}</span> : ''}
										</div>
										<div className="col-md-6">
											<button className="btn btn-primary btn-default ml-5" onClick={(e) => this.newsletterSend(e)}>{t('operatorsPage:SUBSCRIBE.Send')}</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

				
					<section id="whoDoWeWork">
                  <div className="container">
                    <div className="text-center mb-5">
                      <h2 className="sectionTitle">{t('operatorsPage:SUBSCRIBE.title2')}</h2>
                    </div>
                    <div className="row  row-eq-height">
                      <div className="col-md-10 mx-auto">
                        <div className="calltoactionContent">
                          <div className="row pt-3 pb-3">
                          <div className="col-md-1 col-1 my-auto">
                              
                            </div>
                            <div className="col-md-2 col-2 my-auto">
                              <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_01} alt=""/></div>
                            </div>

                            <div className="col-md-2 col-2 my-auto">
                            <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_02} alt=""/></div>
                            </div>

                            <div className="col-md-2 col-2 my-auto">
                            <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_03} alt=""/></div>
                            </div>

                            <div className="col-md-2 col-2 my-auto">
                            <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_04} alt=""/></div>
                            </div>

                            <div className="col-md-2 col-2 my-auto">
                            <div className="p-2 animate__animated animate__zoomin='true'" animate__zoomin='true'><img src={weWork_05} alt=""/></div>
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
                            <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_06} alt=""/></div>
                            </div>

                            <div className="col-md-2 col-2 my-auto">
                            <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_07} alt=""/></div>
                            </div>

                            <div className="col-md-2 col-2 my-auto">
                            <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_08} alt=""/></div>
                            </div>

                            <div className="col-md-2 col-2 my-auto">
                            <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_09} alt=""/></div>
                            </div>

                            <div className="col-md-2 col-2 my-auto">
                            <div className="p-2 animate__animated animate__zoomin='true'"><img src={weWork_10} alt=""/></div>
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
			</div>
		)
	}
}


ServicesProvider.propTypes = {
	// userIsLogged: PropTypes.string.isRequired,
	fetching: PropTypes.bool,
	register: PropTypes.func.isRequired,
	t: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
	return {
		userIsLogged: state.user.isAuthenticated,
		fetching: state.user.isFetching,
		didRegister: state.user.didRegister,
		alerts: state.alerts.pending,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const redirect = () => ownProps.history.push("/login");

	return {
		register: (creds) => {
			dispatch(registerUser(creds, redirect));
		}
	};
};

export default withRouter(withTranslation('translations')
	(connect(mapStateToProps, mapDispatchToProps)((ServicesProvider))));
