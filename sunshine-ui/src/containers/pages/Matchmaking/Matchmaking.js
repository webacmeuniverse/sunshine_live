import React from 'react';
import PropTypes from 'prop-types';

/// WRAPPERS
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';

/// COMPONENTS
import NavMenu from './../../smartcomponents/LandingPageNavContainer';

import Footer from '../LandingPage/Footer';
import SelectLanguageModel from '../../smartcomponents/SelectLanguageModel';

/// ACTIONS
import { registerUser } from '../../../actions/authentication';


import Group610 from '../../../styles/assets/Group610.png';
import mapserchbox from '../../../styles/assets/mapserchbox.png';
import mapzom from '../../../styles/assets/mapzom.png';
import Group3790 from '../../../styles/assets/Group3790.png';


class Matchmaking extends React.Component {
	render() {
		let { register, t, fetching, alerts, language, classes } = this.props;

		return (
			<div>


				<main role="main" id="matchmaking">
					<section className="help-section mt-0">
						<div className="row">
							<div className="col-md-12 text-center">
								Discover
							</div>
						</div>
					</section>





					<section style={{ marginTop: '0px' }} >
						<div className="container">



							<div className="row ">


								<div className="col-md-8  ">
									<div className="row" id="filterRadio">
										<div className="col-md-12">
											<br />
											<div className="float-left drop-hLang">
												<div className="nav-item dropdown hLangSwitch">
													<a className="nav-link dropdown-toggle" href="#" id="dropdown01"
														data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Sort </a>
													<div className="dropdown-menu" aria-labelledby="dropdown01">
														<a className="dropdown-item" href="#">Sort</a>

													</div>
												</div>
											</div>
										</div>
										<label> <input type="radio" name="radioFruit1" value="apple5" checked />&nbsp;&nbsp;&nbsp;
											Picked for you (default)</label>

										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label> <input type="radio" name="radioFruit1"
											value="apple1" />&nbsp;&nbsp;&nbsp; Near me</label>
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <label> <input type="radio" name="radioFruit1"
											value="apple2" />&nbsp;&nbsp;&nbsp; Most Popular </label>
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <label> <input type="radio" name="radioFruit1"
											value="apple3" />&nbsp;&nbsp;&nbsp;Rating</label>
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <label><input type="radio" name="radioFruit1"
											value="apple4" /> &nbsp;&nbsp;&nbsp;Services</label>
										<div className="col-md-12">
											<hr />
										</div>
									</div>
									<div className="row">
										<div className="col-md-4 ">
											<a href="Matchmaking-details.html"><img src={Group610} alt="" width="302"
												height="239" /> </a>
										</div>
										<div className="col-md-8 align-middle my-auto animate__animated animate__fadeInRight">
											<div className="content-style2">
												<p className="mt-3">Organizations</p>
												<h2 className="sectionTitle" style={{ fontWeight: 'bold', fontSize: '20px' }} >Gabercheta Inc.
												</h2>
												<p className="mt-3" style={{ fontWeight: 'normal', fontSize: '14px' }}>Lorem ipsum dolor sit
													amet, consectetur adipiscing elit. Enim, non, nec condimentum eu imperdiet
													ultricies amet, lacus, vestibulum. </p>
												<ul className="rating-icons">
													<li>
														<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
															fill="#FDB200" className="bi bi-star-fill" viewBox="0 0 18 18">
															<path
																d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
														</svg>
													</li>
													<li style={{ fontWeight: 'bold', fontSize: '14px', color: '#383C3D', lineHeight: '29PX' }} >
														4,5
													</li>
													<li style={{ fontWeight: 'bold', fontSize: '14px', color: '#383C3D', lineHeight: '29PX' }} >
														(4 Reviews)
													</li>
												</ul>
											</div>
										</div>
										<div className="col-md-12">
											<hr />
										</div>
									</div>
									<div className="row row-eq-height">
										<div className="col-md-4  ">
											<a href="Matchmaking-details.html"><img src={Group610} alt="" width="302"
												height="239" /> </a>
										</div>
										<div className="col-md-8 align-middle my-auto animate__animated animate__fadeInRight">
											<div className="content-style2">
												<p className="mt-3">Organizations</p>

												<h2 className="sectionTitle" style={{ fontWeight: 'bold', fontSize: '20px', color: '#383C3D' }} >Gabercheta Inc.
												</h2>
												<p className="mt-3" style={{ fontWeight: 'normal', fontSize: '14px' }} >Lorem ipsum dolor sit
													amet, consectetur adipiscing elit. Enim, non, nec condimentum eu imperdiet
													ultricies amet, lacus, vestibulum. </p>
												<ul className="rating-icons">
													<li>
														<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
															fill="#FDB200" className="bi bi-star-fill" viewBox="0 0 18 18">
															<path
																d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
														</svg>
													</li>
													<li style={{ fontWeight: 'bold', fontSize: '14px', color: '#383C3D', lineHeight: '29PX' }} >
														4,5
													</li>
													<li style={{ fontWeight: 'bold', fontSize: '14px', color: '#383C3D', lineHeight: '29PX' }} >
														(4 Reviews)
													</li>
												</ul>
											</div>
										</div>
										<div className="col-md-12">
											<hr />
										</div>
									</div>

									<div className="row row-eq-height">
										<div className="col-md-4  ">
											<a href="Matchmaking-details.html"><img src={Group610} alt="" width="302"
												height="239" /> </a>
										</div>
										<div className="col-md-8 align-middle my-auto animate__animated animate__fadeInRight">
											<div className="content-style2">
												<p className="mt-3">Organizations</p>

												<h2 className="sectionTitle" style={{ fontWeight: 'bold', fontSize: '20px', color: '#383C3D' }}>Gabercheta Inc.
												</h2>
												<p className="mt-3" style={{ fontWeight: 'normal', fontSize: '14px' }}>Lorem ipsum dolor sit
													amet, consectetur adipiscing elit. Enim, non, nec condimentum eu imperdiet
													ultricies amet, lacus, vestibulum. </p>
												<ul className="rating-icons">
													<li>
														<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
															fill="#FDB200" className="bi bi-star-fill" viewBox="0 0 18 18">
															<path
																d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
														</svg>
													</li>
													<li style={{ fontWeight: 'bold', fontSize: '14px', color: '#383C3D', lineHeight: '29PX' }} >
														4,5
													</li>
													<li style={{ fontWeight: 'bold', fontSize: '14px', color: '#383C3D', lineHeight: '29PX' }} >
														(4 Reviews)
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-4 ">
									<div className="col-md-12  " style={{ backgroundImage: '', height: '1000px' }}>
										<img src={mapserchbox} alt="" className="mapserchbox" />
										<img src={mapzom} alt="" className="mapzom" />
										<img src={Group3790} alt="" className="mapIcon" />
										<img src={Group3790} alt="" className="mapIcon1" />
										<img src={Group3790} alt="" className="mapIcon2" />
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


Matchmaking.propTypes = {
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
	(connect(mapStateToProps, mapDispatchToProps)((Matchmaking))));
